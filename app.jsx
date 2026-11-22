const { useState, useRef, useCallback, useEffect } = React;

const TR = {
  he: {
    appSub: "כלי הכנת שירים לסונו AI",
    srcTitle: "טקסט מקור",
    srcPh: "כתוב את מילות השיר כאן...\nלחץ על התגיות למעלה להוספת מבנה\n\nדוגמה:\n[Verse 1]\nהלילה נוסעים רחוק\nמשאירים את הכל מאחור\n[Chorus]\nאנחנו חיים את הרגע",
    resTitle: "תוצאה — Lyrics לסונו",
    resSub: "ניתן לעריכה",
    resPh: "התוצאה תופיע כאן...",
    styTitle: "סגנון מוזיקלי — Style לסונו",
    styPh: "הוסף סגנון מותאם (למשל: 120 BPM, female vocals)...",
    transBtn: "תעתיק לאותיות לטיניות", transing: "מתעתק...",
    cpLyr: "העתק Lyrics לסונו", cpSty: "העתק Style לסונו", copied: "הועתק!",
    lines: "שורות", clear: "נקה", srcLang: "שפת מקור",
    speed: "קצב השמעה", listen: "השמע", stop: "עצור",
    settings: "הגדרות", about: "אודות", home: "בית",
    uname: "שם משתמש", unamePh: "הכנס שם...",
    uiLang: "שפת ממשק", theme: "ערכת צבעים",
    share: "שיתוף", prtLyr: "הדפס Lyrics", prtSty: "הדפס Style", prtAll: "הדפס הכל",
    night: "לילה", day: "יום", guide: "מדריך",
    gSteps: [
      { i: "📝", t: "בחר תבנית", d: "בחר תבנית מוכנה (פופ, ראפ, בלדה) או כתוב מאפס. התבנית מכניסה מבנה שיר שלם עם תגיות." },
      { i: "✍️", t: "כתוב מילים", d: "כתוב את מילות השיר בשפת המקור. הוסף תגיות מבנה (Verse, Chorus, Bridge) ותגיות קול (Male, Female, Duet) עם הכפתורים." },
      { i: "📊", t: "בדוק הברות", d: "הפעל את מונה ההברות כדי לוודא שהשורות מאוזנות. שורות באותו אורך = קצב חלק." },
      { i: "🔄", t: "בחר מצב והמר", d: "4 מצבים: תעתיק מלא (לטינית), היברידי (עברית+לטינית), עברית מותאמת (ניקוד+טריקים), או עברית ישירה. נסה ובחר מה שנשמע הכי טוב!" },
      { i: "🔊", t: "השמע ובדוק", d: "לחץ השמע על שני הצדדים. שנה מהירות עם הסליידר. השתמש בהשוואה A/B כדי לשמוע מקור ותוצאה ברצף." },
      { i: "✏️", t: "ערוך ותקן", d: "ערוך את התוצאה ידנית. אם מילה בעייתית — תקן אותה ושמור במילון (📖) לשימוש עתידי." },
      { i: "🎨", t: "בנה סגנון", d: "בחר ז'אנר, סוג קול, BPM. שמור סגנונות מועדפים עם ⭐. הנחיית מבטא ישראלי נוספת אוטומטית!" },
      { i: "📋", t: "העתק לסונו", d: "העתק Lyrics ו-Style בנפרד — כל אחד לתיבה שלו בסונו. טיפ: השתמש ב-Voice בסונו עם קול ישראלי לתוצאה הכי טובה!" },
      { i: "💾", t: "שמור להיסטוריה", d: "שמור שירים מוצלחים להיסטוריה (📜) כדי לזכור מה עבד. ייצא גיבוי בהגדרות." },
    ],
    skip: "דלג", next: "הבא", done: "סיום",
    aboutTxt: "SunoPrep הוא כלי מתקדם להכנת שירים לפלטפורמת Suno AI.\n\nהכלי פותר את הבעיה המרכזית של שירה בשפות שסונו מתקשה בהן (עברית, ערבית, רוסית ועוד) באמצעות 4 מצבי המרה: תעתיק מלא ללטינית, היברידי, עברית מנוקדת מותאמת, ועברית ישירה.\n\nתכונות עיקריות:\n• 4 מצבי המרה לבחירה\n• בניית סגנון מוזיקלי עם ז'אנרים, סוג קול, BPM\n• סגנונות מועדפים אישיים (⭐)\n• תגיות מבנה שיר + תגיות קול (דואט, מקהלה...)\n• תבניות שיר מוכנות (פופ, ראפ, בלדה)\n• השמעה (TTS) עם שליטת מהירות\n• השוואה A/B בין מקור לתוצאה\n• מונה הברות לכל שורה\n• מילון מילים בעייתיות\n• היסטוריית שירים\n• הנחיית מבטא ישראלי אוטומטית\n• הדפסה, שיתוף, ייצוא/ייבוא גיבוי\n• ✨ אולפן שירים עם AI: רעיונות, 3 כיוונים, כלי שורה (חלופות, קיצור, חרוזים), שם לשיר וסגנון לסונו\n• 🎻 סדנת שיפור: מבקר AI נותן ציון, ושינוי נשמר רק אם הציון עלה\n• 🧐 מבקר ניקוד ששומר על האותיות\n• 📚 ספריית סגנונות: דירוג, הערות, קישורים, ״לנסות שוב״ ווריאציות AI\n• 5 שפות ממשק, 9 שפות מקור\n• 5 ערכות צבע + מצב יום/לילה\n• עובד בדפדפן — בלי שרת, בלי התקנה",
    ver: "גרסה 10.1", back: "← חזרה לדף הבית",
    errCon: "שגיאה בחיבור. נסה שוב.", shareMsg: "נסו את SunoPrep — כלי מתקדם להכנת שירים לסונו AI! 🎤🎵",
    prevSty: "Style:", custLbl: "סגנון מותאם אישית:",
    delAll: "מחיקת כל הנתונים", delConf: "לחץ שוב לאישור", deleted: "נמחק",
    expBk: "ייצוא גיבוי", impBk: "ייבוא גיבוי", dayNight: "מצב תצוגה",
  },
  en: {
    appSub: "Song prep tool for Suno AI",
    srcTitle: "Source text",
    srcPh: "Write your lyrics here...\nClick tags above to add structure\n\nExample:\n[Verse 1]\nTonight we drive far away\n[Chorus]\nWe live the moment",
    resTitle: "Result — Lyrics for Suno", resSub: "Editable",
    resPh: "Result will appear here...",
    styTitle: "Music style — Style for Suno",
    styPh: "Add custom style (e.g., 120 BPM, female vocals)...",
    transBtn: "Transliterate to Latin", transing: "Processing...",
    cpLyr: "Copy Lyrics for Suno", cpSty: "Copy Style for Suno", copied: "Copied!",
    lines: "lines", clear: "Clear", srcLang: "Source language",
    speed: "Playback speed", listen: "Listen", stop: "Stop",
    settings: "Settings", about: "About", home: "Home",
    uname: "Username", unamePh: "Enter name...",
    uiLang: "Interface language", theme: "Color theme",
    share: "Share", prtLyr: "Print Lyrics", prtSty: "Print Style", prtAll: "Print all",
    night: "Night", day: "Day", guide: "Guide",
    gSteps: [
      { i: "📝", t: "Choose template", d: "Pick a ready-made template (Pop, Rap, Ballad) or start from scratch. Templates insert a full song structure with tags." },
      { i: "✍️", t: "Write lyrics", d: "Write your lyrics in the source language. Add structure tags (Verse, Chorus, Bridge) and voice tags (Male, Female, Duet) with the buttons." },
      { i: "📊", t: "Check syllables", d: "Enable the syllable counter to make sure lines are balanced. Equal-length lines = smooth rhythm." },
      { i: "🔄", t: "Choose mode & convert", d: "4 modes: Full transliteration, Hybrid, Optimized Hebrew (nikud+tricks), or Direct Hebrew. Try each and pick what sounds best!" },
      { i: "🔊", t: "Listen & check", d: "Click play on both sides. Adjust speed with the slider. Use A/B Compare to hear source and result back to back." },
      { i: "✏️", t: "Edit & fix", d: "Edit the result manually. If a word is problematic, fix it and save to the dictionary (📖) for future use." },
      { i: "🎨", t: "Build style", d: "Pick genre, voice type, BPM. Save favorite styles with ⭐. Israeli accent hint is added automatically!" },
      { i: "📋", t: "Copy to Suno", d: "Copy Lyrics and Style separately — each to its own box in Suno. Pro tip: Use Suno's Voice feature with a native voice for best results!" },
      { i: "💾", t: "Save to history", d: "Save successful songs to history (📜) to remember what worked. Export backups in Settings." },
    ],
    skip: "Skip", next: "Next", done: "Done",
    aboutTxt: "SunoPrep is an advanced tool for preparing songs for Suno AI.\n\nIt solves the core problem of singing in languages Suno struggles with (Hebrew, Arabic, Russian, etc.) through 4 conversion modes: full Latin transliteration, hybrid, optimized Hebrew with nikud, and direct Hebrew.\n\nKey features:\n• 4 conversion modes\n• Music style builder with genres, voice types, BPM\n• Personal favorite styles (⭐)\n• Song structure + voice tags (duet, choir...)\n• Ready-made song templates (Pop, Rap, Ballad)\n• TTS playback with speed control\n• A/B comparison between source and result\n• Syllable counter per line\n• Problem words dictionary\n• Song history\n• Auto Israeli accent hint\n• Print, share, export/import backup\n• ✨ AI song studio, auto-refine with a critic, nikud reviewer\n• 5 UI languages, 9 source languages\n• 5 color themes + day/night mode\n• Runs in browser — no server, no install",
    ver: "Version 10.1", back: "← Back to home",
    errCon: "Connection error. Try again.", shareMsg: "Try SunoPrep — advanced song prep for Suno AI! 🎤🎵",
    prevSty: "Style:", custLbl: "Custom style:",
    delAll: "Delete all data", delConf: "Click again to confirm", deleted: "Deleted",
    expBk: "Export backup", impBk: "Import backup", dayNight: "Display mode",
  },
  ru: {
    appSub: "Подготовка песен для Suno", srcTitle: "Исходный текст", srcPh: "Напишите текст...",
    resTitle: "Результат — Lyrics", resSub: "Редактируемый", resPh: "Результат появится здесь...",
    styTitle: "Стиль — Style для Suno", styPh: "Добавьте стиль...",
    transBtn: "Транслитерация", transing: "Обработка...",
    cpLyr: "Копировать Lyrics", cpSty: "Копировать Style", copied: "Скопировано!",
    lines: "строк", clear: "Очистить", srcLang: "Язык оригинала",
    speed: "Скорость", listen: "Слушать", stop: "Стоп",
    settings: "Настройки", about: "О приложении", home: "Главная",
    uname: "Имя", unamePh: "Введите имя...", uiLang: "Язык", theme: "Тема",
    share: "Поделиться", prtLyr: "Печать Lyrics", prtSty: "Печать Style", prtAll: "Печать",
    night: "Ночь", day: "День", guide: "Руководство",
    gSteps: [
      { i: "✍️", t: "Текст", d: "Напишите текст песни" },
      { i: "🏷️", t: "Структура", d: "Куплет, припев, бридж" },
      { i: "🔄", t: "Транслитерация", d: "Латинские буквы" },
      { i: "🎨", t: "Стиль", d: "Выберите стиль" },
      { i: "📋", t: "Копировать", d: "Lyrics и Style отдельно" },
    ],
    skip: "Пропустить", next: "Далее", done: "Готово",
    aboutTxt: "Продвинутый инструмент подготовки песен для Suno AI. 4 режима конвертации, построитель стилей, история песен, словарь проблемных слов.", ver: "Версия 9.7", back: "← Назад",
    errCon: "Ошибка.", shareMsg: "Попробуйте SunoPrep!",
    prevSty: "Style:", custLbl: "Свой стиль:",
    delAll: "Удалить всё", delConf: "Ещё раз", deleted: "Удалено",
    expBk: "Экспорт", impBk: "Импорт", dayNight: "Режим",
  },
  es: {
    appSub: "Preparación para Suno", srcTitle: "Texto original", srcPh: "Escribe la letra...",
    resTitle: "Resultado — Lyrics", resSub: "Editable", resPh: "Resultado aquí...",
    styTitle: "Estilo — Style para Suno", styPh: "Agrega estilo...",
    transBtn: "Transliterar", transing: "Procesando...",
    cpLyr: "Copiar Lyrics", cpSty: "Copiar Style", copied: "¡Copiado!",
    lines: "líneas", clear: "Limpiar", srcLang: "Idioma",
    speed: "Velocidad", listen: "Escuchar", stop: "Parar",
    settings: "Ajustes", about: "Info", home: "Inicio",
    uname: "Nombre", unamePh: "Tu nombre...", uiLang: "Idioma", theme: "Tema",
    share: "Compartir", prtLyr: "Imprimir Lyrics", prtSty: "Imprimir Style", prtAll: "Imprimir",
    night: "Noche", day: "Día", guide: "Guía",
    gSteps: [
      { i: "✍️", t: "Letra", d: "Escribe en idioma original" },
      { i: "🏷️", t: "Estructura", d: "Verso, coro, puente" },
      { i: "🔄", t: "Transliterar", d: "Letras latinas" },
      { i: "🎨", t: "Estilo", d: "Elige o escribe" },
      { i: "📋", t: "Copiar", d: "Lyrics y Style separados" },
    ],
    skip: "Saltar", next: "Siguiente", done: "Listo",
    aboutTxt: "Herramienta avanzada para preparar canciones para Suno AI. 4 modos de conversión, constructor de estilos, historial, diccionario de palabras problemáticas.", ver: "v10.1", back: "← Volver",
    errCon: "Error.", shareMsg: "¡Prueba SunoPrep!",
    prevSty: "Style:", custLbl: "Personalizado:",
    delAll: "Borrar todo", delConf: "Confirma", deleted: "Borrado",
    expBk: "Exportar", impBk: "Importar", dayNight: "Modo",
  },
  ar: {
    appSub: "إعداد أغاني لـ Suno", srcTitle: "النص الأصلي", srcPh: "اكتب كلمات الأغنية...",
    resTitle: "النتيجة — Lyrics", resSub: "قابل للتعديل", resPh: "ستظهر النتيجة...",
    styTitle: "النمط — Style لـ Suno", styPh: "أضف نمطًا...",
    transBtn: "حوّل لحروف لاتينية", transing: "جارٍ...",
    cpLyr: "انسخ Lyrics", cpSty: "انسخ Style", copied: "تم!",
    lines: "أسطر", clear: "مسح", srcLang: "لغة المصدر",
    speed: "السرعة", listen: "استمع", stop: "إيقاف",
    settings: "إعدادات", about: "حول", home: "رئيسية",
    uname: "الاسم", unamePh: "أدخل الاسم...", uiLang: "اللغة", theme: "الألوان",
    share: "مشاركة", prtLyr: "طباعة Lyrics", prtSty: "طباعة Style", prtAll: "طباعة",
    night: "ليل", day: "نهار", guide: "دليل",
    gSteps: [
      { i: "✍️", t: "اكتب", d: "كلمات الأغنية" },
      { i: "🏷️", t: "هيكل", d: "بيت، لازمة، جسر" },
      { i: "🔄", t: "حوّل", d: "حروف لاتينية" },
      { i: "🎨", t: "النمط", d: "اختر أو اكتب" },
      { i: "📋", t: "انسخ", d: "Lyrics و Style منفصلين" },
    ],
    skip: "تخطي", next: "التالي", done: "تم",
    aboutTxt: "أداة متقدمة لإعداد أغاني Suno AI. 4 أوضاع تحويل، منشئ أنماط، سجل الأغاني، قاموس الكلمات المشكلة.", ver: "v10.1", back: "← العودة",
    errCon: "خطأ.", shareMsg: "جرّب SunoPrep!",
    prevSty: "Style:", custLbl: "مخصص:",
    delAll: "حذف الكل", delConf: "مرة أخرى", deleted: "تم الحذف",
    expBk: "تصدير", impBk: "استيراد", dayNight: "الوضع",
  },
};

const LANGS = {
  he: { n: "עברית", d: "rtl", tts: "he-IL" },
  ar: { n: "العربية", d: "rtl", tts: "ar-SA" },
  ru: { n: "Русский", d: "ltr", tts: "ru-RU" },
  el: { n: "Ελληνικά", d: "ltr", tts: "el-GR" },
  tr: { n: "Türkçe", d: "ltr", tts: "tr-TR" },
  th: { n: "ไทย", d: "ltr", tts: "th-TH" },
  ko: { n: "한국어", d: "ltr", tts: "ko-KR" },
  ja: { n: "日本語", d: "ltr", tts: "ja-JP" },
  es: { n: "Español", d: "ltr", tts: "es-ES" },
};

const UI_LANGS = { he: "עברית", en: "English", ru: "Русский", es: "Español", ar: "العربية" };

const TAGS = ["[Intro]","[Verse]","[Pre-Chorus]","[Chorus]","[Bridge]","[Outro]","[Break]"];

const VOICE_TAGS = [
  { l: "[Male Vocal]", h: "קול גבר" },
  { l: "[Female Vocal]", h: "קול אישה" },
  { l: "[Duet]", h: "דואט" },
  { l: "[Harmony]", h: "הרמוניה" },
  { l: "[Spoken Word]", h: "דיבור" },
  { l: "[Whisper]", h: "לחישה" },
  { l: "[Ad-lib]", h: "אד-ליב" },
  { l: "[Backing Vocals]", h: "ליווי" },
  { l: "[Choir]", h: "מקהלה" },
];

const VOCAL_STYLES = [
  { id: "male_deep", l: "גבר עמוק / Deep Male", p: "deep male vocals" },
  { id: "male_soft", l: "גבר רך / Soft Male", p: "soft clear male vocals" },
  { id: "male_raspy", l: "גבר צרוד / Raspy Male", p: "raspy male vocals" },
  { id: "female_soft", l: "אישה רכה / Soft Female", p: "soft female vocals" },
  { id: "female_power", l: "אישה חזקה / Power Female", p: "powerful female vocals" },
  { id: "female_high", l: "אישה גבוהה / High Female", p: "high-pitched female vocals" },
  { id: "duet_mf", l: "דואט גבר+אישה / M+F Duet", p: "male and female duet vocals" },
  { id: "choir", l: "מקהלה / Choir", p: "choir backing vocals, harmonies" },
  { id: "autotune", l: "אוטוטיון / Autotune", p: "autotune vocals, T-Pain style" },
];

const STYLES = [
  { id: "mizrachi", l: "מזרחי / Mizrachi", p: "Mizrachi pop, darbuka, oud, Middle Eastern scales, quarter tones" },
  { id: "israeli", l: "פופ ישראלי / Israeli Pop", p: "Israeli pop, Mediterranean feel, acoustic guitar, catchy melody" },
  { id: "ballad", l: "בלדה / Ballad", p: "Slow ballad, piano, strings, emotional, heartfelt" },
  { id: "rap", l: "ראפ / Rap", p: "Rap, trap beat, 808 bass, aggressive flow, urban" },
  { id: "rock", l: "רוק / Rock", p: "Rock, electric guitar, drums, energetic, powerful" },
  { id: "electronic", l: "אלקטרוני / Electronic", p: "Electronic pop, synth, dance beat, modern production" },
  { id: "reggae", l: "רגאיי / Reggae", p: "Relaxed acoustic reggae, smooth summer chill, warm guitar skank, easy bassline" },
  { id: "acoustic", l: "אקוסטי / Acoustic", p: "Acoustic, fingerpicking guitar, intimate, folk" },
  { id: "rnb", l: "R&B", p: "R&B, smooth, soulful, groove, modern" },
  { id: "reggaeton", l: "רגאטון / Reggaeton", p: "Reggaeton, Latin beat, dancehall, rhythmic, energetic" },
];

const TH = {
  gold: { a: "#C9A84C", bg: "#0B0B0F", bgL: "#F5F3EE", cd: "#141418", cdL: "#FFF", bd: "#2A2A30", bdL: "#E0DDD5" },
  blue: { a: "#4A8FE7", bg: "#0A0D14", bgL: "#F0F4FA", cd: "#11151E", cdL: "#FFF", bd: "#1E2A3A", bdL: "#D0D8E8" },
  emerald: { a: "#3DAA7D", bg: "#0A100E", bgL: "#F0F8F4", cd: "#111A16", cdL: "#FFF", bd: "#1E3028", bdL: "#C8E0D4" },
  rose: { a: "#D4637A", bg: "#100A0C", bgL: "#FAF0F2", cd: "#1A1114", cdL: "#FFF", bd: "#302028", bdL: "#E8D0D8" },
  purple: { a: "#9B7FD4", bg: "#0C0A12", bgL: "#F4F1FA", cd: "#15111E", cdL: "#FFF", bd: "#28203A", bdL: "#DAD0E8" },
};

/* ─── ניגודיות צבעים: צבע הדגשה כטקסט על רקע בהיר מוכהה עד שמגיע ל-4.5:1; טקסט על רקע הדגשה נבחר לבן/שחור לפי הניגוד הטוב יותר ─── */
const hexRgb = (h) => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
const relLum = ([r, g, b]) => { const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
const contrastOf = (c1, c2) => { const a = relLum(c1), b = relLum(c2); return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05); };
const accentForText = (hex, bgHex, min = 4.5) => {
  const bgc = hexRgb(bgHex); let rgb = hexRgb(hex);
  for (let i = 0; i < 40 && contrastOf(rgb, bgc) < min; i++) rgb = rgb.map(v => Math.round(v * 0.93));
  return "#" + rgb.map(v => v.toString(16).padStart(2, "0")).join("");
};
const textOnAccent = (hex) => contrastOf(hexRgb(hex), [11, 11, 15]) >= contrastOf(hexRgb(hex), [255, 255, 255]) ? "#0B0B0F" : "#FFFFFF";

/* ─── AI PROVIDERS ─── */
const AI_PROVIDERS = [
  { id: "gemini", icon: "✨", badge: { he: "חינם", en: "Free", ru: "Бесплатно", es: "Gratis", ar: "مجاني" }, badgeType: "free",
    name: "Gemini (Google)",
    desc: { he: "חינם לגמרי · בלי כרטיס אשראי", en: "Completely free · No credit card", ru: "Бесплатно · Без карты", es: "Gratis · Sin tarjeta", ar: "مجاني · بدون بطاقة" } },
  { id: "claude", icon: "🤖", badge: { he: "בתשלום", en: "Paid", ru: "Платно", es: "Pago", ar: "مدفوع" }, badgeType: "paid",
    name: "Claude (Anthropic)",
    desc: { he: "הכי מדויק לעברית · ~$0.01 לשיר", en: "Most accurate for Hebrew · ~$0.01/song", ru: "Точнее всех · ~$0.01", es: "Más preciso · ~$0.01", ar: "الأدق · ~$0.01" } },
  { id: "openai", icon: "💬", badge: { he: "בתשלום", en: "Paid", ru: "Платно", es: "Pago", ar: "مدفوع" }, badgeType: "paid",
    name: "ChatGPT (OpenAI)",
    desc: { he: "GPT-4o Mini · מהיר וזול", en: "GPT-4o Mini · Fast and cheap", ru: "GPT-4o Mini · Быстро", es: "GPT-4o Mini · Rápido", ar: "GPT-4o Mini · سريع" } },
  { id: "device", icon: "📱", badge: { he: "מקומי", en: "Local", ru: "Локально", es: "Local", ar: "محلي" }, badgeType: "device",
    name: "Ollama / LM Studio",
    desc: { he: "רץ במחשב שלך · פרטי לחלוטין", en: "Runs on your computer · Fully private", ru: "На вашем ПК · Приватно", es: "En tu PC · Privado", ar: "على جهازك · خاص" } },
  { id: "custom", icon: "⚙️", badge: { he: "מותאם", en: "Custom", ru: "Свой", es: "Custom", ar: "مخصص" }, badgeType: "device",
    name: { he: "endpoint מותאם", en: "Custom endpoint", ru: "Свой эндпоинт", es: "Endpoint propio", ar: "نقطة مخصصة" },
    desc: { he: "כל URL תואם OpenAI", en: "Any OpenAI-compatible URL", ru: "Любой OpenAI URL", es: "URL compatible OpenAI", ar: "أي URL متوافق" } },
];

const SETUP_STEPS = {
  he: {
    intro: "🔐 המפתח שלך נשמר רק במכשיר שלך — הוא לא נשלח לשום מקום חוץ מספק ה-AI שבחרת.",
    gemini: { label: "מפתח Google Gemini", ph: "AIza...", note: "✅ חינם לגמרי: 15 בקשות בדקה — בלי כרטיס אשראי!",
      steps: ["היכנס ל־aistudio.google.com", "התחבר עם חשבון Google רגיל", "לחץ Get API Key ← Create API key", "העתק את המפתח (מתחיל ב-AIza) והדבק כאן"] },
    claude: { label: "מפתח Anthropic API", ph: "sk-ant-api03-...",
      steps: ["היכנס ל־console.anthropic.com וצור חשבון", "הוסף אמצעי תשלום (תשלום לפי שימוש, ~$0.01 לשיר)", "בתפריט הצד לחץ API Keys", "לחץ Create Key ← העתק והדבק כאן"] },
    openai: { label: "מפתח OpenAI API", ph: "sk-proj-...",
      steps: ["היכנס ל־platform.openai.com", "לחץ על תמונת הפרופיל ← API Keys", "לחץ Create new secret key ← העתק מיד (מוצג פעם אחת!)", "עבור ל־Billing והוסף אמצעי תשלום"] },
    device: { title: "📱 AI מקומי במחשב שלך", info: "מתחבר ל-AI שרץ על המחשב שלך. פרטיות מלאה — שום מידע לא יוצא מהמכשיר.",
      urlLabel: "כתובת API מקומית", urlHint: "Ollama: פורט 11434 · LM Studio: פורט 1234",
      steps: ["התקן Ollama (ollama.ai) או LM Studio (lmstudio.ai)", "הורד מודל: הרץ ollama pull llama3 בטרמינל", "ודא שהשרת רץ לפני שאתה מתעתק"] },
    custom: { label1: "כתובת API", ph1: "https://your-api.com/v1/chat/completions", label2: "מפתח API (אופציונלי)", ph2: "המפתח שלך...", hint: "חייב להיות תואם OpenAI (פורמט chat/completions)." },
    save: "✓ שמור והתחבר", test: "🔌 בדוק חיבור", testing: "בודק...", ok: "✓ החיבור תקין!", fail: "✗ נכשל: ", noSel: "בחר ספק AI קודם",
    title: "חיבור בינה מלאכותית", connected: "מחובר", notConnected: "לא מחובר", selectProvider: "בחר ספק AI",
  },
  en: {
    intro: "🔐 Your key stays on your device only — it's never sent anywhere except the AI provider you choose.",
    gemini: { label: "Google Gemini API Key", ph: "AIza...", note: "✅ Completely free: 15 requests/min — no credit card needed!",
      steps: ["Go to aistudio.google.com", "Sign in with any Google account", "Click Get API Key → Create API key", "Copy the key (starts with AIza) and paste here"] },
    claude: { label: "Anthropic API Key", ph: "sk-ant-api03-...",
      steps: ["Go to console.anthropic.com and create an account", "Add a payment method (pay per use, ~$0.01/song)", "In the sidebar click API Keys", "Click Create Key → copy and paste here"] },
    openai: { label: "OpenAI API Key", ph: "sk-proj-...",
      steps: ["Go to platform.openai.com", "Click your profile icon → API Keys", "Click Create new secret key → copy immediately (shown once!)", "Go to Billing and add a payment method"] },
    device: { title: "📱 Local AI on your computer", info: "Connects to AI running locally on your machine. Full privacy — no data leaves your device.",
      urlLabel: "Local API URL", urlHint: "Ollama: port 11434 · LM Studio: port 1234",
      steps: ["Install Ollama (ollama.ai) or LM Studio (lmstudio.ai)", "Download a model: run ollama pull llama3 in Terminal", "Make sure the server is running before transliterating"] },
    custom: { label1: "API Endpoint URL", ph1: "https://your-api.com/v1/chat/completions", label2: "API Key (optional)", ph2: "Your API key...", hint: "Must be OpenAI-compatible (chat/completions format)." },
    save: "✓ Save and connect", test: "🔌 Test connection", testing: "Testing...", ok: "✓ Connected!", fail: "✗ Failed: ", noSel: "Select a provider first",
    title: "AI Connection", connected: "Connected", notConnected: "Not connected", selectProvider: "Choose AI provider",
  },
  ru: {
    intro: "🔐 Ваш ключ хранится только на устройстве.",
    gemini: { label: "Ключ Google Gemini", ph: "AIza...", note: "✅ Бесплатно: 15 запросов/мин — без карты!",
      steps: ["Зайдите на aistudio.google.com", "Войдите с аккаунтом Google", "Get API Key → Create API key", "Скопируйте ключ (AIza...) и вставьте"] },
    claude: { label: "Ключ Anthropic API", ph: "sk-ant-api03-...",
      steps: ["console.anthropic.com — создайте аккаунт", "Добавьте способ оплаты (~$0.01/песня)", "API Keys в боковой панели", "Create Key → скопируйте"] },
    openai: { label: "Ключ OpenAI API", ph: "sk-proj-...",
      steps: ["platform.openai.com", "Профиль → API Keys", "Create new secret key → копируйте сразу", "Billing → добавьте оплату"] },
    device: { title: "📱 Локальный ИИ", info: "Подключается к ИИ на вашем компьютере. Полная приватность.",
      urlLabel: "Локальный URL", urlHint: "Ollama: 11434 · LM Studio: 1234",
      steps: ["Установите Ollama или LM Studio", "ollama pull llama3", "Запустите сервер"] },
    custom: { label1: "URL эндпоинта", ph1: "https://your-api.com/v1/chat/completions", label2: "Ключ (опц.)", ph2: "Ваш ключ...", hint: "OpenAI-совместимый формат." },
    save: "✓ Сохранить", test: "🔌 Проверить", testing: "Проверка...", ok: "✓ Подключено!", fail: "✗ Ошибка: ", noSel: "Выберите провайдера",
    title: "Подключение ИИ", connected: "Подключено", notConnected: "Не подключено", selectProvider: "Выберите провайдера",
  },
  es: {
    intro: "🔐 Tu clave se queda solo en tu dispositivo.",
    gemini: { label: "Clave Google Gemini", ph: "AIza...", note: "✅ Gratis: 15 solicitudes/min — ¡sin tarjeta!",
      steps: ["Ve a aistudio.google.com", "Inicia sesión con Google", "Get API Key → Create API key", "Copia la clave (AIza...) y pégala"] },
    claude: { label: "Clave Anthropic API", ph: "sk-ant-api03-...",
      steps: ["console.anthropic.com — crea cuenta", "Agrega método de pago (~$0.01/canción)", "API Keys en el panel", "Create Key → copia"] },
    openai: { label: "Clave OpenAI API", ph: "sk-proj-...",
      steps: ["platform.openai.com", "Perfil → API Keys", "Create new secret key → copia ya", "Billing → agrega pago"] },
    device: { title: "📱 IA Local", info: "Se conecta a IA en tu computadora. Privacidad total.",
      urlLabel: "URL local", urlHint: "Ollama: 11434 · LM Studio: 1234",
      steps: ["Instala Ollama o LM Studio", "ollama pull llama3", "Inicia el servidor"] },
    custom: { label1: "URL del endpoint", ph1: "https://your-api.com/v1/chat/completions", label2: "Clave (opcional)", ph2: "Tu clave...", hint: "Compatible con OpenAI." },
    save: "✓ Guardar", test: "🔌 Probar", testing: "Probando...", ok: "✓ ¡Conectado!", fail: "✗ Falló: ", noSel: "Elige un proveedor",
    title: "Conexión IA", connected: "Conectado", notConnected: "No conectado", selectProvider: "Elige proveedor",
  },
  ar: {
    intro: "🔐 مفتاحك يبقى على جهازك فقط.",
    gemini: { label: "مفتاح Google Gemini", ph: "AIza...", note: "✅ مجاني: 15 طلب/دقيقة — بدون بطاقة!",
      steps: ["اذهب إلى aistudio.google.com", "سجّل الدخول بحساب Google", "Get API Key ← Create API key", "انسخ المفتاح (AIza...) والصقه"] },
    claude: { label: "مفتاح Anthropic API", ph: "sk-ant-api03-...",
      steps: ["console.anthropic.com — أنشئ حساباً", "أضف وسيلة دفع (~$0.01/أغنية)", "API Keys في الشريط", "Create Key ← انسخ"] },
    openai: { label: "مفتاح OpenAI API", ph: "sk-proj-...",
      steps: ["platform.openai.com", "الملف الشخصي ← API Keys", "Create new secret key ← انسخ فوراً", "Billing ← أضف دفع"] },
    device: { title: "📱 ذكاء محلي", info: "يتصل بذكاء اصطناعي على جهازك. خصوصية تامة.",
      urlLabel: "عنوان محلي", urlHint: "Ollama: 11434 · LM Studio: 1234",
      steps: ["ثبّت Ollama أو LM Studio", "ollama pull llama3", "شغّل الخادم"] },
    custom: { label1: "عنوان API", ph1: "https://your-api.com/v1/chat/completions", label2: "المفتاح (اختياري)", ph2: "مفتاحك...", hint: "متوافق مع OpenAI." },
    save: "✓ حفظ", test: "🔌 اختبار", testing: "جارٍ...", ok: "✓ متصل!", fail: "✗ فشل: ", noSel: "اختر مزوداً",
    title: "اتصال الذكاء", connected: "متصل", notConnected: "غير متصل", selectProvider: "اختر مزوداً",
  },
};

const GEMINI_MODELS = ["gemini-flash-latest", "gemini-3.6-flash", "gemini-3.5-flash", "gemini-3.5-flash-lite", "gemini-2.5-flash", "gemini-2.0-flash"];

async function fetchGeminiModels(key) {
  try {
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
    if (!r.ok) return null;
    const d = await r.json();
    const models = (d.models || [])
      .filter(m => (m.supportedGenerationMethods || []).includes("generateContent"))
      .map(m => m.name.replace("models/", ""))
      .filter(n => n.includes("flash") || n.includes("pro"));
    return models.length ? models : null;
  } catch { return null; }
}

async function callGemini(keys, prompt, modelList, opts = {}) {
  const keyList = Array.isArray(keys) ? keys : [keys];
  // Try a cached working model first, then the provided/default list
  let models = modelList && modelList.length ? modelList : GEMINI_MODELS;
  const cached = (typeof localStorage !== "undefined") ? localStorage.getItem("sp_gemini_model") : null;
  if (cached) models = [cached, ...models.filter(m => m !== cached)];
  let lastErr = null;
  for (const key of keyList) {
    for (const model of models) {
      const genCfg = { temperature: opts.temperature ?? 0.3, maxOutputTokens: 6000 };
      // בלי "חשיבה" בכל מודל Flash (כולל gemini-flash-latest) — זה מה שהאט את יצירת השירים
      if (model.includes("flash") || model.startsWith("gemini-2.5") || model.startsWith("gemini-3")) genCfg.thinkingConfig = { thinkingBudget: 0 };
      try {
        if (opts.onText) {                                   // זרימה: הטקסט מופיע תוך כדי כתיבה
          const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse&key=${key}`, {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: genCfg }),
          });
          if (res.ok && res.body) {
            const reader = res.body.getReader(), dec = new TextDecoder(); let buf = "", full = "";
            for (;;) {
              const { value, done } = await reader.read(); if (done) break;
              buf += dec.decode(value, { stream: true });
              let nl; while ((nl = buf.indexOf("\n")) >= 0) {
                const line = buf.slice(0, nl).trim(); buf = buf.slice(nl + 1);
                if (!line.startsWith("data:")) continue;
                try { const d = JSON.parse(line.slice(5)); const piece = (d?.candidates?.[0]?.content?.parts || []).map(x => x.text || "").join(""); if (piece) { full += piece; opts.onText(full); } } catch (e) {}
              }
            }
            if (full.trim()) { try { localStorage.setItem("sp_gemini_model", model); } catch {} return full; }
            // הזרימה לא החזירה טקסט — ממשיכים לבקשה רגילה באותו מודל
          }
          if (!res.ok) {
            const e = await res.json().catch(() => ({}));
            lastErr = new Error(e?.error?.message || `HTTP ${res.status}`);
            if (res.status === 429) { try { localStorage.removeItem("sp_gemini_model"); } catch {} }
            if (![404, 429, 500, 503].includes(res.status)) throw lastErr;
            continue;
          }
        }
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: genCfg }),
        });
        if (res.ok) {
          const d = await res.json();
          try { localStorage.setItem("sp_gemini_model", model); } catch {}
          return d?.candidates?.[0]?.content?.parts?.[0]?.text || "";
        }
        const e = await res.json().catch(() => ({}));
        lastErr = new Error(e?.error?.message || `HTTP ${res.status}`);
        if (res.status === 429) { try { localStorage.removeItem("sp_gemini_model"); } catch {} }
        if (![404, 429, 500, 503].includes(res.status)) throw lastErr;
      } catch (e) { lastErr = e; }
    }
  }
  throw lastErr || new Error("Gemini unavailable");
}

async function callOpenAICompat(url, key, prompt, model, opts = {}) {
  const h = { "Content-Type": "application/json" };
  if (key) h["Authorization"] = "Bearer " + key;
  const res = await fetch(url, {
    method: "POST", headers: h,
    body: JSON.stringify({ model: model || "gpt-4o-mini", max_tokens: 3000, ...(opts.temperature != null ? { temperature: opts.temperature } : {}), messages: [{ role: "user", content: prompt }] }),
  });
  if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e?.error?.message || `HTTP ${res.status}`); }
  const d = await res.json();
  return d?.choices?.[0]?.message?.content || "";
}

async function callClaude(key, prompt, opts = {}) {
  const h = { "Content-Type": "application/json" };
  if (key) { h["x-api-key"] = key; h["anthropic-version"] = "2023-06-01"; h["anthropic-dangerous-direct-browser-access"] = "true"; }
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST", headers: h,
    body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 3000, ...(opts.temperature != null ? { temperature: Math.min(1, opts.temperature) } : {}), messages: [{ role: "user", content: prompt }] }),
  });
  if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e?.error?.message || `HTTP ${res.status}`); }
  const d = await res.json();
  return d?.content?.[0]?.text || "";
}

/* ─── RULE-BASED TRANSLITERATION ENGINE (Free/Offline) ─── */
const COMMON_WORDS = {
  "אני":"ani","אתה":"ata","את":"at","הוא":"hu","היא":"hi","אנחנו":"anakhnu","הם":"hem","הן":"hen",
  "של":"shel","עם":"im","על":"al","אל":"el","מן":"min","בין":"bein","אחרי":"aharei","לפני":"lifnei",
  "לא":"lo","כן":"ken","גם":"gam","רק":"rak","עוד":"od","כל":"kol","מה":"ma","מי":"mi","איך":"eikh",
  "למה":"lama","כמה":"kama","איפה":"eifo","מתי":"matai","זה":"ze","זאת":"zot","הנה":"hine",
  "יש":"yesh","אין":"ein","היה":"haya","היתה":"hayta","היו":"hayu","יהיה":"yihye",
  "אהבה":"ahava","חיים":"haim","לב":"lev","שמש":"shemesh","ירח":"yareach","לילה":"layla",
  "יום":"yom","שמים":"shamaim","ארץ":"eretz","מים":"maim","אור":"or","חושך":"hoshekh",
  "שלום":"shalom","תודה":"toda","בבקשה":"bevakasha","סליחה":"sliha",
  "ילד":"yeled","ילדה":"yalda","איש":"ish","אישה":"isha","אבא":"aba","אמא":"ima",
  "בית":"bait","דרך":"derekh","עיר":"ir","רחוב":"rehov","שיר":"shir","מילה":"mila",
  "טוב":"tov","רע":"ra","יפה":"yafe","גדול":"gadol","קטן":"katan","חדש":"hadash",
  "חזק":"hazak","חלש":"halash","שמח":"sameah","עצוב":"atzuv",
  "הלב":"halev","העיניים":"haeinayim","הלילה":"halayla","היום":"hayom","החיים":"hahaim",
  "השמש":"hashemesh","האור":"haor","האמת":"haemet","השמים":"hashamaim",
  "ואהבה":"veahava","ואני":"veani","והוא":"vehu","והיא":"vehi","ואת":"veat",
  "בלב":"balev","בדרך":"baderekh","בלילה":"balayla","ביום":"bayom",
  "לחיים":"lehaim","ללב":"lalev","לאהבה":"leahava",
  "מאחור":"meahor","מלפנים":"milifnim",
  "תמיד":"tamid","אולי":"ulai","פתאום":"pitom","ביחד":"beyahad","לבד":"levad",
  "שוב":"shuv","כבר":"kvar","עכשיו":"akhshav","אתמול":"etmol","מחר":"mahar",
  "רוצה":"rotze","יודע":"yodea","חושב":"hoshev","מרגיש":"margish","שומע":"shomea",
  "רואה":"roe","אוהב":"ohev","שומר":"shomer","זוכר":"zokher","שוכח":"shokheah",
  "בוכה":"bokhe","צוחק":"tzokhek","שר":"shar","רוקד":"roked",
  "פה":"po","שם":"sham","כאן":"kan","הביתה":"habayta","החוצה":"hahutza",
  "חבר":"haver","חברה":"havera","חברים":"haverim","משפחה":"mishpaha",
  "עולם":"olam","נשמה":"neshama","רוח":"ruah","כוח":"koah","חלום":"halom",
  "מוזיקה":"muzika","שירה":"shira","ריקוד":"rikud",
  "אחד":"ehad","שניים":"shnaim","שלוש":"shalosh","ארבע":"arba","חמש":"hamesh",
  "נתתי":"natati","הייתי":"hayiti","עשיתי":"asiti","הלכתי":"halakhti","באתי":"bati",
  "ראיתי":"raiti","שמעתי":"shamati","אמרתי":"amarti","חשבתי":"hashavti",
  "התעוררתי":"hitorarti","השתנתי":"hishtaneti","התחלתי":"hithalti",
  "האמנתי":"heemanti","פתחתי":"patahti","סגרתי":"sagarti",
  "נפלתי":"nafalti","קמתי":"kamti","רצתי":"ratzti",
  "כולם":"kulam","משהו":"mashehu","כלום":"klum","הכל":"hakol","שום":"shum",
};

const HEB_CONS = {
  'א':'','ב':'v','ג':'g','ד':'d','ה':'h','ו':'v','ז':'z','ח':'h','ט':'t','י':'y',
  'כ':'kh','ך':'kh','ל':'l','מ':'m','ם':'m','נ':'n','ן':'n','ס':'s','ע':'',
  'פ':'f','ף':'f','צ':'ts','ץ':'ts','ק':'k','ר':'r','ש':'sh','ת':'t',
};

const NIKUD = {
  '\u05B0':'e','\u05B1':'e','\u05B2':'a','\u05B3':'o','\u05B4':'i',
  '\u05B5':'e','\u05B6':'e','\u05B7':'a','\u05B8':'a','\u05B9':'o',
  '\u05BA':'o','\u05BB':'u','\u05BC':'','\u05C1':'','\u05C2':'',
};

function ruleTranslit(text) {
  return text.split('\n').map(line => {
    if (/^\[/.test(line.trim()) || /^\(/.test(line.trim()) || !line.trim()) return line;
    return line.split(/\s+/).map(word => {
      const clean = word.replace(/[.,!?;:"""'']/g, '');
      const punct = word.slice(clean.length);
      if (/^[a-zA-Z0-9\[\(]/.test(clean)) return word;
      const stripped = clean.replace(/[\u0591-\u05C7\u200f\u200e]/g, '');
      if (COMMON_WORDS[stripped]) return COMMON_WORDS[stripped] + punct;
      const hasNikud = /[\u05B0-\u05C7]/.test(clean);
      let result = '';
      const chars = [...clean];
      for (let i = 0; i < chars.length; i++) {
        const ch = chars[i];
        if (NIKUD[ch]) { result += NIKUD[ch]; continue; }
        if (ch === '\u05C1') continue; // shin dot
        if (ch === '\u05C2') { // sin dot - change previous sh to s
          if (result.endsWith('sh')) result = result.slice(0, -2) + 's';
          continue;
        }
        if (ch === '\u05BC') { // dagesh
          const prev = result.slice(-1);
          if (result.endsWith('v') && chars[i-1] === 'ב') { result = result.slice(0, -1) + 'b'; }
          else if (result.endsWith('kh') && (chars[i-1] === 'כ' || chars[i-1] === 'ך')) { result = result.slice(0, -2) + 'k'; }
          else if (result.endsWith('f') && (chars[i-1] === 'פ' || chars[i-1] === 'ף')) { result = result.slice(0, -1) + 'p'; }
          continue;
        }
        if (/[\u0591-\u05AF\u05BF\u05C0\u05C3-\u05C7\u200f\u200e]/.test(ch)) continue;
        if (HEB_CONS[ch] !== undefined) {
          result += HEB_CONS[ch];
          if (!hasNikud && i < chars.length - 1) {
            const next = chars[i + 1];
            if (HEB_CONS[next] !== undefined && !/[\u05B0-\u05C7]/.test(chars[i+1])) {
              const isEnd = i >= chars.length - 3;
              result += isEnd ? '' : 'a';
            }
          }
        } else {
          result += ch;
        }
      }
      result = result.replace(/hh/g, 'h').replace(/aa/g, 'a').replace(/ii/g, 'i');
      return (result || clean) + punct;
    }).join(' ');
  }).join('\n');
}

const TEMPLATES = [
  { id: "pop", l: "🎵 פופ / Pop", t: "[Intro]\n\n[Verse 1]\n\n\n\n[Pre-Chorus]\n\n\n[Chorus]\n\n\n\n[Verse 2]\n\n\n\n[Pre-Chorus]\n\n\n[Chorus]\n\n\n\n[Bridge]\n\n\n[Chorus]\n\n\n\n[Outro]" },
  { id: "rap", l: "🎤 ראפ / Rap", t: "[Intro]\n\n[Verse 1]\n\n\n\n\n\n\n\n[Chorus]\n\n\n\n[Verse 2]\n\n\n\n\n\n\n\n[Chorus]\n\n\n\n[Verse 3]\n\n\n\n\n\n\n\n[Chorus]\n\n\n\n[Outro]" },
  { id: "ballad", l: "🎹 בלדה / Ballad", t: "[Intro]\n(Slow, emotional piano)\n\n[Verse 1]\n\n\n\n\n[Chorus]\n\n\n\n[Verse 2]\n\n\n\n\n[Chorus]\n\n\n\n[Bridge]\n(Building intensity)\n\n\n[Chorus]\n\n\n\n[Outro]\n(Fade out)" },
  { id: "simple", l: "📝 פשוט / Simple", t: "[Verse 1]\n\n\n\n[Chorus]\n\n\n\n[Verse 2]\n\n\n\n[Chorus]" },
];

/* ── בדיקת חריזה לפי הגייה (בלי בינה ובלי ניקוד): ממירים את סוף המילה האחרונה לרצף "צלילים" ──
   חריזה חזקה = שני הצלילים האחרונים זהים (למשל לילה/חלה → לה, ים/שמיים → ים, ות/בלילות → ות).
   חריזה חלשה = אותו צליל סיום בלבד (למשל אהבה/שמחה → a). זו הערכה: בלי ניקוד אי אפשר לדעת את ההגייה בוודאות. */
const RHYME_MAP = { "א":"", "ע":"", "ב":"B", "ג":"G", "ד":"D", "ה":"h", "ו":"U", "ז":"Z", "ח":"X", "ט":"T", "י":"I", "כ":"K", "ך":"X", "ל":"L", "מ":"M", "ם":"M", "נ":"N", "ן":"N", "ס":"S", "פ":"P", "ף":"P", "צ":"C", "ץ":"C", "ק":"K", "ר":"R", "ש":"S", "ת":"T" };
const rhymeSounds = (word) => {
  const w = word.replace(/[\u0591-\u05C7]/g, "").replace(/[^\u05D0-\u05EAa-zA-Z]/g, "");
  if (!w) return [];
  if (!/[\u05D0-\u05EA]/.test(w)) { const l = w.toLowerCase(); return l.split("").slice(-3); }      // לועזית: האותיות האחרונות
  const toks = [];
  for (let i = 0; i < w.length; i++) {
    const ch = w[i], last = i === w.length - 1;
    let t = RHYME_MAP[ch];
    if (t === undefined) continue;
    if (ch === "ה") t = last ? "A" : "";          // ה בסוף מילה = תנועה (אהבה → ba), באמצע — שקטה/עיצור, מתעלמים
    if (ch === "א" || ch === "ע") t = "";
    if (t) toks.push(t);
  }
  // ״ים״ ו״ות״ הם סיומות — מאחדים לצליל אחד כדי ש״שמיים״ ו״ים״ יתחרזו
  for (let i = toks.length - 1; i > 0; i--) if ((toks[i] === "I" || toks[i] === "U") && toks[i - 1] === toks[i]) toks.splice(i, 1);   // שמיים → שמים
  const n = toks.length;
  if (n >= 2 && toks[n - 2] === "I" && toks[n - 1] === "M") { toks.splice(n - 2, 2, "IM"); }
  else if (n >= 2 && toks[n - 2] === "U" && toks[n - 1] === "T") { toks.splice(n - 2, 2, "UT"); }
  return toks;
};
function analyzeRhymes(text) {
  const lines = text.split("\n").map((l, i) => ({ i, raw: l, clean: l.replace(/\[.*?\]/g, "").replace(/\(.*?\)/g, "").trim() }))
    .filter(l => l.clean && !/^\[/.test(l.raw.trim()));
  const info = lines.map(l => {
    const words = l.clean.replace(/[.,!?;:"'\u05be\u05f3\u05f4()…–—-]/g, " ").split(/\s+/).filter(Boolean);
    const lastWord = words[words.length - 1] || "";
    const toks = rhymeSounds(lastWord);
    const k1 = toks.slice(-1).join(".");
    const suffix = k1 === "IM" || k1 === "UT";            // ים / ות — סיומות שמתחרזות בפני עצמן
    return { n: l.i + 1, word: lastWord.replace(/[\u0591-\u05C7]/g, ""), k2: suffix ? k1 : toks.slice(-2).join("."), k1, len: suffix ? 2 : toks.length };
  }).filter(x => x.len > 0);
  const by = (field, items) => { const m = {}; items.forEach(x => { (m[x[field]] = m[x[field]] || []).push(x); }); return Object.values(m).filter(g => g.length > 1); };
  const strongGroups = by("k2", info.filter(x => x.len >= 2));
  const inStrong = new Set(strongGroups.flat().map(x => x.n));
  // חלשות: אותו צליל סיום, רק בין שורות שלא נכנסו לחריזה חזקה
  const weakGroups = by("k1", info.filter(x => !inStrong.has(x.n)));
  const pack = (g) => ({ lines: g.map(x => x.n), words: [...new Set(g.map(x => x.word))].slice(0, 4), ending: g[0].word.slice(-3) });
  const groups = strongGroups.map(pack), weak = weakGroups.map(pack);
  // תבנית חריזה (A B A B …) — רק לשירים עד 24 שורות
  const letterOf = {}; let nxt = 0;
  [...strongGroups, ...weakGroups].forEach(g => { const L = String.fromCharCode(65 + (nxt++ % 26)); g.forEach(x => { letterOf[x.n] = L; }); });
  const scheme = info.length <= 24 ? info.map(x => letterOf[x.n] || "·").join(" ") : "";
  return { total: lines.length, groups, weak, scheme };
}

/* ═══ אולפן השירים — שמירת המצב (כל שינוי נשמר מיד, חלק א׳) ═══ */
const IDEA_KEY = "sunoprep_idea_state";
const IDEA_SAVED = (() => { try { return JSON.parse(localStorage.getItem(IDEA_KEY) || "{}") || {}; } catch (e) { return {}; } })();
const IDEA_GENRES = ["מזרחי", "פופ ישראלי", "בלדה", "ראפ / היפ־הופ", "רוק", "ים־תיכוני", "שיר ילדים", "חופשי"];
const IDEA_MOODS = ["רומנטי", "שמח וקצבי", "עצוב ומרגש", "עוצמתי", "נוסטלגי", "מצחיק"];
const IDEA_GENDERS = ["👨➡️👩 גבר שר לאישה", "👩➡️👨 אישה שרה לגבר", "👨➡️👨 גבר שר לגבר", "👩➡️👩 אישה שרה לאישה", "ניטרלי / ללא מגדר מוגדר"];
const IDEA_TOPICS = ["אהבה ראשונה", "געגוע לבית", "פרידה וגעגוע", "מסיבה של קיץ", "שיר לאמא", "חברים לכל החיים", "לקום מחדש אחרי נפילה", "לילה בעיר"];
const GENRE_HINT = {
  "מזרחי": "סגנון מזרחי: רגש גדול ופנייה ישירה, פזמון מזמר עם הברות ארוכות שאפשר לסלסל בהן.",
  "פופ ישראלי": "פופ ישראלי: פזמון פשוט ומיידי, משפטים כמו דיבור יומיומי, הוק של 2–4 מילים.",
  "בלדה": "בלדה: שורות נושמות, רגש שעולה בהדרגה ומגיע לשיא בגשר.",
  "ראפ / היפ־הופ": "ראפ: חריזה פנימית ומשחקי מילים, שורות צפופות בקצב, פזמון קצר שחוזר.",
  "רוק": "רוק: אנרגיה, משפטים חדים וישירים, פזמון שצועקים יחד.",
  "ים־תיכוני": "ים־תיכוני: חום, שמש וריקוד, שורות קצביות וקלילות.",
  "שיר ילדים": "שיר ילדים: מילים פשוטות, הרבה חזרות והומור, בלי שום תוכן שלא מתאים לילדים.",
  "חופשי": "",
};
const LENGTH_HINT = { "קצרה": "בית אחד ופזמון", "רגילה": "שני בתים, פזמון וגשר", "מלאה": "שלושה בתים, פזמון, גשר וסיום" };
const SECTION_HE = { "verse": "בית", "chorus": "פזמון", "pre-chorus": "טרום־פזמון", "bridge": "גשר", "intro": "פתיחה", "outro": "סיום", "hook": "הוק", "break": "הפסקה" };
const sectionLabel = (tag) => { const m = tag.trim().match(/^([A-Za-z-]+)\s*(\d*)/); const he = m && SECTION_HE[m[1].toLowerCase()]; return he ? `${he}${m[2] ? " " + m[2] : ""}` : tag; };

/* ═══ AppNest Refine — "המפה" של SunoPrep (המנוע עצמו ב-appnest-refine.js) ═══ */
const SONG_CRITERIA = { hook: 2, rhyme: 1.5, flow: 1.5, imagery: 1.5, emotion: 1, gender: 1.5, fit: 1, suno: 1 };
const SONG_CRIT_LABELS = { hook: "🎣 פזמון וקליטות", rhyme: "🎵 חריזה", flow: "🌊 זרימה ומשקל", imagery: "🖼️ דימויים ומקוריות", emotion: "❤️ רגש", gender: "🎭 עקביות מגדר", fit: "🎯 התאמה להגדרות", suno: "🤖 מוכנות לסונו" };
const HAS_NIKUD = /[ְ-ׇּׁׂ]/;
function songPostProcess(text, original) {
  // שלב המילים: אם המקור בלי ניקוד — מורידים ניקוד שהבינה הוסיפה על דעת עצמה
  return HAS_NIKUD.test(original) ? text : text.replace(/[֑-ׇ]/g, (ch) => ch === "־" ? ch : "");
}
function songLocalCheck(text, original) {
  const issues = [];
  const lines = text.split("\n").filter(l => l.trim());
  const origLines = original.split("\n").filter(l => l.trim());
  const tagsOrig = (original.match(/\[[^\]]+\]/g) || []).length;
  const tagsNew = (text.match(/\[[^\]]+\]/g) || []).length;
  if (tagsOrig >= 2 && tagsNew < Math.ceil(tagsOrig / 2)) issues.push("נמחקו תגיות המבנה");
  if (!/[א-ת]/.test(text)) issues.push("אין עברית בטקסט");
  if (text !== original && lines.length > origLines.length * 1.6 + 4) issues.push("השיר התארך יותר מדי");
  if (text !== original && lines.length < origLines.length * 0.5) issues.push("השיר התקצר יותר מדי");
  const rh = analyzeRhymes(text);
  const rhymed = new Set([...rh.groups, ...rh.weak].flatMap(g => g.lines)).size;
  const syl = text.split("\n").filter(l => l.trim() && !/^\s*\[/.test(l)).map(l => countSyllables(l));
  const long = syl.filter(n => n > 16).length;
  const summary = "ניתוח מקומי (מחושב בקוד — עובדות, לא ניחוש):\n" +
    (rh.scheme ? `- תבנית חריזה של סופי השורות: ${rh.scheme}\n` : "") +
    `- שורות שמתחרזות עם שורה אחרת: ${rhymed} מתוך ${rh.total}\n` +
    `- הברות לפי שורה: ${syl.map((n, i) => `${i + 1}:${n}`).join(" | ")}\n` +
    `- שורות ארוכות מאוד (מעל 16 הברות): ${long}`;
  return { ok: issues.length === 0, issues, metrics: { scheme: rh.scheme, rhymed, total: rh.total, long }, summary };
}
/* שומר-מילים לניקוד: אחרי שהבינה מנקדת, בודקים בקוד שהיא לא שינתה אף אות. (ו/י נחשבות שינוי קל — כתיב מלא/חסר) */
function nikudWordGuard(source, output, dropHyphens) {
  const words = (s, dh) => { let t = s.replace(/[֑-ֽֿ-ׇ]/g, ""); if (dh) t = t.replace(/([א-ת])-(?=[א-ת])/g, "$1"); return t.split(/[\s־]+/).map(w => w.replace(/[^א-ת]/g, "")).filter(Boolean); };
  const loose = w => w.replace(/[וי]/g, "");
  const a = words(source, dropHyphens), b = words(output, false);
  const ok = loose(a.join("")) === loose(b.join(""));
  const changed = [];
  if (!ok && a.length === b.length) a.forEach((w, i) => { if (loose(w) !== loose(b[i])) changed.push({ from: w, to: b[i] }); });
  return { ok, changed, countDiff: b.length - a.length };
}

const countSyllables = (line) => {
  const clean = line.replace(/\[.*?\]/g, "").replace(/\(.*?\)/g, "").trim();
  if (!clean) return 0;
  // Check if Hebrew text
  const isHeb = /[\u0590-\u05FF]/.test(clean);
  if (isHeb) {
    // Count nikud vowels if present
    const nikudVowels = clean.match(/[\u05B0-\u05BB]/g);
    if (nikudVowels && nikudVowels.length > 2) return nikudVowels.filter(n => n !== '\u05BC' && n !== '\u05C1' && n !== '\u05C2').length;
    // No nikud: count consonants (excluding maters lectionis at word boundaries), estimate syllables
    const words = clean.split(/\s+/).filter(w => w && !/^\[/.test(w));
    let total = 0;
    words.forEach(w => {
      const stripped = w.replace(/[^\u05D0-\u05EA]/g, "");
      if (COMMON_WORDS[stripped]) {
        // Count vowels in the known transliteration
        const translit = COMMON_WORDS[stripped];
        total += (translit.match(/[aeiou]/gi) || []).length;
      } else {
        // Estimate: each consonant cluster = 1 syllable, minimum 1
        total += Math.max(1, Math.round(stripped.length / 2));
      }
    });
    return total;
  }
  // Latin text: count vowel groups
  const latMatches = clean.match(/[aeiouyAEIOUY]+/g);
  return latMatches ? latMatches.length : Math.ceil(clean.length / 3);
};

function SunoPrep() {
  const [scr, setScr] = useState("home");
  const [activeTab, setActiveTab] = useState(() => { const v = localStorage.getItem("sunoprep-active-tab") || "write"; return v === "voice" ? "checks" : v; });
  const [src, setSrc] = useState("");
  const [res, setRes] = useState("");
  const [sLang, setSLang] = useState("he");
  const [uLang, setULang] = useState("he");
  const [loading, setLoading] = useState(false);
  const [ideaPrompt, setIdeaPrompt] = useState(() => IDEA_SAVED.ideaPrompt ?? "");
  const [ideaMood, setIdeaMood] = useState(() => IDEA_SAVED.ideaMood ?? "רומנטי");
  const [ideaType, setIdeaType] = useState(() => IDEA_SAVED.ideaType ?? "טיוטת שיר");
  const [ideaStructure, setIdeaStructure] = useState(() => IDEA_SAVED.ideaStructure ?? "בית–פזמון–בית–פזמון–גשר");
  const [ideaLength, setIdeaLength] = useState(() => IDEA_SAVED.ideaLength ?? "רגילה");
  const [ideaPerspective, setIdeaPerspective] = useState(() => IDEA_SAVED.ideaPerspective ?? "גוף ראשון");
  const [ideaGenderMode, setIdeaGenderMode] = useState(() => localStorage.getItem("sunoprep_idea_gender_mode") || "ניטרלי / ללא מגדר מוגדר");
  const [genderCheckResult, setGenderCheckResult] = useState("");
  const [voiceSamples, setVoiceSamples] = useState([]);
  const [voiceName, setVoiceName] = useState("");
  const [voiceNotes, setVoiceNotes] = useState("");
  const [activeVoiceId, setActiveVoiceId] = useState(() => localStorage.getItem("sunoprep_active_voice") || "");
  const [recording, setRecording] = useState(false);
  const [voiceRecommendation, setVoiceRecommendation] = useState("");
  const [performanceProfile, setPerformanceProfile] = useState(() => localStorage.getItem("sunoprep_performance_profile") || "אינטימי");
  const [savedPerformanceProfiles, setSavedPerformanceProfiles] = useState(() => { try { return JSON.parse(localStorage.getItem("sunoprep_performance_profiles")||"[]"); } catch(e){ return []; } });
  const mediaRecorderRef = useRef(null);
  const voiceChunksRef = useRef([]);
  useEffect(()=>{ let alive=true; voiceDBAll().then(rows=>{if(alive)setVoiceSamples(rows.map(x=>({...x,url:URL.createObjectURL(x.blob)})));}).catch(()=>{}); return ()=>{alive=false;};},[]);

  const [ideaRhyme, setIdeaRhyme] = useState(() => IDEA_SAVED.ideaRhyme ?? "חריזה טבעית");
  const [ideaKeywords, setIdeaKeywords] = useState(() => IDEA_SAVED.ideaKeywords ?? "");
  const [ideaOut, setIdeaOut] = useState(() => IDEA_SAVED.ideaOut ?? "");
  const [ideaHistory, setIdeaHistory] = useState(() => Array.isArray(IDEA_SAVED.ideaHistory) ? IDEA_SAVED.ideaHistory : []);
  const [ideaHistoryIndex, setIdeaHistoryIndex] = useState(-1);
  const [compareA, setCompareA] = useState("current");
  const [compareB, setCompareB] = useState("history-0");
  const [ideaVariants, setIdeaVariants] = useState(() => Array.isArray(IDEA_SAVED.ideaVariants) ? IDEA_SAVED.ideaVariants : []);
  const [ideaGenre, setIdeaGenre] = useState(() => IDEA_SAVED.ideaGenre || "פופ ישראלי");
  const [ideaAutoRefine, setIdeaAutoRefine] = useState(() => !!IDEA_SAVED.ideaAutoRefine);
  const [ideaMore, setIdeaMore] = useState(false);
  const [ideaEdit, setIdeaEdit] = useState(false);
  const [ideaShowVersions, setIdeaShowVersions] = useState(false);
  const [ideaInspire, setIdeaInspire] = useState(null);      // {loading, ideas:[]}
  const [ideaTitles, setIdeaTitles] = useState(null);        // {loading, titles:[]}
  const [ideaStyleMsg, setIdeaStyleMsg] = useState("");
  const [lineSel, setLineSel] = useState(null);              // אינדקס השורה שנבחרה בטיוטה
  const [lineTool, setLineTool] = useState(null);            // {idx, kind, loading, options, err}
  const [continueBusy, setContinueBusy] = useState(false);
  /* ═══ 📚 ספריית הסגנונות שלי — סגנונות שניסיתי בסונו, עם דירוג והערות ═══ */
  const [styleLib, setStyleLib] = useState(() => { try { const v = JSON.parse(localStorage.getItem("sunoprep_style_lib") || "[]"); return Array.isArray(v) ? v : []; } catch (e) { return []; } });
  useEffect(() => { try { localStorage.setItem("sunoprep_style_lib", JSON.stringify(styleLib)); } catch (e) {} }, [styleLib]);
  const [libQuery, setLibQuery] = useState("");
  const [libFilter, setLibFilter] = useState("all");
  const [libSort, setLibSort] = useState("recent");
  const [libEdit, setLibEdit] = useState(null);              // רשומה בעריכה (חדשה או קיימת)
  const [libVar, setLibVar] = useState(null);                // {id, loading, options}
  const [libMsg, setLibMsg] = useState("");
  const [ideaLive, setIdeaLive] = useState("");              // טקסט שזורם בזמן הכתיבה
  const [ideaStart, setIdeaStart] = useState(0);
  const [, setTick] = useState(0);
  useEffect(() => { if (!ideaStart) return; const t = setInterval(() => setTick(x => x + 1), 1000); return () => clearInterval(t); }, [ideaStart]);
  const [ideaLoading, setIdeaLoading] = useState(false);
  const [ideaImprove, setIdeaImprove] = useState("חזק את הפזמון והפוך אותו ליותר קליט");
  const [refineRounds, setRefineRounds] = useState(() => Number(localStorage.getItem("sunoprep_refine_rounds")) || 2);
  const [refineState, setRefineState] = useState(null);
  const [refineResult, setRefineResult] = useState(null);
  const refineCancelRef = useRef(false);
  const [srcBeforeRefine, setSrcBeforeRefine] = useState(null);
  const [nikudReview, setNikudReview] = useState(null);
  const [nikudWarn, setNikudWarn] = useState("");
  const [err, setErr] = useState("");
  useEffect(() => { if (!err) return; const t = setTimeout(() => setErr(""), 9000); return () => clearTimeout(t); }, [err]);
  const [tMode, setTMode] = useState("full");
  const [genderDir, setGenderDir] = useState("m2f");
  const [showVoiceTip, setShowVoiceTip] = useState(true);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [aiProvider, setAiProvider] = useState(null);
  const [aiKeys, setAiKeys] = useState({ gemini: "", claude: "", openai: "", deviceUrl: "http://localhost:11434/v1", customUrl: "", customKey: "" });
  const [liveModels, setLiveModels] = useState([]);
  const [selModel, setSelModel] = useState("");
  const [refreshingModels, setRefreshingModels] = useState(false);
  const [selProvider, setSelProvider] = useState(null);
  const [testState, setTestState] = useState(null);
  const [selSty, setSelSty] = useState([]);
  const [selVocal, setSelVocal] = useState([]);
  const [custSty, setCustSty] = useState(() => { try { return localStorage.getItem("sunoprep_cust_sty") || ""; } catch (e) { return ""; } });
  useEffect(() => { try { localStorage.setItem("sunoprep_cust_sty", custSty); } catch (e) {} }, [custSty]);
  const [performanceCard, setPerformanceCard] = useState({verse:"soft and intimate", chorus:"powerful and open", bridge:"emotional and rising", outro:"gentle and fading"});
  const [bpmVal, setBpmVal] = useState(0);
  const [savedSty, setSavedSty] = useState([]);
  const [editStyId, setEditStyId] = useState(null);
  const [editStyLabel, setEditStyLabel] = useState("");
  const [rate, setRate] = useState(1.0);
  const [speaking, setSpeaking] = useState(null);
  const [lineSpeaking, setLineSpeaking] = useState(null);
  const [lineChecks, setLineChecks] = useState(() => { try { return JSON.parse(localStorage.getItem("sunoprep_line_checks")||"{}"); } catch(e){ return {}; } });
  const [cpd, setCpd] = useState(null);
  const [theme, setTheme] = useState("gold");
  const [day, setDay] = useState(false);
  const [uname, setUname] = useState("");
  const [vCount, setVCount] = useState(1);
  const [guide, setGuide] = useState(false);
  const [gStep, setGStep] = useState(0);
  const [delSt, setDelSt] = useState(0);
  const [history, setHistory] = useState([]);
  const [wordDict, setWordDict] = useState(() => { try { return JSON.parse(localStorage.getItem("sunoprep_pron_dict") || "{}"); } catch(e){ return {}; } });
  const [dictWord, setDictWord] = useState("");
  const [dictPron, setDictPron] = useState("");
  const [showSylCount, setShowSylCount] = useState(true);
  const [projects, setProjects] = useState(() => { try { return JSON.parse(localStorage.getItem("sunoprep_projects") || "[]"); } catch(e){ return []; } });
  const [projectName, setProjectName] = useState("");
  const [health, setHealth] = useState(null);
  const [phraseBank, setPhraseBank] = useState(() => { try { return JSON.parse(localStorage.getItem("sunoprep_phrase_bank") || "[]"); } catch(e){ return []; } });
  const [phraseText, setPhraseText] = useState("");
  const [phraseTag, setPhraseTag] = useState("");
  const [pronFeedback, setPronFeedback] = useState(() => { try { return JSON.parse(localStorage.getItem("sunoprep_pron_feedback") || "[]"); } catch(e){ return []; } });
  const [feedbackWord, setFeedbackWord] = useState("");
  const [feedbackPron, setFeedbackPron] = useState("");
  const [feedbackNote, setFeedbackNote] = useState("");

  const savePronFeedback = (status) => {
    const word=feedbackWord.trim(), pron=feedbackPron.trim();
    if(!word || !pron) return;
    const item={id:Date.now(),word,pron,status,note:feedbackNote.trim(),updatedAt:new Date().toISOString()};
    const next=[item,...pronFeedback].slice(0,100);
    setPronFeedback(next); localStorage.setItem("sunoprep_pron_feedback",JSON.stringify(next));
    if(status==="good") {
      const nextDict={...wordDict,[word]:pron};
      setWordDict(nextDict); localStorage.setItem("sunoprep_pron_dict",JSON.stringify(nextDict));
    }
    setFeedbackNote("");
  };
  const deletePronFeedback = (id) => {
    const next=pronFeedback.filter(x=>x.id!==id); setPronFeedback(next);
    localStorage.setItem("sunoprep_pron_feedback",JSON.stringify(next));
  };
  const srcRef = useRef(null);
  const fileRef = useRef(null);

  const savePhrase = () => { const text=phraseText.trim(); if(!text) return; const item={id:Date.now(),text,tag:phraseTag.trim()}; const next=[item,...phraseBank.filter(x=>x.text!==text)].slice(0,100); setPhraseBank(next); localStorage.setItem("sunoprep_phrase_bank",JSON.stringify(next)); setPhraseText(""); setPhraseTag(""); };
  const deletePhrase = (id) => { const next=phraseBank.filter(x=>x.id!==id); setPhraseBank(next); localStorage.setItem("sunoprep_phrase_bank",JSON.stringify(next)); };
  const addPhraseToSong = (text) => setSrc(prev => prev ? prev.replace(/\s*$/,"")+"\n"+text : text);
  const saveIdeaExcerpt = () => {
    const text = window.prompt("הדבק או כתוב את המשפט/השורות שברצונך לשמור בבנק המשפטים:");
    if(!text || !text.trim()) return;
    const tag = window.prompt("תגית אופציונלית (למשל: פזמון, אהבה, פתיחה):") || "טיוטת AI";
    const item={id:Date.now(),text:text.trim(),tag:tag.trim()};
    const next=[item,...phraseBank.filter(x=>x.text!==item.text)].slice(0,100);
    setPhraseBank(next); localStorage.setItem("sunoprep_phrase_bank",JSON.stringify(next));
  };

  const saveProject = () => {
    const name = projectName.trim() || `שיר ${new Date().toLocaleString("he-IL")}`;
    const item = { id: Date.now(), name, src, res, styTxt, sLang, updatedAt: new Date().toISOString() };
    const next = [item, ...projects.filter(p => p.name !== name)].slice(0, 30);
    setProjects(next); localStorage.setItem("sunoprep_projects", JSON.stringify(next)); setProjectName(name);
  };
  const loadProject = (p) => { setSrc(p.src || ""); setRes(p.res || ""); setProjectName(p.name || ""); if(p.sLang) setSLang(p.sLang); };
  const deleteProject = (id) => { const next=projects.filter(p=>p.id!==id); setProjects(next); localStorage.setItem("sunoprep_projects", JSON.stringify(next)); };

  const exportProject = (p) => {
    const full = { type: "sunoprep-project", version: "9.3", exportedAt: new Date().toISOString(),
      name: p.name, src: p.src, res: p.res, styTxt: p.styTxt, sLang: p.sLang,
      selSty, selVocal, custSty, bpmVal, tMode };
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([JSON.stringify(full, null, 2)], { type: "application/json" }));
    const safe = (p.name || "song").replace(/[^\w\u0590-\u05FF -]/g, "").slice(0, 40);
    a.download = `sunoprep-${safe}.json`; a.click();
  };
  const importProject = (e) => {
    const f = e.target.files?.[0]; if (!f) return;
    const r = new FileReader();
    r.onload = (ev) => {
      try {
        const d = JSON.parse(ev.target.result);
        if (d.type !== "sunoprep-project") { setErr(rtl ? "קובץ לא תקין" : "Invalid file"); return; }
        setSrc(d.src || ""); setRes(d.res || ""); setProjectName(d.name || "");
        if (d.selSty) setSelSty(d.selSty); if (d.selVocal) setSelVocal(d.selVocal);
        if (d.custSty !== undefined) setCustSty(d.custSty); if (d.bpmVal !== undefined) setBpmVal(d.bpmVal);
        if (d.tMode) setTMode(d.tMode);
        setActiveTab("write");
      } catch { setErr(rtl ? "שגיאה בקריאת הקובץ" : "Error reading file"); }
    };
    r.readAsText(f);
    e.target.value = "";
  };

  const c = TH[theme];
  const bg = day ? c.bgL : c.bg;
  const cd = day ? c.cdL : c.cd;
  const bd = day ? c.bdL : c.bd;
  const tx = day ? "#1A1A1A" : "#E8E6E0";
  const sb = day ? "#5C5C5C" : "#9A9A9A";
  const ca = day ? accentForText(c.a, c.bgL) : c.a;      // צבע הדגשה לטקסט
  const onA = textOnAccent(c.a);                          // צבע טקסט על רקע הדגשה
  const okC = day ? "#1E7A52" : "#3DAA7D";                // ירוק "תקין" קריא
  const t = TR[uLang] || TR.en;
  const rtl = ["he", "ar"].includes(uLang);
  const sl = LANGS[sLang];

  const accentHint = sLang === "he" ? "Israeli Hebrew pronunciation, native Israeli accent" : sLang === "ar" ? "native Arabic pronunciation" : "";
  const bpmText = bpmVal > 0 ? `${bpmVal} BPM` : "";
  const allStyles = [...STYLES, ...savedSty.map(s => ({ id: s.id, p: s.prompt }))];
  const activeVoice = voiceSamples.find(v => v.id === activeVoiceId);
  const activeVoiceHint = activeVoice?.notes?.trim()
    ? `Voice character reference: ${activeVoice.notes.trim()}`
    : "";
  const styTxt = [...selSty.map(id => allStyles.find(s => s.id === id)?.p).filter(Boolean), ...selVocal.map(id => VOCAL_STYLES.find(s => s.id === id)?.p).filter(Boolean), bpmText, custSty.trim(), activeVoiceHint, accentHint].filter(Boolean).join(", ");

  // הסגנון "הנקי" שנבנה עכשיו (בלי הנחיית המבטא/הקול שנוספות אוטומטית) + ההגדרות המדויקות כדי לשחזר אותו
  const builtStyleNow = () => [...selSty.map(id => allStyles.find(x => x.id === id)?.p).filter(Boolean), ...selVocal.map(id => VOCAL_STYLES.find(x => x.id === id)?.p).filter(Boolean), bpmText, custSty.trim()].filter(Boolean).join(", ");
  const newLibEntry = (style, extra = {}) => ({ id: "sl_" + Date.now() + "_" + Math.random().toString(36).slice(2, 6), name: "", style, rating: 0, notes: "", tags: [], links: "", songs: projectName.trim() ? [projectName.trim()] : [], tryAgain: false, created: Date.now(), lastUsed: 0, uses: 0, ...extra });
  const openLibFromCurrent = (styleOverride, extra = {}) => {
    const st = (styleOverride || builtStyleNow()).trim();
    const e = newLibEntry(st, { setup: styleOverride ? null : { selSty, selVocal, bpmVal, custSty }, ...extra });
    setLibEdit({ ...e, isNew: true, tagsText: (e.tags || []).join(", "), songsText: e.songs.join(", ") });
    setLibMsg(""); setActiveTab("styles"); setTimeout(() => { try { document.getElementById("sty-library").scrollIntoView({ behavior: "smooth", block: "start" }); } catch (e) {} }, 60);
  };
  const saveLibEdit = () => {
    const e = libEdit; if (!e) return;
    if (!e.style.trim()) { setErr("כתוב או הדבק את טקסט הסגנון"); return; }
    const clean = { ...e, name: (e.name || "").trim() || e.style.trim().slice(0, 32), style: e.style.trim(),
      tags: (e.tagsText || "").split(/[,،]+/).map(x => x.trim()).filter(Boolean), songs: (e.songsText || "").split(/[,،]+/).map(x => x.trim()).filter(Boolean) };
    delete clean.isNew; delete clean.tagsText; delete clean.songsText;
    setStyleLib(prev => prev.some(x => x.id === clean.id) ? prev.map(x => x.id === clean.id ? clean : x) : [clean, ...prev]);
    setLibEdit(null); setLibMsg(`✅ "${clean.name}" נשמר בספרייה`);
  };
  const editLib = (x) => setLibEdit({ ...x, tagsText: (x.tags || []).join(", "), songsText: (x.songs || []).join(", ") });
  const updateLib = (id, patch) => setStyleLib(prev => prev.map(x => x.id === id ? { ...x, ...patch } : x));
  const deleteLib = (x) => { if (window.confirm(`למחוק את "${x.name}" מהספרייה?`)) setStyleLib(prev => prev.filter(y => y.id !== x.id)); };
  const applyLibStyle = (x) => {
    const ok = x.setup && (x.setup.selSty || []).every(id => allStyles.some(a => a.id === id));
    if (ok) { setSelSty(x.setup.selSty || []); setSelVocal(x.setup.selVocal || []); setBpmVal(x.setup.bpmVal || 0); setCustSty(x.setup.custSty || ""); }
    else { setSelSty([]); setSelVocal([]); setBpmVal(0); setCustSty(x.style); }
    updateLib(x.id, { uses: (x.uses || 0) + 1, lastUsed: Date.now() });
    setLibMsg(`▶️ הסגנון "${x.name || "החדש"}" מוכן — אפשר להעתיק אותו למעלה`);
    setActiveTab("styles"); try { window.scrollTo({ top: 0, behavior: "smooth" }); } catch (e) {}
  };
  const importStarStyles = () => {
    const have = new Set(styleLib.map(x => x.style.trim()));
    const add = savedSty.filter(x => x.prompt && !have.has(x.prompt.trim())).map(x => newLibEntry(x.prompt.trim(), { name: x.label, songs: [] }));
    if (!add.length) { setLibMsg("כל הסגנונות המסומנים ב-⭐ כבר נמצאים בספרייה"); return; }
    setStyleLib(prev => [...add, ...prev]); setLibMsg(`✅ יובאו ${add.length} סגנונות מ-⭐ הסגנונות שלי`);
  };

  const insertTag = useCallback((tag) => {
    const el = srcRef.current; if (!el) return;
    const s = el.selectionStart, e = el.selectionEnd;
    let ins = tag;
    if (tag === "[Verse]") { ins = `[Verse ${vCount}]`; setVCount(c => c + 1); }
    const bf = src.slice(0, s), af = src.slice(e);
    const nl = bf.length > 0 && !bf.endsWith("\n") ? "\n" : "";
    setSrc(bf + nl + ins + "\n" + af);
    setTimeout(() => { const p = (bf + nl + ins + "\n").length; el.focus(); el.setSelectionRange(p, p); }, 0);
  }, [src, vCount]);

  const doTranslit = async (mode) => {
    const m = mode || tMode;
    if (!src.trim()) return;
    
    if (m === "hebrew") {
      setRes(src);
      return;
    }

    // Strip nikud — instant, offline. Removes all Hebrew vowel/cantillation marks, keeps words exactly.
    if (m === "stripnikud") {
      setRes(src.replace(/[\u0591-\u05C7]/g, ""));
      setErr("");
      return;
    }

    // No AI connected: use offline rule-based engine (except modes that strictly need AI)
    if (!aiProvider) {
      if (m === "hybrid" || m === "optimized") {
        setErr(rtl ? "המצב הזה דורש חיבור AI. עובר לתעתיק מקומי..." : "This mode requires an AI connection. Using offline engine...");
        setTimeout(() => setErr(""), 3500);
        setRes(ruleTranslit(src));
        return;
      }
      if (m === "marknikud" || m === "gendernikud") {
        setErr(rtl ? "המצב הזה דורש חיבור AI. חבר בינה בהגדרות." : "This mode requires an AI connection. Connect AI in settings.");
        setTimeout(() => setErr(""), 4000);
        return;
      }
      setRes(ruleTranslit(src));
      return;
    }
    
    setLoading(true); setErr("");

    const markNikudPrompt = `You are a Hebrew nikud (vocalization) expert helping prepare song lyrics for Suno AI.

The user marked specific PROBLEM words by putting hyphens between their letters — for example "ה-ח-ו-ל" means the word "החול" was marked.

YOUR TASK — follow these rules EXACTLY:
1. For each word written with hyphens between its letters: REMOVE the hyphens and add FULL, CORRECT nikud (vowel points) to that word. Example: "ה-ח-ו-ל" → "הַחוֹל", "ס-י-פ-ו-ר" → "סִיפּוּר", "מ-ו-צ-א" → "מוֹצֵא".
2. Words that ALREADY have nikud from a previous pass: keep their existing nikud EXACTLY as-is. Do NOT remove or change it.
3. Words that are plain (no hyphens, no nikud): leave them EXACTLY as they are — no nikud, no changes.
4. Keep every word identical (same letters, same order, same lines). Keep all [tags] and (instructions) unchanged. Keep blank lines.
5. Output ONLY the resulting lyrics. No explanations, no notes.

EXAMPLE INPUT:
[Verse]
הגלים לוחשים אל ה-ח-ו-ל החם
רוח מלח מביאה ס-י-פ-ו-ר ישן
בְּתוֹךְ השקט הזה, אני מ-ו-צ-א את עצמי

EXAMPLE OUTPUT:
[Verse]
הגלים לוחשים אל הַחוֹל החם
רוח מלח מביאה סִיפּוּר ישן
בְּתוֹךְ השקט הזה, אני מוֹצֵא את עצמי

Now process these lyrics:
${src}`;

    const genderLabels = {
      m2f: { singer: "male", addressee: "female" },
      f2m: { singer: "female", addressee: "male" },
      f2f: { singer: "female", addressee: "female" },
      m2m: { singer: "male", addressee: "male" },
    };
    const gl = genderLabels[genderDir] || genderLabels.m2f;
    const genderNikudPrompt = `You are a Hebrew nikud (vocalization) expert preparing song lyrics for Suno AI.

CONTEXT: In this song, the SINGER is ${gl.singer}, and the person being SUNG TO (the addressee) is ${gl.addressee}.

THE PROBLEM: When Hebrew is written WITHOUT nikud, Suno AI guesses the gender and often gets it wrong — making a male singer sound female, or making "you" sound like the wrong gender. Nikud fixes this by locking in the correct vowels.

YOUR TASK:
1. Scan the lyrics for GENDER-AMBIGUOUS words — words whose reading depends on gender:
   - First-person verbs/adjectives that reveal the SINGER's gender (e.g. אוהב/אוהבת, הולך/הולכת, יודע/יודעת, שמח/שמחה, לבד/לבדי). Point these for a ${gl.singer} singer.
   - Second-person forms addressing the ADDRESSEE (e.g. אותך → אוֹתְךָ/אוֹתָךְ, שלך → שֶׁלְּךָ/שֶׁלָּךְ, לך → לְךָ/לָךְ, איתך, בך, עליך, אתה/את, בוא/בואי, תהיה/תהיי). Point these for a ${gl.addressee} addressee.
2. Add FULL correct nikud ONLY to those gender-ambiguous words, matching the ${gl.singer}→${gl.addressee} direction.
3. Every OTHER word: leave EXACTLY as-is, with NO nikud added.
4. Words that already have nikud: keep it unchanged.
5. Keep every word identical (same letters, order, lines). Keep [tags] and (instructions). Keep blank lines.
6. Output ONLY the resulting lyrics. No explanations.

EXAMPLE (male singer → female addressee):
INPUT:
אני אוהב אותך מאוד
תמיד אחשוב עליך
OUTPUT:
אני אוֹהֵב אוֹתָךְ מאוד
תמיד אֶחְשׁוֹב עָלַיִךְ

Now process these lyrics (singer: ${gl.singer}, addressee: ${gl.addressee}):
${src}`;

    const fullPrompt = `You convert ${sl.n} song lyrics into phonetic Latin text optimized for Suno AI singing.

GOAL: Make Suno sound like a native ${sl.n} speaker singing. Suno is trained on English, Spanish, Portuguese, and Italian music. Use phonetic patterns from THESE languages — never academic transliteration.

CRITICAL SUNO BEHAVIOR:
- "ch" → Suno says "CHURCH" (English ch). NEVER use "ch" for Hebrew ח/כ.
- "kh" → Suno makes a harsh Arabic sound. NEVER use "kh".
- Apostrophes → Suno makes a glottal stop/pause. NEVER use apostrophes.
- Double consonants → Suno stutters. Keep consonants single.
- Suno naturally handles: h, sh, ts, k, v, z, t, d, n, m, l, r, s, b, p, f, g

RULES:
1. ZERO apostrophes, quotes, hyphens, or dashes in lyrics. Ever.
2. Keep tags [Verse 1] [Chorus] [Bridge] [Intro] [Outro] [Male Vocal] [Female Vocal] [Duet] etc exactly as-is
3. Keep (parenthetical instructions) exactly as-is
4. Preserve exact line breaks
5. Output ONLY the converted text. No notes or explanations.

HEBREW SOUNDS → SUNO SPELLING:
ח (het) → "H" — just a simple h. "Haver" "Hom" "Haim" "Hosheh"
כ soft/ך (haf) → "H" — same as ח. "leHol" "noHa" "dereH"
כ hard (kaf) → "K" — "Katav" "Ko"
ע (ayin) → SILENT — just write the vowel: "alai" "einaim" "atzmi" "od"
א (alef) → SILENT — just the vowel: "ani" "ima" "or"
ה at word end → "a" — "ahava" "gdola" "yafa" "hadasha"
ה at word start → "Ha" — "Halev" "Hayom" "Hine"
ה (the prefix) → "ha" attached — "halaila" "haor" "hashamaim"
ק (kuf) → "K" — "Kol" "maKom" "tiKva"
צ/ץ (tsadi) → "Ts" — "Tsarot" "oTs" "aTsmi"
שׁ (shin) → "Sh" — "Shalom" "maSHir"
שׂ (sin) → "S" — "Sameah" "laSot"
ת (tav) → "T" — "Tamid" "naTati"
ט (tet) → "T" — "Tov" "Tauyot"
ר (resh) → "R" — normal r
ו prefix (and) → "ve" attached — "veahava" "veani"
מ prefix (from) → "me" attached — "meaHor" "meHatHala"
ל prefix (to) → "le" attached — "leHol" "laHazor"
ב prefix (in) → "ba/be" attached — "baderekh" "balaila"

VOWELS — use clear, open, SPANISH-style vowels:
a = "ah" sound (like Spanish "casa")
e = "eh" sound (like Spanish "mesa")
i = "ee" sound (like Spanish "si")
o = "oh" sound (like Spanish "solo")
u = "oo" sound (like Spanish "tu")
ai = as in English "sky"
ei = as in English "day"

CAPITALIZATION: Capitalize the stressed syllable to help Suno rhythm.
Hebrew words usually stress the LAST syllable.
"hayiTI" "yeLED" "taMIM" "ahaVA" "haveRIM" "leHOL"
Exception: segolate nouns stress first syllable: "YEled" "DErekh" "MElekh"

FULL EXAMPLES:
"הָיִיתִי יֶלֶד תָּמִים" → "HayiTI YEled taMIM"
"חָשַׁבְתִּי כֻּלָּם חֲבֵרִים" → "HaSHAVti kuLAM haveRIM"
"הִתְעוֹרַרְתִּי פִּתְאוֹם" → "HitorarTI pitOM"

Convert these lyrics:
${src}`;

    const hybridPrompt = `You are helping prepare ${sl.n} song lyrics for Suno AI (v4.5).

Suno v4.5 can partially read ${sl.n} but struggles with certain letters and combinations.
Your job: create a HYBRID version that keeps ${sl.n} script where Suno handles it well, and replaces ONLY problematic words with Latin phonetic spelling.

RULES:
1. Keep structure tags [Verse 1] [Chorus] etc and (instructions) exactly as-is
2. Keep simple, common ${sl.n} words IN THEIR ORIGINAL SCRIPT: אני, את, אתה, של, עם, אל, לא, כן, מה, זה, היא, הוא, הם, לי, לך, בי, כל, עוד, יום, לב, אור, שם
3. TRANSLITERATE to Latin ONLY words containing these problematic letters/sounds: ח, כ (soft), ך, ע (when not silent), ק in unusual positions, and any word Suno commonly mispronounces
4. When transliterating: NEVER use "ch" (Suno says "church"), use "H" instead. NEVER use apostrophes or hyphens.
5. Preserve exact line breaks
6. Output ONLY the hybrid text. No notes.

EXAMPLE INPUT:
[Verse 1]
הָיִיתִי יֶלֶד תָּמִים, הֶאֱמַנְתִּי לְכָל מִלָּה
חָשַׁבְתִּי כֻּלָּם חֲבֵרִים

EXAMPLE OUTPUT:
[Verse 1]
הייתי ילד תמים, האמנתי לכל מילה
HaSHAVti כולם HaveRIM

Convert these lyrics to hybrid format:
${src}`;

    const optimizedPrompt = `You optimize Hebrew song lyrics for Suno AI singing. Keep everything in Hebrew but apply techniques that help Suno pronounce Hebrew correctly WITHOUT slowing down the rhythm.

APPLY THESE TECHNIQUES:

1. FULL NIKUD (vowel marks) on EVERY word. Most important step.

2. SMART PREFIX SEPARATION — only separate LONG compound prefixes, NOT short common ones:
   DO separate (with a space):
   - "שכשהתעוררתי" → "שֶׁכְּשֶׁ הִתְעוֹרַרְתִּי" (3+ prefix stack)
   - "מאחורי" → "מֵאֲחוֹרֵי" (keep as one word — it's common enough)
   - "שהתעוררתי" → "שֶׁ הִתְעוֹרַרְתִּי" (prefix + long verb)
   
   DO NOT separate (keep as one natural word):
   - "והשמש" → "וְהַשֶּׁמֶשׁ" (short, natural, keep together)
   - "בדרך" → "בַּדֶּרֶךְ" (common, keep together)
   - "לכל" → "לְכָל" (short, keep together)
   - "האמת" → "הָאֱמֶת" (common, keep together)

3. MINIMAL PUNCTUATION for flow — only add commas at NATURAL breath points, not after every phrase. A line of lyrics should flow, not stop-start.

4. KEEP ORIGINAL LINE LENGTHS — do NOT break lines shorter than the original. If the original has 8 words on a line, keep 8 words. Short lines kill the rhythm for fast genres like rap.

5. Add RHYTHM INSTRUCTIONS in parentheses at the start of each section, matching the song's energy:
   - For rap/fast songs: (fast flow, rhythmic)
   - For ballads: (slow, emotional)  
   - For pop: (upbeat, catchy rhythm)
   These go AFTER the structure tag: [Verse 1]\n(fast flow, rhythmic)

6. Keep ALL structure tags [Verse 1] [Chorus] [Male Vocal] etc EXACTLY as they are.

7. For STRETCHED words at line ends, repeat the last vowel: "אַהֲבָהההה" — but ONLY at dramatic line endings, not everywhere.

8. Output ONLY the optimized Hebrew. No notes or explanations.

EXAMPLE INPUT:
[Verse 1]
הייתי ילד תמים האמנתי לכל מילה
פתחתי את הלב נתתי חום ואהבה
חשבתי כולם חברים כולם אחים בדם
אבל מאחורי הגב הם צחקו עלי כולם

EXAMPLE OUTPUT:
[Verse 1]
(rhythmic flow)
הָיִיתִי יֶלֶד תָּמִים, הֶאֱמַנְתִּי לְכָל מִלָּה
פָּתַחְתִּי אֶת הַלֵּב, נָתַתִּי חֹם וְאַהֲבָה
חָשַׁבְתִּי כֻּלָּם חֲבֵרִים, כֻּלָּם אַחִים בַּדָּם
אֲבָל מֵאֲחוֹרֵי הַגַּב הֵם צָחֲקוּ עָלַי כֻּלָּם

Optimize these lyrics:
${src}`;

    const prompt = m === "hybrid" ? hybridPrompt : m === "optimized" ? optimizedPrompt : m === "marknikud" ? markNikudPrompt : m === "gendernikud" ? genderNikudPrompt : fullPrompt;

    setNikudWarn(""); setNikudReview(null);
    try {
      let out = await callAI(prompt);
      if ((m === "marknikud" || m === "gendernikud") && out?.trim()) {
        let g = nikudWordGuard(src, out, m === "marknikud");
        if (!g.ok) {
          const list = g.changed.slice(0, 8).map(x => `${x.from} → ${x.to}`).join(", ");
          const retry = prompt + `\n\nCRITICAL: In your previous attempt you CHANGED letters or words${list ? " (" + list + ")" : ""}. Do NOT change, add or remove any letter or word — ONLY add nikud marks where the rules say. Return the full lyrics again.`;
          const out2 = await callAI(retry);
          if (out2?.trim()) { const g2 = nikudWordGuard(src, out2, m === "marknikud"); if (g2.ok || g2.changed.length < g.changed.length || (!g.changed.length && Math.abs(g2.countDiff) < Math.abs(g.countDiff))) { out = out2; g = g2; } }
          if (!g.ok) setNikudWarn(g.changed.length ? `⚠️ הבינה שינתה ${g.changed.length} מילים (גם אחרי ניסיון חוזר): ${g.changed.slice(0, 6).map(x => `${x.from} ← ${x.to}`).join(" · ")}. כדאי לבדוק אותן.` : `⚠️ הבינה שינתה את הטקסט (${g.countDiff > 0 ? "נוספו" : "חסרות"} ${Math.abs(g.countDiff)} מילים). כדאי להשוות למקור.`);
        }
      }
      if (out?.trim()) setRes(out.trim());
      else setErr(t.errCon);
    } catch (e) {
      let msg = String(e?.message || e);
      if (msg.length > 90) msg = msg.slice(0, 90) + "...";
      setErr(msg);
    }
    setLoading(false);
  };

  // opts: {temperature, onText} — יצירתי = טמפרטורה גבוהה, ביקורת/ניקוד = נמוכה; onText = זרימה (Gemini בלבד)
  const callAI = async (prompt, opts = {}) => {
    const p = aiProvider;
    if (p === "gemini") {
      const keys = aiKeys.gemini.split(/[\n,;]+/).map(s => s.trim()).filter(Boolean);
      const models = selModel ? [selModel, ...GEMINI_MODELS.filter(m => m !== selModel)] : (liveModels.length ? liveModels : null);
      return await callGemini(keys, prompt, models, opts);
    }
    if (p === "claude") return await callClaude(aiKeys.claude, prompt, opts);
    if (p === "builtin") return await callClaude("", prompt, opts);
    if (p === "openai") return await callOpenAICompat("https://api.openai.com/v1/chat/completions", aiKeys.openai, prompt, "gpt-4o-mini", opts);
    if (p === "device") return await callOpenAICompat(aiKeys.deviceUrl.replace(/\/+$/, "") + "/chat/completions", "", prompt, "llama3", opts);
    if (p === "custom") return await callOpenAICompat(aiKeys.customUrl, aiKeys.customKey, prompt, "gpt-4o-mini", opts);
    throw new Error("No provider");
  };

  useEffect(() => { localStorage.setItem("sunoprep_idea_gender_mode", ideaGenderMode); }, [ideaGenderMode]);

  const genderInstruction = `התאמת מגדר ונמען: ${ideaGenderMode}. הקפד על עקביות מלאה של לשון הפנייה, כינויי גוף, פעלים, תארים וכינויי חיבה. אל תחליף מגדר או צורת פנייה באמצע.`;

  const checkGenderConsistency = async () => {
    if (!ideaOut.trim()) { setErr("אין טיוטה לבדיקה"); return; }
    if (!aiProvider) { setErr("כדי לבדוק התאמה צריך לחבר ספק AI בהגדרות"); return; }
    setIdeaLoading(true); setErr(""); setGenderCheckResult("");
    try {
      const p=`אתה עורך לשון ושירים בעברית. בדוק את הטיוטה לפי ההגדרה: ${ideaGenderMode}. ${genderInstruction} החזר תשובה קצרה בעברית: תחילה "תקין" או "נמצאו בעיות", אחר כך רשימת שורות בעייתיות והצעת תיקון. אל תשכתב את כל השיר.\n\nטיוטה:\n${ideaOut}`;
      const out=await callAI(p); setGenderCheckResult((out||"לא התקבלה תוצאה").trim());
    } catch(e) { setErr(String(e?.message||e)); }
    setIdeaLoading(false);
  };

  const adaptIdeaGender = async () => {
    if (!ideaOut.trim()) { setErr("אין טיוטה להתאמה"); return; }
    if (!aiProvider) { setErr("כדי להתאים טיוטה צריך לחבר ספק AI בהגדרות"); return; }
    setIdeaLoading(true); setErr("");
    try {
      const p=`אתה עורך שירים מקצועי בעברית. התאם את הטיוטה להגדרה: ${ideaGenderMode}. ${genderInstruction} שמור ככל האפשר על המשמעות, המבנה, החריזה והאווירה. החזר רק את הטיוטה המותאמת, ללא הסברים.\n\nטיוטה מקורית:\n${ideaOut}`;
      const out=await callAI(p);
      if(out?.trim()) { const next=out.trim(); setIdeaHistory(prev=>[...prev, ideaOut]); setIdeaHistoryIndex(prev=>prev+1); setIdeaOut(next); setGenderCheckResult("נוצרה גרסה מותאמת. המקור נשמר בהיסטוריית הגרסאות."); }
    } catch(e) { setErr(String(e?.message||e)); }
    setIdeaLoading(false);
  };

  /* ═══ ✨ אולפן השירים ═══ */
  useEffect(() => {
    const t = setTimeout(() => { try { localStorage.setItem(IDEA_KEY, JSON.stringify({ ideaPrompt, ideaMood, ideaType, ideaStructure, ideaLength, ideaPerspective, ideaRhyme, ideaKeywords, ideaOut, ideaGenre, ideaAutoRefine, ideaVariants: ideaVariants.slice(0, 3), ideaHistory: ideaHistory.slice(-15) })); } catch (e) {} }, 400);
    return () => clearTimeout(t);
  }, [ideaPrompt, ideaMood, ideaType, ideaStructure, ideaLength, ideaPerspective, ideaRhyme, ideaKeywords, ideaOut, ideaGenre, ideaAutoRefine, ideaVariants, ideaHistory]);

  // קריאת AI שמחזירה JSON (ניסיון חוזר אחד אם הפורמט נשבר)
  const aiJSON = async (prompt, temperature = 0.9) => {
    const ex = (window.AppNestRefine && window.AppNestRefine.extractJSON) || ((t) => { try { return JSON.parse(t); } catch (e) { return null; } });
    for (let i = 0; i < 2; i++) { const j = ex(await callAI(i ? prompt + "\n\nהחזר אך ורק JSON תקין, בלי טקסט נוסף." : prompt, { temperature })); if (j) return j; }
    throw new Error("הבינה לא החזירה תשובה בפורמט הנכון. נסה שוב.");
  };
  const needAI = (what) => { if (aiProvider) return true; setErr(`כדי ${what} צריך לחבר ספק AI בהגדרות (Gemini חינמי)`); return false; };

  const setDraft = (next, keepOld = true) => {           // מחליף טיוטה ושומר את הקודמת בהיסטוריה
    if (keepOld && ideaOut.trim() && ideaOut !== next) { setIdeaHistory(prev => [...prev, ideaOut].slice(-15)); setIdeaHistoryIndex(-1); }
    setIdeaOut(next); setLineSel(null); setLineTool(null);
  };

  const ANGLES = ["כיוון רגשי ואישי, מנקודת מבט אינטימית", "כיוון קצבי עם פזמון שמתפוצץ", "כיוון מפתיע — זווית, סיפור או דימוי שלא מצפים להם"];
  const makeSongPrompt = (i, count) => `אתה כותב שירים מקצועי בעברית שכותב להיטים, ומכין מילים ל-Suno AI.
כתוב ${ideaType} על: "${ideaPrompt.trim()}".

הגדרות:
- ז'אנר: ${ideaGenre} · מצב רוח: ${ideaMood}
- מבנה: ${ideaStructure} · אורך: ${ideaLength} (${LENGTH_HINT[ideaLength] || ""})
- נקודת מבט: ${ideaPerspective} · חריזה: ${ideaRhyme}
- מי שר למי: ${ideaGenderMode}. ${genderInstruction}${ideaKeywords.trim() ? `\n- מילות מפתח לשלב אם זה טבעי: ${ideaKeywords.trim()}` : ""}

כללי כתיבה:
1. פזמון קליט: שורת מפתח (הוק) קצרה שחוזרת, והפזמון חוזר זהה בכל פעם שהוא מופיע.
2. דימויים קונקרטיים ופרטים אמיתיים (מקום, חפץ, רגע) — להראות ולא להסביר. בלי קלישאות שחוקות כמו "לב שבור", "דמעות כמו גשם", "את כל העולם שלי".
3. שורות קצרות שקל לשיר: עד 8–9 מילים, ובשורות מקבילות מספר הברות דומה.
4. ${GENRE_HINT[ideaGenre] || "עקבי בסגנון ובקצב."}
5. עברית טבעית ועכשווית, לא מליצית.
6. תגיות מבנה באנגלית בסוגריים מרובעים, כל אחת בשורה נפרדת: [Verse 1], [Pre-Chorus], [Chorus], [Bridge], [Outro].
7. בלי ניקוד, בלי כותרת ובלי הסברים — רק מילות השיר.${count > 1 ? `\n\nזה כיוון ${i + 1} מתוך ${count}: ${ANGLES[i] || ANGLES[2]}. הוא חייב להיות שונה לגמרי מהכיוונים האחרים — בזווית, בדימויים ובפזמון.` : ""}`;

  const generateIdea = async (count = 1) => {
    if (!ideaPrompt.trim()) { setErr("כתוב קודם על מה השיר (או בחר נושא מהרשימה)"); return; }
    if (!needAI("לכתוב שיר")) return;
    setIdeaLoading(true); setErr(""); setRefineResult(null); setIdeaTitles(null); setIdeaStyleMsg(""); setIdeaLive(""); setIdeaStart(Date.now());
    let first = "";
    try {
      const live = count === 1 && aiProvider === "gemini";
      const outs = await Promise.all(Array.from({ length: count }, (_, i) => callAI(makeSongPrompt(i, count), { temperature: 0.95, ...(live ? { onText: (t) => setIdeaLive(t) } : {}) }).catch((e) => { if (count === 1) throw e; return ""; })));
      const clean = outs.map(x => songPostProcess((window.AppNestRefine ? window.AppNestRefine.cleanText(x) : (x || "")).trim(), "")).filter(Boolean);
      if (!clean.length) throw new Error("לא התקבלה טיוטה. בדוק את החיבור בהגדרות ונסה שוב.");
      setIdeaVariants(clean); first = clean[0]; setDraft(first); setIdeaEdit(false);
    } catch (e) { setErr(String(e?.message || e)); }
    setIdeaLoading(false); setIdeaLive(""); setIdeaStart(0);
    if (first && count === 1 && ideaAutoRefine) runAutoRefine("idea", false, first, 1);
  };

  const quickImprove = async (how) => {
    if (!ideaOut.trim() || !needAI("לשפר")) return;
    setIdeaLoading(true); setErr("");
    try {
      const p = `אתה עורך שירים מקצועי בעברית. שפר את הטיוטה לפי הבקשה: "${how}". שמור על הרעיון, על המבנה ועל תגיות [Verse]/[Chorus]. ${genderInstruction} ${GENRE_HINT[ideaGenre] || ""} בלי ניקוד ובלי הסברים — החזר רק את הטיוטה המשופרת.\n\nהטיוטה:\n${ideaOut}`;
      const raw = await callAI(p, { temperature: 0.85 });
      const out = window.AppNestRefine ? window.AppNestRefine.cleanText(raw) : (raw || "").trim();
      if (out) setDraft(songPostProcess(out, ideaOut));
    } catch (e) { setErr(String(e?.message || e)); }
    setIdeaLoading(false);
  };

  const inspireMe = async () => {
    if (!needAI("לקבל רעיונות")) return;
    setIdeaInspire({ loading: true, ideas: [] }); setErr("");
    try {
      const j = await aiJSON(`הצע 5 רעיונות מקוריים לשירים בעברית בז'אנר ${ideaGenre}, במצב רוח ${ideaMood}${ideaPrompt.trim() ? `, בהשראת: "${ideaPrompt.trim()}"` : ""}. כל רעיון במשפט אחד קונקרטי ומפתיע (סיפור, רגע או דימוי — לא נושא כללי). החזר JSON בלבד: {"ideas":["...","...","...","...","..."]}`);
      setIdeaInspire({ loading: false, ideas: (j.ideas || []).map(String).filter(Boolean).slice(0, 6) });
    } catch (e) { setIdeaInspire(null); setErr(String(e?.message || e)); }
  };

  const suggestTitles = async () => {
    if (!ideaOut.trim() || !needAI("להציע שם")) return;
    setIdeaTitles({ loading: true, titles: [] }); setErr("");
    try {
      const j = await aiJSON(`הצע 5 שמות קצרים וקליטים (1–4 מילים) לשיר הבא. עדיף שם שנלקח מההוק. החזר JSON בלבד: {"titles":["..."]}\n\nהשיר:\n${ideaOut}`);
      setIdeaTitles({ loading: false, titles: (j.titles || []).map(String).filter(Boolean).slice(0, 6) });
    } catch (e) { setIdeaTitles(null); setErr(String(e?.message || e)); }
  };

  const suggestStyle = async () => {
    if (!ideaOut.trim() || !needAI("להציע סגנון")) return;
    setIdeaLoading(true); setErr(""); setIdeaStyleMsg("");
    try {
      const j = await aiJSON(`You are a Suno AI prompt expert. Write a Suno "Style of Music" prompt in ENGLISH for these Hebrew lyrics: genre "${ideaGenre}", mood "${ideaMood}", singer: ${ideaGenderMode}. Comma-separated tags: genre and sub-genre, 2–3 instruments, vocal type, tempo/BPM, mood. Max 110 characters. Do not include artist names. Return JSON only: {"style":"..."}\n\nLyrics:\n${ideaOut}`);
      const st = String(j.style || "").replace(/["\n]/g, " ").trim().slice(0, 160);
      if (!st) throw new Error("לא התקבל סגנון");
      setCustSty(st); setIdeaStyleMsg(`🎼 הוכנס לשדה "סגנון מותאם אישית" בלשונית סגנונות: ${st}`);
    } catch (e) { setErr(String(e?.message || e)); }
    setIdeaLoading(false);
  };

  const sendDraftToWrite = () => {
    if (!ideaOut.trim()) return;
    if (src.trim()) {
      const replace = window.confirm("בלשונית כתיבה כבר יש שיר.\n\nאישור = להחליף אותו בטיוטה הזו\nביטול = להוסיף את הטיוטה בסוף");
      setSrc(replace ? ideaOut : src.replace(/\s*$/, "") + "\n\n" + ideaOut);
    } else setSrc(ideaOut);
    setActiveTab("write");
    try { window.scrollTo({ top: 0, behavior: "smooth" }); } catch (e) {}
  };

  // כלי שורה: חלופות / קיצור / חרוזים לשורה שנבחרה
  const lineTask = async (idx, kind) => {
    const lines = ideaOut.split("\n"); const line = (lines[idx] || "").trim(); if (!line || !needAI("להשתמש בכלי השורה")) return;
    setLineTool({ idx, kind, loading: true, options: [] }); setErr("");
    const syl = countSyllables(line);
    const words = line.replace(/[.,!?;:"'()…–—-]/g, " ").split(/\s+/).filter(Boolean); const last = words[words.length - 1] || "";
    const prevLine = (lines.slice(0, idx).reverse().find(l => l.trim() && !/^\s*\[/.test(l)) || "").trim();
    const nextLine = (lines.slice(idx + 1).find(l => l.trim() && !/^\s*\[/.test(l)) || "").trim();
    const prompts = {
      alt: `אתה כותב שירים בעברית. בשיר שלמטה, כתוב 3 חלופות לשורה "${line}" בלבד. כל חלופה: אותו רעיון בניסוח רענן, בערך ${syl} הברות, ממשיכה טבעי מהשורה הקודמת ("${prevLine}") ומתחברת לבאה ("${nextLine}")${ideaRhyme !== "ללא חריזה מחייבת" ? ", ושומרת על החריזה של השורה" : ""}. ${genderInstruction} בלי ניקוד. החזר JSON בלבד: {"options":["...","...","..."]}\n\nהשיר:\n${ideaOut}`,
      short: `קצר את השורה "${line}" לגרסה קלה יותר לשירה (בערך ${Math.max(4, syl - 3)} הברות), באותה משמעות ובאותו חרוז. תן 2 אפשרויות. ${genderInstruction} בלי ניקוד. החזר JSON בלבד: {"options":["...","..."]}`,
      rhyme: `תן 12 מילים או צירופים קצרים בעברית שמתחרזים לפי ההגייה עם "${last}" ומתאימים לשיר בז'אנר ${ideaGenre} על "${ideaPrompt.trim() || "אהבה"}". סדר מהחרוז החזק לחלש. בלי ניקוד. החזר JSON בלבד: {"options":["..."]}`,
    };
    try {
      const j = await aiJSON(prompts[kind]);
      const opts = (j.options || []).map(x => songPostProcess(String(x).trim(), "")).filter(Boolean).slice(0, kind === "rhyme" ? 14 : 4);
      setLineTool({ idx, kind, loading: false, options: opts, last });
    } catch (e) { setLineTool({ idx, kind, loading: false, options: [], err: String(e?.message || e) }); }
  };
  const replaceLine = (idx, text) => { const lines = ideaOut.split("\n"); lines[idx] = text; setDraft(lines.join("\n")); };

  // 📚 וריאציות לסגנון מהספרייה (קריאת AI אחת)
  const styleVariations = async (x) => {
    if (!needAI("ליצור וריאציות")) return;
    setLibVar({ id: x.id, loading: true, options: [] }); setErr("");
    try {
      const j = await aiJSON(`You are a Suno AI style-prompt expert. The user liked this Suno "Style of Music" prompt:
"${x.style}"
${x.notes ? `Their notes about what worked / what to change (Hebrew): ${x.notes}
` : ""}Write 3 variations that keep what they liked but explore a different direction each (e.g. instrumentation, energy/tempo, vocal delivery). English, comma-separated tags, max 120 characters each, no artist names. For each give a short Hebrew explanation of what changed. Return JSON only: {"variations":[{"style":"...","why":"..."}]}`, 0.9);
      setLibVar({ id: x.id, loading: false, options: (j.variations || []).map(v => ({ style: String(v.style || "").replace(/["\n]/g, " ").trim(), why: String(v.why || "") })).filter(v => v.style).slice(0, 4) });
    } catch (e) { setLibVar(null); setErr(String(e?.message || e)); }
  };

  // ✍️ המשך את השיר (לשונית כתיבה): כותב את החלק הבא ומוסיף בסוף
  const continueSong = async () => {
    if (!src.trim() || !needAI("להמשיך את השיר")) return;
    setContinueBusy(true); setErr("");
    try {
      const tags = (src.match(/\[[^\]]+\]/g) || []).map(t => t.slice(1, -1));
      const p = `אתה כותב שירים בעברית. זה שיר שהמשתמש התחיל לכתוב. כתוב רק את החלק הבא שלו (בית, פזמון או גשר — מה שמתאים עכשיו לפי המבנה${tags.length ? `; עד עכשיו: ${tags.join(", ")}` : ""}). שמור על הקול, הסגנון, המשקל והחריזה של המשתמש. אם החלק הבא הוא פזמון שכבר הופיע — חזור עליו זהה. ${genderInstruction} ${HAS_NIKUD.test(src) ? "" : "בלי ניקוד. "}התחל בתגית מבנה בסוגריים מרובעים (למשל [Verse 2]) והחזר רק את החלק החדש, בלי הסברים.\n\nהשיר עד עכשיו:\n${src}`;
      const raw = await callAI(p, { temperature: 0.85 });
      const out = window.AppNestRefine ? window.AppNestRefine.cleanText(raw) : (raw || "").trim();
      if (!out) throw new Error("לא התקבל המשך. נסה שוב.");
      setSrcBeforeRefine(src); setSrc(src.replace(/\s*$/, "") + "\n\n" + songPostProcess(out, src));
    } catch (e) { setErr(String(e?.message || e)); }
    setContinueBusy(false);
  };

  /* ═══ 🎻 סדנת שיפור אוטומטית: כותב → מבקר → משפר (מנוע AppNest Refine) ═══
     target "idea" = טיוטת AI בלשונית רעיונות · target "write" = השיר שהמשתמש כתב בלשונית כתיבה */
  const songSettingsText = (own) => own
    ? `- זה שיר שהמשתמש כתב בעצמו (לא טיוטת AI) — הקול והסגנון שלו הם העיקר\n- מגדר ונמען: ${ideaGenderMode}`
    : `- סוג: ${ideaType} · מבנה: ${ideaStructure} · אורך: ${ideaLength}\n- מצב רוח: ${ideaMood} · נקודת מבט: ${ideaPerspective}\n- חריזה: ${ideaRhyme} · מגדר ונמען: ${ideaGenderMode}` +
      (ideaPrompt.trim() ? `\n- הרעיון: "${ideaPrompt.trim()}"` : "") + (ideaKeywords.trim() ? `\n- מילות מפתח: ${ideaKeywords.trim()}` : "");

  const makeSongCritique = (own) => ({ draft, local }) => `אתה מבקר שירים קשוח והוגן, מומחה לכתיבת שירים בעברית ולהכנת מילים ל-Suno AI. תן ציון אמיתי, לא מחמאות: 5 = בינוני, 7 = טוב, 9 = מעולה ונדיר.

${own ? "פרטים על השיר" : "ההגדרות שהכותב ביקש"}:
${songSettingsText(own)}

${local ? local.summary : ""}

דרג כל קריטריון מ-0 עד 10:
hook — יש פזמון או שורת מפתח שנתקעת בראש, חוזרת ופשוטה לשירה
rhyme — איכות החריזה${own ? "" : " ביחס להגדרה"} (היעזר בניתוח המקומי, אבל שפוט לפי ההגייה האמיתית)
flow — זרימה ומשקל: שורות מקבילות באורך דומה, קל לשיר, בלי שורות עמוסות
imagery — דימויים מקוריים וקונקרטיים, בלי קלישאות שחוקות
emotion — רגש אמין ועקבי
gender — עקביות מלאה של מגדר ופנייה לפי ההגדרה (כל טעות מורידה הרבה)
fit — ${own ? "שלמות ובהירות: השיר מספר משהו ברור מההתחלה ועד הסוף" : "התאמה לרעיון, למבנה ולאורך שביקשו"}
suno — מוכנות ל-Suno: תגיות [Verse]/[Chorus] תקינות, שורות לא ארוכות מדי, בלי הסברים בתוך הטקסט

החזר JSON בלבד, בדיוק בפורמט הזה:
{"scores":{"hook":0,"rhyme":0,"flow":0,"imagery":0,"emotion":0,"gender":0,"fit":0,"suno":0},"strengths":["מה טוב ושווה לשמור"],"weaknesses":[{"where":"פזמון, שורה 2","problem":"מה הבעיה","fix":"הצעה קונקרטית לתיקון"}],"verdict":"משפט אחד"}
עד 5 חולשות, החשובה ביותר ראשונה. הכל בעברית.

השיר:
${draft}`;

  const makeSongRewrite = (own) => ({ draft, review, log, round, local }) => {
    const weak = review.weaknesses.map((w, i) => `${i + 1}. ${w.where ? "[" + w.where + "] " : ""}${w.problem}${w.fix ? " → " + w.fix : ""}`).join("\n");
    const keep = review.strengths.map(x => "- " + x).join("\n");
    const rejected = log.filter(e => !e.accepted && e.tried).map(e => `- סבב ${e.round}: ניסה לתקן "${(e.tried || []).slice(0, 3).join("; ")}" — ${e.reason}`).join("\n");
    const nikudRule = HAS_NIKUD.test(draft) ? "- בשורות שלא שינית השאר את הניקוד בדיוק כמו שהוא; מילים חדשות כתוב בלי ניקוד." : "- בלי ניקוד.";
    return `אתה כותב ועורך שירים מקצועי בעברית. זה סבב שיפור ${round}.
המטרה: להעלות את ציון המבקר (כרגע ${review.score}/10) בלי לאבד את מה שטוב.

${songSettingsText(own)}

חולשות לתיקון, לפי סדר חשיבות:
${weak || "- אין חולשות מפורטות; חזק את הפזמון ואת הדימויים"}

חוזקות שחובה לשמור:
${keep || "- הרעיון המרכזי"}
${rejected ? "\nניסיונות קודמים שנדחו — אל תחזור על אותה גישה:\n" + rejected + "\n" : ""}
${local ? local.summary : ""}

כללים:
${own ? "- זה השיר של המשתמש: תקן רק את מה שהמבקר ציין, שנה כמה שפחות שורות, ושמור על הקול, המילים והסגנון שלו.\n- שמור על אורך דומה למקור." : `- שמור על הרעיון המרכזי.\n- אל תאריך את השיר מעבר לאורך "${ideaLength}".`}
- שמור על המבנה ועל תגיות [Verse]/[Chorus]/[Bridge] ותגיות קול שקיימות.
- ${genderInstruction}
${nikudRule}
- בלי הסברים ובלי כותרות — החזר רק את מילות השיר המלאות.

השיר הנוכחי:
${draft}`;
  };

  const refineBusy = !!refineState?.running;

  const runAutoRefine = async (target, reviewOnly = false, draftOverride = null, roundsOverride = null) => {
    const own = target === "write";
    const base = draftOverride != null ? draftOverride : own ? src : ideaOut;
    if (!base.trim()) { setErr(own ? "כתוב שיר לפני השיפור" : "צור או בחר טיוטה לפני השיפור"); return; }
    if (!aiProvider) { setErr("כדי לשפר צריך לחבר ספק AI בהגדרות"); return; }
    if (!window.AppNestRefine) { setErr("מנוע השיפור לא נטען — רענן את הדף"); return; }
    const rounds = reviewOnly ? 0 : (roundsOverride || refineRounds);
    refineCancelRef.current = false;
    if (!own) setIdeaLoading(true);
    setErr(""); setRefineResult(null);
    setRefineState({ target, running: true, rounds, stage: "critique", round: 0, steps: [], baseline: null });
    try {
      const r = await window.AppNestRefine.run({
        callAI: (pr) => callAI(pr, { temperature: pr.startsWith("אתה מבקר שירים") ? 0.2 : 0.85 }), draft: base, rounds, minGain: 0.3, criteria: SONG_CRITERIA,
        buildCritique: makeSongCritique(own), buildRewrite: makeSongRewrite(own),
        localCheck: songLocalCheck, postProcess: songPostProcess,
        isCancelled: () => refineCancelRef.current,
        onProgress: (ev) => setRefineState(st => st && ({ ...st, stage: ev.stage, round: ev.round,
          baseline: ev.stage === "baseline" ? ev.score : st.baseline,
          steps: ev.entry ? [...st.steps, ev.entry] : st.steps })),
      });
      if (r.improved) {
        if (own) { setSrcBeforeRefine(base); setSrc(r.text); }
        else {
          const accepted = r.log.filter(e => e.accepted).map(e => e.text);
          const chain = [base, ...accepted.slice(0, -1)];          // כל גרסת ביניים שהתקבלה נכנסת להיסטוריה
          setIdeaHistory(prev => [...prev, ...chain].slice(-15)); setIdeaHistoryIndex(-1); setIdeaOut(r.text); setLineSel(null); setLineTool(null);
        }
      }
      setRefineResult({ ...r, target, reviewOnly });
    } catch (e) { setErr(String(e?.message || e)); }
    setRefineState(st => st && { ...st, running: false });
    if (!own) setIdeaLoading(false);
  };

  /* ═══ 🧐 מבקר ניקוד: בודק את הניקוד בתוצאה ומציע תיקונים — ומוודא בקוד שהתיקון לא משנה אותיות ═══ */
  const stripNik = (w) => w.replace(/[֑-ׇ]/g, "").replace(/[^א-ת]/g, "");
  const sameLetters = (a, b) => { const l = x => stripNik(x).replace(/[וי]/g, ""); return !!stripNik(a) && l(a) === l(b); };
  const NIKUD_DIRS = { m2f: "גבר שר לאישה", f2m: "אישה שרה לגבר", f2f: "אישה שרה לאישה", m2m: "גבר שר לגבר" };

  const reviewNikud = async () => {
    if (!res.trim()) return;
    if (!aiProvider) { setErr("בדיקת ניקוד צריכה חיבור AI בהגדרות"); return; }
    const text = res;
    setNikudReview({ loading: true, issues: [], applied: {} }); setErr("");
    const p = `אתה מומחה לניקוד עברי ולהכנת שירים ל-Suno AI. בדוק את הניקוד בשיר הבא.
${tMode === "gendernikud" ? `כיוון השירה: ${NIKUD_DIRS[genderDir] || NIKUD_DIRS.m2f}. בדוק במיוחד שהניקוד של מילות פנייה, פעלים וכינויים מתאים לכיוון הזה.\n` : ""}בדוק רק מילים שיש עליהן ניקוד:
- האם הניקוד נכון דקדוקית
- האם הוא מתאים למגדר ולהקשר במשפט
- האם יש מילה מנוקדת חלקית או בצורה שתבלבל את סונו בהגייה
אסור להציע שינוי אותיות — רק ניקוד. מילה נכונה אל תכלול ברשימה.
החזר JSON בלבד: {"ok":true,"issues":[{"word":"המילה בדיוק כפי שהיא בטקסט","suggested":"אותה מילה עם ניקוד מתוקן","reason":"הסבר קצר"}],"summary":"משפט אחד"}
עד 12 בעיות, החשובות ראשונות. הכל בעברית.

השיר:
${text}`;
    try {
      let j = null;
      for (let i = 0; i < 2 && !j; i++) j = window.AppNestRefine.extractJSON(await callAI(i ? p + "\n\nהחזר אך ורק JSON תקין." : p));
      if (!j) throw new Error("המבקר לא החזיר תשובה תקינה. נסה שוב.");
      const issues = (Array.isArray(j.issues) ? j.issues : []).slice(0, 12).map(x => ({
        word: String(x.word || "").trim(), suggested: String(x.suggested || "").trim(), reason: String(x.reason || ""),
      })).filter(x => x.word && x.suggested && x.word !== x.suggested)
        .map(x => ({ ...x, safe: sameLetters(x.word, x.suggested) }));
      setNikudReview({ loading: false, issues, summary: String(j.summary || ""), applied: {}, forText: text });
    } catch (e) { setNikudReview(null); setErr(String(e?.message || e)); }
  };

  const applyNikudFix = (idx) => {
    const it = nikudReview?.issues[idx]; if (!it || !it.safe) return false;
    let done = false;
    setRes(cur => {
      if (cur.includes(it.word)) { done = true; return cur.replace(it.word, it.suggested); }
      // לא נמצאה בדיוק — מחפשים מילה עם אותן אותיות
      const parts = cur.split(/(\s+)/);
      const k = parts.findIndex(w => w.trim() && stripNik(w) === stripNik(it.word));
      if (k < 0) return cur;
      const pre = w => (w.match(/^[^א-ת]*/) || [""])[0], post = w => (w.match(/[^א-ת֑-ׇ]*$/) || [""])[0];
      parts[k] = pre(parts[k]) + it.suggested.replace(/^[^א-ת]*|[^א-ת֑-ׇ]*$/g, "") + post(parts[k]);
      done = true; return parts.join("");
    });
    setNikudReview(nr => nr && { ...nr, applied: { ...nr.applied, [idx]: true } });
    return done;
  };

  const testConnection = async () => {
    const st = SETUP_STEPS[uLang] || SETUP_STEPS.en;
    if (!selProvider) { setTestState({ ok: false, msg: st.noSel }); setTimeout(() => setTestState(null), 2500); return; }
    setTestState({ testing: true, msg: st.testing });
    try {
      const testPrompt = "Reply with exactly: OK";
      if (selProvider === "gemini") {
        const keys = aiKeys.gemini.split(/[\n,;]+/).map(s => s.trim()).filter(Boolean);
        if (!keys.length) throw new Error("No key");
        await callGemini(keys, testPrompt);
      } else if (selProvider === "claude") {
        if (!aiKeys.claude.trim()) throw new Error("No key");
        await callClaude(aiKeys.claude.trim(), testPrompt);
      } else if (selProvider === "builtin") {
        await callClaude("", testPrompt);
      } else if (selProvider === "openai") {
        if (!aiKeys.openai.trim()) throw new Error("No key");
        await callOpenAICompat("https://api.openai.com/v1/chat/completions", aiKeys.openai.trim(), testPrompt, "gpt-4o-mini");
      } else if (selProvider === "device") {
        await callOpenAICompat((aiKeys.deviceUrl || "http://localhost:11434/v1").replace(/\/+$/, "") + "/chat/completions", "", testPrompt, "llama3");
      } else if (selProvider === "custom") {
        if (!aiKeys.customUrl.trim()) throw new Error("No URL");
        await callOpenAICompat(aiKeys.customUrl.trim(), aiKeys.customKey.trim(), testPrompt, "gpt-4o-mini");
      }
      setTestState({ ok: true, msg: st.ok });
    } catch (e) {
      let m = String(e?.message || e);
      if (m.length > 40) m = m.slice(0, 40) + "...";
      setTestState({ ok: false, msg: st.fail + m });
    }
    setTimeout(() => setTestState(null), 5000);
  };

  const saveAiSetup = async () => {
    if (!selProvider) return;
    setAiProvider(selProvider);
    try { await localSet("ai-config", JSON.stringify({ provider: selProvider, keys: aiKeys })); } catch {}
    setScr("home");
  };

  const disconnectAi = async () => {
    setAiProvider(null); setSelProvider(null);
    try { await localSet("ai-config", JSON.stringify({ provider: null, keys: aiKeys })); } catch {}
  };

  const speak = (txt, isSrc) => {
    window.speechSynthesis.cancel();
    const k = isSrc ? "s" : "r";
    if (speaking === k) { setSpeaking(null); return; }
    const clean = txt.replace(/\[.*?\]/g, "").replace(/\(.*?\)/g, "").trim();
    if (!clean) return;
    const u = new SpeechSynthesisUtterance(clean);
    u.lang = isSrc ? sl.tts : (tMode === "optimized" || tMode === "hebrew" || tMode === "hybrid" || tMode === "stripnikud" || tMode === "marknikud" || tMode === "gendernikud") ? sl.tts : "en-US"; u.rate = rate;
    u.onend = () => setSpeaking(null); u.onerror = () => setSpeaking(null);
    setSpeaking(k); window.speechSynthesis.speak(u);
  };

  const speakLine = (txt, i) => {
    window.speechSynthesis.cancel();
    if (lineSpeaking === i) { setLineSpeaking(null); return; }
    const clean = txt.replace(/\[.*?\]/g, "").replace(/\(.*?\)/g, "").trim();
    if (!clean) return;
    const u = new SpeechSynthesisUtterance(clean);
    u.lang = sl.tts; u.rate = rate;
    u.onend = () => setLineSpeaking(null);
    u.onerror = () => setLineSpeaking(null);
    setLineSpeaking(i);
    window.speechSynthesis.speak(u);
  };

  const speakAllLines = () => {
    window.speechSynthesis.cancel();
    const lines = src.split("\n").map((x, i) => ({ text: x.trim(), i }))
      .filter(x => x.text && !/^\[.*\]$/.test(x.text) && !/^\(.*\)$/.test(x.text));
    if (!lines.length) return;
    let p = 0;
    const next = () => {
      if (p >= lines.length) { setLineSpeaking(null); return; }
      const current = lines[p];
      const u = new SpeechSynthesisUtterance(current.text);
      u.lang = sl.tts; u.rate = rate;
      setLineSpeaking(current.i);
      p++;
      u.onend = next;
      u.onerror = next;
      window.speechSynthesis.speak(u);
    };
    next();
  };

  const copy = async (txt, fld) => {
    if (!txt?.trim()) return;
    try { await navigator.clipboard.writeText(txt); }
    catch { const a = document.createElement("textarea"); a.value = txt; document.body.appendChild(a); a.select(); document.execCommand("copy"); document.body.removeChild(a); }
    setCpd(fld); setTimeout(() => setCpd(null), 2000);
  };

  const print = (w) => {
    let h = ""; const hdr = uname ? `<p style="color:#888;font-size:11px">${uname} | ${new Date().toLocaleDateString()}</p>` : "";
    if (w !== "lyrics") h += `<h2>Style of Music</h2><pre style="white-space:pre-wrap">${styTxt}</pre>`;
    if (w !== "style") h += `<h2>Lyrics</h2><pre style="white-space:pre-wrap">${res || src}</pre>`;
    const win = window.open("", "_blank");
    win.document.write(`<html><body style="font-family:monospace;padding:40px;max-width:600px;margin:0 auto">${hdr}${h}<p style="color:#aaa;font-size:10px;margin-top:40px">SunoPrep © AppNest 2026</p></body></html>`);
    win.document.close(); win.print();
  };

  const share = () => {
    if (navigator.share) navigator.share({ title: "SunoPrep", text: t.shareMsg, url: location.href }).catch(() => {});
    else copy(location.href + "\n" + t.shareMsg, "share");
  };

  const [showBackupReminder, setShowBackupReminder] = useState(false);

  const expBk = () => {
    const d = JSON.stringify({ backupVersion: "9.0", exportedAt: new Date().toISOString(), app: "SunoPrep", src, res, selSty, selVocal, custSty, bpmVal, savedSty, styleLib, uname, sLang, uLang, theme, day, activeVoiceId }, null, 2);
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([d], { type: "application/json" }));
    a.download = `sunoprep-backup-${new Date().toISOString().slice(0, 10)}.json`; a.click();
    try { localStorage.setItem("sp_last_backup", Date.now().toString()); } catch {}
    setShowBackupReminder(false);
  };

  const impBk = (e) => {
    const f = e.target.files?.[0]; if (!f) return;
    const r = new FileReader();
    r.onload = (ev) => {
      try {
        const d = JSON.parse(ev.target.result);
        if (d.src !== undefined) setSrc(d.src); if (d.res !== undefined) setRes(d.res);
        if (d.selSty) setSelSty(d.selSty); if (d.selVocal) setSelVocal(d.selVocal); if (d.custSty !== undefined) setCustSty(d.custSty); if (d.bpmVal !== undefined) setBpmVal(d.bpmVal); if (d.savedSty) setSavedSty(d.savedSty); if (Array.isArray(d.styleLib)) setStyleLib(d.styleLib);
        if (d.uname) setUname(d.uname); if (d.sLang) setSLang(d.sLang);
        if (d.uLang) setULang(d.uLang); if (d.theme) setTheme(d.theme);
        if (d.day !== undefined) setDay(d.day); if (d.activeVoiceId !== undefined) setActiveVoiceId(d.activeVoiceId);
      } catch {}
    };
    r.readAsText(f);
  };

  useEffect(() => () => window.speechSynthesis.cancel(), []);

  useEffect(() => {
    (async () => {
      try {
        const r = await localGet("saved-styles");
        if (r?.value) setSavedSty(JSON.parse(r.value));
      } catch {}
      try {
        const h = await localGet("song-history");
        if (h?.value) setHistory(JSON.parse(h.value));
      } catch {}
      try {
        const w = await localGet("word-dict");
        if (w?.value) setWordDict(JSON.parse(w.value));
      } catch {}
      try {
        const a = await localGet("ai-config");
        if (a?.value) {
          const cfg = JSON.parse(a.value);
          if (cfg.provider) { setAiProvider(cfg.provider); setSelProvider(cfg.provider); }
          if (cfg.keys) setAiKeys(k => ({ ...k, ...cfg.keys }));
        }
      } catch {}
      try {
        const last = localStorage.getItem("sp_last_backup");
        const hist = await localGet("song-history");
        const hasContent = hist?.value && JSON.parse(hist.value).length > 0;
        if (hasContent) {
          if (!last) { setShowBackupReminder(true); }
          else {
            const days = (Date.now() - parseInt(last)) / (1000 * 60 * 60 * 24);
            if (days > 7) setShowBackupReminder(true);
          }
        }
      } catch {}
    })();
  }, []);

  useEffect(() => {
    (async () => { try { await localSet("saved-styles", JSON.stringify(savedSty)); } catch {} })();
  }, [savedSty]);

  const saveToHistory = async () => {
    const entry = { id: Date.now(), date: new Date().toLocaleDateString(), srcLang: sLang, mode: tMode, src, res, style: styTxt, title: src.split("\n").find(l => l.trim() && !l.startsWith("["))?.trim().slice(0, 40) || "Untitled" };
    const newH = [entry, ...history].slice(0, 50);
    setHistory(newH);
    try { await localSet("song-history", JSON.stringify(newH)); } catch {}
  };

  const loadFromHistory = (entry) => {
    setSrc(entry.src || ""); setRes(entry.res || "");
    setScr("home");
  };

  const deleteFromHistory = async (id) => {
    const newH = history.filter(h => h.id !== id);
    setHistory(newH);
    try { await localSet("song-history", JSON.stringify(newH)); } catch {}
  };

  const saveWordFix = async (original, fixed) => {
    if (!original || !fixed || original === fixed) return;
    const newD = { ...wordDict, [original]: fixed };
    setWordDict(newD);
    try { await localSet("word-dict", JSON.stringify(newD)); } catch {}
  };

  const removeWordFix = async (word) => {
    const newD = { ...wordDict };
    delete newD[word];
    setWordDict(newD);
    try { await localSet("word-dict", JSON.stringify(newD)); } catch {}
  };

  const playAB = () => {
    window.speechSynthesis.cancel();
    const cleanSrc = src.replace(/\[.*?\]/g, "").replace(/\(.*?\)/g, "").trim();
    const cleanRes = res.replace(/\[.*?\]/g, "").replace(/\(.*?\)/g, "").trim();
    if (!cleanSrc || !cleanRes) return;
    const uA = new SpeechSynthesisUtterance(cleanSrc);
    uA.lang = sl.tts; uA.rate = rate;
    setSpeaking("ab");
    uA.onend = () => {
      setTimeout(() => {
        const uB = new SpeechSynthesisUtterance(cleanRes);
        uB.lang = (tMode === "optimized" || tMode === "hebrew" || tMode === "hybrid" || tMode === "stripnikud" || tMode === "marknikud" || tMode === "gendernikud") ? sl.tts : "en-US";
        uB.rate = rate;
        uB.onend = () => setSpeaking(null);
        uB.onerror = () => setSpeaking(null);
        window.speechSynthesis.speak(uB);
      }, 500);
    };
    uA.onerror = () => setSpeaking(null);
    window.speechSynthesis.speak(uA);
  };

  const insertTemplate = (tmpl) => {
    setSrc(tmpl);
    setVCount(1);
  };

  const [autoStructuring, setAutoStructuring] = useState(false);
  const autoDetectStructure = async () => {
    if (!src.trim() || !aiProvider) return;
    setAutoStructuring(true); setErr("");
    const prompt = `You are a Hebrew song editor. The user pasted raw lyrics WITHOUT structure tags. Analyze the lyrics and add Suno structure tags: [Intro], [Verse 1], [Verse 2], [Pre-Chorus], [Chorus], [Bridge], [Outro].

RULES:
1. Detect repeated blocks — a block of lines that repeats is the [Chorus].
2. Non-repeating story blocks are verses ([Verse 1], [Verse 2]...).
3. A short line group before a repeating chorus may be a [Pre-Chorus].
4. A different-feeling block near the end is often a [Bridge].
5. Keep the EXACT original text and line order. Do NOT rewrite, translate, or change any words.
6. Only ADD tags on their own lines above each section. Add a blank line between sections.
7. If the lyrics already have some tags, keep them and fill in missing ones.
8. Output ONLY the tagged lyrics. No explanations.

Lyrics:
${src}`;
    try {
      const out = await callAI(prompt);
      if (out?.trim()) setSrc(out.trim());
      else setErr(t.errCon);
    } catch (e) {
      let m = String(e?.message || e); if (m.length > 90) m = m.slice(0, 90) + "...";
      setErr(m);
    }
    setAutoStructuring(false);
  };

  const addSavedStyle = () => {
    if (!custSty.trim()) return;
    const id = "custom_" + Date.now();
    const label = custSty.trim().length > 30 ? custSty.trim().slice(0, 30) + "..." : custSty.trim();
    setSavedSty(prev => [...prev, { id, label, prompt: custSty.trim() }]);
    setCustSty("");
  };

  const removeSavedStyle = (id) => {
    setSavedSty(prev => prev.filter(s => s.id !== id));
    setSelSty(prev => prev.filter(x => x !== id));
    (async () => { try { await localSet("saved-styles", JSON.stringify(savedSty.filter(s => s.id !== id))); } catch {} })();
  };

  const updateSavedStyleLabel = (id) => {
    if (!editStyLabel.trim()) { setEditStyId(null); return; }
    setSavedSty(prev => prev.map(s => s.id === id ? { ...s, label: editStyLabel.trim() } : s));
    setEditStyId(null);
    setEditStyLabel("");
  };

  useEffect(() => { try { localStorage.setItem("sunoprep-active-tab", activeTab); } catch {} }, [activeTab]);

  /* ── כפתור החזרה של הטלפון (דרישת חובה, חלק א׳ סעיף 1 במסמך הדרישות) ──
     סדר: מדריך / תפריט שפה פתוחים → נסגרים · מסך פנימי → למסך שממנו הגיעו ·
     לשונית שאינה "כתיבה" → "כתיבה" · בבית → "לחץ שוב כדי לצאת" (יציאה רק בלחיצה שנייה תוך 2 שניות). */
  const navRef = useRef({});
  navRef.current = { scr, activeTab, guide, showLangMenu };
  const scrTrail = useRef(["home"]);
  const [exitHint, setExitHint] = useState(false);
  useEffect(() => {
    const tr = scrTrail.current;
    if (scr === "home") scrTrail.current = ["home"]; else if (tr[tr.length - 1] !== scr) tr.push(scr);
  }, [scr]);
  const backTarget = () => {
    const tr = scrTrail.current;
    return tr.length > 1 && tr[tr.length - 2] !== "home" ? tr[tr.length - 2] : "home";
  };
  const goBackScr = () => {
    const tr = scrTrail.current;
    const target = backTarget();
    if (target === "home") scrTrail.current = ["home"]; else tr.pop();
    setScr(target);
  };
  useEffect(() => {
    let guard = false, armed = false, timer = null;
    // Chrome מדלג על רשומות היסטוריה שנוספו לפני אינטראקציה של המשתמש — לכן "השומר" נוסף רק אחרי הנגיעה הראשונה
    const active = () => !navigator.userActivation || navigator.userActivation.hasBeenActive;
    const sync = () => { if (!armed && !guard && active()) { try { window.history.pushState({ g: 1 }, ""); guard = true; } catch (e) {} } };
    const onFirstTouch = () => { sync(); if (guard) { window.removeEventListener("pointerdown", onFirstTouch, true); window.removeEventListener("keydown", onFirstTouch, true); } };
    window.addEventListener("pointerdown", onFirstTouch, true);
    window.addEventListener("keydown", onFirstTouch, true);
    const onPop = () => {
      guard = false;
      const s = navRef.current;
      if (s.guide) setGuide(false);
      else if (s.showLangMenu) setShowLangMenu(false);
      else if (s.scr !== "home") goBackScr();
      else if (s.activeTab !== "write") setActiveTab("write");
      else {
        armed = true; setExitHint(true);
        timer = setTimeout(() => { armed = false; setExitHint(false); sync(); }, 2000);
        return;
      }
      sync();
    };
    sync();
    window.addEventListener("popstate", onPop);
    return () => { window.removeEventListener("popstate", onPop); window.removeEventListener("pointerdown", onFirstTouch, true); window.removeEventListener("keydown", onFirstTouch, true); if (timer) clearTimeout(timer); };
  }, []);
  /* ── מגבלות תווים של Suno (הפרופיל נבחר ידנית; המספרים משתנים בין גרסאות ולכן לא נעולים בקוד) ── */
  const SUNO_LIMITS = { v4: { lyr: 3000, sty: 200, label: "v4 / v3.5" }, v45: { lyr: 5000, sty: 1000, label: "v4.5 / v5" } };
  const [limProf, setLimProf] = useState(() => { try { return localStorage.getItem("sunoprep_limit_profile") || "v45"; } catch (e) { return "v45"; } });
  useEffect(() => { try { localStorage.setItem("sunoprep_limit_profile", limProf); } catch (e) {} }, [limProf]);
  const PRESS_AGAIN = { he: "לחץ שוב כדי לצאת", en: "Press back again to exit", ru: "Нажмите «назад» ещё раз для выхода", es: "Pulsa atrás otra vez para salir", ar: "اضغط رجوع مرة أخرى للخروج" };
  const exitToast = exitHint ? (
    <div style={{ position: "fixed", bottom: 28, left: "50%", transform: "translateX(-50%)", background: "#222", color: "#fff", padding: "10px 18px", borderRadius: 22, fontSize: 13, zIndex: 9999, boxShadow: "0 4px 14px rgba(0,0,0,.4)", pointerEvents: "none" }}>
      {PRESS_AGAIN[uLang] || PRESS_AGAIN.en}
    </div>
  ) : null;

  const B = ({ children, onClick, pri, act, dis, sm, sx }) => (
    <button onClick={onClick} disabled={dis} style={{
      background: pri ? c.a : act ? `${c.a}22` : "transparent",
      color: pri ? onA : act ? ca : tx,
      border: pri ? "none" : `1px solid ${act ? c.a : bd}`,
      padding: sm ? "5px 10px" : pri ? "12px 24px" : "8px 14px",
      borderRadius: 10, cursor: dis ? "not-allowed" : "pointer",
      fontSize: sm ? 12 : pri ? 15 : 13, fontWeight: pri ? 600 : 400,
      fontFamily: "inherit", opacity: dis ? 0.5 : 1, transition: "all .15s", ...sx,
    }}>{children}</button>
  );

  /* ═══ רכיבי עיצוב של אולפן השירים ═══ */
  const Chip = ({ on, onClick, children, dis }) => (
    <button onClick={onClick} disabled={dis} style={{
      padding: "7px 12px", borderRadius: 20, fontSize: 13, fontFamily: "inherit", cursor: dis ? "not-allowed" : "pointer",
      border: `1px solid ${on ? c.a : bd}`, background: on ? c.a : bg, color: on ? onA : tx, fontWeight: on ? 700 : 400,
      opacity: dis ? 0.5 : 1, transition: "all .15s", lineHeight: 1.3, minHeight: 36,
    }}>{children}</button>
  );
  const stepCard = { marginTop: 12, padding: 14, borderRadius: 16, background: cd, border: `1px solid ${bd}` };
  const stepHead = { display: "flex", alignItems: "center", gap: 8, fontWeight: 800, fontSize: 16, color: tx };
  const stepNum = { width: 26, height: 26, borderRadius: "50%", display: "inline-grid", placeItems: "center", fontSize: 13, fontWeight: 800, background: c.a, color: onA, flexShrink: 0 };
  const chipLabel = { fontSize: 12, fontWeight: 700, color: sb, marginTop: 12, marginBottom: 6 };
  const chipRow = { display: "flex", gap: 6, flexWrap: "wrap" };

  const renderLineTools = (idx) => {
    const lt = lineTool && lineTool.idx === idx ? lineTool : null;
    return <div style={{ margin: "4px 4px 8px", padding: 9, borderRadius: 10, background: cd, border: `1px solid ${c.a}66` }}>
      <div style={chipRow}>
        <Chip dis={lt?.loading} on={lt?.kind === "alt"} onClick={() => lineTask(idx, "alt")}>🔁 3 חלופות</Chip>
        <Chip dis={lt?.loading} on={lt?.kind === "short"} onClick={() => lineTask(idx, "short")}>✂️ קצר</Chip>
        <Chip dis={lt?.loading} on={lt?.kind === "rhyme"} onClick={() => lineTask(idx, "rhyme")}>🎯 חרוזים</Chip>
        <Chip onClick={() => { setIdeaEdit(true); setLineSel(null); }}>✏️ ערוך ידנית</Chip>
      </div>
      {lt?.loading && <div style={{ fontSize: 12, color: ca, marginTop: 8 }}>⏳ חושב...</div>}
      {lt?.err && <div style={{ fontSize: 12, color: "#e0a03a", marginTop: 8 }}>⚠️ {lt.err}</div>}
      {lt && !lt.loading && lt.options.length > 0 && (lt.kind === "rhyme"
        ? <div style={{ marginTop: 8 }}><div style={{ fontSize: 11, color: sb, marginBottom: 5 }}>חרוזים ל"{lt.last}" — לחץ כדי להעתיק:</div><div style={chipRow}>{lt.options.map(o => <Chip key={o} onClick={() => { try { navigator.clipboard && navigator.clipboard.writeText(o); } catch (e) {} }}>{o}</Chip>)}</div></div>
        : <div style={{ marginTop: 8, display: "grid", gap: 6 }}>{lt.options.map((o, k) => <button key={k} onClick={() => replaceLine(idx, o)} style={{ textAlign: "start", padding: "8px 10px", borderRadius: 9, border: `1px solid ${bd}`, background: bg, color: tx, fontFamily: "inherit", fontSize: 14, cursor: "pointer", display: "flex", justifyContent: "space-between", gap: 8 }}><span>{o}</span><span style={{ fontSize: 11, color: ca, flexShrink: 0 }}>החלף ↵</span></button>)}</div>)}
    </div>;
  };

  const renderDraftView = () => {
    let section = "";
    return ideaOut.split("\n").map((l, i) => {
      const tag = l.trim().match(/^\[(.+?)\]$/);
      if (tag) { section = tag[1]; return <div key={i} style={{ margin: i ? "12px 4px 5px" : "0 4px 5px" }}><span style={{ fontSize: 11, fontWeight: 700, color: ca, border: `1px solid ${c.a}66`, borderRadius: 20, padding: "2px 10px", background: `${c.a}14` }}>{sectionLabel(tag[1])} <span style={{ opacity: .6, fontWeight: 400 }}>· {tag[1]}</span></span></div>; }
      if (!l.trim()) return <div key={i} style={{ height: 6 }} />;
      const chorus = /chorus|hook|פזמון/i.test(section) && !/pre/i.test(section), open = lineSel === i;
      return <div key={i}>
        <div onClick={() => { setLineSel(open ? null : i); if (!open && lineTool?.idx !== i) setLineTool(null); }} style={{ padding: "5px 9px", borderRadius: 8, cursor: "pointer", fontSize: 15, lineHeight: 1.55, color: tx, display: "flex", justifyContent: "space-between", gap: 8,
          background: open ? `${c.a}26` : chorus ? `${c.a}0f` : "transparent", borderInlineStart: `3px solid ${chorus || open ? c.a : "transparent"}`, fontWeight: chorus ? 600 : 400 }}>
          <span>{l}</span><span style={{ fontSize: 10, color: sb, flexShrink: 0, alignSelf: "center" }}>{countSyllables(l)}</span>
        </div>
        {open && renderLineTools(i)}
      </div>;
    });
  };

  /* פאנל סדנת השיפור — משותף ללשונית רעיונות ("idea") וללשונית כתיבה ("write") */
  const renderRefinePanel = (target) => {
    const own = target === "write";
    const st = refineState && refineState.target === target ? refineState : null;
    const rr = refineResult && refineResult.target === target ? refineResult : null;
    const busy = refineBusy || (!own && ideaLoading);
    return <div style={{marginTop:9,padding:10,borderRadius:10,border:`1px solid ${c.a}66`,background:`${c.a}0d`}}>
      <div style={{fontWeight:800,color:tx,fontSize:13}}>🎻 {own ? "שפר את השיר שכתבת — מבקר · משפר" : "סדנת שיפור אוטומטית — כותב · מבקר · משפר"}</div>
      <div style={{fontSize:11,color:sb,marginTop:3,lineHeight:1.5}}>{own
        ? "מבקר AI נותן ציון ורשימת חולשות, ועורך AI מתקן רק את מה שצריך — שומר על המילים והסגנון שלך. הגרסה החדשה נכנסת רק אם הציון באמת עלה, ואפשר תמיד להחזיר את המקור."
        : "מבקר AI נותן ציון ורשימת חולשות, כותב AI מתקן לפיה, והגרסה החדשה נשמרת רק אם הציון באמת עלה. כל גרסה שהתקבלה נכנסת להיסטוריית הגרסאות."}</div>
      <div style={{display:"flex",gap:6,marginTop:7,flexWrap:"wrap",alignItems:"center"}}>
        {own && <select value={ideaGenderMode} disabled={busy} onChange={e=>setIdeaGenderMode(e.target.value)} title="מי שר למי" style={{padding:7,borderRadius:8,border:`1px solid ${bd}`,background:bg,color:tx}}><option>👨➡️👩 גבר שר לאישה</option><option>👩➡️👨 אישה שרה לגבר</option><option>👨➡️👨 גבר שר לגבר</option><option>👩➡️👩 אישה שרה לאישה</option><option>ניטרלי / ללא מגדר מוגדר</option></select>}
        <select value={refineRounds} disabled={busy} onChange={e=>{const n=Number(e.target.value);setRefineRounds(n);localStorage.setItem("sunoprep_refine_rounds",String(n));}} style={{padding:7,borderRadius:8,border:`1px solid ${bd}`,background:bg,color:tx}}>
          {[1,2,3].map(n=><option key={n} value={n}>{n} {n===1?"סבב":"סבבים"} · עד {1+2*n} קריאות AI</option>)}
        </select>
        <B sm pri onClick={()=>runAutoRefine(target,false)} dis={busy}>🎻 שפר אוטומטית</B>
        <B sm onClick={()=>runAutoRefine(target,true)} dis={busy}>🧐 ביקורת וציון בלבד</B>
        {st?.running && <B sm onClick={()=>{refineCancelRef.current=true;}}>⏹️ עצור אחרי השלב הנוכחי</B>}
        {own && <B sm onClick={continueSong} dis={busy||continueBusy}>{continueBusy?"⏳ כותב את ההמשך...":"✍️ כתוב לי את החלק הבא"}</B>}
        {own && srcBeforeRefine!=null && !st?.running && <B sm onClick={()=>{const cur=src;setSrc(srcBeforeRefine);setSrcBeforeRefine(cur);}}>↶ החזר / החלף לגרסה הקודמת</B>}
      </div>
      {st?.running && <div style={{marginTop:7,fontSize:12,color:ca,fontWeight:700}}>⏳ {st.stage==="rewrite" ? `סבב ${st.round}/${st.rounds}: ${own?"העורך":"הכותב"} מתקן לפי הביקורת...` : st.round===0 ? "המבקר קורא את השיר ונותן ציון..." : `סבב ${st.round}/${st.rounds}: המבקר בודק את הגרסה החדשה...`}{st.baseline!=null && ` · ציון התחלתי ${st.baseline}`}</div>}
      {st?.steps?.length>0 && <div style={{marginTop:6,display:"grid",gap:4}}>{st.steps.map((e,i)=><div key={i} style={{fontSize:11,padding:"5px 8px",borderRadius:7,background:bg,border:`1px solid ${e.accepted?c.a:bd}`,color:tx}}>
        {e.accepted?"✅":"↩️"} סבב {e.round}{e.after!=null?`: ${e.before} → ${e.after}`:""} — {e.reason}
      </div>)}</div>}
      {rr && !st?.running && <div style={{marginTop:8,padding:9,borderRadius:9,background:bg,border:`1px solid ${bd}`}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",gap:6,flexWrap:"wrap"}}>
          <b style={{color:tx}}>{rr.reviewOnly?"🧐 ציון המבקר":rr.improved?"🎉 השיר שופר":"השיר נשאר כמו שהוא"}</b>
          <span style={{fontSize:20,fontWeight:800,color:ca,direction:"ltr"}}>{rr.reviewOnly||!rr.improved?`${rr.finalScore}/10`:`${rr.initialScore} → ${rr.finalScore}`}</span>
        </div>
        {!rr.reviewOnly && !rr.improved && <div style={{fontSize:11,color:sb,marginTop:3}}>אף גרסה לא עברה את הציון של {own?"השיר":"הטיוטה"} שלך, אז לא שיניתי כלום. אפשר לנסות שוב (המבקר והכותב יוצאים שונים בכל פעם).</div>}
        <div style={{marginTop:7,display:"grid",gap:3}}>{Object.keys(SONG_CRITERIA).map(k=>{const v=rr.review.scores[k];return <div key={k} style={{display:"grid",gridTemplateColumns:"125px 1fr 28px",gap:6,alignItems:"center",fontSize:11,color:tx}}>
          <span>{SONG_CRIT_LABELS[k]}</span>
          <div style={{height:7,borderRadius:4,background:`${c.a}22`,overflow:"hidden"}}><div style={{width:`${(v||0)*10}%`,height:"100%",background:c.a}}/></div>
          <span style={{direction:"ltr",textAlign:"left"}}>{v==null?"–":v}</span>
        </div>;})}</div>
        {rr.review.verdict && <div style={{marginTop:7,fontSize:12,color:tx}}>💬 {rr.review.verdict}</div>}
        {rr.review.strengths.length>0 && <div style={{marginTop:6,fontSize:11,color:tx}}><b>👍 חוזקות:</b>{rr.review.strengths.map((x,i)=><div key={i}>• {x}</div>)}</div>}
        {rr.review.weaknesses.length>0 && <div style={{marginTop:6,fontSize:11,color:tx}}><b>🔧 מה עוד אפשר לשפר:</b>{rr.review.weaknesses.map((w,i)=><div key={i} style={{marginTop:2}}>• {w.where?<b>{w.where}: </b>:null}{w.problem}{w.fix?<span style={{color:sb}}> — {w.fix}</span>:null}</div>)}</div>}
        <div style={{fontSize:10,color:sb,marginTop:6}}>{rr.calls} קריאות AI בהרצה הזו · הציון הכולל מחושב באפליקציה לפי משקלות (פזמון כפול).</div>
      </div>}
    </div>;
  };

  /* ── GUIDE ── */
  if (guide) {
    const s = t.gSteps[gStep];
    return (
      <div style={{ background: bg, color: tx, minHeight: "100vh", direction: rtl ? "rtl" : "ltr", fontFamily: "'Segoe UI',sans-serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 30 }}>
        <div style={{ fontSize: 50, marginBottom: 16 }}>{s.i}</div>
        <div style={{ fontSize: 20, fontWeight: 600, color: ca, marginBottom: 8 }}>{s.t}</div>
        <div style={{ fontSize: 14, color: sb, marginBottom: 30, textAlign: "center", maxWidth: 300 }}>{s.d}</div>
        <div style={{ display: "flex", gap: 6, marginBottom: 24 }}>
          {t.gSteps.map((_, i) => <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: i === gStep ? c.a : bd }} />)}
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <B onClick={() => setGuide(false)}>{t.skip}</B>
          <B pri onClick={() => { if (gStep < t.gSteps.length - 1) setGStep(gStep + 1); else setGuide(false); }}>
            {gStep < t.gSteps.length - 1 ? t.next : t.done}
          </B>
        </div>
      </div>
    );
  }

  /* ── AI SETUP ── */
  if (scr === "aisetup") {
    const st = SETUP_STEPS[uLang] || SETUP_STEPS.en;
    const badgeColor = (bt) => bt === "free" ? { bg: "#0F6E5622", fg: "#3DAA7D" } : bt === "paid" ? { bg: `${c.a}22`, fg: c.a } : { bg: `${sb}22`, fg: sb };
    const Field = ({ label, value, onChange, ph, type, multiline }) => (
      <div style={{ marginBottom: 10 }}>
        <div style={{ fontSize: 12, color: tx, fontWeight: 500, marginBottom: 5 }}>{label}</div>
        {multiline ? (
          <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={ph} rows={3}
            style={{ width: "100%", background: bg, border: `1px solid ${bd}`, borderRadius: 8, padding: "9px 12px", color: tx, fontSize: 12, fontFamily: "monospace", direction: "ltr", textAlign: "left", resize: "vertical" }} />
        ) : (
          <input type={type || "text"} value={value} onChange={e => onChange(e.target.value)} placeholder={ph}
            style={{ width: "100%", background: bg, border: `1px solid ${bd}`, borderRadius: 8, padding: "9px 12px", color: tx, fontSize: 13, fontFamily: "inherit", direction: "ltr", textAlign: "left" }} />
        )}
      </div>
    );
    const Steps = ({ items }) => (
      <div style={{ display: "flex", flexDirection: "column", gap: 7, marginTop: 10 }}>
        {items.map((s, i) => (
          <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
            <span style={{ minWidth: 18, height: 18, borderRadius: "50%", background: `${c.a}20`, color: ca, fontSize: 10, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>{i + 1}</span>
            <span style={{ fontSize: 12, color: sb, lineHeight: 1.55 }}>{s}</span>
          </div>
        ))}
      </div>
    );
    return (
      <div style={{ background: bg, color: tx, minHeight: "100vh", direction: rtl ? "rtl" : "ltr", fontFamily: "'Segoe UI',sans-serif", padding: 20 }}>
        <B onClick={goBackScr}>{t.back}</B>
        <h2 style={{ fontSize: 20, fontWeight: 600, color: ca, margin: "14px 0 6px" }}>🔌 {st.title}</h2>

        <div style={{ background: `${c.a}0E`, border: `1px solid ${c.a}25`, borderRadius: 10, padding: "10px 13px", fontSize: 11.5, color: sb, lineHeight: 1.65, marginBottom: 16, maxWidth: 620 }}>
          {st.intro}
        </div>

        <div style={{ fontSize: 12, color: sb, marginBottom: 8 }}>{st.selectProvider}:</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 7, marginBottom: 16, maxWidth: 620 }}>
          {AI_PROVIDERS.map(p => {
            const on = selProvider === p.id;
            const bc = badgeColor(p.badgeType);
            const nm = typeof p.name === "string" ? p.name : (p.name[uLang] || p.name.en);
            return (
              <div key={p.id} onClick={() => { setSelProvider(p.id); setTestState(null); }}
                style={{ display: "flex", alignItems: "center", gap: 11, background: on ? `${c.a}12` : cd, border: `1px solid ${on ? c.a : bd}`, borderRadius: 11, padding: "11px 13px", cursor: "pointer", transition: "all .15s" }}>
                <div style={{ width: 36, height: 36, borderRadius: 9, background: on ? `${c.a}22` : bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{p.icon}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 500, color: on ? ca : tx }}>{nm}</div>
                  <div style={{ fontSize: 11, color: sb, marginTop: 2 }}>{p.desc[uLang] || p.desc.en}</div>
                </div>
                <span style={{ fontSize: 10, padding: "3px 9px", borderRadius: 11, background: bc.bg, color: bc.fg, fontWeight: 500, flexShrink: 0 }}>{p.badge[uLang] || p.badge.en}</span>
                {on && <span style={{ color: ca, fontSize: 15, flexShrink: 0 }}>✓</span>}
              </div>
            );
          })}
        </div>

        {selProvider && (
          <div style={{ background: cd, border: `1px solid ${bd}`, borderRadius: 12, padding: 15, maxWidth: 620, marginBottom: 14 }}>
            {selProvider === "gemini" && (<>
              <Field label={st.gemini.label} value={aiKeys.gemini} onChange={v => setAiKeys(k => ({ ...k, gemini: v }))} ph={st.gemini.ph} multiline />
              <div style={{ fontSize: 10.5, color: sb, marginTop: -4, marginBottom: 8 }}>
                {rtl ? "💡 אפשר להזין כמה מפתחות — אחד בכל שורה. כשנגמרת מכסה, האפליקציה עוברת לבא אוטומטית." : "💡 You can enter multiple keys — one per line. The app rotates automatically when a quota runs out."}
              </div>
              <div style={{ marginTop: 10, marginBottom: 6 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
                  <span style={{ fontSize: 12, color: tx, fontWeight: 500 }}>{rtl ? "מודל:" : "Model:"}</span>
                  <B sm onClick={async () => {
                    const keys = aiKeys.gemini.split(/[\n,;]+/).map(s => s.trim()).filter(Boolean);
                    if (!keys.length) return;
                    setRefreshingModels(true);
                    const m = await fetchGeminiModels(keys[0]);
                    if (m) { setLiveModels(m); if (!selModel) setSelModel(m[0]); }
                    setRefreshingModels(false);
                  }} sx={{ fontSize: 11 }}>
                    {refreshingModels ? (rtl ? "מרענן..." : "Refreshing...") : (rtl ? "🔄 רענן מודלים" : "🔄 Refresh models")}
                  </B>
                </div>
                <select value={selModel} onChange={e => setSelModel(e.target.value)}
                  style={{ width: "100%", background: bg, border: `1px solid ${bd}`, borderRadius: 8, padding: "8px 10px", color: tx, fontSize: 12, fontFamily: "inherit", direction: "ltr" }}>
                  <option value="">{rtl ? "אוטומטי (מומלץ)" : "Automatic (recommended)"}</option>
                  {(liveModels.length ? liveModels : GEMINI_MODELS).map(m => <option key={m} value={m}>{m}</option>)}
                </select>
                <div style={{ fontSize: 10, color: sb, marginTop: 4 }}>
                  {rtl ? "שמות מודלים מתיישנים. אם מתקבלת שגיאת 404 — לחץ רענן מודלים." : "Model names go stale. If you get a 404 error, click Refresh models."}
                </div>
              </div>
              <Steps items={st.gemini.steps} />
              <div style={{ marginTop: 11, padding: "9px 12px", background: "#0F6E5615", border: "1px solid #0F6E5635", borderRadius: 8, fontSize: 11.5, color: "#3DAA7D", lineHeight: 1.55 }}>{st.gemini.note}</div>
              <div style={{ marginTop: 9, display: "flex", gap: 12, flexWrap: "wrap" }}>
                <a href="https://aistudio.google.com" target="_blank" rel="noreferrer" style={{ color: ca, fontSize: 12 }}>→ aistudio.google.com</a>
                <a href="https://www.youtube.com/watch?v=Cl4XKgz6EJQ" target="_blank" rel="noreferrer" style={{ color: ca, fontSize: 12 }}>▶ {rtl ? "סרטון: איך להשיג מפתח חינם" : "Video: get a free key"}</a>
              </div>
            </>)}

            {selProvider === "claude" && (<>
              <Field label={st.claude.label} value={aiKeys.claude} onChange={v => setAiKeys(k => ({ ...k, claude: v }))} ph={st.claude.ph} type="password" />
              <Steps items={st.claude.steps} />
              <div style={{ marginTop: 9 }}><a href="https://console.anthropic.com" target="_blank" rel="noreferrer" style={{ color: ca, fontSize: 12 }}>→ console.anthropic.com</a></div>
            </>)}

            {selProvider === "openai" && (<>
              <Field label={st.openai.label} value={aiKeys.openai} onChange={v => setAiKeys(k => ({ ...k, openai: v }))} ph={st.openai.ph} type="password" />
              <Steps items={st.openai.steps} />
              <div style={{ marginTop: 9 }}><a href="https://platform.openai.com" target="_blank" rel="noreferrer" style={{ color: ca, fontSize: 12 }}>→ platform.openai.com</a></div>
            </>)}

            {selProvider === "device" && (<>
              <div style={{ fontSize: 13, fontWeight: 500, color: ca, marginBottom: 6 }}>{st.device.title}</div>
              <div style={{ fontSize: 12, color: sb, lineHeight: 1.65, marginBottom: 4 }}>{st.device.info}</div>
              <Steps items={st.device.steps} />
              <div style={{ marginTop: 13 }}>
                <Field label={st.device.urlLabel} value={aiKeys.deviceUrl} onChange={v => setAiKeys(k => ({ ...k, deviceUrl: v }))} ph="http://localhost:11434/v1" />
                <div style={{ fontSize: 10.5, color: sb, marginTop: -5 }}>{st.device.urlHint}</div>
              </div>
            </>)}

            {selProvider === "custom" && (<>
              <Field label={st.custom.label1} value={aiKeys.customUrl} onChange={v => setAiKeys(k => ({ ...k, customUrl: v }))} ph={st.custom.ph1} />
              <Field label={st.custom.label2} value={aiKeys.customKey} onChange={v => setAiKeys(k => ({ ...k, customKey: v }))} ph={st.custom.ph2} type="password" />
              <div style={{ fontSize: 11, color: sb }}>{st.custom.hint}</div>
            </>)}
          </div>
        )}

        {selProvider && (
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", maxWidth: 620 }}>
            <B pri onClick={saveAiSetup} sx={{ flex: 1, minWidth: 160 }}>{st.save}</B>
            <B onClick={testConnection} sx={{
              minWidth: 150,
              color: testState?.ok === true ? "#3DAA7D" : testState?.ok === false ? "#E55" : tx,
              borderColor: testState?.ok === true ? "#3DAA7D" : testState?.ok === false ? "#E55" : bd,
            }}>{testState ? testState.msg : st.test}</B>
          </div>
        )}

        {aiProvider && (
          <div style={{ marginTop: 16, maxWidth: 620 }}>
            <B onClick={disconnectAi} sx={{ color: "#E55", borderColor: "#E5555540", fontSize: 12 }}>
              {rtl ? "✕ נתק AI" : "✕ Disconnect AI"}
            </B>
          </div>
        )}
      </div>
    );
  }

  /* ── HISTORY ── */
  /* ── 📚 STYLE LIBRARY — מוצג בתוך לשונית "סגנונות" ── */
  const renderStyleLibrary = () => {
    const q = libQuery.trim().toLowerCase();
    const allTags = [...new Set(styleLib.flatMap(x => x.tags || []))].slice(0, 12);
    let list = styleLib.filter(x => libFilter === "all" || (libFilter === "fav" && (x.rating || 0) >= 4) || (libFilter === "try" && x.tryAgain) || (libFilter.startsWith("tag:") && (x.tags || []).includes(libFilter.slice(4))));
    if (q) list = list.filter(x => [x.name, x.style, x.notes, ...(x.tags || []), ...(x.songs || [])].join(" ").toLowerCase().includes(q));
    list = [...list].sort((a, b) => libSort === "rating" ? (b.rating || 0) - (a.rating || 0) : libSort === "name" ? a.name.localeCompare(b.name, "he") : (b.lastUsed || b.created || 0) - (a.lastUsed || a.created || 0));
    const fld = { width: "100%", marginTop: 4, padding: 10, borderRadius: 10, border: `1px solid ${bd}`, background: bg, color: tx, fontFamily: "inherit", fontSize: 14 };
    const lbl = { fontSize: 12, fontWeight: 700, color: sb, marginTop: 10 };
    const stars = (n, onSet) => <span style={{ display: "inline-flex", gap: 2, direction: "ltr" }}>{[1, 2, 3, 4, 5].map(k => <button key={k} onClick={onSet ? () => onSet(k === n ? 0 : k) : undefined} style={{ background: "transparent", border: "none", padding: 0, fontSize: onSet ? 22 : 15, cursor: onSet ? "pointer" : "default", color: k <= n ? "#F5B301" : bd, lineHeight: 1 }}>★</button>)}</span>;
    const linkify = (txt) => (txt || "").split(/\n+/).map(l => l.trim()).filter(Boolean).map((l, i) => /^https?:\/\//.test(l) ? <div key={i}><a href={l} target="_blank" rel="noopener noreferrer" style={{ color: ca, fontSize: 12, wordBreak: "break-all" }}>🔗 {l.replace(/^https?:\/\/(www\.)?/, "").slice(0, 48)}</a></div> : <div key={i} style={{ fontSize: 12, color: tx }}>{l}</div>);
    const E = libEdit;
    return (
      <div style={{ color: tx, direction: "rtl" }}>
        <div style={{ padding: "14px", borderRadius: 14, background: cd, border: `1px solid ${c.a}55` }}>
          <div style={{ fontWeight: 800, fontSize: 19, color: tx }}>📚 ספריית הסגנונות שלי</div>
          <div style={{ fontSize: 12, color: sb, marginTop: 3, lineHeight: 1.5 }}>כל סגנון שניסית בסונו — עם דירוג, הערות על מה יצא, קישורים לשירים, ו"לנסות שוב". לחיצה על ▶️ מחזירה את הסגנון בדיוק לבונה הסגנון.</div>
          <div style={{ display: "flex", gap: 6, marginTop: 10, flexWrap: "wrap" }}>
            <B sm pri onClick={() => openLibFromCurrent()} dis={!builtStyleNow()}>➕ שמור את הסגנון שבנוי עכשיו</B>
            <B sm onClick={() => { const e = newLibEntry(""); setLibEdit({ ...e, isNew: true, tagsText: "", songsText: e.songs.join(", ") }); }}>✍️ סגנון חדש (הדבקה)</B>
            {savedSty.length > 0 && <B sm onClick={importStarStyles}>⭐ ייבא מ"הסגנונות שלי"</B>}
          </div>
          {libMsg && <div style={{ marginTop: 8, fontSize: 12, color: ca }}>{libMsg}</div>}
        </div>

        {E && <div style={{ marginTop: 12, padding: 14, borderRadius: 16, background: cd, border: `2px solid ${c.a}` }}>
          <div style={{ fontWeight: 800, fontSize: 16, color: tx }}>{E.isNew ? "➕ סגנון חדש בספרייה" : "✏️ עריכת סגנון"}</div>
          <div style={lbl}>שם</div>
          <input value={E.name} onChange={ev => setLibEdit({ ...E, name: ev.target.value })} placeholder='למשל: "מזרחי חם עם עוד — יצא מעולה"' style={fld} />
          <div style={lbl}>טקסט הסגנון לסונו</div>
          <textarea dir="ltr" value={E.style} onChange={ev => setLibEdit({ ...E, style: ev.target.value })} placeholder="Mizrahi pop, oud, darbuka, warm male vocals, 95 BPM" style={{ ...fld, minHeight: 70, textAlign: "left", fontFamily: "monospace", fontSize: 13 }} />
          <div style={lbl}>כמה אהבתי את מה שיצא</div>
          <div style={{ marginTop: 4 }}>{stars(E.rating || 0, n => setLibEdit({ ...E, rating: n }))}</div>
          <label style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10, fontSize: 13, color: tx, cursor: "pointer" }}><input type="checkbox" checked={!!E.tryAgain} onChange={ev => setLibEdit({ ...E, tryAgain: ev.target.checked })} style={{ width: 18, height: 18, accentColor: c.a }} />🧪 רוצה לנסות אותו שוב בעתיד</label>
          <div style={lbl}>הערות — מה יצא טוב? מה לשנות בפעם הבאה?</div>
          <textarea value={E.notes} onChange={ev => setLibEdit({ ...E, notes: ev.target.value })} placeholder="למשל: הקול יצא מושלם, אבל הקצב מהיר מדי. בפעם הבאה 85 BPM. עובד הכי טוב עם עברית מנוקדת." style={{ ...fld, minHeight: 80, resize: "vertical", lineHeight: 1.5 }} />
          <div style={lbl}>תגיות (מופרדות בפסיק)</div>
          <input value={E.tagsText} onChange={ev => setLibEdit({ ...E, tagsText: ev.target.value })} placeholder="מזרחי, חתונה, קצבי" style={fld} />
          <div style={lbl}>שירים שעשיתי איתו (מופרדים בפסיק)</div>
          <input value={E.songsText} onChange={ev => setLibEdit({ ...E, songsText: ev.target.value })} placeholder="רק מילה, התחנה האחרונה" style={fld} />
          <div style={lbl}>קישורים לשירים בסונו / יוטיוב (שורה לכל קישור)</div>
          <textarea dir="ltr" value={E.links} onChange={ev => setLibEdit({ ...E, links: ev.target.value })} placeholder="https://suno.com/song/..." style={{ ...fld, minHeight: 54, textAlign: "left", fontSize: 12 }} />
          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <B pri onClick={saveLibEdit} sx={{ flex: 1 }}>💾 שמור</B>
            <B onClick={() => setLibEdit(null)}>ביטול</B>
          </div>
        </div>}

        {styleLib.length > 0 && <div style={{ marginTop: 12 }}>
          <input value={libQuery} onChange={ev => setLibQuery(ev.target.value)} placeholder="🔍 חיפוש בשם, בסגנון, בהערות או בתגיות" style={{ ...fld, marginTop: 0 }} />
          <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
            <Chip on={libFilter === "all"} onClick={() => setLibFilter("all")}>הכל ({styleLib.length})</Chip>
            <Chip on={libFilter === "fav"} onClick={() => setLibFilter("fav")}>❤️ אהבתי (4★+)</Chip>
            <Chip on={libFilter === "try"} onClick={() => setLibFilter("try")}>🧪 לנסות שוב</Chip>
            {allTags.map(tg => <Chip key={tg} on={libFilter === "tag:" + tg} onClick={() => setLibFilter("tag:" + tg)}>#{tg}</Chip>)}
          </div>
          <div style={{ display: "flex", gap: 6, marginTop: 8, alignItems: "center", fontSize: 12, color: sb }}>מיון:
            {[["recent", "אחרון"], ["rating", "דירוג"], ["name", "שם"]].map(([k, l]) => <Chip key={k} on={libSort === k} onClick={() => setLibSort(k)}>{l}</Chip>)}
          </div>
        </div>}

        {styleLib.length === 0 && !E && <div style={{ marginTop: 14, padding: 18, borderRadius: 16, border: `1px dashed ${bd}`, textAlign: "center", color: sb, fontSize: 13, lineHeight: 1.6 }}>
          <div style={{ fontSize: 34 }}>🎼</div>
          עוד אין סגנונות בספרייה.<br />בנה סגנון למעלה ולחץ "📚 שמור לספרייה", או הדבק כאן סגנון שעבד לך בסונו.
        </div>}
        {styleLib.length > 0 && list.length === 0 && <div style={{ marginTop: 14, color: sb, fontSize: 13, textAlign: "center" }}>לא נמצאו סגנונות לחיפוש הזה.</div>}

        <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
          {list.map(x => <div key={x.id} style={{ padding: 13, borderRadius: 14, background: cd, border: `1px solid ${x.rating >= 4 ? c.a + "88" : bd}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "flex-start" }}>
              <div style={{ fontWeight: 800, fontSize: 15, color: tx, lineHeight: 1.35 }}>{x.tryAgain ? "🧪 " : ""}{x.name}</div>
              {stars(x.rating || 0, n => updateLib(x.id, { rating: n }))}
            </div>
            <div dir="ltr" style={{ marginTop: 7, padding: "7px 9px", borderRadius: 8, background: bg, border: `1px solid ${bd}`, fontFamily: "monospace", fontSize: 12, color: tx, textAlign: "left", lineHeight: 1.45 }}>{x.style}</div>
            {x.notes && <div style={{ marginTop: 7, fontSize: 13, color: tx, whiteSpace: "pre-wrap", lineHeight: 1.5 }}>📝 {x.notes}</div>}
            {(x.tags || []).length > 0 && <div style={{ display: "flex", gap: 4, marginTop: 7, flexWrap: "wrap" }}>{x.tags.map(tg => <span key={tg} style={{ fontSize: 11, padding: "2px 8px", borderRadius: 20, background: `${c.a}18`, color: ca }}>#{tg}</span>)}</div>}
            {(x.songs || []).length > 0 && <div style={{ marginTop: 6, fontSize: 12, color: sb }}>🎵 {x.songs.join(" · ")}</div>}
            {x.links && <div style={{ marginTop: 5 }}>{linkify(x.links)}</div>}
            <div style={{ marginTop: 6, fontSize: 10, color: sb }}>{x.uses ? `שימש ${x.uses} פעמים · ` : ""}{x.lastUsed ? `לאחרונה ${new Date(x.lastUsed).toLocaleDateString("he-IL")}` : `נשמר ${new Date(x.created).toLocaleDateString("he-IL")}`}</div>
            <div style={{ display: "flex", gap: 6, marginTop: 9, flexWrap: "wrap" }}>
              <B sm pri onClick={() => applyLibStyle(x)}>▶️ השתמש עכשיו</B>
              <B sm onClick={() => { try { navigator.clipboard && navigator.clipboard.writeText(x.style); setLibMsg(`📋 הועתק: ${x.name}`); } catch (e) {} }}>📋 העתק</B>
              <B sm onClick={() => editLib(x)}>✏️ ערוך / הערות</B>
              <B sm onClick={() => styleVariations(x)} dis={libVar?.loading}>{libVar?.id === x.id && libVar.loading ? "⏳ חושב..." : "🧪 3 וריאציות"}</B>
              <B sm onClick={() => updateLib(x.id, { tryAgain: !x.tryAgain })}>{x.tryAgain ? "✓ ברשימת הניסיון" : "🧪 לנסות שוב"}</B>
              <button onClick={() => deleteLib(x)} title="מחק" style={{ background: "transparent", border: "none", color: "#E55", cursor: "pointer", fontSize: 14 }}>🗑️</button>
            </div>
            {libVar?.id === x.id && !libVar.loading && libVar.options.length > 0 && <div style={{ marginTop: 9, display: "grid", gap: 7 }}>
              {libVar.options.map((v, k) => <div key={k} style={{ padding: 9, borderRadius: 10, background: bg, border: `1px solid ${bd}` }}>
                <div dir="ltr" style={{ fontFamily: "monospace", fontSize: 12, color: tx, textAlign: "left" }}>{v.style}</div>
                {v.why && <div style={{ fontSize: 12, color: sb, marginTop: 4 }}>{v.why}</div>}
                <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
                  <B sm onClick={() => { const e = newLibEntry(v.style, { name: `${x.name} · וריאציה ${k + 1}`, tags: x.tags || [], tryAgain: true, notes: v.why ? `וריאציה של "${x.name}": ${v.why}` : "", songs: [] }); setStyleLib(prev => [e, ...prev]); setLibMsg(`✅ נשמרה וריאציה ${k + 1} (מסומנת "לנסות שוב")`); }}>💾 שמור כסגנון חדש</B>
                  <B sm onClick={() => applyLibStyle({ id: "_tmp", style: v.style })}>▶️ נסה עכשיו</B>
                </div>
              </div>)}
            </div>}
          </div>)}
        </div>
      </div>
    );
  };

  if (scr === "history") return (
    <div style={{ background: bg, color: tx, minHeight: "100vh", direction: rtl ? "rtl" : "ltr", fontFamily: "'Segoe UI',sans-serif", padding: 24 }}>
      <B onClick={goBackScr}>{t.back}</B>
      <h2 style={{ fontSize: 20, fontWeight: 600, color: ca, margin: "16px 0" }}>📜 {rtl ? "היסטוריה" : "History"}</h2>
      {history.length === 0 && <div style={{ color: sb, fontSize: 13 }}>{rtl ? "אין שירים שמורים עדיין" : "No saved songs yet"}</div>}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {history.map(h => (
          <div key={h.id} style={{ background: cd, border: `1px solid ${bd}`, borderRadius: 10, padding: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <div>
                <span style={{ fontSize: 13, fontWeight: 500, color: ca }}>{h.title}</span>
                <span style={{ fontSize: 10, color: sb, marginInlineStart: 8 }}>{h.date} · {h.mode}</span>
              </div>
              <div style={{ display: "flex", gap: 4 }}>
                <B sm onClick={() => loadFromHistory(h)}>📂 {rtl ? "טען" : "Load"}</B>
                <button onClick={() => deleteFromHistory(h.id)} style={{ background: "transparent", border: "none", color: "#E55", cursor: "pointer", fontSize: 12 }}>✕</button>
              </div>
            </div>
            <div style={{ fontSize: 11, color: sb, maxHeight: 40, overflow: "hidden", direction: "ltr", fontFamily: "monospace" }}>
              {(h.res || h.src || "").slice(0, 100)}...
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  /* ── WORD DICTIONARY ── */
  if (scr === "worddict") return (
    <div style={{ background: bg, color: tx, minHeight: "100vh", direction: rtl ? "rtl" : "ltr", fontFamily: "'Segoe UI',sans-serif", padding: 24 }}>
      <B onClick={goBackScr}>{t.back}</B>
      <h2 style={{ fontSize: 20, fontWeight: 600, color: ca, margin: "16px 0" }}>📖 {rtl ? "מילון מילים בעייתיות" : "Problem Words Dictionary"}</h2>
      <div style={{ fontSize: 12, color: sb, marginBottom: 16, lineHeight: 1.6 }}>
        {rtl ? "כשאתה מתקן מילה בתוצאה, לחץ עליה כאן כדי לשמור את התיקון. בפעם הבאה האפליקציה תזכור." : "When you fix a word in the result, save the correction here. The app will remember it next time."}
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <input id="wd-orig" placeholder={rtl ? "מילה מקורית..." : "Original word..."} style={{ flex: 1, background: bg, border: `1px solid ${bd}`, borderRadius: 8, padding: "8px 12px", color: tx, fontSize: 13, fontFamily: "inherit" }} />
        <input id="wd-fix" placeholder={rtl ? "תיקון..." : "Fixed version..."} dir="ltr" style={{ flex: 1, background: bg, border: `1px solid ${bd}`, borderRadius: 8, padding: "8px 12px", color: tx, fontSize: 13, fontFamily: "inherit" }} />
        <B sm onClick={() => {
          const o = document.getElementById("wd-orig")?.value;
          const f = document.getElementById("wd-fix")?.value;
          if (o && f) { saveWordFix(o, f); document.getElementById("wd-orig").value = ""; document.getElementById("wd-fix").value = ""; }
        }} sx={{ whiteSpace: "nowrap" }}>➕ {rtl ? "הוסף" : "Add"}</B>
      </div>
      {Object.keys(wordDict).length === 0 && <div style={{ color: sb, fontSize: 13 }}>{rtl ? "המילון ריק" : "Dictionary is empty"}</div>}
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {Object.entries(wordDict).map(([orig, fix]) => (
          <div key={orig} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: cd, border: `1px solid ${bd}`, borderRadius: 8, padding: "8px 12px" }}>
            <div style={{ fontSize: 13 }}>
              <span style={{ color: "#E55" }}>{orig}</span>
              <span style={{ color: sb, margin: "0 8px" }}>→</span>
              <span style={{ color: "#4CAF50" }}>{fix}</span>
            </div>
            <button onClick={() => removeWordFix(orig)} style={{ background: "transparent", border: "none", color: "#E55", cursor: "pointer", fontSize: 12 }}>✕</button>
          </div>
        ))}
      </div>
    </div>
  );

  /* ── ABOUT ── */
  if (scr === "about") {
    const infoRow = (label, val) => (
      <div style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: `1px solid ${bd}`, fontSize: 12.5 }}>
        <span style={{ color: sb }}>{label}</span><span style={{ color: tx }}>{val}</span>
      </div>
    );
    return (
    <div style={{ background: bg, color: tx, minHeight: "100vh", direction: rtl ? "rtl" : "ltr", fontFamily: "'Segoe UI',sans-serif", padding: 24 }}>
      <B onClick={goBackScr}>{t.back}</B>
      <div style={{ textAlign: "center", padding: "34px 0 20px" }}>
        <div style={{ fontSize: 50, marginBottom: 12 }}>🎤</div>
        <div style={{ fontSize: 28, fontWeight: 700, color: ca }}>SunoPrep</div>
        <div style={{ fontSize: 13, color: sb }}>{t.ver}</div>
      </div>
      <div style={{ maxWidth: 500, margin: "0 auto" }}>
        <div style={{ fontSize: 13, color: sb, marginBottom: 22, lineHeight: 1.8, whiteSpace: "pre-wrap", textAlign: rtl ? "right" : "left" }}>{t.aboutTxt}</div>

        <div style={{ background: cd, border: `1px solid ${bd}`, borderRadius: 12, padding: "6px 16px", marginBottom: 16 }}>
          {infoRow(rtl ? "גרסה" : "Version", "9.3")}
          {infoRow(rtl ? "פותח" : "Developer", "Barak Aflalo")}
          {infoRow(rtl ? "פלטפורמה" : "Platform", "PWA · HTML5")}
          {infoRow(rtl ? "אחסון נתונים" : "Data storage", rtl ? "על המכשיר בלבד" : "On device only")}
          {infoRow(rtl ? "רישיון" : "License", "© AppNest 2026")}
          {infoRow(rtl ? "השראה" : "Inspired by", "PaperOrchestra (Google Research, Apache-2.0) · AG-UI (MIT)")}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <B onClick={() => { if (navigator.share) navigator.share({ title: "SunoPrep", text: t.shareMsg, url: location.href }).catch(()=>{}); else copy(location.href, "share"); }}>
            📤 {rtl ? "שתף את האפליקציה" : "Share the app"}
          </B>
          <B onClick={() => window.open("mailto:appnest55@gmail.com?subject=SunoPrep Feedback")}>
            ✉️ {rtl ? "שלח משוב" : "Send feedback"}
          </B>
          <B onClick={() => window.open("https://appnest-store.pages.dev", "_blank")}>
            🏪 {rtl ? "חנות AppNest" : "AppNest Store"}
          </B>
          <B onClick={() => { setGStep(0); setGuide(true); }}>📖 {t.guide}</B>
          <B onClick={() => window.open("privacy_policy.html", "_blank")}>
            🔒 {rtl ? "מדיניות פרטיות" : "Privacy Policy"}
          </B>
        </div>

        <div style={{ marginTop: 18, padding: "11px 14px", background: `${c.a}0C`, border: `1px solid ${c.a}25`, borderRadius: 10, fontSize: 11, color: sb, lineHeight: 1.65 }}>
          ⚠️ {rtl
            ? "SunoPrep הוא כלי עזר. התעתיקים והצעות הבינה הם הערכות בלבד. פיצ'רי הבינה שולחים את הטקסט לספק שבחרת."
            : "SunoPrep is a helper tool. Transliterations and AI suggestions are estimates only. AI features send your text to the provider you chose."}
        </div>

        <div style={{ textAlign: "center", fontSize: 11, color: sb, marginTop: 20 }}>© AppNest 2026</div>
      </div>
    </div>
    );
  }

  /* ── SETTINGS ── */
  if (scr === "settings") {
    const Card = ({ label, children }) => (
      <div style={{ background: cd, border: `1px solid ${bd}`, borderRadius: 12, padding: 14 }}>
        <div style={{ fontSize: 12, color: sb, marginBottom: 6 }}>{label}</div>
        {children}
      </div>
    );
    return (
      <div style={{ background: bg, color: tx, minHeight: "100vh", direction: rtl ? "rtl" : "ltr", fontFamily: "'Segoe UI',sans-serif", padding: 24 }}>
        <B onClick={goBackScr}>{t.back}</B>
        <h2 style={{ fontSize: 20, fontWeight: 600, color: ca, margin: "16px 0" }}>⚙ {t.settings}</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 500 }}>
          {/* AI Connection */}
          <div onClick={() => setScr("aisetup")} style={{ background: aiProvider ? "#0F6E5612" : `${c.a}12`, border: `1px solid ${aiProvider ? "#0F6E5640" : `${c.a}30`}`, borderRadius: 12, padding: 14, cursor: "pointer" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: 9, background: aiProvider ? "#0F6E5622" : `${c.a}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, flexShrink: 0 }}>
                {aiProvider ? (AI_PROVIDERS.find(p => p.id === aiProvider)?.icon || "🔌") : "🔌"}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13.5, fontWeight: 500, color: aiProvider ? okC : ca }}>
                  {(SETUP_STEPS[uLang] || SETUP_STEPS.en).title}
                </div>
                <div style={{ fontSize: 11, color: sb, marginTop: 2 }}>
                  {aiProvider
                    ? `${(SETUP_STEPS[uLang] || SETUP_STEPS.en).connected} · ${(() => { const pr = AI_PROVIDERS.find(p => p.id === aiProvider); return pr ? (typeof pr.name === "string" ? pr.name : (pr.name[uLang] || pr.name.en)) : aiProvider; })()}`
                    : (rtl ? "לא מחובר — לוחצים כאן לחיבור (יש אופציה חינמית!)" : "Not connected — tap to connect (free option available!)")}
                </div>
              </div>
              <span style={{ color: sb, fontSize: 15 }}>{rtl ? "‹" : "›"}</span>
            </div>
          </div>


          <Card label={t.uname}>
            <input value={uname} onChange={e => setUname(e.target.value)} placeholder={t.unamePh}
              style={{ width: "100%", background: bg, border: `1px solid ${bd}`, borderRadius: 8, padding: "7px 12px", color: tx, fontSize: 14, fontFamily: "inherit" }} />
          </Card>
          <Card label={t.uiLang}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {Object.entries(UI_LANGS).map(([k, v]) => <B key={k} sm act={uLang === k} onClick={() => setULang(k)}>{v}</B>)}
            </div>
          </Card>
          <Card label={t.theme}>
            <div style={{ display: "flex", gap: 10 }}>
              {Object.entries(TH).map(([k, v]) => (
                <div key={k} onClick={() => setTheme(k)} style={{
                  width: 34, height: 34, borderRadius: "50%", cursor: "pointer", background: v.a,
                  border: theme === k ? "3px solid #fff" : "3px solid transparent",
                }} />
              ))}
            </div>
          </Card>
          <Card label={t.dayNight}>
            <div style={{ display: "flex", gap: 8 }}>
              <B sm act={!day} onClick={() => setDay(false)}>🌙 {t.night}</B>
              <B sm act={day} onClick={() => setDay(true)}>☀️ {t.day}</B>
            </div>
          </Card>
          <Card label={t.speed}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <input type="range" min="0.5" max="2" step="0.1" value={rate}
                onChange={e => setRate(parseFloat(e.target.value))} style={{ flex: 1 }} />
              <span style={{ fontSize: 14, color: ca, direction: "ltr" }}>×{rate.toFixed(1)}</span>
            </div>
          </Card>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <B sm onClick={expBk}>📥 {t.expBk}</B>
            <B sm onClick={() => fileRef.current?.click()}>📤 {t.impBk}</B>
            <input ref={fileRef} type="file" accept=".json" onChange={impBk} style={{ display: "none" }} />
          </div>
          <B onClick={() => { setGStep(0); setGuide(true); }}>📖 {t.guide}</B>
          <B onClick={() => {
            if (delSt === 0) setDelSt(1);
            else { setSrc(""); setRes(""); setSelSty([]); setSelVocal([]); setCustSty(""); setBpmVal(0); setVCount(1); setDelSt(2); setTimeout(() => setDelSt(0), 2000); }
          }} sx={{ color: "#E55", borderColor: "#E5555555" }}>
            🗑 {delSt === 0 ? t.delAll : delSt === 1 ? t.delConf : t.deleted}
          </B>
        </div>
      </div>
    );
  }

  /* ── HOME ── */
  const TA = { width: "100%", minHeight: 180, background: bg, border: `1px solid ${bd}`, borderRadius: 10, padding: 14, color: tx, fontSize: 15, lineHeight: 1.8, resize: "vertical", fontFamily: "inherit" };
  return (
    <div style={{ background: bg, color: tx, minHeight: "100vh", direction: rtl ? "rtl" : "ltr", fontFamily: "'Segoe UI',sans-serif" }}>
      <style>{`textarea:focus,input:focus{outline:1px solid ${c.a}} @keyframes sp-p{0%,100%{opacity:1}50%{opacity:.4}} .sp-ld{animation:sp-p 1s infinite} .sp-tabs::-webkit-scrollbar{display:none}`}</style>
      {exitToast}

      {/* HEADER */}
      <div style={{ padding: "10px 16px", borderBottom: `1px solid ${bd}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 22 }}>🎤</span>
          <div>
            <span style={{ fontSize: 17, fontWeight: 700, color: ca }}>SunoPrep</span>
            <div style={{ fontSize: 9, color: sb }}>{t.appSub}</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
          <div onClick={() => setScr("aisetup")} title={(SETUP_STEPS[uLang] || SETUP_STEPS.en).title}
            style={{ display: "flex", alignItems: "center", gap: 4, padding: "4px 8px", borderRadius: 8, border: `1px solid ${aiProvider ? "#0F6E5650" : bd}`, background: aiProvider ? "#0F6E5615" : "transparent", cursor: "pointer" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: aiProvider ? "#3DAA7D" : sb, flexShrink: 0 }} />
            <span style={{ fontSize: 10, color: aiProvider ? "#3DAA7D" : sb, whiteSpace: "nowrap" }}>
              {aiProvider ? (AI_PROVIDERS.find(p => p.id === aiProvider)?.icon || "AI") : (rtl ? "חבר AI" : "Connect AI")}
            </span>
          </div>
          <div style={{ position: "relative" }}>
            <B sm onClick={() => setShowLangMenu(!showLangMenu)}>🌐</B>
            {showLangMenu && (
              <div style={{ position: "absolute", top: "100%", [rtl ? "right" : "left"]: 0, background: cd, border: `1px solid ${bd}`, borderRadius: 8, padding: 4, zIndex: 99, minWidth: 100, boxShadow: "0 4px 12px rgba(0,0,0,0.3)" }}>
                {Object.entries(UI_LANGS).map(([k, v]) => (
                  <div key={k} onClick={() => { setULang(k); setShowLangMenu(false); }}
                    style={{ padding: "6px 10px", fontSize: 12, color: uLang === k ? ca : tx, cursor: "pointer", borderRadius: 4, background: uLang === k ? `${c.a}15` : "transparent" }}>
                    {v}
                  </div>
                ))}
              </div>
            )}
          </div>
          <B sm onClick={() => setDay(!day)}>{day ? "🌙" : "☀️"}</B>
          <B sm onClick={() => setScr("settings")}>⚙</B>
          <B sm onClick={() => setScr("about")}>ℹ️</B>
        </div>
      </div>

      {/* TAB NAVIGATION — 3 per row */}
      <div style={{ padding:"10px 12px 0", maxWidth:700, margin:"0 auto" }}>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:8 }}>
          {[
            ["write","✍️ כתיבה"],
            ["ideas","✨ רעיונות"],
            ["styles","🎼 סגנונות"],
            ["checks","🎧 בדיקות"],
            ["projects","🗂️ פרויקטים"],
            ["suno","🎵 Suno"]
          ].map(([id,label]) => (
            <button key={id} onClick={() => setActiveTab(id)} style={{ padding:"11px 8px", borderRadius:11, border:`1.5px solid ${activeTab===id?c.a:bd}`, background:activeTab===id?`${c.a}22`:cd, color:activeTab===id?ca:tx, fontSize:13, fontWeight:activeTab===id?700:500, cursor:"pointer", fontFamily:"inherit", textAlign:"center" }}>{label}</button>
          ))}
        </div>
      </div>

      <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 14, maxWidth: 700, margin: "0 auto" }}>

        {activeTab === "write" && <>
        {/* SOURCE */}
        <div style={{ background: cd, border: `1px solid ${bd}`, borderRadius: 14, padding: 14 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: ca }}>{t.srcTitle}</span>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <B sm act={speaking === "s"} onClick={() => speak(src, true)}>{speaking === "s" ? `⏹ ${t.stop}` : `▶ ${t.listen}`}</B>
              <input type="range" min="0.5" max="2" step="0.1" value={rate}
                onChange={e => setRate(parseFloat(e.target.value))}
                style={{ width: 70 }} title={t.speed} />
              <span style={{ fontSize: 11, color: ca, direction: "ltr", minWidth: 28 }}>×{rate.toFixed(1)}</span>
            </div>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 4 }}>
            <span style={{ fontSize: 10, color: sb, display: "flex", alignItems: "center" }}>{rtl ? "תבנית:" : "Template:"}</span>
            {TEMPLATES.map(tmpl => <B key={tmpl.id} sm onClick={() => insertTemplate(tmpl.t)} sx={{ fontSize: 11 }}>{tmpl.l}</B>)}
          </div>
          {aiProvider && src.trim() && (
            <div style={{ marginBottom: 6 }}>
              <B sm onClick={autoDetectStructure} dis={autoStructuring} sx={{ fontSize: 11, background: `${c.a}15`, color: ca, borderColor: `${c.a}50` }}>
                {autoStructuring ? (rtl ? "⏳ מזהה מבנה..." : "⏳ Detecting...") : (rtl ? "🪄 זהה מבנה אוטומטית" : "🪄 Auto-detect structure")}
              </B>
              <span style={{ fontSize: 9, color: sb, marginInlineStart: 6 }}>{rtl ? "מוסיף [בית]/[פזמון] לבד" : "adds [Verse]/[Chorus] tags"}</span>
            </div>
          )}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 4 }}>
            {TAGS.map(tag => <B key={tag} sm onClick={() => insertTag(tag)}>{tag}</B>)}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 8 }}>
            <span style={{ fontSize: 10, color: sb, display: "flex", alignItems: "center" }}>{rtl ? "קולות:" : "Vocals:"}</span>
            {VOICE_TAGS.map(vt => <B key={vt.l} sm onClick={() => insertTag(vt.l)} sx={{ fontSize: 11, borderStyle: "dashed" }}>{rtl ? vt.h : vt.l}</B>)}
          </div>
          <textarea ref={srcRef} dir={sl.d} value={src} onChange={e => setSrc(e.target.value)} placeholder={t.srcPh} style={TA} />
          {rtl && src.trim().length>20 && renderRefinePanel("write")}
          {tMode === "marknikud" && (
            <div style={{ marginTop: 6, padding: "9px 12px", background: `${c.a}0C`, border: `1px solid ${c.a}35`, borderRadius: 10 }}>
              <div style={{ fontSize: 11, color: sb, lineHeight: 1.6, marginBottom: 7 }}>
                {rtl ? "🎯 סמן מילה שסונו הרס: בחר אותה בטקסט (או שים את הסמן עליה) ולחץ הכפתור. אפשר גם להוסיף מקפים ידנית: ה-ח-ו-ל" : "Mark a word Suno mispronounced: select it (or place the cursor in it) and click the button. You can also add hyphens manually: ה-ח-ו-ל"}
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                <B sm onClick={() => {
                  const el = srcRef.current; if (!el) return;
                  let s = el.selectionStart, e = el.selectionEnd;
                  const txt = src;
                  // If nothing selected, expand to the word around the cursor
                  if (s === e) {
                    const isWordChar = (ch) => ch && /[\u0590-\u05FF]/.test(ch);
                    while (s > 0 && isWordChar(txt[s - 1])) s--;
                    while (e < txt.length && isWordChar(txt[e])) e++;
                  }
                  const word = txt.slice(s, e);
                  const letters = [...word].filter(ch => /[\u0590-\u05FF]/.test(ch));
                  if (letters.length < 2) return;
                  // Insert hyphens between Hebrew letters, keep existing nikud attached
                  let marked = "";
                  const chars = [...word];
                  for (let i = 0; i < chars.length; i++) {
                    marked += chars[i];
                    // after a Hebrew consonant (not nikud), if next real letter exists, add hyphen
                    if (/[\u05D0-\u05EA]/.test(chars[i])) {
                      let j = i + 1;
                      while (j < chars.length && /[\u0591-\u05C7]/.test(chars[j])) { marked += chars[j]; j++; i = j - 1; }
                      if (j < chars.length && /[\u05D0-\u05EA]/.test(chars[j])) marked += "-";
                    }
                  }
                  const next = txt.slice(0, s) + marked + txt.slice(e);
                  setSrc(next);
                }}>{rtl ? "➕ סמן את המילה שנבחרה" : "➕ Mark selected word"}</B>
                <B sm onClick={() => setSrc(src.replace(/([\u05D0-\u05EA])-(?=[\u05D0-\u05EA])/g, "$1"))}>
                  {rtl ? "🧽 נקה את כל הסימונים" : "🧽 Clear all marks"}
                </B>
              </div>
            </div>
          )}
          {src.trim() && (()=>{const words=src.replace(/\[[^\]]*\]/g," ").split(/\s+/).filter(Boolean);const issues=[];const ambiguous=["את","עם","על","שם","ספר","דרך","יכול","חוזר","אור","לב","שלום","מחר"];src.split("\n").forEach((ln,i)=>{const x=ln.trim();if(!x||/^\[.*\]$/.test(x))return;const wc=x.split(/\s+/).length;if(wc>14)issues.push({i,msg:`שורה ארוכה (${wc} מילים) — כדאי לבדוק זרימה`});if(/[A-Za-z]/.test(x)&&/[א-ת]/.test(x))issues.push({i,msg:"ערבוב עברית ואנגלית — כדאי לבדוק הגייה"});if(/(.)\1\1/.test(x))issues.push({i,msg:"אותיות חוזרות באופן חריג — בדוק שאין טעות"});const found=ambiguous.filter(w=>new RegExp(`(^|\\s)${w}($|\\s|[,.!?…])`).test(x));if(found.length)issues.push({i,msg:`מילים שעשויות להיות דו־משמעיות: ${found.join("، ")} — מומלץ להאזין`});const learned=Object.keys(wordDict||{}).filter(w=>x.includes(w));if(learned.length)issues.push({i,msg:`נמצאו מילים מהמילון האישי: ${learned.join("، ")} — אפשר לבדוק את ההגייה השמורה`});});return <div style={{marginTop:10,padding:12,background:cd,border:`1px solid ${c.a}`,borderRadius:12}}><div style={{fontWeight:700,color: ca}}>🔎 בדיקת הגייה חכמה</div><div style={{fontSize:11,color:sb,marginTop:4}}>הבדיקה מציעה מה לבדוק בלבד — היא לא משנה את המילים.</div>{issues.length?<div style={{display:"grid",gap:5,marginTop:8}}>{issues.map((q,k)=><div key={k} style={{fontSize:12,color:tx}}>🟡 שורה {q.i+1}: {q.msg}</div>)}</div>:<div style={{fontSize:12,marginTop:7,color:tx}}>✅ לא נמצאו אזהרות בסיסיות. מומלץ עדיין להאזין לשורות.</div>}</div>})()}
          {src.trim() && (()=>{const r=analyzeRhymes(src);const none=!r.groups.length&&!r.weak.length;return <div style={{marginTop:10,padding:12,background:cd,border:`1px solid ${bd}`,borderRadius:12}}>
            <div style={{fontWeight:700,color: ca}}>🎵 {rtl?"בדיקת חריזה":"Rhyme check"}</div>
            <div style={{fontSize:11,color:sb,marginTop:4}}>{rtl?"לפי הגייה של סוף המילה האחרונה בכל שורה (הערכה — בלי ניקוד אי אפשר לדעת בוודאות).":"By the sound of each line's last word (an estimate — without vowel marks it can't be certain)."}</div>
            {r.scheme && !none && <div dir="ltr" style={{fontSize:13,color:tx,marginTop:8,letterSpacing:2,fontFamily:"monospace"}}>{rtl?"תבנית: ":"Pattern: "}{r.scheme}</div>}
            {r.groups.length>0 && <div style={{display:"grid",gap:5,marginTop:8}}>{r.groups.map((g,idx)=><div key={"s"+idx} style={{fontSize:12,color:tx}}>🎶 {rtl?"שורות":"Lines"} {g.lines.join(", ")} {rtl?"מתחרזות":"rhyme"} (…{g.ending}) <span style={{color:sb}}>— {g.words.join(" · ")}</span></div>)}</div>}
            {r.weak.length>0 && <div style={{display:"grid",gap:5,marginTop:8}}>{r.weak.map((g,idx)=><div key={"w"+idx} style={{fontSize:12,color:tx}}>〰️ {rtl?"שורות":"Lines"} {g.lines.join(", ")} — {rtl?"חריזה חלשה (צליל סיום דומה)":"loose rhyme (similar ending)"} <span style={{color:sb}}>— {g.words.join(" · ")}</span></div>)}</div>}
            {none && <div style={{fontSize:12,marginTop:7,color:sb}}>{rtl?"לא זוהו חרוזים ברורים. זה בסדר — לא כל שיר חייב חריזה.":"No clear rhymes detected. That's fine — not every song needs rhyme."}</div>}
          </div>})()}
          {src.trim() && <div style={{ marginTop: 10, padding: 12, background: `${c.a}0A`, border: `1px solid ${c.a}45`, borderRadius: 12 }}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:8,marginBottom:7}}>
              <div style={{fontWeight:800,color: ca}}>🎧 בדיקת השיר לפי שורה</div><B sm act={lineSpeaking===-2} onClick={()=>lineSpeaking!==null?(window.speechSynthesis.cancel(),setLineSpeaking(null)):speakAllLines()}>{lineSpeaking!==null?"⏹ עצור הכל":"▶️ השמע הכל"}</B>
              <div style={{fontSize:10,color:sb}}>מהירות: {rate.toFixed(1)}×</div>
            </div>
            <div style={{fontSize:11,color:sb,marginBottom:9}}>לחץ על ▶️ ליד כל שורה כדי לשמוע אותה בנפרד. אפשר גם לסמן: ✅ תקינה, 🟡 לבדיקה או 🔴 בעייתית. תגיות כמו [Verse] ו־[Chorus] לא יוקראו.</div>
            <div style={{display:"grid",gap:6,maxHeight:300,overflowY:"auto"}}>
              {src.split("\n").map((line,i)=>{
                const text=line.trim(); const isTag=/^\[.*\]$/.test(text)||/^\(.*\)$/.test(text);
                if(!text) return null;
                if(isTag) return <div key={i} style={{fontSize:10,color:sb,padding:"4px 7px",opacity:.8}}>{text}</div>;
                const status=lineChecks[`${i}:${text}`]||""; const setStatus=(v)=>{const n={...lineChecks,[`${i}:${text}`]:v};setLineChecks(n);localStorage.setItem("sunoprep_line_checks",JSON.stringify(n));};
                return <div key={i} style={{display:"flex",alignItems:"center",gap:7,padding:"8px 9px",background:bg,border:`1px solid ${lineSpeaking===i?c.a:bd}`,borderRadius:9,flexWrap:"wrap"}}>
                  <span style={{fontSize:10,color:sb,minWidth:20}}>{i+1}</span>
                  <span style={{flex:1,fontSize:13,lineHeight:1.45}}>{lineSpeaking===i ? "🔊 " : ""}{text}</span>
                  <B sm act={lineSpeaking===i} onClick={()=>speakLine(text,i)}>{lineSpeaking===i?"⏹ עצור":"▶️ השמע"}</B><B sm onClick={()=>speakLine(text,i)}>🔁</B><B sm act={status==="good"} onClick={()=>setStatus(status==="good"?"":"good")}>✅</B><B sm act={status==="check"} onClick={()=>setStatus(status==="check"?"":"check")}>🟡</B><B sm act={status==="bad"} onClick={()=>setStatus(status==="bad"?"":"bad")}>🔴</B>
                </div>
              })}
            </div>
          </div>}
          <div style={{ marginTop: 10, padding: 12, background: `${c.a}0D`, border: `1px solid ${c.a}45`, borderRadius: 12 }}>
            <div style={{ fontWeight: 700, color: ca, marginBottom: 5 }}>💡 בנק משפטים ורעיונות</div>
            <div style={{ fontSize: 11, color: sb, marginBottom: 8 }}>שמור שורות שאהבת והוסף אותן לכל שיר בלחיצה.</div>
            <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
              <input value={phraseText} onChange={e=>setPhraseText(e.target.value)} placeholder="משפט או שורת השראה..." style={{ flex:"1 1 220px", minWidth:0, background:bg, border:`1px solid ${bd}`, borderRadius:8, padding:"8px 10px", color:tx, fontFamily:"inherit" }} />
              <input value={phraseTag} onChange={e=>setPhraseTag(e.target.value)} placeholder="תגית (אהבה, פזמון...)" style={{ flex:"1 1 120px", minWidth:0, background:bg, border:`1px solid ${bd}`, borderRadius:8, padding:"8px 10px", color:tx, fontFamily:"inherit" }} />
              <B sm onClick={savePhrase}>💾 שמור</B>
            </div>
            {phraseBank.length>0 && <div style={{ marginTop:8, display:"grid", gap:6 }}>
              {phraseBank.slice(0,12).map(p=><div key={p.id} style={{ display:"flex", alignItems:"center", gap:6, padding:"7px 8px", background:bg, border:`1px solid ${bd}`, borderRadius:8 }}>
                <span style={{ flex:1, fontSize:13 }}>{p.text} {p.tag && <small style={{color:sb}}>#{p.tag}</small>}</span>
                <B sm onClick={()=>addPhraseToSong(p.text)}>➕ הוסף</B><B sm onClick={()=>deletePhrase(p.id)}>✕</B>
              </div>)}
            </div>}
          </div>
          {src.trim() && (
            <div style={{ marginTop: 10, padding: 12, background: `${c.a}0D`, border: `1px solid ${c.a}45`, borderRadius: 12 }}>
              <div style={{ fontWeight: 700, color: ca, marginBottom: 5 }}>📚 מילון הגייה אישי</div>
              <div style={{ fontSize: 11, color: sb, marginBottom: 8 }}>שמור צורת הגייה שעבדה לך. בפעם הבאה שהמילה תופיע, תוכל להשתמש בה שוב בלי לתקן מחדש.</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                <input value={dictWord} onChange={e=>setDictWord(e.target.value)} placeholder="המילה המקורית" style={{ flex: "1 1 120px", minWidth: 0, background:bg, border:`1px solid ${bd}`, borderRadius:8, padding:"8px 10px", color:tx, fontFamily:"inherit" }} />
                <input value={dictPron} onChange={e=>setDictPron(e.target.value)} placeholder="צורת ההגייה ל-Suno" style={{ flex: "1 1 150px", minWidth: 0, background:bg, border:`1px solid ${bd}`, borderRadius:8, padding:"8px 10px", color:tx, fontFamily:"inherit" }} />
                <B sm onClick={() => { if(!dictWord.trim() || !dictPron.trim()) return; const n={...wordDict,[dictWord.trim()]:dictPron.trim()}; setWordDict(n); localStorage.setItem("sunoprep_pron_dict",JSON.stringify(n)); setDictWord(""); setDictPron(""); }}>💾 שמור</B>
              </div>
              {Object.keys(wordDict).length > 0 && <div style={{ marginTop:8, display:"flex", flexWrap:"wrap", gap:5 }}>
                {Object.entries(wordDict).map(([w,p]) => <span key={w} style={{ padding:"5px 7px", border:`1px solid ${bd}`, borderRadius:8, fontSize:11, background:bg }}>{w} → <b>{p}</b> <button onClick={()=>{const n={...wordDict};delete n[w];setWordDict(n);localStorage.setItem("sunoprep_pron_dict",JSON.stringify(n));}} style={{ marginInlineStart:5, border:0, background:"transparent", color:"#d66", cursor:"pointer" }}>×</button></span>)}
              </div>}
              {Object.keys(wordDict).length > 0 && <B sm onClick={() => { let out=src; Object.entries(wordDict).forEach(([w,p])=>{out=out.replace(new RegExp(w.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),"g"),p)}); setRes(out); }} sx={{ marginTop:8 }}>✨ החל את המילון על גרסת Suno</B>}
            </div>
          )}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4, fontSize: 11, color: sb }}>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span>{src.split("\n").filter(l => l.trim()).length} {t.lines}</span>
              <B sm onClick={() => setShowSylCount(!showSylCount)} act={showSylCount} sx={{ fontSize: 10, padding: "2px 6px" }}>
                {rtl ? "הברות" : "Syllables"}
              </B>
            </div>
            <div style={{ display: "flex", gap: 4 }}>
              <B sm onClick={() => { const inp = document.createElement("input"); inp.type = "file"; inp.accept = ".txt,.text"; inp.onchange = (e) => { const f = e.target.files?.[0]; if (f) { const r = new FileReader(); r.onload = (ev) => setSrc(ev.target.result); r.readAsText(f); } }; inp.click(); }}>📄 {rtl ? "ייבוא" : "Import"}</B>
              <B sm onClick={() => { setSrc(""); setVCount(1); }}>🗑 {t.clear}</B>
            </div>
          </div>
          {showSylCount && src.trim() && (
            <div style={{ marginTop: 6, padding: "6px 10px", background: `${c.a}06`, borderRadius: 6, fontSize: 10, color: sb, direction: sl.d, maxHeight: 120, overflowY: "auto" }}>
              {src.split("\n").map((line, i) => {
                const isTag = /^\[/.test(line.trim()) || !line.trim();
                const syl = isTag ? null : countSyllables(line);
                return isTag ? null : (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "1px 0" }}>
                    <span style={{ opacity: 0.85, maxWidth: "80%", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>{line.trim()}</span>
                    <span style={{ color: ca, fontWeight: 500 }}>{syl}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div style={{ display:"flex", justifyContent:"flex-end", padding:"0 0 8px" }}>
          <B onClick={() => setScr("history")} sx={{ fontSize:13, padding:"8px 16px" }}>📜 {rtl ? "היסטוריה" : "History"}</B>
        </div>
        {showBackupReminder && (
          <div style={{ background: `${c.a}12`, border: `1px solid ${c.a}35`, borderRadius: 10, padding: "10px 13px", display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <span style={{ fontSize: 18, flexShrink: 0 }}>💾</span>
            <div style={{ flex: 1, fontSize: 11.5, color: sb, lineHeight: 1.5 }}>
              {rtl ? "יש לך שירים שמורים — כדאי לגבות אותם למקרה שתחליף מכשיר או תנקה את הדפדפן." : "You have saved songs — back them up in case you switch device or clear the browser."}
            </div>
            <B sm onClick={expBk} sx={{ fontSize: 11, whiteSpace: "nowrap" }}>{rtl ? "גבה עכשיו" : "Back up"}</B>
            <button onClick={() => setShowBackupReminder(false)} style={{ background: "transparent", border: "none", color: sb, cursor: "pointer", fontSize: 14, flexShrink: 0 }}>✕</button>
          </div>
        )}
      {/* CONNECT AI BANNER */}
        {!aiProvider && (
          <div onClick={() => setScr("aisetup")}
            style={{ background: `${c.a}12`, border: `1px solid ${c.a}35`, borderRadius: 12, padding: "12px 14px", display: "flex", alignItems: "center", gap: 11, cursor: "pointer" }}>
            <span style={{ fontSize: 20, flexShrink: 0 }}>🔌</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: ca, marginBottom: 3 }}>
                {rtl ? "חבר בינה מלאכותית לתעתיק חכם" : "Connect AI for smart transliteration"}
              </div>
              <div style={{ fontSize: 11, color: sb, lineHeight: 1.55 }}>
                {rtl
                  ? "עכשיו עובד במצב מקומי (בלי אינטרנט). חבר Gemini בחינם — בלי כרטיס אשראי — ותקבל תעתיק חכם ומצבים נוספים."
                  : "Currently in offline mode. Connect Gemini for free — no credit card — to unlock smart transliteration and extra modes."}
              </div>
            </div>
            <span style={{ color: ca, fontSize: 16, flexShrink: 0 }}>{rtl ? "‹" : "›"}</span>
          </div>
        )}

        {/* VOICE TIP */}
        {showVoiceTip && (
          <div style={{ background: `${c.a}12`, border: `1px solid ${c.a}30`, borderRadius: 12, padding: "12px 16px", display: "flex", alignItems: "flex-start", gap: 10 }}>
            <span style={{ fontSize: 20, flexShrink: 0 }}>🎙️</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: ca, marginBottom: 4 }}>
                {rtl ? "טיפ פרו: שיבוט קול בסונו" : "Pro tip: Voice cloning in Suno"}
              </div>
              <div style={{ fontSize: 11, color: sb, lineHeight: 1.6 }}>
                {rtl
                  ? "לחץ על + Voice בסונו והעלה הקלטה של 10-15 שניות של זמר ישראלי (או שלך!). סונו ישתמש בקול הזה עם המבטא הישראלי, וזה פותר את בעיית המבטא לגמרי."
                  : "Click + Voice in Suno and upload a 10-15 second recording of a native singer (or yourself!). Suno will use that voice and accent, solving the accent problem completely."}
              </div>
            </div>
            <B sm onClick={() => setShowVoiceTip(false)} sx={{ flexShrink: 0, fontSize: 14 }}>✕</B>
          </div>
        )}

        {/* CONVERSION MODE + BUTTONS */}
        <div style={{ background: cd, border: `1px solid ${bd}`, borderRadius: 14, padding: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: ca, marginBottom: 8 }}>
            {rtl ? "מצב המרה:" : "Conversion mode:"}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
            <B sm act={tMode === "full"} onClick={() => setTMode("full")}>
              {rtl ? "🔤 תעתיק מלא (לטינית)" : "🔤 Full transliteration"}
            </B>
            <B sm act={tMode === "hybrid"} onClick={() => setTMode("hybrid")}>
              {rtl ? "🔀 היברידי" : "🔀 Hybrid"} {!aiProvider && <span style={{ fontSize: 9, color: ca, marginInlineStart: 2 }}>AI</span>}
            </B>
            <B sm act={tMode === "optimized"} onClick={() => setTMode("optimized")}>
              {rtl ? "✨ עברית מותאמת" : "✨ Optimized Hebrew"} {!aiProvider && <span style={{ fontSize: 9, color: ca, marginInlineStart: 2 }}>AI</span>}
            </B>
            <B sm act={tMode === "hebrew"} onClick={() => setTMode("hebrew")}>
              {rtl ? "🇮🇱 עברית ישירה" : "🇮🇱 Direct Hebrew"}
            </B>
            <B sm act={tMode === "stripnikud"} onClick={() => setTMode("stripnikud")}>
              {rtl ? "🧹 עברית ללא ניקוד" : "🧹 Hebrew without nikud"}
            </B>
            <B sm act={tMode === "marknikud"} onClick={() => setTMode("marknikud")}>
              {rtl ? "🎯 ניקוד לפי סימון" : "🎯 Mark-to-nikud"} {!aiProvider && <span style={{ fontSize: 9, color: ca, marginInlineStart: 2 }}>AI</span>}
            </B>
            <B sm act={tMode === "gendernikud"} onClick={() => setTMode("gendernikud")}>
              {rtl ? "🎭 ניקוד מגדרי" : "🎭 Gender nikud"} {!aiProvider && <span style={{ fontSize: 9, color: ca, marginInlineStart: 2 }}>AI</span>}
            </B>
          </div>
          <div style={{ fontSize: 11, color: sb, marginBottom: 12, lineHeight: 1.6 }}>
            {tMode === "full" && (rtl ? "ממיר את כל המילים לאותיות לטיניות. מתאים כשסונו לא מצליח לקרוא עברית בכלל." : "Converts all words to Latin letters. Use when Suno can't read the source language at all.")}
            {tMode === "hybrid" && (rtl ? "משאיר מילים פשוטות בעברית ומתעתק רק מילים בעייתיות. מנצל את היכולת החלקית של סונו v4.5 בעברית." : "Keeps simple words in Hebrew, transliterates only problematic ones. Uses Suno v4.5's partial Hebrew support.")}
            {tMode === "optimized" && (rtl ? "עברית מנוקדת + הפרדת תחיליות + פיסוק לנשימה + שורות קצרות. שומר על עברית אמיתית אבל עוזר לסונו לקרוא נכון!" : "Hebrew with nikud + prefix separation + breath punctuation + short lines. Keeps real Hebrew but helps Suno read correctly!")}
            {tMode === "hebrew" && (rtl ? "מעתיק את הטקסט בעברית כמו שהוא. סונו v4.5 יכול לקרוא עברית — נסה ותראה אם זה עובד!" : "Copies text in original script as-is. Suno v4.5 can partially read it — try and see!")}
            {tMode === "stripnikud" && (rtl ? "מעלה שיר מנוקד ומחזיר אותו עם אותן מילים בדיוק — בלי שום ניקוד. עובד מיידית, בלי AI." : "Takes a text with nikud and returns the exact same words with no nikud at all. Instant, no AI needed.")}
            {tMode === "marknikud" && (rtl ? "סמן מילים בעייתיות עם מקפים בין האותיות (ה-ח-ו-ל). האפליקציה תסיר את המקפים ותנקד רק את המילים שסימנת — השאר יישאר בדיוק כמו שהוא." : "Mark problem words with hyphens between letters. The app removes the hyphens and adds nikud only to the marked words — the rest stays exactly as-is.")}
            {tMode === "gendernikud" && (rtl ? "כתוב את השיר בלי ניקוד. הבינה תזהה לבד את המילים שיכולות להתפרש גם לגבר וגם לאישה, ותנקד רק אותן לפי כיוון השירה שתבחר. השאר יישאר בלי ניקוד." : "Write the song without nikud. The AI finds words that could be read as either gender and adds nikud only to those, matching the singing direction you pick. The rest stays unpointed.")}
          </div>
          {tMode === "gendernikud" && (
            <div style={{ marginBottom: 12, padding: "10px 12px", background: `${c.a}0C`, border: `1px solid ${c.a}30`, borderRadius: 10 }}>
              <div style={{ fontSize: 11, color: sb, marginBottom: 7 }}>{rtl ? "מי שר → למי שרים:" : "Who sings → to whom:"}</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                <B sm act={genderDir === "m2f"} onClick={() => setGenderDir("m2f")}>{rtl ? "👨→👩 גבר לאישה" : "👨→👩 Male to female"}</B>
                <B sm act={genderDir === "f2m"} onClick={() => setGenderDir("f2m")}>{rtl ? "👩→👨 אישה לגבר" : "👩→👨 Female to male"}</B>
                <B sm act={genderDir === "f2f"} onClick={() => setGenderDir("f2f")}>{rtl ? "👩→👩 אישה לאישה" : "👩→👩 Female to female"}</B>
                <B sm act={genderDir === "m2m"} onClick={() => setGenderDir("m2m")}>{rtl ? "👨→👨 גבר לגבר" : "👨→👨 Male to male"}</B>
              </div>
            </div>
          )}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <B pri onClick={() => doTranslit()} dis={loading || !src.trim()} sx={{ minWidth: 240 }}>
              {loading ? <span className="sp-ld">⏳ {t.transing}</span> : 
                tMode === "hebrew" ? (rtl ? "📋 העתק עברית ישירה" : "📋 Copy direct Hebrew") :
                tMode === "hybrid" ? (rtl ? "🔀 המרה היברידית" : "🔀 Hybrid conversion") :
                tMode === "optimized" ? (rtl ? "✨ מטב עברית לסונו" : "✨ Optimize Hebrew for Suno") :
                tMode === "stripnikud" ? (rtl ? "🧹 הסר ניקוד" : "🧹 Strip nikud") :
                tMode === "marknikud" ? (rtl ? "🎯 נקד את המסומנות" : "🎯 Nikud the marked words") :
                tMode === "gendernikud" ? (rtl ? "🎭 נקד לפי מגדר" : "🎭 Nikud by gender") :
                `🔄 ${t.transBtn}`}
            </B>
          </div>
        </div>


        {/* ═══ RESULT: LYRICS ═══ */}
        <div style={{ background: cd, border: `1px solid ${bd}`, borderRadius: 14, padding: 14 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
            <div>
              <span style={{ fontSize: 14, fontWeight: 600, color: ca }}>{t.resTitle}</span>
              <span style={{ fontSize: 10, color: sb, marginInlineStart: 6 }}>{t.resSub}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <B sm act={speaking === "r"} onClick={() => speak(res, false)}>{speaking === "r" ? `⏹ ${t.stop}` : `▶ ${t.listen}`}</B>
              <input type="range" min="0.5" max="2" step="0.1" value={rate}
                onChange={e => setRate(parseFloat(e.target.value))}
                style={{ width: 70 }} title={t.speed} />
              <span style={{ fontSize: 11, color: ca, direction: "ltr", minWidth: 28 }}>×{rate.toFixed(1)}</span>
            </div>
          </div>
          <textarea dir={tMode === "hebrew" || tMode === "optimized" || tMode === "stripnikud" || tMode === "marknikud" || tMode === "gendernikud" ? sl.d : "ltr"} value={res} onChange={e => setRes(e.target.value)} placeholder={t.resPh}
            style={{ ...TA, fontFamily: tMode === "hebrew" || tMode === "optimized" || tMode === "stripnikud" || tMode === "marknikud" || tMode === "gendernikud" ? "inherit" : "'Courier New',monospace", direction: tMode === "hebrew" || tMode === "optimized" || tMode === "stripnikud" || tMode === "marknikud" || tMode === "gendernikud" ? sl.d : "ltr", textAlign: tMode === "hebrew" || tMode === "optimized" || tMode === "stripnikud" || tMode === "marknikud" || tMode === "gendernikud" ? (sl.d === "rtl" ? "right" : "left") : "left" }} />
          {nikudWarn && res && <div style={{ marginTop: 6, padding: "7px 10px", borderRadius: 7, border: "1px solid #e0a03a", background: "#e0a03a18", color: tx, fontSize: 12, lineHeight: 1.5 }}>{nikudWarn}</div>}
          {res && aiProvider && (tMode === "marknikud" || tMode === "gendernikud" || tMode === "optimized") && HAS_NIKUD.test(res) && <div style={{ marginTop: 6, padding: "8px 10px", borderRadius: 8, border: `1px solid ${bd}`, background: `${c.a}08` }}>
            <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
              <B sm onClick={reviewNikud} dis={nikudReview?.loading || loading}>{nikudReview?.loading ? "⏳ המבקר בודק את הניקוד..." : "🧐 בדוק את הניקוד (מבקר AI)"}</B>
              {nikudReview?.issues?.some((x, i) => x.safe && !nikudReview.applied[i]) && <B sm pri onClick={() => nikudReview.issues.forEach((x, i) => { if (x.safe && !nikudReview.applied[i]) applyNikudFix(i); })}>✅ תקן הכל</B>}
              <span style={{ fontSize: 10, color: sb }}>קריאת AI אחת. תיקון שמשנה אותיות נחסם אוטומטית.</span>
            </div>
            {nikudReview && !nikudReview.loading && <div style={{ marginTop: 7, fontSize: 12, color: tx }}>
              {nikudReview.issues.length === 0 ? <div>✅ המבקר לא מצא בעיות בניקוד.{nikudReview.summary ? " " + nikudReview.summary : ""}</div> : <>
                {nikudReview.summary && <div style={{ marginBottom: 5 }}>💬 {nikudReview.summary}</div>}
                {nikudReview.issues.map((x, i) => <div key={i} style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap", padding: "4px 0", borderTop: i ? `1px solid ${bd}` : "none" }}>
                  <span style={{ fontSize: 15 }}>{x.word}</span><span style={{ color: sb }}>←</span><span style={{ fontSize: 15, fontWeight: 700, color: ca }}>{x.suggested}</span>
                  <span style={{ fontSize: 11, color: sb, flex: "1 1 140px" }}>{x.reason}</span>
                  {!x.safe ? <span style={{ fontSize: 10, color: "#e0a03a" }}>⚠️ ההצעה משנה אותיות — לא מוחל</span>
                    : nikudReview.applied[i] ? <span style={{ fontSize: 11, color: ca }}>✓ תוקן</span>
                    : <B sm onClick={() => applyNikudFix(i)}>תקן</B>}
                </div>)}
              </>}
            </div>}
          </div>}
          {res && <div style={{ marginTop: 6, padding: "6px 10px", background: `${c.a}08`, borderRadius: 6, fontSize: 11, color: sb, lineHeight: 1.6 }}>
            💡 {tMode === "optimized" 
              ? (rtl ? "טיפ: אם הקצב איטי מדי — הסר רווחים בין תחיליות, או הוסף BPM גבוה יותר בסגנון. אם מילה נשמעת לא נכון — הסר או שנה את הניקוד שלה." 
                     : "Tip: If tempo is too slow, remove spaces between prefixes or add higher BPM in style. If a word sounds wrong, remove or change its nikud.")
              : (rtl ? "טיפ: לחץ השמע ובדוק. אם מילה נשמעת לא נכון — ערוך אותה ידנית." 
                     : "Tip: Click play and check. If a word sounds wrong, edit it manually.")}
          </div>}
          <div style={{ marginTop: 10, display: "flex", justifyContent: "center", gap: 8, flexWrap: "wrap" }}>
            <B pri onClick={() => copy(res, "lyr")} dis={!res.trim()}
              sx={{ minWidth: 180, background: cpd === "lyr" ? "#4CAF50" : c.a }}>
              {cpd === "lyr" ? `✅ ${t.copied}` : `📋 ${t.cpLyr}`}
            </B>
            <B sm onClick={playAB} dis={!src.trim() || !res.trim()} act={speaking === "ab"}
              sx={{ fontSize: 12 }}>
              {speaking === "ab" ? "⏹ A/B..." : `🔊 ${rtl ? "השוואה A/B" : "A/B Compare"}`}
            </B>
            <B sm onClick={saveToHistory} dis={!src.trim()}
              sx={{ fontSize: 12 }}>
              {rtl ? "💾 שמור להיסטוריה" : "💾 Save to history"}
            </B>
          </div>
          <div style={{ textAlign: "center", fontSize: 10, color: sb, marginTop: 6 }}>
            → {rtl ? "הדבק בתיבת Lyrics בסונו" : "Paste into Suno's Lyrics box"}
          </div>
        </div>

        {/* 🎼 הסגנון — מקוצר; העריכה המלאה בלשונית סגנונות */}
        <div style={{ background: cd, border: `1px solid ${bd}`, borderRadius: 14, padding: 12, display: "flex", gap: 10, alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 200px", minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: ca }}>🎼 {rtl ? "הסגנון לשיר" : "Song style"}</div>
            <div dir="ltr" style={{ fontSize: 11, marginTop: 3, color: styTxt ? tx : sb, textAlign: "left", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{styTxt || (rtl ? "עוד לא נבחר סגנון" : "No style selected yet")}</div>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <B sm onClick={() => { setActiveTab("styles"); try { window.scrollTo({ top: 0, behavior: "smooth" }); } catch (e) {} }}>🎼 {styTxt ? (rtl ? "ערוך סגנון" : "Edit style") : (rtl ? "בחר סגנון" : "Choose style")}</B>
            {styTxt && <B sm pri onClick={() => copy(styTxt, "sty")}>{cpd === "sty" ? "✅" : "📋"} {rtl ? "העתק" : "Copy"}</B>}
          </div>
        </div>

        {/* RHYTHM & LINE BALANCE */}
        {src.trim() && (() => {
          const lines = src.split(/\n/).map((x,i)=>({text:x.trim(),i})).filter(o=>o.text && !/^\[.*\]$/.test(o.text));
          const count = x => (x.match(/[א-ת]+/g)||[]).reduce((n,w)=>n+Math.max(1,(w.replace(/[אהוי]/g," ").trim().match(/[א-ת]+/g)||[]).length),0);
          const vals=lines.map(o=>count(o.text));
          const avg=vals.reduce((a,b)=>a+b,0)/Math.max(1,vals.length);
          const max=Math.max(...vals,1);
          return <div style={{marginTop:12,padding:14,borderRadius:12,background:`${c.a}0d`,border:`1px solid ${c.a}35`}}>
            <div style={{fontWeight:800,fontSize:15,color:tx}}>🎵 איזון קצב ועומס שורות</div>
            <div style={{fontSize:11,color:sb,marginTop:4}}>הערכה גסה לפי אורך ומבנה המילים — לא מדד מוזיקלי מדויק.</div>
            <div style={{marginTop:10,display:"grid",gap:7}}>
              {lines.map((o,j)=>{const v=vals[j], ratio=v/Math.max(avg,1), flag=ratio>1.45?"🔴":ratio>1.2?"🟡":ratio<0.65?"🟡":"🟢"; return <div key={o.i} style={{padding:"8px 9px",borderRadius:8,background:bg,border:`1px solid ${bd}`}}>
                <div style={{display:"flex",justifyContent:"space-between",gap:8,fontSize:11}}><span style={{color:tx,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{flag} {o.text}</span><b style={{color: ca,whiteSpace:"nowrap"}}>{v} יח׳</b></div>
                <div style={{height:5,borderRadius:5,background:bd,marginTop:6,overflow:"hidden"}}><div style={{height:"100%",width:`${Math.min(100,(v/max)*100)}%`,background:c.a,borderRadius:5}}/></div>
                {ratio>1.45 && <div style={{fontSize:10,color:sb,marginTop:5}}>השורה ארוכה משמעותית מהממוצע — Suno עלול לדחוס או לבלוע מילים.</div>}
              </div>})}
            </div>
            <div style={{fontSize:10,color:sb,marginTop:8}}>ממוצע: {avg.toFixed(1)} יחידות לשורה. השווה בעיקר שורות בתוך אותו בית.</div>
          </div>
        })()}

        {/* FINAL SUNO CHECK */}
        {src.trim() && (() => {
          const rawLines = src.split(/\n/).map(x=>x.trim()).filter(x=>x && !/^\[.*\]$/.test(x));
          const issues = [];
          const mixed = rawLines.filter(x => /[א-ת][A-Za-z]|[A-Za-z][א-ת]/.test(x));
          if (mixed.length) issues.push(`נמצא ערבוב עברית/אנגלית ב־${mixed.length} שורות`);
          const stretched = rawLines.filter(x => /(.)\1\1\1/.test(x));
          if (stretched.length) issues.push(`נמצאו אותיות שחוזרות יותר מדי ב־${stretched.length} שורות`);
          const longLines = rawLines.filter(x => (x.match(/[א-ת]+/g)||[]).length > 14);
          if (longLines.length) issues.push(`${longLines.length} שורות ארוכות שעלולות להיות צפופות לשירה`);
          const changed = res && src.trim() !== res.trim();
          if (changed) issues.push("גרסת Suno שונה מהטקסט המקורי — כדאי לעבור על השינויים");
          const status = issues.length === 0 ? "ready" : issues.length <= 2 ? "check" : "warn";
          const icon = status==="ready" ? "🟢" : status==="check" ? "🟡" : "🔴";
          const title = status==="ready" ? "מוכן לבדיקה ב־Suno" : status==="check" ? "כדאי לבדוק כמה דברים" : "נמצאו דברים שדורשים בדיקה";
          return <div style={{ marginTop:12, padding:14, borderRadius:12, background: status==="ready" ? "#2e7d3212" : status==="check" ? "#f9a82512" : "#c6282812", border:`1px solid ${status==="ready"?"#2e7d3260":status==="check"?"#f9a82570":"#c6282860"}` }}>
            <div style={{ fontWeight:800, fontSize:15, color:tx }}>{icon} בדיקה סופית לפני Suno — {title}</div>
            <div style={{ fontSize:11, color:sb, marginTop:5 }}>הבדיקה לא משנה את המילים. היא רק מסמנת דברים שכדאי לעבור עליהם לפני ההעתקה.</div>
            {issues.length ? <div style={{ marginTop:9, display:"grid", gap:5 }}>{issues.map((x,i)=><div key={i} style={{ fontSize:12, color:tx }}>⚠️ {x}</div>)}</div> : <div style={{ marginTop:9, fontSize:12, color:tx }}>✓ לא נמצאו תווים מעורבים, מתיחות חריגות או שורות ארוכות במיוחד.</div>}
            <div style={{ marginTop:10, display:"flex", gap:6, flexWrap:"wrap" }}>
              <B sm onClick={() => { const el=document.getElementById("lyrics-output"); if(el) el.scrollIntoView({behavior:"smooth",block:"center"}); }}>🔍 בדוק את גרסת Suno</B>
              <B sm onClick={() => copy(res || src, "final")} dis={!(res||src)}>📋 העתק גרסה ל־Suno</B>
            </div>
          </div>
        })()}

        </>}
      {activeTab === "styles" && <div style={{ display: "grid", gap: 14 }}>
        {/* ═══ 🎼 סגנונות — כל מה שקשור לצליל של השיר במקום אחד ═══ */}
        <div style={{ padding: "16px 14px", borderRadius: 16, background: `linear-gradient(160deg, ${c.a}1f, ${cd} 55%)`, border: `1px solid ${c.a}55` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 42, height: 42, borderRadius: 12, display: "grid", placeItems: "center", fontSize: 22, background: `${c.a}26`, border: `1px solid ${c.a}66` }}>🎼</div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 18, color: tx }}>{rtl ? "סגנונות" : "Styles"}</div>
              <div style={{ fontSize: 12, color: sb }}>{rtl ? "בונה הסגנון, הספרייה שלך וכרטיס הביצוע — הכל במקום אחד." : "Style builder, your library and the performance card — all in one place."}</div>
            </div>
          </div>
          <div dir="ltr" style={{ marginTop: 10, padding: "9px 11px", borderRadius: 10, background: bg, border: `1px solid ${bd}`, fontSize: 12, fontFamily: "monospace", color: styTxt ? tx : sb, textAlign: "left", lineHeight: 1.5 }}>{styTxt || (rtl ? "עוד לא נבחר סגנון — בחר למטה או מהספרייה" : "No style yet — pick below or from your library")}</div>
          <div style={{ display: "flex", gap: 6, marginTop: 9, flexWrap: "wrap" }}>
            <B sm pri onClick={() => copy(styTxt, "sty")} dis={!styTxt}>{cpd === "sty" ? `✅ ${t.copied}` : `📋 ${t.cpSty}`}</B>
            {[["sty-builder", rtl ? "🎛️ בונה הסגנון" : "🎛️ Builder"], ["sty-library", (rtl ? "📚 הספרייה" : "📚 Library") + ` (${styleLib.length})`], ["sty-perf", rtl ? "🎭 כרטיס ביצוע" : "🎭 Performance"]].map(([id, l]) => <Chip key={id} onClick={() => { try { document.getElementById(id).scrollIntoView({ behavior: "smooth", block: "start" }); } catch (e) {} }}>{l}</Chip>)}
          </div>
        </div>

        {/* ═══ STYLE ═══ */}
        <div id="sty-builder" style={{ background: cd, border: `1px solid ${bd}`, borderRadius: 14, padding: 14, scrollMarginTop: 12 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: ca, marginBottom: 8 }}>{t.styTitle}</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 8 }}>
            {STYLES.map(s => (
              <B key={s.id} sm act={selSty.includes(s.id)} onClick={() => setSelSty(p => p.includes(s.id) ? p.filter(x => x !== s.id) : [...p, s.id])}>
                {s.l}
              </B>
            ))}
          </div>
          <div style={{ fontSize: 11, color: sb, marginBottom: 4 }}>{rtl ? "סוג קול:" : "Voice type:"}</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 8 }}>
            {VOCAL_STYLES.map(s => (
              <B key={s.id} sm act={selVocal.includes(s.id)} onClick={() => setSelVocal(p => p.includes(s.id) ? p.filter(x => x !== s.id) : [...p, s.id])}
                sx={{ borderStyle: "dashed" }}>
                {s.l}
              </B>
            ))}
          </div>
          <div style={{ fontSize: 11, color: sb, marginBottom: 4 }}>{rtl ? "קצב (BPM):" : "Tempo (BPM):"}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
            {[0, 70, 85, 100, 120, 140, 170].map(v => (
              <B key={v} sm act={bpmVal === v} onClick={() => setBpmVal(v)} sx={{ minWidth: 38 }}>
                {v === 0 ? (rtl ? "אוטו" : "Auto") : v === 70 ? "70 🐢" : v === 85 ? "85" : v === 100 ? "100" : v === 120 ? "120" : v === 140 ? "140" : "170 🚀"}
              </B>
            ))}
          </div>
          <div style={{ fontSize: 11, color: sb, marginBottom: 4 }}>{t.custLbl}</div>
          <div style={{ display: "flex", gap: 6 }}>
            <input dir="ltr" value={custSty} onChange={e => setCustSty(e.target.value)} placeholder={t.styPh}
              style={{ flex: 1, background: bg, border: `1px solid ${bd}`, borderRadius: 8, padding: "8px 12px", color: tx, fontSize: 13, fontFamily: "inherit", direction: "ltr", textAlign: "left" }}
              onKeyDown={e => { if (e.key === "Enter" && custSty.trim()) addSavedStyle(); }} />
            {custSty.trim() && (
              <B sm onClick={addSavedStyle} sx={{ background: `${c.a}20`, color: ca, borderColor: c.a, whiteSpace: "nowrap" }}>
                {rtl ? "⭐ שמור" : "⭐ Save"}
              </B>
            )}
          </div>

          {rtl && <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
            <B sm onClick={() => openLibFromCurrent()} dis={!builtStyleNow()} sx={{ borderColor: `${c.a}80` }}>📚 שמור לספריית הסגנונות</B>
            <B sm onClick={() => { try { document.getElementById("sty-library").scrollIntoView({ behavior: "smooth", block: "start" }); } catch (e) {} }}>📚 לספרייה שלי ({styleLib.length}) ↓</B>
          </div>}
          {savedSty.length > 0 && (
            <div style={{ marginTop: 8 }}>
              <div style={{ fontSize: 11, color: sb, marginBottom: 4 }}>{rtl ? "⭐ הסגנונות שלי:" : "⭐ My styles:"}</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                {savedSty.map(s => (
                  <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 0 }}>
                    {editStyId === s.id ? (
                      <div style={{ display: "flex", gap: 2 }}>
                        <input value={editStyLabel} onChange={e => setEditStyLabel(e.target.value)}
                          onKeyDown={e => { if (e.key === "Enter") updateSavedStyleLabel(s.id); if (e.key === "Escape") setEditStyId(null); }}
                          autoFocus
                          style={{ width: 120, background: bg, border: `1px solid ${c.a}`, borderRadius: 6, padding: "3px 8px", color: tx, fontSize: 11, fontFamily: "inherit" }} />
                        <B sm onClick={() => updateSavedStyleLabel(s.id)} sx={{ fontSize: 10, padding: "3px 6px" }}>✓</B>
                      </div>
                    ) : (
                      <B sm act={selSty.includes(s.id)}
                        onClick={() => setSelSty(p => p.includes(s.id) ? p.filter(x => x !== s.id) : [...p, s.id])}
                        sx={{ borderColor: `${c.a}60`, paddingInlineEnd: 4 }}>
                        ⭐ {s.label}
                      </B>
                    )}
                    {editStyId !== s.id && (
                      <div style={{ display: "flex", gap: 1, marginInlineStart: 2 }}>
                        <button onClick={() => { setEditStyId(s.id); setEditStyLabel(s.label); }}
                          style={{ background: "transparent", border: "none", color: sb, cursor: "pointer", fontSize: 10, padding: "2px 4px" }}
                          title={rtl ? "ערוך" : "Edit"}>✏️</button>
                        <button onClick={() => removeSavedStyle(s.id)}
                          style={{ background: "transparent", border: "none", color: "#E55", cursor: "pointer", fontSize: 10, padding: "2px 4px" }}
                          title={rtl ? "הסר" : "Remove"}>✕</button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          {styTxt && (
            <div style={{ marginTop: 8, padding: "8px 12px", background: `${c.a}10`, borderRadius: 8, border: `1px solid ${c.a}25`, fontSize: 12, color: ca, direction: "ltr", textAlign: "left" }}>
              <span style={{ color: sb }}>{t.prevSty} </span>{styTxt}
            </div>
          )}
          {accentHint && (
            <div style={{ marginTop: 6, fontSize: 10, color: sb }}>
              ✅ {rtl ? `נוסף אוטומטית: "${accentHint}"` : `Auto-added: "${accentHint}"`}
            </div>
          )}
          <div style={{ marginTop: 10, display: "flex", justifyContent: "center" }}>
            <B pri onClick={() => copy(styTxt, "sty")} dis={!styTxt}
              sx={{ minWidth: 220, background: cpd === "sty" ? "#4CAF50" : c.a }}>
              {cpd === "sty" ? `✅ ${t.copied}` : `📋 ${t.cpSty}`}
            </B>
          </div>
          <div style={{ textAlign: "center", fontSize: 10, color: sb, marginTop: 6 }}>
            → {rtl ? "הדבק בתיבת Styles בסונו" : "Paste into Suno's Styles box"}
          </div>
        </div>

        <div id="sty-library" style={{ scrollMarginTop: 12 }}>{renderStyleLibrary()}</div>

        <div id="sty-perf" style={{ scrollMarginTop: 12 }}>
        {/* PERFORMANCE CARD → STYLE PROMPT */}
        <div style={{ background: cd, border: `1px solid ${bd}`, borderRadius: 14, padding: 14, marginTop: 12 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: ca }}>🎭 {rtl ? "כרטיס ביצוע → Style Prompt" : "Performance Card → Style Prompt"}</div>
          <div style={{ fontSize: 11, color: sb, marginTop: 4, marginBottom: 9 }}>{rtl ? "הגדר איך כל חלק אמור להתבצע. הכפתור יוסיף את התיאור ל־Style Prompt בלי לשנות את מילות השיר." : "Describe how each section should be performed. The button adds it to the Style Prompt without changing lyrics."}</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7}}>
            {[['verse','🎵 בית'],['chorus','🎶 פזמון'],['bridge','🌉 גשר'],['outro','🌅 סיום']].map(([k,label])=><label key={k} style={{fontSize:11,color:sb}}>{label}<input dir="ltr" value={performanceCard[k]} onChange={e=>setPerformanceCard(x=>({...x,[k]:e.target.value}))} style={{width:"100%",boxSizing:"border-box",marginTop:4,padding:"8px 9px",borderRadius:8,border:`1px solid ${bd}`,background:bg,color:tx}} /></label>)}
          </div>
          <div style={{display:"flex",gap:7,flexWrap:"wrap",marginTop:9}}>
            <B sm onClick={()=>{const x=`Performance: ${performanceCard.verse} verses, ${performanceCard.chorus} chorus, ${performanceCard.bridge} bridge, ${performanceCard.outro} outro.`; setCustSty(prev=>prev.trim()?prev.trim()+", "+x:x)}}>✨ {rtl ? "הוסף ל־Style Prompt" : "Add to Style Prompt"}</B>
            <B sm onClick={()=>navigator.clipboard?.writeText(`Performance: ${performanceCard.verse} verses, ${performanceCard.chorus} chorus, ${performanceCard.bridge} bridge, ${performanceCard.outro} outro.`)}>📋 {rtl ? "העתק תיאור ביצוע" : "Copy performance"}</B>
          </div>
        </div>
        </div>
      </div>}
      {activeTab === "ideas" && <div>
        {/* ═══ ✨ אולפן השירים — רעיון → צליל → שיר → ליטוש ═══ */}
        <div style={{ marginTop:12, padding:"16px 14px", borderRadius:16, background:`linear-gradient(160deg, ${c.a}1f, ${cd} 55%)`, border:`1px solid ${c.a}55` }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:42, height:42, borderRadius:12, display:"grid", placeItems:"center", fontSize:22, background:`${c.a}26`, border:`1px solid ${c.a}66` }}>✨</div>
            <div>
              <div style={{ fontWeight:800, fontSize:18, color:tx }}>אולפן השירים</div>
              <div style={{ fontSize:12, color:sb }}>רעיון ← צליל ← שיר ← ליטוש. ה־AI כותב, ואתה בוחר מה נשאר.</div>
            </div>
          </div>
          {!aiProvider && <div onClick={()=>setScr("aisetup")} style={{ marginTop:10, padding:"9px 11px", borderRadius:10, background:bg, border:`1px dashed ${c.a}`, fontSize:12, color:tx, cursor:"pointer" }}>🔌 כדי לכתוב שירים צריך לחבר ספק AI — <b style={{color:ca}}>Gemini חינמי, בלי כרטיס אשראי</b>. לחץ כאן לחיבור.</div>}
        </div>

        {/* שלב 1 — על מה השיר */}
        <div style={stepCard}>
          <div style={stepHead}><span style={stepNum}>1</span>על מה השיר?</div>
          <textarea value={ideaPrompt} onChange={e=>setIdeaPrompt(e.target.value)} placeholder="לדוגמה: הוא עומד בתחנה האחרונה של הלילה ומחכה להודעה ממנה שלא מגיעה..." style={{width:"100%",minHeight:80,marginTop:8,padding:11,borderRadius:12,border:`1px solid ${bd}`,background:bg,color:tx,resize:"vertical",fontSize:15,fontFamily:"inherit",lineHeight:1.5}} />
          <div style={{display:"flex",gap:6,marginTop:8,flexWrap:"wrap"}}>
            {IDEA_TOPICS.map(tp=><Chip key={tp} on={ideaPrompt===tp} onClick={()=>setIdeaPrompt(tp)}>{tp}</Chip>)}
          </div>
          <div style={{marginTop:9}}><B sm onClick={inspireMe} dis={ideaInspire?.loading}>{ideaInspire?.loading?"⏳ חושב על רעיונות...":"🎲 תן לי 5 רעיונות מפתיעים"}</B></div>
          {ideaInspire?.ideas?.length>0 && <div style={{marginTop:8,display:"grid",gap:6}}>
            {ideaInspire.ideas.map((x,i)=><button key={i} onClick={()=>{setIdeaPrompt(x);setIdeaInspire(null);}} style={{textAlign:"start",padding:"9px 11px",borderRadius:10,border:`1px solid ${bd}`,background:bg,color:tx,fontSize:13,fontFamily:"inherit",cursor:"pointer",lineHeight:1.45}}>💡 {x}</button>)}
          </div>}
        </div>

        {/* שלב 2 — איך הוא יישמע */}
        <div style={stepCard}>
          <div style={stepHead}><span style={stepNum}>2</span>איך הוא יישמע?</div>
          <div style={chipLabel}>🎸 ז'אנר</div>
          <div style={chipRow}>{IDEA_GENRES.map(g=><Chip key={g} on={ideaGenre===g} onClick={()=>setIdeaGenre(g)}>{g}</Chip>)}</div>
          <div style={chipLabel}>🎭 מצב רוח</div>
          <div style={chipRow}>{IDEA_MOODS.map(m=><Chip key={m} on={ideaMood===m} onClick={()=>setIdeaMood(m)}>{m}</Chip>)}</div>
          <div style={chipLabel}>🎤 מי שר למי</div>
          <div style={chipRow}>{IDEA_GENDERS.map(g=><Chip key={g} on={ideaGenderMode===g} onClick={()=>setIdeaGenderMode(g)}>{g}</Chip>)}</div>
          <button onClick={()=>setIdeaMore(v=>!v)} style={{marginTop:10,background:"transparent",border:"none",color:ca,fontFamily:"inherit",fontSize:13,fontWeight:700,cursor:"pointer",padding:0}}>{ideaMore?"▴ פחות הגדרות":"▾ עוד הגדרות"} <span style={{color:sb,fontWeight:400,fontSize:11}}>({ideaStructure} · {ideaLength} · {ideaRhyme})</span></button>
          {ideaMore && <div style={{marginTop:4}}>
            <div style={chipLabel}>🧱 מבנה</div>
            <div style={chipRow}>{["בית–פזמון–בית–פזמון–גשר","בית–פזמון","פזמון בלבד","מבנה חופשי"].map(x=><Chip key={x} on={ideaStructure===x} onClick={()=>setIdeaStructure(x)}>{x}</Chip>)}</div>
            <div style={chipLabel}>📏 אורך</div>
            <div style={chipRow}>{["קצרה","רגילה","מלאה"].map(x=><Chip key={x} on={ideaLength===x} onClick={()=>setIdeaLength(x)}>{x} <span style={{opacity:.7,fontSize:10}}>· {LENGTH_HINT[x]}</span></Chip>)}</div>
            <div style={chipLabel}>📝 מה לכתוב</div>
            <div style={chipRow}>{["טיוטת שיר","פזמון","בית","רעיונות לשיר"].map(x=><Chip key={x} on={ideaType===x} onClick={()=>setIdeaType(x)}>{x}</Chip>)}</div>
            <div style={chipLabel}>👁️ נקודת מבט</div>
            <div style={chipRow}>{["גוף ראשון","גוף שני","סיפור מהצד","דואט"].map(x=><Chip key={x} on={ideaPerspective===x} onClick={()=>setIdeaPerspective(x)}>{x}</Chip>)}</div>
            <div style={chipLabel}>🎵 חריזה</div>
            <div style={chipRow}>{["חריזה טבעית","חריזה מודגשת","ללא חריזה מחייבת"].map(x=><Chip key={x} on={ideaRhyme===x} onClick={()=>setIdeaRhyme(x)}>{x}</Chip>)}</div>
            <div style={chipLabel}>🔑 מילים שחייבות להופיע</div>
            <input value={ideaKeywords} onChange={e=>setIdeaKeywords(e.target.value)} placeholder="למשל: ים, תל אביב, שתיים בלילה" style={{width:"100%",marginTop:4,padding:10,borderRadius:10,border:`1px solid ${bd}`,background:bg,color:tx,fontFamily:"inherit",fontSize:14}} />
          </div>}
        </div>

        {/* שלב 3 — כתיבה */}
        <div style={stepCard}>
          <div style={stepHead}><span style={stepNum}>3</span>כתוב לי שיר</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr",gap:8,marginTop:8}}>
            <B pri onClick={()=>generateIdea(1)} dis={ideaLoading||refineBusy} sx={{width:"100%",fontSize:16,padding:"14px 18px"}}>{ideaLoading?`⏳ כותב...${ideaStart?` ${Math.max(0,Math.round((Date.now()-ideaStart)/1000))} שנ׳`:""}`:refineBusy?"🎻 מלטש...":"✨ כתוב לי שיר"}</B>
            <B onClick={()=>generateIdea(3)} dis={ideaLoading||refineBusy} sx={{width:"100%"}}>🎨 3 כיוונים שונים לבחירה</B>
          </div>
          <label style={{display:"flex",alignItems:"center",gap:8,marginTop:10,fontSize:12,color:tx,cursor:"pointer"}}>
            <input type="checkbox" checked={ideaAutoRefine} onChange={e=>setIdeaAutoRefine(e.target.checked)} style={{width:18,height:18,accentColor:c.a}} />
            <span>🎻 ללטש אוטומטית אחרי הכתיבה <span style={{color:sb}}>(עוד 3 קריאות AI — מוסיף בערך 20–40 שניות)</span></span>
          </label>
        </div>

        {/* כתיבה חיה — הטקסט זורם תוך כדי (Gemini) */}
        {ideaLoading && ideaLive && <div style={{...stepCard, border:`1px solid ${c.a}77`}}>
          <div style={stepHead}><span style={stepNum}>✍️</span>כותב עכשיו...</div>
          <div style={{marginTop:10,padding:12,borderRadius:12,background:bg,border:`1px solid ${bd}`,whiteSpace:"pre-wrap",fontSize:15,lineHeight:1.6,color:tx}}>{ideaLive}<span className="sp-ld" style={{color:ca}}>▌</span></div>
        </div>}

        {/* התוצאה */}
        {ideaOut && !(ideaLoading && ideaLive) && <div style={{...stepCard, border:`1px solid ${c.a}77`}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:8,flexWrap:"wrap"}}>
            <div style={stepHead}><span style={stepNum}>4</span>השיר שלך</div>
            <div style={{display:"flex",gap:6}}>
              {refineResult?.target==="idea" && <span title="ציון המבקר" style={{fontSize:12,fontWeight:800,color:onA,background:c.a,borderRadius:20,padding:"3px 10px"}}>⭐ {refineResult.finalScore}/10</span>}
              <B sm act={ideaEdit} onClick={()=>{setIdeaEdit(v=>!v);setLineSel(null);}}>{ideaEdit?"👁️ תצוגה":"✏️ עריכה"}</B>
            </div>
          </div>
          {ideaVariants.length>1 && <div style={{display:"flex",gap:6,marginTop:9,flexWrap:"wrap"}}>{ideaVariants.map((v,i)=><Chip key={i} on={ideaOut===v} onClick={()=>{setIdeaOut(v);setLineSel(null);setLineTool(null);}}>{["💖 כיוון 1 · רגשי","⚡ כיוון 2 · קצבי","🌙 כיוון 3 · מפתיע"][i]||`כיוון ${i+1}`}</Chip>)}</div>}
          {ideaEdit
            ? <textarea value={ideaOut} onChange={e=>{const v=e.target.value; setIdeaVariants(prev=>prev.map(x=>x===ideaOut?v:x)); setIdeaOut(v);}} style={{width:"100%",minHeight:260,marginTop:10,padding:12,borderRadius:12,border:`1px solid ${bd}`,background:bg,color:tx,resize:"vertical",fontSize:15,lineHeight:1.6,fontFamily:"inherit"}} />
            : <div style={{marginTop:10,padding:"10px 8px",borderRadius:12,background:bg,border:`1px solid ${bd}`}}>
                <div style={{fontSize:11,color:sb,margin:"0 4px 6px"}}>👆 לחץ על שורה כדי להחליף, לקצר או למצוא לה חרוזים · המספר = הברות</div>
                {renderDraftView()}
              </div>}

          <B pri onClick={sendDraftToWrite} sx={{width:"100%",marginTop:10,fontSize:15}}>📝 העבר ללשונית כתיבה</B>

          <div style={chipLabel}>🪄 שיפור מהיר בלחיצה</div>
          <div style={chipRow}>
            {["חזק את הפזמון והפוך אותו לקליט יותר","הפוך לקצבי וריקודי יותר","הפוך למרגש ואישי יותר","קצר שורות ארוכות ושפר זרימה","החלף קלישאות בדימויים מקוריים","שמור על הרעיון ושנה את הניסוח"].map(x=><Chip key={x} dis={ideaLoading||refineBusy} onClick={()=>quickImprove(x)}>{x}</Chip>)}
          </div>

          <div style={chipLabel}>🧰 עוד כלים</div>
          <div style={chipRow}>
            <Chip dis={ideaTitles?.loading} onClick={suggestTitles}>{ideaTitles?.loading?"⏳ מחפש שם...":"🏷️ הצע שם לשיר"}</Chip>
            <Chip dis={ideaLoading} onClick={suggestStyle}>🎼 התאם סגנון לסונו</Chip>
            <Chip dis={ideaLoading} onClick={checkGenderConsistency}>🔎 בדוק את הפנייה</Chip>
            <Chip dis={ideaLoading} onClick={adaptIdeaGender}>🎭 התאם ל"{ideaGenderMode.replace(/^[^֐-׿]+/,"")}"</Chip>
            <Chip onClick={saveIdeaExcerpt}>💡 שמור משפט לבנק</Chip>
          </div>
          {ideaTitles?.titles?.length>0 && <div style={{marginTop:8,padding:9,borderRadius:10,background:bg,border:`1px solid ${bd}`}}>
            <div style={{fontSize:11,color:sb,marginBottom:6}}>לחץ על שם כדי לקבוע אותו כשם הפרויקט (ולהעתיק):</div>
            <div style={chipRow}>{ideaTitles.titles.map(t0=><Chip key={t0} on={projectName===t0} onClick={()=>{setProjectName(t0); try{navigator.clipboard&&navigator.clipboard.writeText(t0);}catch(e){}}}>{t0}</Chip>)}</div>
          </div>}
          {ideaStyleMsg && <div style={{marginTop:8,padding:9,borderRadius:10,background:bg,border:`1px solid ${c.a}66`,fontSize:12,color:tx,direction:"rtl"}}>{ideaStyleMsg}<div style={{marginTop:7}}><B sm onClick={()=>openLibFromCurrent(custSty,{tags:[ideaGenre,ideaMood].filter(Boolean),name:`${ideaGenre} · ${ideaMood}`})}>📚 שמור לספריית הסגנונות</B></div></div>}
          {genderCheckResult && <div style={{marginTop:8,padding:9,borderRadius:10,border:`1px solid ${bd}`,background:bg,color:tx,whiteSpace:"pre-wrap",fontSize:12}}><b>🎭 בדיקת התאמה:</b><br/>{genderCheckResult}</div>}

          {renderRefinePanel("idea")}

          <button onClick={()=>setIdeaShowVersions(v=>!v)} style={{marginTop:10,background:"transparent",border:"none",color:ca,fontFamily:"inherit",fontSize:13,fontWeight:700,cursor:"pointer",padding:0}}>{ideaShowVersions?"▴":"▾"} 🗂️ גרסאות קודמות ({ideaHistory.length})</button>
          {ideaShowVersions && <div style={{marginTop:6,padding:9,borderRadius:10,background:bg,border:`1px solid ${bd}`}}>
            {ideaHistory.length===0 ? <div style={{fontSize:12,color:sb}}>עוד אין גרסאות קודמות. לפני כל שינוי הגרסה הקודמת נשמרת כאן.</div> : <>
              <div style={chipRow}>{ideaHistory.map((v,i)=><Chip key={i} onClick={()=>{setIdeaHistory(prev=>[...prev.filter((_,k)=>k!==i), ideaOut]);setIdeaOut(v);setLineSel(null);}}>↩️ גרסה {i+1}</Chip>)}<Chip onClick={()=>{if(window.confirm("למחוק את כל הגרסאות הקודמות?")){setIdeaHistory([]);setIdeaHistoryIndex(-1);}}}>🗑️ נקה</Chip></div>
              <div style={{fontSize:11,fontWeight:700,color:tx,marginTop:10}}>🔍 השוואה</div>
              <div style={{display:"flex",gap:6,marginTop:6,flexWrap:"wrap"}}>
                {[["A",compareA,setCompareA],["B",compareB,setCompareB]].map(([k,val,setv])=><select key={k} value={val} onChange={e=>setv(e.target.value)} style={{padding:7,borderRadius:8,border:`1px solid ${bd}`,background:cd,color:tx}}><option value="current">הגרסה הנוכחית</option>{ideaHistory.map((_,i)=><option key={i} value={`history-${i}`}>גרסה {i+1}</option>)}</select>)}
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7,marginTop:7}}>
                {[compareA,compareB].map((sel,k)=>{const val=sel==="current"?ideaOut:ideaHistory[Number(sel.split("-")[1])]||"";return <div key={k} style={{padding:8,border:`1px solid ${bd}`,borderRadius:8,whiteSpace:"pre-wrap",fontSize:11,maxHeight:240,overflow:"auto",color:tx}}><div style={{fontWeight:700,marginBottom:5}}>{sel==="current"?"נוכחית":`גרסה ${Number(sel.split("-")[1])+1}`}</div>{val}</div>})}
              </div>
            </>}
          </div>}
        </div>}
      </div>}
      {activeTab === "checks" && <div>
        <div style={{ display:"flex", justifyContent:"flex-end", padding:"0 0 8px" }}>
          <B onClick={() => setScr("worddict")} sx={{ fontSize:13, padding:"8px 16px" }}>📖 {rtl ? "מילים בעייתיות" : "Problem words"}</B>
        </div>
      {/* SUNOPREP 5.0 HEALTH CHECK */}
        <div style={{ marginTop:12, padding:14, borderRadius:12, background:cd, border:`1px solid ${bd}` }}>
          <div style={{ fontWeight:800, color:tx }}>🧪 בדיקה אמיתית עם שיר — SunoPrep 9.2.4</div>
          <div style={{ fontSize:11, color:sb, marginTop:4 }}>בדיקה מרוכזת של שמירה, הקראה, נתוני פרויקט וחבילת Suno — בלי לשנות את השיר.</div>
          <div style={{display:"flex",gap:7,marginTop:9,flexWrap:"wrap"}}>
            <B sm onClick={()=>{ const checks=[
              ["טקסט מקור", !!src.trim()], ["גרסת Suno", !!(res||src).trim()],
              ["הקראה במכשיר", "speechSynthesis" in window], ["שמירה מקומית", (()=>{try{localStorage.setItem("sunoprep_health_test","1");localStorage.removeItem("sunoprep_health_test");return true}catch(e){return false}})()],
              ["פרויקטים", Array.isArray(projects)], ["Style Prompt", !!styTxt.trim()], ["כרטיס ביצוע", !!(performanceCard.verse||performanceCard.chorus||performanceCard.bridge||performanceCard.outro)], ["חבילת Suno", !!(res||src).trim() && !!styTxt.trim()]
            ]; setHealth(checks); }}>▶️ הרץ בדיקה</B>
            {health && <><B sm onClick={()=>setHealth(null)}>נקה תוצאה</B><B sm onClick={()=>{const report=health.map(([n,ok])=>`${ok?"✅":"❌"} ${n}: ${ok?"תקין":"דורש בדיקה"}`).join("\n"); navigator.clipboard?.writeText(`דוח בדיקה — SunoPrep 9.2.4\n${report}`).then(()=>alert("דוח הבדיקה הועתק."));}}>📋 העתק דוח</B></>}
          </div>
          {health && <div style={{marginTop:9,display:"grid",gap:5}}>{health.map(([n,ok])=><div key={n} style={{fontSize:12,color:ok?"#4caf50":"#e57373"}}>{ok?"✅":"❌"} {n}: {ok?"תקין":"דורש בדיקה"}</div>)}</div>}
        </div>

        {/* SUNOPREP 5.2 LEARNING FEEDBACK */}
        <div style={{ marginTop:12, padding:14, borderRadius:12, background:cd, border:`1px solid ${bd}` }}>
          <div style={{ fontWeight:800, color:tx }}>🎯 למידה אחרי Suno — מה באמת עבד?</div>
          <div style={{ fontSize:11, color:sb, marginTop:4 }}>אחרי ששמעת את השיר ב־Suno, שמור כאן את המילה, צורת ההגייה והתוצאה. רק סימון “יצא טוב” יעדכן את מילון ההגייה המועדף.</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7,marginTop:10}}>
            <input value={feedbackWord} onChange={e=>setFeedbackWord(e.target.value)} placeholder="המילה המקורית, למשל: אלייך" style={{padding:"9px 10px",borderRadius:9,border:`1px solid ${bd}`,background:bg,color:tx}} />
            <input value={feedbackPron} onChange={e=>setFeedbackPron(e.target.value)} placeholder="הגרסה שניסית ב־Suno" style={{padding:"9px 10px",borderRadius:9,border:`1px solid ${bd}`,background:bg,color:tx}} />
          </div>
          <input value={feedbackNote} onChange={e=>setFeedbackNote(e.target.value)} placeholder="הערה אופציונלית: מה בדיוק קרה בשירה?" style={{width:"100%",boxSizing:"border-box",marginTop:7,padding:"9px 10px",borderRadius:9,border:`1px solid ${bd}`,background:bg,color:tx}} />
          <div style={{display:"flex",gap:6,marginTop:8,flexWrap:"wrap"}}>
            <B sm onClick={()=>savePronFeedback("good")} dis={!feedbackWord.trim()||!feedbackPron.trim()}>✅ יצא טוב — שמור כמועדף</B>
            <B sm onClick={()=>savePronFeedback("bad")} dis={!feedbackWord.trim()||!feedbackPron.trim()}>❌ Suno טעה</B>
            <B sm onClick={()=>savePronFeedback("retry")} dis={!feedbackWord.trim()||!feedbackPron.trim()}>🔁 צריך לנסות שוב</B>
          </div>
          {pronFeedback.length>0 && <>
            <div style={{marginTop:10,padding:"9px",borderRadius:9,background:bg,border:`1px solid ${bd}`,fontSize:11,color:sb}}>
              ⭐ למידה חכמה: האפליקציה סופרת הצלחות וכישלונות לכל צורת הגייה. גרסה עם יותר הצלחות תיחשב מועדפת; גרסה עם יותר כישלונות תסומן כלא מומלצת.
              <div style={{marginTop:6,display:"grid",gap:4}}>
                {Object.entries(pronFeedback.reduce((a,x)=>{const k=x.word+"|"+x.pron; if(!a[k])a[k]={word:x.word,pron:x.pron,good:0,bad:0,retry:0}; a[k][x.status]++; return a;},{})).sort((a,b)=>(b[1].good-b[1].bad)-(a[1].good-a[1].bad)).slice(0,5).map(([k,v])=>{const score=v.good-v.bad; const icon=score>0?"⭐":score<0?"⚠️":"🔁"; const label=score>0?"מומלצת":score<0?"לא מומלצת":"עדיין בבדיקה"; return <div key={k}>{icon} <b>{v.word} → {v.pron}</b> — {label} (✅ {v.good} | ❌ {v.bad} | 🔁 {v.retry})</div>})}
              </div>
            </div>
            <div style={{marginTop:10,display:"grid",gap:6}}>
            {pronFeedback.slice(0,8).map(x=>{const icon=x.status==="good"?"✅":x.status==="bad"?"❌":"🔁"; const label=x.status==="good"?"עבד טוב":x.status==="bad"?"לא עבד":"לניסיון נוסף"; return <div key={x.id} style={{display:"flex",gap:7,alignItems:"center",padding:"8px",borderRadius:9,background:bg,border:`1px solid ${bd}`}}>
              <div style={{flex:1,minWidth:0}}><div style={{fontSize:12,fontWeight:700,color:tx}}>{icon} {x.word} ← {x.pron} <span style={{fontWeight:400,color:sb}}>({label})</span></div>{x.note&&<div style={{fontSize:10,color:sb,marginTop:2}}>{x.note}</div>}</div>
              <B sm onClick={()=>deletePronFeedback(x.id)}>🗑</B>
            </div>})}
          </div></>}
        </div>

        {/* WORKFLOW CHECKLIST */}
        <div style={{ marginTop:12, padding:14, borderRadius:12, background:cd, border:`1px solid ${bd}` }}>
          <div style={{ fontWeight:800, color:tx }}>✅ בדיקת זרימת עבודה — לפני Suno</div>
          <div style={{ fontSize:11, color:sb, marginTop:4 }}>רשימת בדיקה ברורה כדי לוודא שלא דילגת על שלב חשוב. הרשימה לא משנה את השיר.</div>
          <div style={{display:"grid",gap:6,marginTop:10}}>
            {[
              [src.trim().length>0,"נכתב או הודבק טקסט מקור"],
              [res.trim().length>0,"נוצרה גרסת Lyrics ל־Suno"],
              [src.trim()===res.trim(),"גרסת Suno עדיין זהה למקור — או שנבדקו השינויים"],
              [typeof window!=="undefined" && "speechSynthesis" in window,"מנוע הקראה זמין במכשיר"],
              [src.split("\n").filter(x=>x.trim()&&!/^\[.*\]$/.test(x.trim())).length>0,"נמצאו שורות שיר לבדיקה"],
              [projects.length>0,"יש לפחות פרויקט שמור"]
            ].map((x,i)=><div key={i} style={{display:"flex",gap:8,alignItems:"center",padding:"8px 9px",borderRadius:9,background:bg,border:`1px solid ${bd}`}}>
              <span>{x[0]?"🟢":"🟡"}</span><span style={{fontSize:12,color:tx,flex:1}}>{x[1]}</span>
              <span style={{fontSize:10,color:sb}}>{x[0]?"תקין":"כדאי להשלים"}</span>
            </div>)}
          </div>
          <div style={{marginTop:9,fontSize:11,color:sb}}>טיפ: לפני ההעתקה ל־Suno, השמע לפחות שורה אחת ובדוק את גרסת ה־Lyrics מול המקור.</div>
        </div>

        {/* SUNOPREP 9.0 STABILITY */}
        <div style={{ marginTop:12, padding:14, borderRadius:12, background:cd, border:`1px solid ${bd}` }}>
          <div style={{ fontWeight:800, color:tx }}>🛡️ מרכז יציבות ושמירה — 9.1</div>
          <div style={{ fontSize:11, color:sb, marginTop:4 }}>מצב הנתונים החשובים כרגע. שום פעולה כאן לא משנה את המילים.</div>
          <div style={{display:"grid",gap:6,marginTop:9}}>
            {[
              [!!src.trim(),"טקסט המקור קיים"],
              [!!(res||src).trim(),"Lyrics זמינים לחבילת Suno"],
              [!!styTxt.trim(),"Style Prompt מוכן"],
              [projects.length>0,"לפחות פרויקט אחד שמור"],
              [typeof localStorage!=="undefined","שמירה מקומית זמינה"]
            ].map(([ok,label],i)=><div key={i} style={{display:"flex",justifyContent:"space-between",gap:8,padding:"8px 9px",borderRadius:9,background:bg,border:`1px solid ${bd}`}}><span style={{fontSize:12,color:tx}}>{ok?"✅":"⚠️"} {label}</span><span style={{fontSize:10,color:sb}}>{ok?"תקין":"דורש השלמה"}</span></div>)}
          </div>
          <div style={{display:"flex",gap:7,flexWrap:"wrap",marginTop:9}}>
            <B sm onClick={()=>{try{localStorage.setItem("sunoprep_emergency_draft",JSON.stringify({src,res,styTxt,performanceCard,savedAt:new Date().toISOString()}));alert("טיוטת חירום נשמרה במכשיר.");}catch(e){alert("לא ניתן היה לשמור טיוטת חירום.");}}} dis={!src.trim()}>💾 שמור טיוטת חירום</B>
            <B sm onClick={()=>{try{const x=JSON.parse(localStorage.getItem("sunoprep_emergency_draft")||"null");if(!x){alert("לא נמצאה טיוטת חירום.");return;}if(window.confirm("להחזיר את טיוטת החירום? הטקסט הנוכחי יוחלף.")){setSrc(x.src||"");setRes(x.res||"");setCustSty(x.styTxt||"");if(x.performanceCard){setPerformanceCard(x.performanceCard);}}}catch(e){alert("טיוטת החירום פגומה.");}}}>↩️ שחזר טיוטת חירום</B>
          </div>
        </div>

          {/* 🎙️ ספריית הקולות — עברה לכאן מלשונית "קולות" */}
        <div style={{marginTop:14,borderTop:`1px dashed ${bd}`}}>
        <div style={{padding:"14px 12px"}}>
          <div style={{fontSize:18,fontWeight:800,marginBottom:5}}>🎙️ ספריית קולות ודוגמאות</div>
          <div style={{fontSize:12,color:sb,marginBottom:12}}>הקלט או העלה דוגמה כדי להשוות אופי קול וביצוע לשיר. הדוגמאות נשמרות במכשיר גם אחרי רענון. אפשר לבחור דוגמה פעילה ולהוסיף הערות.</div>
          <div style={{padding:12,border:`1px solid ${bd}`,borderRadius:12,background:cd}}>
            <input value={voiceName} onChange={e=>setVoiceName(e.target.value)} placeholder="שם הדוגמה, למשל: קול חם לפזמון" style={{width:"100%",boxSizing:"border-box",padding:"9px 10px",borderRadius:8,border:`1px solid ${bd}`,background:bg,color:tx,fontFamily:"inherit",marginBottom:8}}/>
            <div style={{fontSize:11,fontWeight:700,margin:"4px 0 6px"}}>🎛️ מאפייני קול מהירים</div><div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:7}}>{["חם","עמוק","עדין","מחוספס","צלול","עוצמתי","אינטימי","אנרגטי","מתאים לפזמון"].map(tag=><button key={tag} type="button" onClick={()=>setVoiceNotes(n=>n.includes(tag)?n:(n?`${n}, ${tag}`:tag))} style={{padding:"5px 8px",borderRadius:999,border:`1px solid ${bd}`,background:bg,color:tx,cursor:"pointer",fontFamily:"inherit",fontSize:10}}>{tag}</button>)}</div><textarea value={voiceNotes} onChange={e=>setVoiceNotes(e.target.value)} placeholder="הערות: חם, עמוק, עדין, מתאים לפזמון..." style={{width:"100%",boxSizing:"border-box",padding:"8px",borderRadius:8,border:`1px solid ${bd}`,background:bg,color:tx,fontFamily:"inherit",minHeight:52,marginBottom:8}}/>
            <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
              <label style={{padding:"8px 11px",borderRadius:9,border:`1px solid ${bd}`,cursor:"pointer",fontSize:12}}>📁 העלה קובץ<input type="file" accept="audio/*" style={{display:"none"}} onChange={async e=>{const f=e.target.files&&e.target.files[0];if(!f)return;const s={id:Date.now(),name:voiceName.trim()||f.name,notes:voiceNotes.trim(),type:"קובץ",blob:f};await voiceDBPut(s);setVoiceSamples(v=>[...v,{...s,url:URL.createObjectURL(f)}]);setVoiceName("");setVoiceNotes("");e.target.value="";}}/></label>
              <B sm act={recording} onClick={async()=>{if(recording){mediaRecorderRef.current&&mediaRecorderRef.current.stop();return;} try{const stream=await navigator.mediaDevices.getUserMedia({audio:true});const mr=new MediaRecorder(stream);voiceChunksRef.current=[];mr.ondataavailable=e=>voiceChunksRef.current.push(e.data);mr.onstop=()=>{const blob=new Blob(voiceChunksRef.current,{type:mr.mimeType||"audio/webm"});const s={id:Date.now(),name:voiceName.trim()||`הקלטה ${new Date().toLocaleTimeString()}`,notes:voiceNotes.trim(),type:"הקלטה",blob};voiceDBPut(s).catch(()=>{});setVoiceSamples(v=>[...v,{...s,url:URL.createObjectURL(blob)}]);setVoiceName("");setVoiceNotes("");setRecording(false);stream.getTracks().forEach(t=>t.stop());};mediaRecorderRef.current=mr;mr.start();setRecording(true);}catch(err){alert("לא התקבלה הרשאה למיקרופון.");}}}>{recording?"⏹ עצור ושמור":"🎤 הקלט מהמיקרופון"}</B>
            </div>
          </div>
          <div style={{marginTop:12,display:"grid",gap:8}}>
            {voiceSamples.length===0 && <div style={{padding:18,textAlign:"center",color:sb,border:`1px dashed ${bd}`,borderRadius:12}}>עדיין אין דוגמאות קול. אפשר להעלות קובץ או להקליט מהמיקרופון.</div>}
            {voiceSamples.map(s=><div key={s.id} style={{padding:10,border:`1px solid ${bd}`,borderRadius:10,background:cd}}>
              <div style={{display:"flex",justifyContent:"space-between",gap:8,alignItems:"center"}}><b style={{fontSize:13}}>🎙️ {s.name}</b><B sm onClick={()=>{voiceDBDelete(s.id).catch(()=>{});URL.revokeObjectURL(s.url);setVoiceSamples(v=>v.filter(x=>x.id!==s.id));}}>🗑️ מחק</B></div>
              <div style={{fontSize:10,color:sb,margin:"4px 0"}}>{s.type}{s.notes?` · ${s.notes}`:""}</div><div style={{marginBottom:7,display:"flex",gap:6,flexWrap:"wrap"}}><B sm onClick={()=>navigator.clipboard&&navigator.clipboard.writeText(s.notes||"")}>📋 העתק תיאור</B><B sm act={String(activeVoiceId)===String(s.id)} onClick={()=>{const id=String(s.id);setActiveVoiceId(id);localStorage.setItem("sunoprep_active_voice",id);}}>{String(activeVoiceId)===String(s.id)?"⭐ דוגמה פעילה":"☆ בחר כדוגמה פעילה"}</B></div><audio controls src={s.url} style={{width:"100%"}} />
            </div>)}
          </div>
          <div style={{marginTop:12,padding:11,borderRadius:10,background:`${c.a}10`,border:`1px solid ${c.a}35`,fontSize:11,color:sb}}>
<b>✨ המלצת אופי קול לפי השיר</b><div style={{marginTop:5}}>ההמלצה משתמשת במילות השיר ובסגנון הנוכחי כדי להציע כיוון התחלתי.</div>
<B sm onClick={()=>setVoiceRecommendation(suggestVoiceProfile(src, style))}>✨ הצע אופי קול לשיר</B>
{voiceRecommendation && (()=>{const rec=voiceRecommendation.split(",").map(x=>x.trim()).filter(Boolean);const active=voiceSamples.find(x=>String(x.id)===String(activeVoiceId));const notes=(active?.notes||"").toLowerCase();const hits=rec.filter(x=>notes.includes(x));const score=active?Math.round((hits.length/Math.max(1,rec.length))*100):0;const label=!active?"בחר דוגמה פעילה":score>=70?"התאמה גבוהה":score>=35?"התאמה בינונית":"כדאי לנסות כיוון אחר";return <div style={{marginTop:9,padding:9,borderRadius:9,background:bg,border:`1px solid ${bd}`}}>
<div><b>הכיוון המומלץ:</b> {voiceRecommendation}</div>
<div style={{marginTop:5}}><b>התאמת הדוגמה הפעילה:</b> {label}{active&&` — ${score}%`}</div>
{active&&<div style={{fontSize:10,color:sb,marginTop:3}}>הדוגמה: {active.name}{active.notes?` · ${active.notes}`:""}</div>}
<div style={{display:"flex",gap:6,flexWrap:"wrap",marginTop:7}}><B sm onClick={()=>{const a=voiceSamples.find(x=>String(x.id)===String(activeVoiceId));if(a){const updated={...a,notes:[a.notes,voiceRecommendation].filter(Boolean).join(", ")};voiceDBPut({...updated,blob:a.blob}).catch(()=>{});setVoiceSamples(v=>v.map(x=>x.id===a.id?updated:x));}}} disabled={!active}>✅ החל את ההמלצה לדוגמה</B><B sm onClick={()=>setVoiceRecommendation(suggestVoiceProfile(src+" "+ideaMood, style+" "+ideaType))}>🔄 נסה שוב</B></div>
</div>})()}
</div>
          <div style={{marginTop:12,padding:11,borderRadius:10,background:`${c.a}0d`,border:`1px solid ${c.a}35`,fontSize:11,color:sb}}>
            <b>🎭 פרופילי ביצוע לשיר</b>
            <div style={{marginTop:5}}>בחר כיוון ביצוע כדי לייצר כמה גרסאות לאותו שיר בלי לאבד את הבחירה הקודמת.</div>
            <div style={{display:"flex",gap:6,flexWrap:"wrap",marginTop:8}}>
              {["אינטימי","עוצמתי","קצבי","רגשי","דרמטי"].map(p=><B sm act={performanceProfile===p} onClick={()=>{setPerformanceProfile(p);localStorage.setItem("sunoprep_performance_profile",p);}} key={p}>{p}</B>)}
            </div>
            <div style={{marginTop:8,padding:8,borderRadius:8,background:bg,border:`1px solid ${bd}`}}>
              <b>הפרופיל הפעיל:</b> {performanceProfile}
              <div style={{marginTop:4}}>הוא ישמש כהכוונה לכרטיס הביצוע ול־Style Prompt, לצד אופי הקול שנבחר.</div>
              <div style={{display:"flex",gap:6,flexWrap:"wrap",marginTop:7}}>
                <B sm onClick={()=>{const item={id:Date.now(),name:performanceProfile,voice:voiceRecommendation||"",notes:(voiceSamples.find(x=>String(x.id)===String(activeVoiceId))?.notes||""),created:new Date().toLocaleString()};const next=[item,...savedPerformanceProfiles].slice(0,12);setSavedPerformanceProfiles(next);localStorage.setItem("sunoprep_performance_profiles",JSON.stringify(next));}}>💾 שמור פרופיל</B>
                <B sm onClick={()=>{const active=voiceSamples.find(x=>String(x.id)===String(activeVoiceId));const text=`Performance: ${performanceProfile}. Vocal character: ${voiceRecommendation||active?.notes||"בחר אופי קול"}.`;navigator.clipboard&&navigator.clipboard.writeText(text);}}>📋 העתק ל־Style Prompt</B>
              </div>
            </div>
            {savedPerformanceProfiles.length>0&&<div style={{marginTop:8}}><b>פרופילים שמורים:</b>{savedPerformanceProfiles.map(p=><div key={p.id} style={{marginTop:5,padding:7,borderRadius:8,border:`1px solid ${bd}`,background:bg,display:"flex",justifyContent:"space-between",gap:6}}><span>{p.name}{p.voice?` · ${p.voice}`:""}</span><span><B sm onClick={()=>{setPerformanceProfile(p.name);localStorage.setItem("sunoprep_performance_profile",p.name);}}>טען</B> <B sm onClick={()=>{const next=savedPerformanceProfiles.filter(x=>x.id!==p.id);setSavedPerformanceProfiles(next);localStorage.setItem("sunoprep_performance_profiles",JSON.stringify(next));}}>🗑️</B></span></div>)}</div>}
          </div>
        </div>
        </div>
        </div>}
      {activeTab === "projects" && <div>
      {/* PROJECTS */}
        <div style={{ marginTop:12, padding:14, borderRadius:12, background:cd, border:`1px solid ${bd}` }}>
          <div style={{ fontWeight:800, color:tx }}>💾 פרויקטים — שמור וחזור לשיר</div>
          <div style={{ fontSize:11, color:sb, marginTop:4 }}>נשמרים במכשיר הזה: טקסט המקור וגרסת Suno. אפשר לחזור לשיר בלי לאבד עבודה.</div>
          <div style={{display:"flex",gap:6,marginTop:9,flexWrap:"wrap"}}>
            <input value={projectName} onChange={e=>setProjectName(e.target.value)} placeholder="שם השיר" style={{flex:"1 1 160px",padding:"9px 10px",borderRadius:9,border:`1px solid ${bd}`,background:bg,color:tx}} />
            <B sm onClick={saveProject} dis={!src.trim()}>💾 שמור פרויקט</B>
            <B sm onClick={() => document.getElementById("proj-import")?.click()}>📂 {rtl ? "ייבא קובץ" : "Import file"}</B>
            <input id="proj-import" type="file" accept=".json" onChange={importProject} style={{display:"none"}} />
          </div>
          {projects.length>0 && <div style={{marginTop:10,display:"grid",gap:6}}>
            {projects.slice(0,8).map(p=><div key={p.id} style={{display:"flex",alignItems:"center",gap:6,padding:"8px",borderRadius:9,background:bg,border:`1px solid ${bd}`}}>
              <div style={{flex:1,minWidth:0}}><div style={{fontWeight:700,color:tx,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.name}</div><div style={{fontSize:10,color:sb}}>{new Date(p.updatedAt).toLocaleString("he-IL")}</div></div>
              <B sm onClick={()=>loadProject(p)}>פתח</B><B sm onClick={()=>exportProject(p)} sx={{fontSize:11}} title={rtl?"ייצא כקובץ":"Export as file"}>📤</B><B sm onClick={()=>deleteProject(p.id)}>🗑</B>
            </div>)}
          </div>}
        </div>

        </div>}
      {activeTab === "suno" && <div>
        <div style={{ display:"flex", justifyContent:"flex-end", padding:"0 0 8px" }}>
          <B onClick={share} sx={{ fontSize:13, padding:"8px 16px" }}>📤 {rtl ? "שתף טקסט" : "Share text"}</B>
        </div>
      {/* PRINT */}
        <div style={{ display: "flex", justifyContent: "center", gap: 6, flexWrap: "wrap" }}>
          <B sm onClick={() => print("lyrics")} dis={!res}>🖨 {t.prtLyr}</B>
          <B sm onClick={() => print("style")} dis={!styTxt}>🖨 {t.prtSty}</B>
          <B sm onClick={() => print("both")} dis={!res && !styTxt}>🖨 {t.prtAll}</B>
        </div>


        {/* SUNO STYLE PROMPT */}
        <div style={{ background: cd, border: `1px solid ${bd}`, borderRadius: 14, padding: 14, marginTop: 12 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: ca, marginBottom: 6 }}>✨ {rtl ? "Style Prompt מוכן ל־Suno" : "Suno-ready Style Prompt"}</div>
          <div style={{ fontSize: 11, color: sb, marginBottom: 8 }}>{rtl ? "נוצר מהסגנון, הקול וה־BPM שבחרת. אפשר לערוך לפני ההעתקה." : "Built from your selected style, vocal and BPM. Edit before copying."}</div>
          <textarea value={styTxt} onChange={e=>setCustSty(e.target.value)} dir="ltr" style={{width:"100%",minHeight:100,resize:"vertical",padding:10,borderRadius:10,border:`1px solid ${bd}`,background:bg,color:tx,fontSize:12,lineHeight:1.5}} />
          <div style={{display:"flex",gap:7,flexWrap:"wrap",marginTop:8}}>
            <B sm onClick={()=>navigator.clipboard?.writeText(styTxt)} dis={!styTxt}>📋 {rtl ? "העתק Style Prompt" : "Copy Style Prompt"}</B>
            <B sm onClick={()=>setCustSty("")}>↺ {rtl ? "אפס עריכה ידנית" : "Reset manual edit"}</B>
          </div>
        </div>


        {/* SUNO PACKAGE */}
        <div style={{ background: cd, border: `2px solid ${c.a}`, borderRadius: 14, padding: 14, marginTop: 12 }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: ca }}>📦 {rtl ? "חבילת Suno — הכול במקום אחד" : "Suno Package — everything in one place"}</div>
          <div style={{ fontSize: 11, color: sb, marginTop: 4, marginBottom: 10 }}>{rtl ? "בדיקה אחרונה והעתקה נפרדת של המילים, ה־Style Prompt ותיאור הביצוע." : "Final check and separate copy buttons for lyrics, style and performance."}</div>
          <div style={{display:"grid",gap:7,fontSize:12,color:tx}}>
            <div>🎵 Lyrics: { (res||src).trim() ? "✅" : "⚠️" } {rtl ? ((res||src).trim()?"מוכנים":"חסרים") : ((res||src).trim()?"Ready":"Missing")}</div>
            <div>✨ Style Prompt: {styTxt.trim()?"✅":"⚠️"} {styTxt.trim()?(rtl?"מוכן":"Ready"):(rtl?"חסר":"Missing")}</div>
            <div>🎭 Performance: {performanceCard.verse||performanceCard.chorus||performanceCard.bridge||performanceCard.outro?"✅":"⚠️"} {rtl?"כרטיס ביצוע":"Performance card"}</div>
          </div>
          {(() => {
            const lim = SUNO_LIMITS[limProf] || SUNO_LIMITS.v45;
            const lyr = (res || src).length, sty = styTxt.length;
            const row = (label, n, max) => {
              const pct = n / max, col = n > max ? (day ? "#B3261E" : "#E24B4A") : pct > 0.9 ? (day ? "#9A5B00" : "#E8A33D") : okC;
              return (
                <div style={{ marginTop: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5, color: tx, direction: "ltr" }}>
                    <span>{label}</span><span style={{ color: col, fontWeight: 600 }}>{n.toLocaleString()} / {max.toLocaleString()}{n > max ? `  (+${(n - max).toLocaleString()})` : ""}</span>
                  </div>
                  <div style={{ height: 5, borderRadius: 3, background: `${bd}`, marginTop: 3, overflow: "hidden" }}>
                    <div style={{ width: `${Math.min(100, pct * 100)}%`, height: "100%", background: col }} />
                  </div>
                  {n > max && <div style={{ fontSize: 11, color: col, marginTop: 3 }}>{rtl ? `⚠️ ארוך מדי ב־${(n - max).toLocaleString()} תווים — Suno יחתוך או יסרב. קצר לפני ההעתקה.` : `⚠️ Over the limit by ${(n - max).toLocaleString()} characters — Suno will truncate or refuse. Shorten before copying.`}</div>}
                </div>
              );
            };
            return (
              <div style={{ marginTop: 10, paddingTop: 8, borderTop: `1px dashed ${bd}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", fontSize: 11, color: sb }}>
                  <span>{rtl ? "מגבלות Suno לפי גרסת מודל:" : "Suno limits by model:"}</span>
                  {Object.entries(SUNO_LIMITS).map(([k, v]) => <B key={k} sm act={limProf === k} onClick={() => setLimProf(k)}>{v.label}</B>)}
                </div>
                {row("Lyrics", lyr, lim.lyr)}
                {row("Style", sty, lim.sty)}
                <div style={{ fontSize: 10, color: sb, marginTop: 6 }}>{rtl ? "המגבלות משתנות בין גרסאות של Suno — אם המספרים אצלך שונים, בחר את הפרופיל הקרוב ובדוק באתר." : "Limits vary by Suno version — if yours differ, pick the closest profile and check the site."}</div>
              </div>
            );
          })()}
          <div style={{display:"flex",gap:7,flexWrap:"wrap",marginTop:10}}>
            <B sm onClick={()=>navigator.clipboard?.writeText(res||src)} dis={!(res||src).trim()}>📋 {rtl?"העתק Lyrics":"Copy Lyrics"}</B>
            <B sm onClick={()=>navigator.clipboard?.writeText(styTxt)} dis={!styTxt.trim()}>✨ {rtl?"העתק Style":"Copy Style"}</B>
            <B sm onClick={()=>navigator.clipboard?.writeText(`Performance: ${performanceCard.verse} verses, ${performanceCard.chorus} chorus, ${performanceCard.bridge} bridge, ${performanceCard.outro} outro.`)}>🎭 {rtl?"העתק ביצוע":"Copy Performance"}</B>
            <B sm onClick={()=>navigator.clipboard?.writeText(`LYRICS:
${res||src}

STYLE PROMPT:
${styTxt}

PERFORMANCE:
${performanceCard.verse} verses, ${performanceCard.chorus} chorus, ${performanceCard.bridge} bridge, ${performanceCard.outro} outro.`)} dis={!(res||src).trim()}>📦 {rtl?"העתק הכול":"Copy All"}</B>
          </div>
        </div>

        </div>}
      {/* FOOTER */}
      {err && <div role="alert" onClick={() => setErr("")} style={{ position: "fixed", insetInline: 12, bottom: 84, zIndex: 9998, padding: "11px 14px", borderRadius: 12, background: day ? "#FFF1F1" : "#3A1515", border: `1px solid ${day ? "#E88" : "#7A2a2a"}`, color: day ? "#B42318" : "#FFB4B4", fontSize: 13, lineHeight: 1.5, boxShadow: "0 8px 24px rgba(0,0,0,.35)", display: "flex", gap: 10, alignItems: "flex-start", cursor: "pointer", direction: rtl ? "rtl" : "ltr" }}>
        <span style={{ flex: 1 }}>⚠️ {err}</span><span style={{ opacity: .7 }}>✕</span>
      </div>}
        <div style={{ textAlign: "center", padding: "14px 0 6px", borderTop: `1px solid ${bd}`, fontSize: 10, color: sb }}>
          SunoPrep 10.1 by Barak Aflalo — © AppNest 2026
        </div>
      </div>
    </div>
  );
}


const VOICE_DB_NAME = "sunoprep_voice_library";
const VOICE_STORE = "samples";
function openVoiceDB(){
  return new Promise((resolve,reject)=>{
    const req=indexedDB.open(VOICE_DB_NAME,1);
    req.onupgradeneeded=()=>{ if(!req.result.objectStoreNames.contains(VOICE_STORE)) req.result.createObjectStore(VOICE_STORE,{keyPath:"id"}); };
    req.onsuccess=()=>resolve(req.result); req.onerror=()=>reject(req.error);
  });
}
async function voiceDBAll(){ const db=await openVoiceDB(); return new Promise((resolve,reject)=>{const r=db.transaction(VOICE_STORE,"readonly").objectStore(VOICE_STORE).getAll();r.onsuccess=()=>resolve(r.result||[]);r.onerror=()=>reject(r.error);});}
async function voiceDBPut(x){const db=await openVoiceDB();return new Promise((resolve,reject)=>{const r=db.transaction(VOICE_STORE,"readwrite").objectStore(VOICE_STORE).put(x);r.onsuccess=()=>resolve();r.onerror=()=>reject(r.error);});}
async function voiceDBDelete(id){const db=await openVoiceDB();return new Promise((resolve,reject)=>{const r=db.transaction(VOICE_STORE,"readwrite").objectStore(VOICE_STORE).delete(id);r.onsuccess=()=>resolve();r.onerror=()=>reject(r.error);});}
function suggestVoiceProfile(lyrics, style) {
  const t = `${lyrics||""} ${style||""}`.toLowerCase();
  const tags = [];
  if (/אהב|געגוע|לב|לילה|רגש/.test(t)) tags.push("חם", "אינטימי");
  if (/ריקוד|קצבי|מסיבה|אנרג/.test(t)) tags.push("אנרגטי", "עוצמתי");
  if (/בלדה|שקט|עדין|כאב|פרידה/.test(t)) tags.push("עדין", "עמוק");
  if (!tags.length) tags.push("חם", "צלול", "מאוזן");
  return [...new Set(tags)].slice(0,4).join(", ");
}

const __root = ReactDOM.createRoot(document.getElementById("root"));
__root.render(React.createElement(SunoPrep));
