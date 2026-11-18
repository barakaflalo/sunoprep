/* ═══════════════════════════════════════════════════════════════════════
   AppNest Assistant 2.0 — המנוע הקבוע (זהה בכל האפליקציות)
   ─────────────────────────────────────────────────────────────────────
   צ'אטבוט היברידי: מדבר בשפה טבעית, עונה על שאלות, ויכול לבצע פעולות
   באפליקציה (לכתוב לשדה, לנווט בין מסכים, להדגיש כפתור, פעולות ייחודיות).

   איך זה בנוי:
   • המנוע (הקובץ הזה) — לא משתנה בין אפליקציות. מעתיקים אותו כמו שהוא.
   • ה"מפה" — window.APPNEST_ASSISTANT_CONFIG, מוגדרת בכל אפליקציה בנפרד,
     ומתארת למנוע את המסכים/השדות/הכפתורים והרקע של אותה אפליקציה.

   חדש ב-2.0 (בהשראת פרוטוקול AG-UI — רעיונות בלבד, בלי ספריות):
   1. "כלים" אמיתיים (function calling) — הפעולות מוגדרות למודל ככלים רשמיים
      במקום בלוק JSON בתוך הטקסט. אם הספק לא תומך בכלים — חוזרים אוטומטית
      לשיטה הישנה (<<ACTION>>), כך ששום דבר לא נשבר.
   2. תשובה זורמת (streaming) — הטקסט מופיע מילה אחרי מילה. כפתור ⏹ לעצירה.
   3. אישור לפני פעולה — לפני דריסת שדה שכבר יש בו תוכן מופיע "לאשר?",
      ואחרי כתיבה יש כפתור ↩ לביטול השינוי.
   4. שפת אירועים קבועה — המנוע משדר אירועים (RUN_STARTED, TEXT_DELTA,
      TOOL_CALL, RUN_FINISHED...) שהאפליקציה יכולה להאזין להם.

   תאימות: כל המפות הקיימות (SunoPrep / Winner / PlateAI) עובדות בלי שינוי.
   שדות אופציונליים חדשים במפה:
     fields[].tab           — שם המסך שבו השדה נמצא (המנוע יעבור אליו לבד)
     fields[].placeholder   — אפשר גם מערך של כמה placeholder-ים (לכמה שפות)
     actions[x].confirm     — true = לבקש אישור לפני הפעולה
     confirmWrites          — false = לכבות את האישור לפני דריסת שדה
     stream                 — false = לכבות תשובה זורמת
     toolMode               — 'text' = לכפות את השיטה הישנה (בלי כלים)

   ה-AI: משתמש ב-BYOK הקיים (המפתח שהמשתמש כבר חיבר). נקרא בשפת-האם של כל
   ספק (Claude / Gemini / OpenAI / מקומי / מותאם) — בלי שכבות תרגום.
   ═══════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  var CFG = window.APPNEST_ASSISTANT_CONFIG;
  if (!CFG) { console.warn('[AppNest Assistant] אין הגדרות (APPNEST_ASSISTANT_CONFIG) — המנוע לא הופעל.'); return; }
  var VERSION = '2.0';

  /* ─────────────── 0. אירועים (בסגנון AG-UI) ─────────────── */
  // כל שלב בריצה משודר כאירוע. האפליקציה יכולה להאזין:
  //   window.addEventListener('appnest-assistant', e => console.log(e.detail.type, e.detail))
  //   או: AppNestAssistant.on(evt => ...)
  var listeners = [];
  function emit(type, data) {
    var evt = { type: type, ts: Date.now() };
    if (data) for (var k in data) if (Object.prototype.hasOwnProperty.call(data, k)) evt[k] = data[k];
    for (var i = 0; i < listeners.length; i++) { try { listeners[i](evt); } catch (e) {} }
    try { window.dispatchEvent(new CustomEvent('appnest-assistant', { detail: evt })); } catch (e) {}
  }

  /* ─────────────── 1. הגדרות ה-AI של האפליקציה ─────────────── */
  function readAiConfig() {
    // אם האפליקציה מגדירה קריאת config משלה (כי היא שומרת מפתחות אחרת) — נשתמש בה.
    if (typeof CFG.readAiConfig === 'function') { try { return CFG.readAiConfig(); } catch (e) { return null; } }
    var storeKey = CFG.aiConfigKey || 'sp_ai-config';
    try {
      var raw = localStorage.getItem(storeKey);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) { return null; }
  }

  // מפצל שדה מפתחות (שיכול להכיל כמה מפתחות מופרדים בפסיק/שורה) ומחזיר את הראשון הנקי,
  // בדיוק כמו שהאפליקציה עצמה עושה. מונע מצב של פסיקים/רווחים נסתרים שמשבשים את המפתח.
  function firstKey(s) {
    var arr = (s || '').split(/[\n,;]+/).map(function (x) { return x.trim(); }).filter(Boolean);
    return arr[0] || '';
  }

  function httpError(status, msg) { var e = new Error(msg || ('HTTP ' + status)); e.status = status; return e; }
  async function errorFrom(res) {
    var j = await res.json().catch(function () { return {}; });
    var m = (j && j.error && (j.error.message || (typeof j.error === 'string' ? j.error : ''))) || ('HTTP ' + res.status);
    return httpError(res.status, m);
  }

  /* ─────────────── 2. הכלים (נבנים אוטומטית מהמפה) ─────────────── */
  function tabNames() { return (CFG.tabs || []).map(function (t) { return t.name; }); }
  function fieldNames() { return (CFG.fields || []).map(function (f) { return f.name; }); }
  function actionNames() { return Object.keys(CFG.actions || {}); }

  function buildTools() {
    var tools = [];
    var tn = tabNames(), fn = fieldNames(), an = actionNames();
    if (fn.length) tools.push({
      name: 'write_field',
      description: 'כותב תוכן מלא לשדה באפליקציה (מחליף את מה שיש בו). השתמש בזה כשהמשתמש מבקש ליצור, לכתוב, לשפר, לתרגם או לשנות תוכן. ' +
        'שדות: ' + (CFG.fields || []).map(function (f) { return f.name + ' = ' + (f.label || f.name); }).join(', '),
      parameters: { type: 'object', properties: {
        field: { type: 'string', enum: fn, description: 'שם השדה' },
        text: { type: 'string', description: 'התוכן המלא שייכתב לשדה' }
      }, required: ['field', 'text'] }
    });
    if (tn.length) tools.push({
      name: 'navigate',
      description: 'עובר למסך אחר באפליקציה. השתמש רק בשם מסך מהרשימה.',
      parameters: { type: 'object', properties: {
        screen: { type: 'string', enum: tn, description: 'שם המסך' }
      }, required: ['screen'] }
    });
    tools.push({
      name: 'highlight',
      description: 'מסמן בזהב כפתור או שדה כדי להראות למשתמש איפה הוא נמצא. target = הטקסט שעל הכפתור או שם השדה.',
      parameters: { type: 'object', properties: {
        target: { type: 'string', description: 'טקסט הכפתור או שם השדה' }
      }, required: ['target'] }
    });
    if (an.length) tools.push({
      name: 'app_action',
      description: 'מפעיל פעולה ייחודית של האפליקציה. פעולות: ' +
        an.map(function (k) { return k + ' — ' + ((CFG.actions[k] && CFG.actions[k].desc) || ''); }).join('; '),
      parameters: { type: 'object', properties: {
        action: { type: 'string', enum: an, description: 'שם הפעולה' }
      }, required: ['action'] }
    });
    return tools;
  }

  // Gemini רוצה טיפוסים באותיות גדולות (OBJECT/STRING)
  function geminiSchema(s) {
    if (!s || typeof s !== 'object') return s;
    var o = {};
    for (var k in s) {
      if (k === 'type') o.type = String(s.type).toUpperCase();
      else if (k === 'properties') { o.properties = {}; for (var p in s.properties) o.properties[p] = geminiSchema(s.properties[p]); }
      else o[k] = s[k];
    }
    return o;
  }

  // ממיר קריאת כלי (מכל ספק) לפעולה פנימית אחידה
  function normalizeCall(name, args) {
    if (typeof args === 'string') { try { args = JSON.parse(args || '{}'); } catch (e) { args = {}; } }
    args = args || {};
    if (name === 'write_field' || name === 'writeField') return { action: 'writeField', target: args.field || args.target, text: args.text || '' };
    if (name === 'navigate') return { action: 'navigate', target: args.screen || args.target };
    if (name === 'highlight') return { action: 'highlight', target: args.target };
    if (name === 'app_action' || name === 'appAction') return { action: 'appAction', target: args.action || args.target };
    return null;
  }

  /* ─────────────── 3. קריאת ה-AI — זורם, עם כלים ─────────────── */
  // קורא זרם SSE (data: {...}) ומעביר כל JSON ל-onJSON.
  async function readSSE(res, onJSON) {
    function line(l) {
      l = l.replace(/\r$/, '');
      if (l.indexOf('data:') !== 0) return;
      var d = l.slice(5).trim();
      if (!d || d === '[DONE]') return;
      var j; try { j = JSON.parse(d); } catch (e) { return; }
      onJSON(j);
    }
    if (!res.body || !res.body.getReader) { (await res.text()).split('\n').forEach(line); return; }
    var reader = res.body.getReader(), dec = new TextDecoder(), buf = '';
    while (true) {
      var r = await reader.read();
      if (r.done) break;
      buf += dec.decode(r.value, { stream: true });
      var lines = buf.split('\n'); buf = lines.pop();
      lines.forEach(line);
    }
    buf += dec.decode();
    if (buf) line(buf);
  }
  function isStream(res) { return /event-stream/i.test(res.headers.get('content-type') || ''); }

  // ── Gemini ──
  async function callGemini(k, sys, msgs, tools, onDelta, signal, stream) {
    var models = CFG.geminiModels || ['gemini-flash-latest', 'gemini-3.5-flash', 'gemini-2.5-flash', 'gemini-2.0-flash'];
    var key = firstKey(k.gemini), lastErr = null;
    var contents = msgs.map(function (m) { return { role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.text }] }; });
    for (var i = 0; i < models.length; i++) {
      var genCfg = { temperature: 0.5, maxOutputTokens: 4000 };
      if (models[i].indexOf('gemini-2.5') === 0 || models[i].indexOf('gemini-3') === 0) genCfg.thinkingConfig = { thinkingBudget: 0 };
      var body = { systemInstruction: { parts: [{ text: sys }] }, contents: contents, generationConfig: genCfg };
      if (tools) body.tools = [{ functionDeclarations: tools.map(function (t) { return { name: t.name, description: t.description, parameters: geminiSchema(t.parameters) }; }) }];
      var url = 'https://generativelanguage.googleapis.com/v1beta/models/' + models[i] +
        (stream ? ':streamGenerateContent?alt=sse&key=' : ':generateContent?key=') + encodeURIComponent(key);
      var out = { text: '', calls: [] }, started = false;
      try {
        var r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), signal: signal });
        if (!r.ok) {
          lastErr = await errorFrom(r);
          if ([404, 429, 500, 503].indexOf(r.status) === -1) throw lastErr;
          continue;                                   // מודל לא זמין/עמוס → הבא בתור
        }
        var eat = function (d) {
          if (d.error) throw httpError(500, d.error.message || 'Gemini error');
          var parts = (d.candidates && d.candidates[0] && d.candidates[0].content && d.candidates[0].content.parts) || [];
          parts.forEach(function (p) {
            if (p.thought) return;
            if (p.text) { started = true; out.text += p.text; onDelta(p.text); }
            if (p.functionCall) out.calls.push({ name: p.functionCall.name, args: p.functionCall.args });
          });
        };
        if (isStream(r)) await readSSE(r, eat); else eat(await r.json());
        return out;
      } catch (e) {
        if (e.name === 'AbortError' || started) throw e;  // כבר התחלנו להציג — לא מחליפים מודל באמצע
        lastErr = e;
        if (e.status && [404, 429, 500, 503].indexOf(e.status) === -1) throw e;
      }
    }
    throw lastErr || new Error('Gemini unavailable');
  }

  // ── Claude ──
  async function callClaude(k, sys, msgs, tools, onDelta, signal, stream) {
    var body = { model: CFG.claudeModel || 'claude-sonnet-4-6', max_tokens: 4000, system: sys, stream: !!stream,
      messages: msgs.map(function (m) { return { role: m.role, content: m.text }; }) };
    if (tools) body.tools = tools.map(function (t) { return { name: t.name, description: t.description, input_schema: t.parameters }; });
    var res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST', signal: signal,
      headers: { 'Content-Type': 'application/json', 'x-api-key': firstKey(k.claude),
        'anthropic-version': '2023-06-01', 'anthropic-dangerous-direct-browser-access': 'true' },
      body: JSON.stringify(body)
    });
    if (!res.ok) throw await errorFrom(res);
    var out = { text: '', calls: [] };
    if (!isStream(res)) {
      var d = await res.json();
      (d.content || []).forEach(function (b) {
        if (b.type === 'text') { out.text += b.text; onDelta(b.text); }
        if (b.type === 'tool_use') out.calls.push({ name: b.name, args: b.input });
      });
      return out;
    }
    var blocks = {};
    await readSSE(res, function (d) {
      if (d.type === 'error') throw httpError(500, (d.error && d.error.message) || 'Claude error');
      if (d.type === 'content_block_start' && d.content_block && d.content_block.type === 'tool_use')
        blocks[d.index] = { name: d.content_block.name, json: '' };
      if (d.type === 'content_block_delta' && d.delta) {
        if (d.delta.type === 'text_delta') { out.text += d.delta.text; onDelta(d.delta.text); }
        if (d.delta.type === 'input_json_delta' && blocks[d.index]) blocks[d.index].json += d.delta.partial_json || '';
      }
    });
    Object.keys(blocks).sort(function (a, b) { return a - b; }).forEach(function (i) {
      out.calls.push({ name: blocks[i].name, args: blocks[i].json || '{}' });
    });
    return out;
  }

  // ── OpenAI / מקומי / מותאם (פורמט OpenAI) ──
  async function callOpenAI(p, k, sys, msgs, tools, onDelta, signal, stream) {
    var url, okey, model;
    if (p === 'openai') { url = 'https://api.openai.com/v1/chat/completions'; okey = firstKey(k.openai); model = CFG.openaiModel || 'gpt-4o-mini'; }
    else if (p === 'device') { url = (k.deviceUrl || '').replace(/\/+$/, '') + '/chat/completions'; okey = ''; model = k.deviceModel || 'llama3'; }
    else if (p === 'custom') { url = k.customUrl || ''; okey = firstKey(k.customKey); model = k.customModel || 'gpt-4o-mini'; }
    else throw new Error('UNKNOWN_PROVIDER');
    var h = { 'Content-Type': 'application/json' };
    if (okey) h['Authorization'] = 'Bearer ' + okey;
    var body = { model: model, max_tokens: 4000, stream: !!stream,
      messages: [{ role: 'system', content: sys }].concat(msgs.map(function (m) { return { role: m.role, content: m.text }; })) };
    if (tools) body.tools = tools.map(function (t) { return { type: 'function', function: { name: t.name, description: t.description, parameters: t.parameters } }; });
    var ro = await fetch(url, { method: 'POST', headers: h, body: JSON.stringify(body), signal: signal });
    if (!ro.ok) throw await errorFrom(ro);
    var out = { text: '', calls: [] };
    if (!isStream(ro)) {                              // שרת שלא תומך בזרימה — מחזיר תשובה אחת
      var d = await ro.json();
      var msg = (d.choices && d.choices[0] && d.choices[0].message) || {};
      if (msg.content) { out.text = msg.content; onDelta(msg.content); }
      (msg.tool_calls || []).forEach(function (c) { if (c.function) out.calls.push({ name: c.function.name, args: c.function.arguments }); });
      return out;
    }
    var tc = {};
    await readSSE(ro, function (d) {
      if (d.error) throw httpError(500, d.error.message || 'AI error');
      var delta = d.choices && d.choices[0] && d.choices[0].delta;
      if (!delta) return;
      if (delta.content) { out.text += delta.content; onDelta(delta.content); }
      (delta.tool_calls || []).forEach(function (c) {
        var i = c.index || 0;
        tc[i] = tc[i] || { name: '', args: '' };
        if (c.function && c.function.name) tc[i].name += c.function.name;
        if (c.function && c.function.arguments) tc[i].args += c.function.arguments;
      });
    });
    Object.keys(tc).sort(function (a, b) { return a - b; }).forEach(function (i) { out.calls.push(tc[i]); });
    return out;
  }

  // מריץ שיחה מול הספק המחובר. מחזיר { text, actions }.
  // אם הספק דוחה את הכלים (שגיאה 400 וכד') — מנסה שוב בשיטה הישנה (טקסט).
  async function runAI(history, userMsg, onDelta, signal) {
    var cfg = readAiConfig();
    if (!cfg || !cfg.provider) throw new Error('NO_AI');
    var p = cfg.provider, k = cfg.keys || {};
    var stream = CFG.stream !== false;
    var msgs = buildMessages(history, userMsg);
    var useTools = CFG.toolMode !== 'text';

    async function attempt(withTools) {
      var sys = buildSystem(!withTools);
      var tools = withTools ? buildTools() : null;
      if (p === 'gemini') return callGemini(k, sys, msgs, tools, onDelta, signal, stream);
      if (p === 'claude') return callClaude(k, sys, msgs, tools, onDelta, signal, stream);
      return callOpenAI(p, k, sys, msgs, tools, onDelta, signal, stream);
    }

    var out;
    try { out = await attempt(useTools); }
    catch (e) {
      var keyProblem = /api.?key|unauthor|permission|invalid.*key/i.test(e.message || '');
      if (useTools && e.status && e.status >= 400 && e.status < 500 && e.status !== 401 && e.status !== 403 && e.status !== 429 && !keyProblem) {
        emit('TOOLS_FALLBACK', { reason: e.message });
        onDelta(null);                                 // מאפס את מה שהוצג
        out = await attempt(false);
      } else throw e;
    }

    // פעולות: מהכלים הרשמיים + גיבוי — בלוקי <<ACTION>> אם המודל כתב אותם בטקסט
    var actions = [];
    out.calls.forEach(function (c) { var a = normalizeCall(c.name, c.args); if (a) actions.push(a); });
    var parsed = parseTextActions(out.text);
    parsed.actions.forEach(function (a) { actions.push(a); });
    return { text: parsed.text, actions: actions };
  }

  /* ─────────────── 4. פעולות על האפליקציה (מבוססות המפה) ─────────────── */
  // מציאת אלמנט לפי טקסט גלוי (יציב יותר מ-selectors באפליקציית React)
  function findByText(tag, text) {
    if (!text) return null;
    var els = document.querySelectorAll(tag);
    text = String(text).trim();
    for (var i = 0; i < els.length; i++) {
      if (panelEl && panelEl.contains(els[i])) continue;   // לא לחפש בתוך חלון העוזר עצמו
      var t = (els[i].textContent || '').trim();
      if (t === text || t.indexOf(text) !== -1) return els[i];
    }
    return null;
  }
  function findField(spec) {
    if (spec.placeholder) {
      var phs = [].concat(spec.placeholder);
      var els = document.querySelectorAll('textarea, input');
      for (var i = 0; i < els.length; i++) {
        var ph = els[i].getAttribute('placeholder') || '';
        for (var j = 0; j < phs.length; j++) if (phs[j] && ph.indexOf(phs[j]) !== -1) return els[i];
      }
    }
    if (spec.selector) return document.querySelector(spec.selector);
    return null;
  }
  // כתיבה לשדה בצורה ש-React "רואה" (native setter + אירוע input)
  function setReactValue(el, value) {
    var proto = el.tagName === 'TEXTAREA' ? window.HTMLTextAreaElement.prototype : window.HTMLInputElement.prototype;
    var setter = Object.getOwnPropertyDescriptor(proto, 'value').set;
    setter.call(el, value);
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
  }
  function flash(el) {
    if (!el) return;
    if (el.scrollIntoView) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    var old = el.style.boxShadow, oldT = el.style.transition;
    el.style.transition = 'box-shadow .3s';
    el.style.boxShadow = '0 0 0 3px #C9A84C, 0 0 18px #C9A84C';
    setTimeout(function () { el.style.boxShadow = old; el.style.transition = oldT; }, 2200);
  }
  function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

  function goTo(name) {
    var tab = (CFG.tabs || []).filter(function (t) { return t.name === name; })[0];
    // אם האפליקציה מגדירה פונקציית ניווט משלה (למשל showScreen) — נשתמש בה.
    if (typeof CFG.navigate === 'function') {
      if (!tab) return false;
      CFG.navigate(tab.screen || tab.match || name);
      return true;
    }
    // ברירת מחדל: מציאת כפתור לפי טקסט ולחיצה
    var btn = findByText('button', (tab && tab.match) || name);
    if (btn) { btn.click(); return true; }
    return false;
  }

  // מוצא שדה; אם הוא לא על המסך ובמפה כתוב באיזה מסך הוא — עובר לשם ומחכה שיופיע.
  async function locateField(fld) {
    var el = findField(fld);
    if (el || !fld.tab) return el;
    if (!goTo(fld.tab)) return null;
    for (var i = 0; i < 10 && !el; i++) { await wait(80); el = findField(fld); }
    return el;
  }

  function fieldSpec(name) { return (CFG.fields || []).filter(function (f) { return f.name === name; })[0]; }

  // מבצע פעולה. מחזיר { ok, msg, undo? }
  async function runAction(act) {
    try {
      if (act.action === 'navigate') {
        var tabOk = (CFG.tabs || []).some(function (t) { return t.name === act.target; });
        if (!tabOk) return { ok: false, msg: 'אין מסך בשם "' + act.target + '".' };
        return goTo(act.target) ? { ok: true, msg: 'עברתי למסך "' + act.target + '".' } : { ok: false };
      }
      if (act.action === 'writeField') {
        var fld = fieldSpec(act.target);
        var el = fld && await locateField(fld);
        if (!el) return { ok: false };
        var prev = el.value || '';
        setReactValue(el, act.text || '');
        flash(el);
        return { ok: true, msg: 'כתבתי ל' + (fld.label || 'שדה') + '.', undo: async function () {
          var e2 = await locateField(fld);
          if (!e2) return false;
          setReactValue(e2, prev); flash(e2); return true;
        } };
      }
      if (act.action === 'highlight') {
        var fs = fieldSpec(act.target);
        var el2 = (fs && await locateField(fs)) || findByText('button', act.target);
        if (el2) { flash(el2); return { ok: true, msg: 'הנה זה — סימנתי לך בזהב.' }; }
        return { ok: false };
      }
      if (act.action === 'appAction') {
        // פעולה ייחודית לאפליקציה — מוגדרת במפה (CFG.actions), מפעילה פונקציה של האפליקציה.
        var custom = (CFG.actions || {})[act.target];
        if (custom && typeof custom.run === 'function') { await custom.run(act); return { ok: true, msg: custom.done || 'בוצע ✓' }; }
        return { ok: false };
      }
    } catch (e) { return { ok: false }; }
    return { ok: false };
  }

  // האם צריך אישור מהמשתמש לפני הפעולה? (human-in-the-loop)
  function needsConfirm(act) {
    if (act.action === 'writeField' && CFG.confirmWrites !== false) {
      var fld = fieldSpec(act.target), el = fld && findField(fld);
      var cur = el ? (el.value || '').trim() : '';
      return cur && cur !== (act.text || '').trim();      // שדה ריק — אין מה לדרוס, כותבים ישר
    }
    if (act.action === 'appAction') { var c = (CFG.actions || {})[act.target]; return !!(c && c.confirm); }
    return false;
  }
  function describeAction(act) {
    if (act.action === 'writeField') { var f = fieldSpec(act.target); return 'להחליף את התוכן ב' + ((f && f.label) || act.target) + '?'; }
    if (act.action === 'appAction') { var c = (CFG.actions || {})[act.target]; return 'לבצע: ' + ((c && c.desc) || act.target) + '?'; }
    return 'לבצע את הפעולה?';
  }

  /* ─────────────── 5. הנחיית ה-AI (system prompt מהמפה) ─────────────── */
  function buildSystem(textMode) {
    var tn = tabNames().map(function (t) { return '"' + t + '"'; }).join(', ');
    var fieldList = (CFG.fields || []).map(function (f) { return '"' + f.name + '" (' + (f.label || '') + ')'; }).join(', ');

    // "עיניים" — התוכן הנוכחי של השדות, כדי שהעוזר יוכל להתייחס אליו
    var fieldState = (CFG.fields || []).map(function (f) {
      var el = findField(f);
      var val = el ? (el.value || '') : '';
      if (val.length > 1500) val = val.slice(0, 1500) + '…';
      return '• ' + (f.label || f.name) + ': ' + (el ? (val ? '"' + val + '"' : '(ריק)') : '(לא מוצג כרגע במסך)');
    }).join('\n');

    var appState = '';
    if (typeof CFG.readState === 'function') { try { appState = CFG.readState() || ''; } catch (e) {} }

    var an = actionNames();
    var actionList = an.map(function (k) { return '"' + k + '" — ' + ((CFG.actions[k] && CFG.actions[k].desc) || ''); }).join('\n');

    var how = textMode ? [
      'אתה יכול לבצע פעולות באפליקציה. כשמתאים, החזר בלוק פעולה בשורה נפרדת בסוף התשובה,',
      'בפורמט הזה בדיוק (JSON בין הסימנים):',
      '<<ACTION>>{"action":"navigate","target":"שם המסך"}<<END>>',
      '<<ACTION>>{"action":"writeField","target":"שם השדה","text":"התוכן המלא"}<<END>>',
      '<<ACTION>>{"action":"highlight","target":"טקסט הכפתור או שם השדה"}<<END>>',
      (an.length ? '<<ACTION>>{"action":"appAction","target":"שם הפעולה"}<<END>>' : ''),
      'כמה פעולות ברצף — כמה בלוקים, כל אחד בשורה נפרדת, לפי הסדר.'
    ] : [
      'יש לך כלים לביצוע פעולות באפליקציה: write_field (כתיבה לשדה), navigate (מעבר מסך), highlight (סימון כפתור/שדה)' +
        (an.length ? ', app_action (פעולות ייחודיות)' : '') + '.',
      'השתמש בכלים כדי לבצע — אל תכתוב JSON או קוד פעולה בתוך הטקסט.',
      'אם המשתמש ביקש כמה דברים ברצף (למשל "כתוב שיר ואז עבור לקולות") — קרא לכמה כלים לפי הסדר (בדרך כלל קודם לכתוב לשדה, ואז לנווט).'
    ];

    return [
      'אתה עוזר חכם בתוך האפליקציה "' + CFG.appName + '".',
      CFG.appDescription || '',
      ''
    ].concat(how).concat([
      '',
      'מסכים זמינים לניווט: ' + (tn || '(אין)'),
      'שדות זמינים לכתיבה: ' + (fieldList || '(אין)'),
      (actionList ? 'פעולות ייחודיות זמינות:\n' + actionList : ''),
      '',
      'התוכן שנמצא כרגע בשדות האפליקציה (כדי שתוכל להתייחס אליו — לשפר, לתרגם, לענות עליו):',
      (fieldState || '(אין שדות)'),
      (appState ? '\nמצב האפליקציה כרגע:\n' + appState : ''),
      '',
      'כללים: דבר בעברית, טבעי וידידותי. תמיד כתוב קודם תשובה קצרה למשתמש (משפט או שניים), ורק אחר כך בצע פעולה אם צריך.',
      'אם המשתמש מבקש ליצור או לשנות תוכן (שיר, טקסט) — כתוב את התוצאה המלאה לשדה דרך הפעולה, לא בגוף הצ\'אט.',
      'אם המשתמש מבקש לשפר/לשנות/לתרגם משהו "שכתבתי" — התבסס על התוכן הנוכחי של השדות למעלה.',
      'לניווט: השתמש אך ורק בשם מסך מהרשימה. אם המשתמש מבקש מסך שלא ברשימה — אל תנחש; אמור לו בקצרה שאין מסך כזה, או שאל למה התכוון.',
      'אם זו רק שאלה/שיחה — אל תבצע שום פעולה.'
    ]).join('\n');
  }

  // היסטוריה → הודעות מסודרות (user/assistant לסירוגין, מתחיל ב-user)
  function buildMessages(history, userMsg) {
    var arr = history.slice(-12).map(function (m) { return { role: m.role === 'user' ? 'user' : 'assistant', text: m.text || '' }; });
    arr.push({ role: 'user', text: userMsg });
    var out = [];
    arr.forEach(function (m) {
      if (!m.text) return;
      if (!out.length && m.role !== 'user') return;
      if (out.length && out[out.length - 1].role === m.role) out[out.length - 1].text += '\n\n' + m.text;
      else out.push({ role: m.role, text: m.text });
    });
    return out;
  }

  // גיבוי: בלוקי <<ACTION>> בתוך הטקסט (השיטה של גרסה 1)
  function parseTextActions(raw) {
    var actions = [], re = /<<ACTION>>([\s\S]*?)<<END>>/g, m;
    while ((m = re.exec(raw || '')) !== null) {
      try { var a = JSON.parse(m[1].trim()); if (a && a.action) actions.push(a); } catch (e) {}
    }
    return { text: displayText(raw), actions: actions };
  }
  // מה שמוצג למשתמש — בלי בלוקי פעולה (גם בלוק שעוד באמצע הזרימה)
  function displayText(raw) { return (raw || '').replace(/<<ACTION>>[\s\S]*?(<<END>>|$)/g, '').trim(); }

  /* ─────────────── 6. ממשק המשתמש (חלון צ'אט + כפתור) ─────────────── */
  // זיכרון מתמשך — השיחה נשמרת מקומית (localStorage) ונטענת בביקור הבא.
  var HKEY = 'appnest_asst_hist_' + (CFG.appName || 'app');
  function loadHistory() { try { return JSON.parse(localStorage.getItem(HKEY)) || []; } catch (e) { return []; } }
  function saveHistory() { try { localStorage.setItem(HKEY, JSON.stringify(history.slice(-30))); } catch (e) {} }
  var history = loadHistory(), panelEl = null, bodyEl = null, panelInput = null, panelSend = null, busy = false, open = false;
  var controller = null, pendingConfirm = null;

  function el(tag, css, txt) { var e = document.createElement(tag); if (css) e.style.cssText = css; if (txt != null) e.textContent = txt; return e; }

  // הקראת טקסט בעברית (Text-to-Speech מובנה בדפדפן)
  var activePlayBtn = null;
  function stopSpeak() {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    if (activePlayBtn) { activePlayBtn.textContent = '🔊'; activePlayBtn = null; }
  }
  function speak(text, btn) {
    if (!window.speechSynthesis) return;
    stopSpeak();
    var u = new SpeechSynthesisUtterance(text);
    u.lang = 'he-IL'; u.rate = 1;
    u.onend = function () { if (btn) btn.textContent = '🔊'; if (activePlayBtn === btn) activePlayBtn = null; };
    if (btn) { btn.textContent = '⏹'; activePlayBtn = btn; }
    window.speechSynthesis.speak(u);
  }

  function addBubble(role, text) {
    var wrap = el('div', 'display:flex;align-items:flex-end;gap:5px;margin:8px 0;' + (role === 'user' ? 'justify-content:flex-start;' : 'justify-content:flex-end;'));
    var b = el('div',
      'max-width:82%;padding:9px 13px;border-radius:14px;font:14px/1.5 "Segoe UI",sans-serif;white-space:pre-wrap;word-break:break-word;direction:rtl;' +
      (role === 'user'
        ? 'background:#2a2a33;color:#eee;border-top-right-radius:4px;'
        : 'background:#C9A84C;color:#0B0B0F;border-top-left-radius:4px;'), text);
    if (role === 'bot' && window.speechSynthesis) {
      var play = el('button', 'background:none;border:none;cursor:pointer;font-size:15px;opacity:.6;padding:2px;flex-shrink:0;', '🔊');
      play.title = 'הקרא / עצור';
      play.onclick = function () {
        if (activePlayBtn === play) stopSpeak();
        else speak(b.textContent, play);
      };
      wrap.appendChild(play);
    }
    if (role === 'bot') {
      var copy = el('button', 'background:none;border:none;cursor:pointer;font-size:14px;opacity:.6;padding:2px;flex-shrink:0;', '📋');
      copy.title = 'העתק';
      copy.onclick = function () {
        var txt = b.textContent;
        var done = function () { copy.textContent = '✓'; setTimeout(function () { copy.textContent = '📋'; }, 1400); };
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(done, function () {});
        else { try { var ta = document.createElement('textarea'); ta.value = txt; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta); done(); } catch (e) {} }
      };
      wrap.appendChild(copy);
    }
    wrap.appendChild(b); bodyEl.appendChild(wrap); scrollDown();
    return b;
  }
  function scrollDown() { if (bodyEl) bodyEl.scrollTop = bodyEl.scrollHeight; }
  function smallBtn(txt, primary) {
    return el('button', 'border:none;border-radius:14px;padding:6px 14px;font:600 13px "Segoe UI",sans-serif;cursor:pointer;' +
      (primary ? 'background:#C9A84C;color:#0B0B0F;' : 'background:#2a2a33;color:#eee;'), txt);
  }

  // כרטיס אישור לפני פעולה. מחזיר Promise<boolean>.
  function askConfirm(act) {
    return new Promise(function (resolve) {
      var card = el('div', 'margin:8px 0 8px auto;max-width:88%;background:#1e1e26;border:1px solid #C9A84C77;border-radius:14px;padding:10px 12px;direction:rtl;font:14px/1.5 "Segoe UI",sans-serif;color:#eee;');
      card.appendChild(el('div', 'font-weight:600;color:#C9A84C;margin-bottom:6px;', '✋ ' + describeAction(act)));
      if (act.action === 'writeField' && act.text) {
        var pv = act.text.length > 280 ? act.text.slice(0, 280) + '…' : act.text;
        card.appendChild(el('div', 'white-space:pre-wrap;background:#0d0d11;border-radius:8px;padding:8px;font-size:13px;max-height:140px;overflow-y:auto;margin-bottom:8px;color:#ccc;', pv));
      }
      var row = el('div', 'display:flex;gap:8px;');
      var yes = smallBtn('✅ אשר', true), no = smallBtn('✖ בטל', false);
      function finish(v) {
        pendingConfirm = null;
        row.remove();
        card.appendChild(el('div', 'font-size:12px;color:#999;', v ? 'אושר ✓' : 'בוטל'));
        emit('CONFIRM_RESOLVED', { action: act, approved: v });
        resolve(v);
      }
      yes.onclick = function () { finish(true); };
      no.onclick = function () { finish(false); };
      row.appendChild(yes); row.appendChild(no); card.appendChild(row);
      bodyEl.appendChild(card); scrollDown();
      pendingConfirm = finish;
      emit('CONFIRM_REQUESTED', { action: act });
    });
  }

  function addUndo(bubble, undo) {
    var u = smallBtn('↩ בטל שינוי', false);
    u.style.marginTop = '6px'; u.style.display = 'block';
    u.onclick = async function () {
      u.disabled = true;
      var ok = await undo();
      u.textContent = ok ? 'השינוי בוטל ✓' : 'לא מצאתי את השדה';
      emit('UNDO', { ok: ok });
    };
    bubble.appendChild(u); scrollDown();
  }

  function setBusy(v) {
    busy = v;
    if (panelSend) {
      panelSend.textContent = v ? '⏹' : 'שלח';
      panelSend.title = v ? 'עצור' : '';
    }
    if (panelInput) { panelInput.disabled = v; }
  }

  function stop() {
    if (controller) { try { controller.abort(); } catch (e) {} }
    if (pendingConfirm) pendingConfirm(false);
  }

  async function send(input) {
    if (busy) return;                          // מונע שליחה כפולה בזמן שהעוזר עונה
    var msg = input.value.trim(); if (!msg) return;
    input.value = ''; addBubble('user', msg);
    var bubble = addBubble('bot', '…חושב');
    var raw = '', runId = 'run_' + Date.now();
    controller = (typeof AbortController !== 'undefined') ? new AbortController() : null;
    setBusy(true);
    emit('RUN_STARTED', { runId: runId, message: msg });
    try {
      var res = await runAI(history, msg, function (chunk) {
        if (chunk === null) { raw = ''; bubble.textContent = '…חושב'; return; }   // איפוס (מעבר לשיטת גיבוי)
        raw += chunk;
        var shown = displayText(raw);
        bubble.textContent = shown || '…חושב';
        scrollDown();
        emit('TEXT_DELTA', { runId: runId, delta: chunk });
      }, controller && controller.signal);

      var botText = res.text;
      if (botText) bubble.textContent = botText;
      else if (res.actions.length) bubble.parentNode.remove();      // רק פעולה, בלי טקסט
      else bubble.textContent = '✓';
      emit('TEXT_DONE', { runId: runId, text: botText });

      // ביצוע הפעולות לפי הסדר — עם אישור כשצריך, והשהיה קטנה כדי שהמסך יתעדכן
      var notes = [];
      for (var i = 0; i < res.actions.length; i++) {
        var act = res.actions[i];
        emit('TOOL_CALL', { runId: runId, action: act });
        if (needsConfirm(act)) {
          var okGo = await askConfirm(act);
          if (!okGo) { notes.push('המשתמש ביטל: ' + act.action + ' ' + (act.target || '')); continue; }
        }
        var r = await runAction(act);
        emit('TOOL_RESULT', { runId: runId, action: act, ok: r.ok });
        if (r.ok) {
          var fb = addBubble('bot', r.msg || 'בוצע ✓');
          if (r.undo) addUndo(fb, r.undo);
          notes.push('בוצע: ' + (r.msg || act.action));
        } else {
          addBubble('bot', r.msg || 'ניסיתי לבצע פעולה אבל לא מצאתי את היעד באפליקציה.');
          notes.push('נכשל: ' + act.action + ' ' + (act.target || ''));
        }
        if (i < res.actions.length - 1) await wait(450);
      }

      history.push({ role: 'user', text: msg });
      history.push({ role: 'bot', text: (botText || '') + (notes.length ? '\n[' + notes.join(' | ') + ']' : '') });
      if (history.length > 30) history = history.slice(-30);
      saveHistory();
      emit('RUN_FINISHED', { runId: runId });
    } catch (e) {
      if (e.name === 'AbortError') {
        var partial = displayText(raw);
        bubble.textContent = partial ? partial + ' …(נעצר)' : 'עצרתי 🙂';
        if (partial) { history.push({ role: 'user', text: msg }); history.push({ role: 'bot', text: partial }); saveHistory(); }
        emit('RUN_CANCELLED', { runId: runId });
      } else {
        if (e.message === 'NO_AI') bubble.textContent = 'כדי לדבר איתי, חבר קודם מפתח AI בהגדרות הבינה של האפליקציה 🔌';
        else bubble.textContent = 'אופס, משהו השתבש: ' + e.message;
        emit('RUN_ERROR', { runId: runId, message: e.message });
      }
    } finally {
      controller = null;
      setBusy(false);
      if (panelInput) panelInput.focus();
    }
  }

  function addSuggestions(inp) {
    var sugg = CFG.suggestions || [];
    if (!sugg.length) return;
    var row = el('div', 'display:flex;flex-wrap:wrap;gap:6px;justify-content:flex-end;margin:4px 0 8px;');
    sugg.forEach(function (s) {
      var chip = el('button', 'background:#1e1e26;color:#C9A84C;border:1px solid #C9A84C55;border-radius:14px;padding:6px 11px;font:13px "Segoe UI",sans-serif;cursor:pointer;direction:rtl;', s);
      chip.onclick = function () { inp.value = s; row.remove(); send(inp); };
      row.appendChild(chip);
    });
    bodyEl.appendChild(row); scrollDown();
  }

  function buildPanel() {
    panelEl = el('div', 'position:fixed;bottom:78px;left:16px;width:340px;max-width:calc(100vw - 32px);height:460px;max-height:calc(100vh - 120px);' +
      'background:#141418;border:1px solid #2e2e38;border-radius:16px;z-index:100000;display:none;flex-direction:column;overflow:hidden;box-shadow:0 12px 40px rgba(0,0,0,.55);');
    var head = el('div', 'padding:12px 14px;background:linear-gradient(90deg,#1a1a20,#141418);border-bottom:1px solid #2e2e38;display:flex;align-items:center;gap:8px;');
    head.appendChild(el('span', 'font-size:17px;', '🪄'));
    head.appendChild(el('span', 'color:#C9A84C;font:600 15px "Segoe UI",sans-serif;', 'עוזר ' + CFG.appName));
    var clr = el('span', 'margin-right:auto;cursor:pointer;color:#888;font-size:15px;line-height:1;', '🗑️');
    clr.title = 'נקה שיחה';
    clr.onclick = clearChat;
    head.appendChild(clr);
    var x = el('span', 'cursor:pointer;color:#888;font-size:20px;line-height:1;', '×');
    x.onclick = toggle; head.appendChild(x);
    bodyEl = el('div', 'flex:1;overflow-y:auto;padding:12px;');
    var foot = el('div', 'padding:10px;border-top:1px solid #2e2e38;display:flex;gap:8px;align-items:center;');
    var inp = el('input', 'flex:1;background:#0d0d11;border:1px solid #2e2e38;border-radius:20px;padding:9px 14px;color:#eee;font:14px "Segoe UI",sans-serif;direction:rtl;outline:none;');
    inp.placeholder = 'שאל אותי משהו, או בקש עזרה…';
    inp.onkeydown = function (ev) { if (ev.key === 'Enter') send(inp); };
    // כפתור מיקרופון — דיבור לטקסט (Web Speech API, חינם, מובנה בדפדפן)
    var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SR) {
      var rec = new SR();
      rec.lang = 'he-IL'; rec.interimResults = false; rec.maxAlternatives = 1;
      var listening = false, micGranted = false;
      var mic = el('button', 'background:#2a2a33;color:#C9A84C;border:none;border-radius:50%;width:38px;height:38px;font-size:17px;cursor:pointer;flex-shrink:0;', '🎤');
      mic.title = 'דבר במקום להקליד';
      rec.onresult = function (e) { inp.value = e.results[0][0].transcript; inp.focus(); };
      rec.onend = function () { listening = false; mic.style.background = '#2a2a33'; };
      rec.onerror = function (ev) {
        listening = false; mic.style.background = '#2a2a33';
        if (ev && (ev.error === 'not-allowed' || ev.error === 'service-not-allowed'))
          addBubble('bot', 'אין לי גישה למיקרופון. אשר את ההרשאה בהגדרות הדפדפן (ליד כתובת האתר) ונסה שוב 🎤');
        else if (ev && ev.error === 'no-speech')
          addBubble('bot', 'לא שמעתי כלום — נסה לדבר קצת יותר חזק 🙂');
        else if (ev && ev.error === 'not-supported')
          addBubble('bot', 'זיהוי הדיבור לא נתמך בדפדפן הזה — אפשר פשוט להקליד 🙂');
      };
      mic.onclick = async function () {
        if (listening) { rec.stop(); return; }
        if (!micGranted && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          try {
            var stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            stream.getTracks().forEach(function (t) { t.stop(); });
            micGranted = true;
          } catch (e) { /* לא עוצרים — נותנים ל-rec.start לנסות, ו-onerror יטפל */ }
        }
        try { rec.start(); listening = true; mic.style.background = '#C9A84C'; }
        catch (e) { listening = false; addBubble('bot', 'לא הצלחתי להפעיל את המיקרופון — אפשר פשוט להקליד 🙂'); }
      };
      foot.appendChild(mic);
    }
    var snd = el('button', 'background:#C9A84C;color:#0B0B0F;border:none;border-radius:20px;padding:0 16px;height:38px;font:600 14px "Segoe UI",sans-serif;cursor:pointer;flex-shrink:0;', 'שלח');
    snd.onclick = function () { if (busy) stop(); else send(inp); };   // בזמן תשובה — הכפתור עוצר
    foot.appendChild(inp); foot.appendChild(snd);
    panelEl.appendChild(head); panelEl.appendChild(bodyEl); panelEl.appendChild(foot);
    document.body.appendChild(panelEl);
    panelInput = inp; panelSend = snd;
    renderConversation();
  }

  // מציג את השיחה בגוף החלון: היסטוריה שמורה אם יש, אחרת הודעת פתיחה + הצעות.
  function renderConversation() {
    bodyEl.innerHTML = '';
    if (history.length) {
      history.forEach(function (m) { addBubble(m.role === 'user' ? 'user' : 'bot', (m.text || '').replace(/\n\[[^\]]*\]$/, '')); });
    } else {
      addBubble('bot', 'היי! אני העוזר של ' + CFG.appName + '. אפשר לשאול אותי כל דבר, לבקש שאכתוב תוכן ישר לאפליקציה, או לעזור לך למצוא דברים. במה אעזור?');
      if (panelInput) addSuggestions(panelInput);
    }
  }

  function clearChat() {
    if (busy) stop();
    history = []; saveHistory(); stopSpeak();
    renderConversation();
  }

  function toggle() {
    if (!panelEl) buildPanel();
    open = !open;
    panelEl.style.display = open ? 'flex' : 'none';
  }

  function addButton() {
    if (document.getElementById('appnest-assistant-btn')) return;
    var b = el('button', 'position:fixed;bottom:16px;left:16px;z-index:100000;background:#C9A84C;color:#0B0B0F;border:none;' +
      'border-radius:24px;padding:10px 18px;font:600 15px "Segoe UI",sans-serif;cursor:pointer;box-shadow:0 4px 16px rgba(0,0,0,.4);', '🪄 עוזר');
    b.id = 'appnest-assistant-btn';
    b.onclick = toggle;
    document.body.appendChild(b);
  }

  // ממשק חיצוני — האפליקציה יכולה לפתוח את העוזר, לשלוח לו הודעה, או להאזין לאירועים.
  window.AppNestAssistant = {
    version: VERSION,
    open: function () { if (!open) toggle(); },
    close: function () { if (open) toggle(); },
    ask: function (text) { if (!open) toggle(); panelInput.value = text; return send(panelInput); },
    stop: stop,
    on: function (fn) { listeners.push(fn); return function () { listeners = listeners.filter(function (f) { return f !== fn; }); }; }
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', addButton);
  else addButton();
})();
