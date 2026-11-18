/* ═══════════════════════════════════════════════════════════════════════
   AppNest Refine — מנוע "כותב → מבקר → משפר" לשימוש חוזר בכל אפליקציות AppNest
   (בהשראת לולאת ה-Content Refinement של PaperOrchestra / Google Research, Apache-2.0)

   הרעיון: לא סומכים על התשובה הראשונה של הבינה.
     1. מבקר נותן ציון לכל קריטריון + רשימת חולשות (JSON)
     2. משפר משכתב לפי הביקורת
     3. בדיקה מקומית (בלי בינה) פוסלת גרסה ששברה כללים
     4. המבקר נותן ציון לגרסה החדשה — היא נשמרת רק אם הציון באמת עלה
   עלות: 1 + 2×סבבים קריאות AI (2 סבבים = 5 קריאות).

   שימוש:
     const r = await AppNestRefine.run({
       callAI,                    // async (prompt) => text    — הספק של האפליקציה (BYOK)
       draft,                     // הטקסט ההתחלתי
       criteria: {hook:2, ...},   // משקל לכל קריטריון; הציון הכולל מחושב כאן ולא ע"י הבינה
       buildCritique: ({draft, local}) => prompt,
       buildRewrite:  ({draft, review, log, round, local}) => prompt,
       localCheck:    (text, original) => ({ok, issues:[], metrics}),   // אופציונלי
       postProcess:   (text, original) => text,                        // אופציונלי — ניקוי קבוע לפני הבדיקה
       rounds: 2, minGain: 0.3,
       onProgress: (ev) => {}, isCancelled: () => false,
     });
     // r = {text, initialScore, finalScore, review, log, improved, calls}
   ═══════════════════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  function extractJSON(text) {
    if (!text) return null;
    let t = String(text).replace(/```(?:json)?/gi, "").trim();
    const a = t.indexOf("{"), b = t.lastIndexOf("}");
    if (a < 0 || b <= a) return null;
    t = t.slice(a, b + 1);
    const tries = [t, t.replace(/,\s*([}\]])/g, "$1"), t.replace(/,\s*([}\]])/g, "$1").replace(/[“”]/g, '"')];
    for (const s of tries) { try { return JSON.parse(s); } catch (e) {} }
    return null;
  }

  function clamp(n) { n = Number(n); return isFinite(n) ? Math.max(0, Math.min(10, n)) : null; }

  function overall(scores, criteria) {
    let sum = 0, w = 0;
    for (const k of Object.keys(criteria)) {
      const v = clamp(scores && scores[k]);
      if (v == null) continue;
      sum += v * criteria[k]; w += criteria[k];
    }
    return w ? Math.round((sum / w) * 10) / 10 : 0;
  }

  /* מנקה הקדמות ומסגרות שהבינה אוהבת להוסיף ("הנה הגרסה המשופרת:") */
  function cleanText(raw) {
    let t = String(raw || "").replace(/^```[a-z]*\n?|```$/gim, "").trim();
    const lines = t.split("\n");
    while (lines.length && /^(הנה|להלן|here is|here's|גרסה משופרת|the revised)/i.test(lines[0].trim()) && /[:：]\s*$/.test(lines[0].trim())) lines.shift();
    return lines.join("\n").trim();
  }

  async function run(opts) {
    const {
      callAI, draft, criteria, buildCritique, buildRewrite,
      localCheck = null, postProcess = null, rounds = 2, minGain = 0.3,
      onProgress = () => {}, isCancelled = () => false,
    } = opts;
    if (typeof callAI !== "function") throw new Error("AppNestRefine: callAI חסר");
    if (!draft || !String(draft).trim()) throw new Error("AppNestRefine: אין טקסט לשיפור");
    let calls = 0;

    const critique = async (text, local) => {
      const prompt = buildCritique({ draft: text, local });
      let j = null;
      for (let attempt = 0; attempt < 2 && !j; attempt++) {
        calls++;
        const raw = await callAI(attempt ? prompt + "\n\nחשוב: החזר אך ורק אובייקט JSON תקין, בלי שום טקסט לפניו או אחריו." : prompt);
        j = extractJSON(raw);
      }
      if (!j) throw new Error("המבקר לא החזיר תשובה תקינה (JSON). נסה שוב או החלף מודל.");
      const scores = {};
      for (const k of Object.keys(criteria)) scores[k] = clamp(j.scores && j.scores[k]);
      return {
        scores,
        score: overall(scores, criteria),
        strengths: Array.isArray(j.strengths) ? j.strengths.slice(0, 5).map(String) : [],
        weaknesses: Array.isArray(j.weaknesses) ? j.weaknesses.slice(0, 6).map(w => typeof w === "string" ? { where: "", problem: w, fix: "" } : { where: String(w.where || ""), problem: String(w.problem || ""), fix: String(w.fix || "") }) : [],
        verdict: String(j.verdict || ""),
      };
    };

    const original = String(draft);
    let cur = original;
    let curLocal = localCheck ? localCheck(cur, original) : null;
    onProgress({ stage: "critique", round: 0 });
    let curReview = await critique(cur, curLocal);
    const initialScore = curReview.score;
    const initialReview = curReview;
    onProgress({ stage: "baseline", round: 0, score: initialScore, review: curReview });

    const log = [];
    for (let r = 1; r <= rounds; r++) {
      if (isCancelled()) { log.push({ round: r, accepted: false, reason: "בוטל" }); break; }
      onProgress({ stage: "rewrite", round: r, score: curReview.score });
      calls++;
      let cand = cleanText(await callAI(buildRewrite({ draft: cur, review: curReview, log, round: r, local: curLocal })));
      if (cand && postProcess) cand = String(postProcess(cand, original) || "").trim();
      if (!cand) { log.push({ round: r, accepted: false, before: curReview.score, reason: "התקבלה תשובה ריקה" }); onProgress({ stage: "round-done", round: r, entry: log[log.length - 1] }); continue; }

      const candLocal = localCheck ? localCheck(cand, original) : null;
      if (candLocal && candLocal.ok === false) {
        log.push({ round: r, accepted: false, before: curReview.score, reason: "נפסל בבדיקה המקומית: " + candLocal.issues.join(" · "), tried: curReview.weaknesses.map(w => w.problem) });
        onProgress({ stage: "round-done", round: r, entry: log[log.length - 1] });
        continue;
      }
      if (isCancelled()) { log.push({ round: r, accepted: false, reason: "בוטל" }); break; }
      onProgress({ stage: "critique", round: r });
      const rev = await critique(cand, candLocal);
      const accepted = rev.score >= curReview.score + minGain;
      const entry = {
        round: r, accepted, before: curReview.score, after: rev.score,
        reason: accepted ? "הציון עלה" : "הציון לא עלה מספיק — נשארים עם הגרסה הקודמת",
        tried: curReview.weaknesses.map(w => w.problem), text: cand,
      };
      log.push(entry);
      onProgress({ stage: "round-done", round: r, entry });
      if (accepted) { cur = cand; curReview = rev; curLocal = candLocal; }
    }

    return { text: cur, improved: cur !== original, initialScore, finalScore: curReview.score, initialReview, review: curReview, log, calls };
  }

  /* ביקורת בלבד (קריאה אחת) — לראות ציון בלי לשנות כלום */
  async function review(opts) {
    const r = await run(Object.assign({}, opts, { rounds: 0 }));
    return { score: r.initialScore, review: r.review, calls: r.calls };
  }

  window.AppNestRefine = { run, review, extractJSON, cleanText, version: "1.0" };
})();
