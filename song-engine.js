/* ═══════════════════════════════════════════════════════════════════════
   SongEngine — מחולל שירים בעברית בלי AI (AppNest)
   עובד בלי אינטרנט, בלי מפתח ובלי מכסה. מרכיב שיר מתבניות מבנה ומבנקי שורות
   מחורזות לפי מצב רוח, משלב את המשפטים ומילות המפתח של המשתמש, ומתאים מגדר.

   סימונים בבנק השורות:
     {לנקבה|לזכר}  = הנמען (למי שרים)
     [לזכר|לנקבה] = הזמר (מי ששר)

   שימוש:
     SongEngine.generate({ mood, genre, structure, length, gender, keywords, phrases, seed }) → טקסט עם תגיות
     SongEngine.altLine(line, { mood, gender, section })  → שורה חלופית מאותו סוג
     SongEngine.rhymes(word, extraWords)                  → מילים שמתחרזות (לפי סוף המילה)
   ═══════════════════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  const BANK = {
    love: {
      verse: [
        ["יש ריח של קפה ושל גשם בחלון", "ואני עוד [מחזיק|מחזיקה] את התמונה שלך בטלפון"],
        ["{את|אתה} {צוחקת|צוחק} ופתאום כל הרעש נעלם", "כמו שיר שמתנגן בשקט בתוך כל העולם"],
        ["הלכנו ברחוב עד שנגמרו הפנסים", "דיברנו על הכול ושתקנו על הדברים החשובים"],
        ["{שלחת|שלחת} לי לב קטן באמצע הלילה", "ואני כבר [יודע|יודעת] שזאת לא סתם מילה"],
        ["על המרפסת שלנו עוד יש שתי כוסות", "ואני לא [צריך|צריכה] יותר מזה כדי לחיות"],
        ["{את|אתה} {יודעת|יודע} לקרוא אותי בלי מילים", "גם כשאני [שותק|שותקת] [ומסתיר|ומסתירה] את הפחדים"],
        ["נסענו בלי מפה ובלי שום תוכנית", "רק {את|אתה}, אני וזריחה ראשונה ואמיתית"],
        ["כל מה שחיפשתי היה כאן כל הזמן", "בחיוך שלך, בשקט, בקול שלך הקטן"],
        ["{החזקת|החזקת} לי את היד מתחת לשולחן", "ופתאום הבנתי שאני [שייך|שייכת] לכאן"],
        ["העיר הזאת גדולה מדי בשביל שניים", "אבל איתך היא קטנה כמו שתי כפות ידיים"],
      ],
      pre: [
        ["ואם {תשאלי|תשאל} אותי מה אני [רוצה|רוצה]", "זה רק {אותך|אותך} פה, עוד לילה, עוד שעה"],
        ["ואני כבר לא [מפחד|מפחדת] להגיד", "שאיתך הלב שלי חוזר להיות ילד"],
        ["אז {תחזיקי|תחזיק} לי את היד ואל {תשחררי|תשחרר}", "כי איתך גם החושך נראה לי מואר"],
      ],
      chorus: [
        { hook: "רק {את|אתה}, רק {את|אתה}", lines: ["{את|אתה} הבית שלי בסוף כל יום", "{את|אתה} הסיבה שאני עוד [חולם|חולמת] חלום"] },
        { hook: "{תישארי|תישאר} עוד קצת", lines: ["כי הלילה עוד צעיר והירח עוד ער", "ואני רק [רוצה|רוצה] שהלילה הזה לא ייגמר"] },
        { hook: "כל מה שאני [צריך|צריכה] זה {אותך|אותך}", lines: ["לא כסף, לא זהב, לא שום דבר אחר", "רק עוד בוקר איתך ועוד לילה מאוחר"] },
        { hook: "{את|אתה} הכי {יפה|יפה} בעולם", lines: ["גם כשהשמש כבר שוקעת בים", "אני רואה רק {אותך|אותך} מול כולם"] },
      ],
      bridge: [
        ["ואם יום אחד הכול ישתנה", "ואם הרוח תיקח אותנו רחוק", "{תזכרי|תזכור} את הלילה הזה", "כי הוא שלנו, ואף אחד לא ייקח אותו"],
        ["אני לא [יודע|יודעת] מה יביא המחר", "אבל איתך אני כבר לא [מפחד|מפחדת]", "{תני|תן} לי יד", "ונעבור את זה ביחד"],
      ],
      outro: ["רק {את|אתה}... רק {את|אתה}..."],
    },

    sad: {
      verse: [
        ["{השארת|השארת} ספר פתוח על השולחן", "ואני לא [נוגע|נוגעת], כאילו {תחזרי|תחזור} עוד רגע לכאן"],
        ["הטלפון שותק כבר שלושה לילות", "ואני [סופר|סופרת] את הדקות בין הדמעות"],
        ["על הקיר עוד נשאר הסימן של התמונה", "וכל הבית מרגיש כמו תחנה ישנה"],
        ["אמרו לי שהזמן מרפא את הכול", "אבל אצלי הוא רק נעצר אתמול"],
        ["אני [עובר|עוברת] ליד הבית שלך בלי לעצור", "[ונשאר|ונשארת] שם עוד רגע מול האור"],
        ["מחקתי את המספר אבל [זוכר|זוכרת] אותו בעל פה", "כמו שיר שנתקע לי בלב ולא מרפה"],
        ["הכוס שלך עוד במדף העליון", "ואני [משאיר|משאירה] אותה שם, ליתר ביטחון"],
        ["יש ימים שאני [שוכח|שוכחת] {שהלכת|שהלכת}", "ואז הלילה מגיע ומזכיר לי מה איבדתי באמת"],
        ["הגשם דופק על החלון כמו פעם", "ורק הצד שלך במיטה נשאר ריק ושקט, בלי טעם"],
      ],
      pre: [
        ["ואם {תשמעי|תשמע} את השיר הזה ברדיו", "{תדעי|תדע} שכתבתי אותו רק בשבילך עכשיו"],
        ["אני [מנסה|מנסה] להיות [חזק|חזקה]", "אבל כל מה שנשאר לי זה שתיקה"],
      ],
      chorus: [
        { hook: "איך {הלכת|הלכת} ככה", lines: ["בלי לומר שלום, בלי להסתובב", "{השארת|השארת} אותי פה עם חצי לב"] },
        { hook: "{תחזרי|תחזור} אליי", lines: ["רק עוד לילה אחד, רק עוד שיחה", "אני לא [מבקש|מבקשת] הרבה, רק סליחה"] },
        { hook: "אולי מחר", lines: ["אולי מחר זה יכאב קצת פחות", "אולי מחר אני אלמד שוב לחיות"] },
        { hook: "כל הלילות {בלעדייך|בלעדיך}", lines: ["ארוכים כמו שנה", "ואני עוד [מחכה|מחכה] {לך|לך} בתחנה"] },
      ],
      bridge: [
        ["ואולי זה ככה צריך להיות", "ואולי יום אחד {תביני|תבין}", "שאהבתי {אותך|אותך} יותר", "ממה שידעתי לומר"],
        ["אני [פותח|פותחת] את החלון", "[נותן|נותנת] לרוח לקחת את מה שנשאר", "ומחר אני אקום", "ואנסה שוב לנשום"],
      ],
      outro: ["אולי מחר... אולי מחר..."],
    },

    happy: {
      verse: [
        ["שישי בערב, הרחוב כבר מתעורר", "כולם יוצאים החוצה, אף אחד לא נשאר"],
        ["שמתי את השיר הכי חזק ברמקול", "ואת השבוע הזה שכחנו כבר אתמול"],
        ["החברים בדרך, השמש עוד חמה", "יש ים, יש מוזיקה, אין שום בעיה"],
        ["{את|אתה} {רוקדת|רוקד} באמצע וכולם מסתכלים", "הלילה הזה שלנו, אנחנו לא עוצרים"],
        ["לא צריך תוכנית, לא צריך סיבה", "רק עוד שיר אחד ועוד סיבוב על הרחבה"],
        ["קמנו מאוחר וזה בדיוק בסדר", "היום אין משרד, אין שעון ואין מחר"],
        ["הנעליים ביד והחול עוד חם", "כל הקיץ לפנינו ואנחנו מול כל העולם"],
      ],
      pre: [
        ["אז תרימו את הידיים", "עד השמיים"],
        ["ואם מישהו שואל לאן אנחנו הולכים", "תגידו לו שאנחנו כבר לא חוזרים"],
      ],
      chorus: [
        { hook: "הלילה הזה שלנו", lines: ["כולם על הרגליים, אף אחד לא יושב", "הלב דופק בקצב והכול פתאום טוב"] },
        { hook: "יאללה תרקדו", lines: ["תשכחו מהכול ותנו לקצב לקחת", "עוד שיר אחד, עוד פעם, עוד פעם אחת"] },
        { hook: "יש לנו את הלילה", lines: ["ואף אחד לא הולך עכשיו הביתה", "עוד סיבוב, עוד צחוק, עוד שיר על הרחבה הזאת"] },
      ],
      bridge: [
        ["כל העולם יכול לחכות", "הלילה אנחנו רק רוצים לחיות"],
        ["עוצרים לרגע...", "נושמים...", "ועוד פעם!"],
      ],
      outro: ["הלילה הזה שלנו (הו הו)"],
    },

    power: {
      verse: [
        ["[נפלתי|נפלתי] לא פעם, ואמרו שזה נגמר", "אבל קמתי כל בוקר וחזרתי חזק עוד יותר"],
        ["כל מי שלא האמין עכשיו עומד ושותק", "ואני [ממשיך|ממשיכה] לטפס, כל צעד עוד יותר רחוק"],
        ["יש לי צלקות מכל הקרבות", "והן רק מזכירות לי כמה אני [יכול|יכולה] לחיות"],
        ["אמרו לי [תוריד|תורידי] את הראש", "אבל אני [נולדתי|נולדתי] לרוץ קדימה, לא לחשוש"],
        ["הלילה הכי חשוך תמיד לפני הזריחה", "ואני כבר [רואה|רואה] את האור בקצה, את ההבטחה"],
        ["בניתי את עצמי מאבנים ששברו לי", "וכל אבן שזרקו עליי הפכה לגשר שלי"],
      ],
      pre: [
        ["והקול שלי עולה", "מעל כל הרעש, מעל כל השאלה"],
        ["אז {תסתכלי|תסתכל} עליי עכשיו", "אני לא אותו אחד, זה הזמן שלי, זה עכשיו"],
      ],
      chorus: [
        { hook: "אני עוד פה", lines: ["אחרי כל הסערות, אחרי כל המכות", "אני עוד פה, ואני רק [מתחיל|מתחילה] לחיות"] },
        { hook: "{תני|תן} לי לעוף", lines: ["אין שמיים שיעצרו אותי עכשיו", "כל מה שחלמתי נמצא מול העיניים, כאן ועכשיו"] },
        { hook: "לא שוברים אותי", lines: ["אפשר לנסות, אפשר לדחוף", "אני [עומד|עומדת] [חזק|חזקה] עד הסוף"] },
      ],
      bridge: [
        ["ואם אפול שוב", "אני אקום שוב", "ואם יכבה האור", "אני אהיה האור"],
      ],
      outro: ["אני עוד פה... אני עוד פה"],
    },

    nostalgia: {
      verse: [
        ["השכונה הישנה, הספסל ליד הקיוסק", "שם החלפנו חלומות בשקית במבה ובצחוק"],
        ["אמא קראה מהחלון שהאוכל מוכן", "ואנחנו ביקשנו עוד דקה, עוד משחק אחרון"],
        ["קסטה ישנה במגירה, שירים מהרדיו", "כל שיר הוא תמונה שלא הולכת לשום מקום, גם עכשיו"],
        ["הקיץ ההוא היה ארוך מכל השנים", "רצנו יחפים בחול עד שנדלקו הפנסים"],
        ["אופניים בלי בלמים וברך פצועה", "ואף אחד לא פחד, הכול היה הרפתקה"],
      ],
      pre: [
        ["ואם הייתי [יכול|יכולה] לחזור לרגע אחד", "הייתי [מחבק|מחבקת] את כולם עוד קצת, עוד"],
      ],
      chorus: [
        { hook: "איפה הימים ההם", lines: ["כשהכול היה פשוט וקל", "כשהעולם נגמר בסוף הרחוב שלנו, וזה בכלל"] },
        { hook: "תחזירו לי את הקיץ", lines: ["את הריח של הים ואת החברים", "את הלילות שלא נגמרו ואת השירים"] },
      ],
      bridge: [
        ["היום כולנו גדלנו", "כל אחד בדרך שלו", "אבל כשאני [עוצם|עוצמת] עיניים", "אנחנו שוב שם, כולנו"],
      ],
      outro: ["איפה הימים ההם..."],
    },

    funny: {
      verse: [
        ["קניתי מכונת קפה שעושה הכול חוץ מקפה", "עכשיו היא מדברת איתי, וגם זה לא ממש יפה"],
        ["החתול שלי חושב שהוא המלך פה", "ואני רק המשרת שמביא לו טונה מהקופה"],
        ["התחלתי דיאטה ביום ראשון בשמונה", "ובתשע כבר [ישבתי|ישבתי] מול חומוס ופיתה חמה"],
        ["קבעתי עם עצמי ללכת לחדר כושר", "הגעתי עד החניה ואמרתי: זה כבר מספיק, זה אושר"],
        ["שלחתי הודעה לבוס במקום לאמא", "עכשיו הוא יודע שאני [אוהב|אוהבת] אותו, וזאת דרמה"],
      ],
      pre: [
        ["ואם {תשאלי|תשאל} איך החיים שלי מסתדרים", "אז ככה: לא, אבל אני [שר|שרה] שירים"],
      ],
      chorus: [
        { hook: "זה בסדר, זה בסדר", lines: ["גם אם הכול הפוך, גם אם הכול נשבר", "יש חומוס במקרר ושיר ברדיו, מה צריך יותר"] },
        { hook: "מחר אני [מתחיל|מתחילה]", lines: ["מחר אני אהיה [מסודר|מסודרת] [ומושלם|ומושלמת]", "אבל היום אני רק [שוכב|שוכבת] פה [ומסתכל|ומסתכלת] על העולם"] },
      ],
      bridge: [
        ["רגע, רגע... איפה המפתחות?", "...הם היו לי ביד כל הזמן"],
      ],
      outro: ["זה בסדר... (באמת?) זה בסדר"],
    },
  };

  const MOOD_MAP = { "רומנטי": "love", "עצוב ומרגש": "sad", "שמח וקצבי": "happy", "עוצמתי": "power", "נוסטלגי": "nostalgia", "מצחיק": "funny" };
  // תבניות לשילוב מילות המפתח של המשתמש (שמות עצם עובדים הכי טוב)
  const KW_LINES = ["ובסוף נשאר רק {KW}", "וכל מה שאני [זוכר|זוכרת] זה {KW}", "{KW} — זה כל הסיפור"];

  // ── עזרים ──
  function rng(seed) { let s = (seed >>> 0) || 1; return () => { s ^= s << 13; s ^= s >>> 17; s ^= s << 5; return ((s >>> 0) % 100000) / 100000; }; }
  function pick(arr, r, avoid) { const pool = avoid ? arr.filter(x => !avoid.includes(x)) : arr; const a = pool.length ? pool : arr; return a[Math.floor(r() * a.length)]; }
  function genderOf(mode) {
    const m = String(mode || "");
    if (m.includes("אישה שרה לגבר")) return { singer: "f", addr: "m" };
    if (m.includes("גבר שר לגבר")) return { singer: "m", addr: "m" };
    if (m.includes("אישה שרה לאישה")) return { singer: "f", addr: "f" };
    return { singer: "m", addr: "f" };          // גבר שר לאישה / ניטרלי — ברירת מחדל
  }
  function applyGender(line, g) {
    return String(line)
      .replace(/\{([^|{}]*)\|([^|{}]*)\}/g, (_, f, m) => (g.addr === "f" ? f : m))
      .replace(/\[([^|\[\]]*)\|([^|\[\]]*)\]/g, (_, m, f) => (g.singer === "m" ? m : f));
  }
  function cleanPhrase(p) { return String(p || "").replace(/\s+/g, " ").trim(); }

  function generate(opts) {
    const o = opts || {};
    const r = rng(o.seed || Date.now());
    const mood = BANK[MOOD_MAP[o.mood] || o.mood] || BANK.love;
    const g = genderOf(o.gender);
    const G = (x) => applyGender(x, g);
    const structure = String(o.structure || "");
    const length = String(o.length || "רגילה");
    const phrases = (o.phrases || []).map(cleanPhrase).filter(p => p && p.length <= 70 && !/^\[/.test(p));
    const keywords = String(o.keywords || "").split(/[,،\n]+/).map(x => x.trim()).filter(Boolean);
    const genre = String(o.genre || "");
    const usedV = [];
    let phraseUsed = 0;

    const verse = () => {
      const c1 = pick(mood.verse, r, usedV); usedV.push(c1);
      const c2 = pick(mood.verse, r, usedV); usedV.push(c2);
      const lines = [...c1, ...c2].map(G);
      // משפט מהבנק של המשתמש — מחליף שורה אחת בבית (עד שניים בשיר)
      if (phrases.length && phraseUsed < 2 && r() < 0.65) { lines[3] = phrases[Math.floor(r() * phrases.length)]; phraseUsed++; }
      return lines;
    };
    const ch = pick(mood.chorus, r);
    const adlib = /פופ|ים|שמח/.test(genre + o.mood) ? " (הו הו)" : "";
    const chorusLines = [G(ch.hook), ...ch.lines.map(G), G(ch.hook) + adlib];
    const pre = mood.pre.length ? pick(mood.pre, r).map(G) : null;
    let bridge = (pick(mood.bridge, r) || []).map(G);
    if (keywords.length) bridge = [...bridge.slice(0, 3), G(pick(KW_LINES, r).replace("{KW}", keywords[Math.floor(r() * keywords.length)]))];

    const out = [];
    const add = (tag, lines) => { out.push(`[${tag}]`); lines.forEach(l => out.push(l)); out.push(""); };
    if (/מזרחי|ים־תיכוני/.test(genre)) add("Intro", ["(יה לה לה, יה לה לה...)"]);
    const onlyChorus = /פזמון בלבד/.test(structure);
    const short = /בית–פזמון$/.test(structure) || length === "קצרה";
    if (onlyChorus) { add("Chorus", chorusLines); }
    else {
      add("Verse 1", verse());
      if (!short && pre) add("Pre-Chorus", pre);
      add("Chorus", chorusLines);
      if (!short) {
        add("Verse 2", verse());
        if (pre) add("Pre-Chorus", pre);
        add("Chorus", chorusLines);
        if (bridge.length) add("Bridge", bridge);
        if (length === "מלאה") { add("Verse 3", verse()); }
        add("Chorus", chorusLines);
        if (length === "מלאה" && mood.outro) add("Outro", mood.outro.map(G));
      }
    }
    return out.join("\n").trim();
  }

  // שורה חלופית מאותו מצב רוח (לפי סוג החלק אם ידוע)
  function altLine(line, opts) {
    const o = opts || {}; const r = rng(Date.now());
    const mood = BANK[MOOD_MAP[o.mood] || o.mood] || BANK.love;
    const g = genderOf(o.gender);
    const sec = String(o.section || "").toLowerCase();
    let pool = sec.includes("chorus") ? mood.chorus.flatMap(c => [c.hook, ...c.lines]) : sec.includes("pre") ? mood.pre.flat() : sec.includes("bridge") ? mood.bridge.flat() : mood.verse.flat();
    pool = pool.map(x => applyGender(x, g)).filter(x => x !== line);
    const res = []; for (let i = 0; i < 3 && pool.length; i++) { const x = pick(pool, r, res); if (!res.includes(x)) res.push(x); }
    return res;
  }

  // חרוזים בלי AI: מילים מכל הבנקים (ומהמילים של המשתמש) שנגמרות באותו צליל
  const norm = (w) => String(w || "").replace(/[֑-ׇ]/g, "").replace(/[^א-ת]/g, "").replace(/ך/g, "כ").replace(/ם/g, "מ").replace(/ן/g, "נ").replace(/ף/g, "פ").replace(/ץ/g, "צ");
  let WORDS = null;
  function allWords() {
    if (WORDS) return WORDS;
    const set = new Set();
    const walk = (x) => { if (Array.isArray(x)) x.forEach(walk); else if (x && typeof x === "object") Object.values(x).forEach(walk); else if (typeof x === "string") applyGender(x, { singer: "m", addr: "f" }).concat(" ", applyGender(x, { singer: "f", addr: "m" })).split(/[\s,.!?…—\-()]+/).forEach(w => { const c = w.replace(/[^א-ת]/g, ""); if (c.length >= 2) set.add(c); }); };
    walk(BANK); WORDS = [...set]; return WORDS;
  }
  function rhymes(word, extra) {
    const w = norm(word); if (w.length < 2) return [];
    const pool = [...new Set([...allWords(), ...(extra || []).flatMap(t => String(t).split(/\s+/)).map(x => x.replace(/[^א-ת]/g, "")).filter(x => x.length >= 2)])];
    const end3 = w.slice(-3), end2 = w.slice(-2);
    const strong = pool.filter(x => norm(x) !== w && w.length >= 3 && norm(x).endsWith(end3));
    const weak = pool.filter(x => norm(x) !== w && !strong.includes(x) && norm(x).endsWith(end2));
    return [...strong, ...weak].slice(0, 16);
  }

  /* ═══ רמיקס מהשירים של המשתמש (בלי AI) ═══
     מפרק כל שיר לחלקים לפי התגיות ([Verse]/[Chorus]/[Bridge]…), אוסף צמדי שורות מהבתים (מעדיף צמדים מחורזים),
     פזמונים שלמים וגשרים — ומרכיב שיר חדש משירים שונים. הפזמון נלקח שלם משיר אחד כדי שיישאר קוהרנטי. */
  function parseSong(text) {
    const secs = []; let cur = { tag: "verse", lines: [] };
    String(text || "").split(/\r?\n/).forEach(raw => {
      const l = raw.trim();
      const m = l.match(/^\[([^\]]+)\]$/) || l.match(/^\(?(פזמון|בית|גשר|פתיחה|סיום)[^)]*\)?:?$/);
      if (m) { if (cur.lines.length) secs.push(cur); const t = m[1].toLowerCase(); cur = { tag: /chorus|פזמון|hook/.test(t) ? (/pre/.test(t) ? "pre" : "chorus") : /bridge|גשר/.test(t) ? "bridge" : /outro|סיום/.test(t) ? "outro" : /intro|פתיחה/.test(t) ? "intro" : /pre/.test(t) ? "pre" : "verse", lines: [] }; return; }
      if (!l || /^(style|סגנון)\s*:/i.test(l)) return;
      cur.lines.push(l);
    });
    if (cur.lines.length) secs.push(cur);
    return secs;
  }
  const endsRhyme = (a, b) => { const x = norm(a.split(/\s+/).pop()), y = norm(b.split(/\s+/).pop()); return x.length >= 2 && y.length >= 2 && x.slice(-2) === y.slice(-2); };
  function fromCorpus(songs, opts) {
    const o = opts || {}; const r = rng(o.seed || Date.now());
    const pool = { couplets: [], choruses: [], bridges: [], pres: [] };
    (songs || []).forEach((sg, si) => {
      parseSong(sg.lyrics || sg.text || "").forEach(sec => {
        const L = sec.lines.filter(x => x.length <= 90);
        if (sec.tag === "chorus" && L.length >= 2) pool.choruses.push({ si, lines: L.slice(0, 6) });
        else if (sec.tag === "bridge" && L.length) pool.bridges.push({ si, lines: L.slice(0, 4) });
        else if (sec.tag === "pre" && L.length) pool.pres.push({ si, lines: L.slice(0, 2) });
        else if (sec.tag === "verse") for (let i = 0; i + 1 < L.length; i += 2) pool.couplets.push({ si, lines: [L[i], L[i + 1]], rh: endsRhyme(L[i], L[i + 1]) });
      });
    });
    if (pool.couplets.length < 2 && !pool.choruses.length) return "";
    // מעדיפים צמדים מחורזים (פי 3)
    const weighted = pool.couplets.flatMap(c => c.rh ? [c, c, c] : [c]);
    const used = new Set();
    const coup = () => { for (let k = 0; k < 40; k++) { const c = weighted[Math.floor(r() * weighted.length)]; if (c && !used.has(c)) { used.add(c); return c.lines; } } return (weighted[0] || { lines: [] }).lines; };
    const verse = () => [...coup(), ...coup()];
    const ch = pool.choruses.length ? pool.choruses[Math.floor(r() * pool.choruses.length)].lines : [...coup()];
    const pre = pool.pres.length && r() < 0.6 ? pool.pres[Math.floor(r() * pool.pres.length)].lines : null;
    const br = pool.bridges.length ? pool.bridges[Math.floor(r() * pool.bridges.length)].lines : null;
    const length = String(o.length || "רגילה"), short = length === "קצרה";
    const out = []; const add = (t, ls) => { out.push(`[${t}]`); ls.forEach(l => out.push(l)); out.push(""); };
    add("Verse 1", verse()); if (pre && !short) add("Pre-Chorus", pre); add("Chorus", ch);
    if (!short) { add("Verse 2", verse()); if (pre) add("Pre-Chorus", pre); add("Chorus", ch); if (br) add("Bridge", br); if (length === "מלאה") add("Verse 3", verse()); add("Chorus", ch); }
    return out.join("\n").trim();
  }
  function corpusStats(songs) { const p = { couplets: 0, choruses: 0 }; (songs || []).forEach(sg => parseSong(sg.lyrics || "").forEach(sec => { if (sec.tag === "chorus") p.choruses++; else if (sec.tag === "verse") p.couplets += Math.floor(sec.lines.length / 2); })); return p; }

  window.SongEngine = { generate, altLine, rhymes, fromCorpus, parseSong, corpusStats, moods: Object.keys(MOOD_MAP), version: "1.1" };
})();
