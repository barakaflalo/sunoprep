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
    aboutTxt: "SunoPrep הוא כלי מתקדם להכנת שירים לפלטפורמת Suno AI.\n\nהכלי פותר את הבעיה המרכזית של שירה בשפות שסונו מתקשה בהן (עברית, ערבית, רוסית ועוד) באמצעות 4 מצבי המרה: תעתיק מלא ללטינית, היברידי, עברית מנוקדת מותאמת, ועברית ישירה.\n\nתכונות עיקריות:\n• 4 מצבי המרה לבחירה\n• בניית סגנון מוזיקלי עם ז'אנרים, סוג קול, BPM\n• סגנונות מועדפים אישיים (⭐)\n• תגיות מבנה שיר + תגיות קול (דואט, מקהלה...)\n• תבניות שיר מוכנות (פופ, ראפ, בלדה)\n• השמעה (TTS) עם שליטת מהירות\n• השוואה A/B בין מקור לתוצאה\n• מונה הברות לכל שורה\n• מילון מילים בעייתיות\n• היסטוריית שירים\n• הנחיית מבטא ישראלי אוטומטית\n• הדפסה, שיתוף, ייצוא/ייבוא גיבוי\n• 5 שפות ממשק, 9 שפות מקור\n• 4 ערכות צבע + מצב יום/לילה\n• עובד בדפדפן — בלי שרת, בלי התקנה",
    ver: "גרסה 2.0", back: "← חזרה לדף הבית",
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
    aboutTxt: "SunoPrep is an advanced tool for preparing songs for Suno AI.\n\nIt solves the core problem of singing in languages Suno struggles with (Hebrew, Arabic, Russian, etc.) through 4 conversion modes: full Latin transliteration, hybrid, optimized Hebrew with nikud, and direct Hebrew.\n\nKey features:\n• 4 conversion modes\n• Music style builder with genres, voice types, BPM\n• Personal favorite styles (⭐)\n• Song structure + voice tags (duet, choir...)\n• Ready-made song templates (Pop, Rap, Ballad)\n• TTS playback with speed control\n• A/B comparison between source and result\n• Syllable counter per line\n• Problem words dictionary\n• Song history\n• Auto Israeli accent hint\n• Print, share, export/import backup\n• 5 UI languages, 9 source languages\n• 4 color themes + day/night mode\n• Runs in browser — no server, no install",
    ver: "Version 2.0", back: "← Back to home",
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
    aboutTxt: "Продвинутый инструмент подготовки песен для Suno AI. 4 режима конвертации, построитель стилей, история песен, словарь проблемных слов.", ver: "Версия 2.0", back: "← Назад",
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
    aboutTxt: "Herramienta avanzada para preparar canciones para Suno AI. 4 modos de conversión, constructor de estilos, historial, diccionario de palabras problemáticas.", ver: "v2.0", back: "← Volver",
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
    aboutTxt: "أداة متقدمة لإعداد أغاني Suno AI. 4 أوضاع تحويل، منشئ أنماط، سجل الأغاني، قاموس الكلمات المشكلة.", ver: "v2.0", back: "← العودة",
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
};

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

const GEMINI_MODELS = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-flash-latest", "gemini-1.5-flash"];

async function callGemini(keys, prompt) {
  const keyList = Array.isArray(keys) ? keys : [keys];
  let lastErr = null;
  for (const key of keyList) {
    for (const model of GEMINI_MODELS) {
      const genCfg = { temperature: 0.3, maxOutputTokens: 6000 };
      if (model.startsWith("gemini-2.5")) genCfg.thinkingConfig = { thinkingBudget: 0 };
      try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: genCfg }),
        });
        if (res.ok) {
          const d = await res.json();
          return d?.candidates?.[0]?.content?.parts?.[0]?.text || "";
        }
        const e = await res.json().catch(() => ({}));
        lastErr = new Error(e?.error?.message || `HTTP ${res.status}`);
        if (![404, 429, 500, 503].includes(res.status)) throw lastErr;
      } catch (e) { lastErr = e; }
    }
  }
  throw lastErr || new Error("Gemini unavailable");
}

async function callOpenAICompat(url, key, prompt, model) {
  const h = { "Content-Type": "application/json" };
  if (key) h["Authorization"] = "Bearer " + key;
  const res = await fetch(url, {
    method: "POST", headers: h,
    body: JSON.stringify({ model: model || "gpt-4o-mini", max_tokens: 3000, messages: [{ role: "user", content: prompt }] }),
  });
  if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e?.error?.message || `HTTP ${res.status}`); }
  const d = await res.json();
  return d?.choices?.[0]?.message?.content || "";
}

async function callClaude(key, prompt) {
  const h = { "Content-Type": "application/json" };
  if (key) { h["x-api-key"] = key; h["anthropic-version"] = "2023-06-01"; h["anthropic-dangerous-direct-browser-access"] = "true"; }
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST", headers: h,
    body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 3000, messages: [{ role: "user", content: prompt }] }),
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
  const [src, setSrc] = useState("");
  const [res, setRes] = useState("");
  const [sLang, setSLang] = useState("he");
  const [uLang, setULang] = useState("he");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [tMode, setTMode] = useState("full");
  const [showVoiceTip, setShowVoiceTip] = useState(true);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [aiProvider, setAiProvider] = useState(null);
  const [aiKeys, setAiKeys] = useState({ gemini: "", claude: "", openai: "", deviceUrl: "http://localhost:11434/v1", customUrl: "", customKey: "" });
  const [selProvider, setSelProvider] = useState(null);
  const [testState, setTestState] = useState(null);
  const [selSty, setSelSty] = useState([]);
  const [selVocal, setSelVocal] = useState([]);
  const [custSty, setCustSty] = useState("");
  const [bpmVal, setBpmVal] = useState(0);
  const [savedSty, setSavedSty] = useState([]);
  const [editStyId, setEditStyId] = useState(null);
  const [editStyLabel, setEditStyLabel] = useState("");
  const [rate, setRate] = useState(1.0);
  const [speaking, setSpeaking] = useState(null);
  const [cpd, setCpd] = useState(null);
  const [theme, setTheme] = useState("gold");
  const [day, setDay] = useState(false);
  const [uname, setUname] = useState("");
  const [vCount, setVCount] = useState(1);
  const [guide, setGuide] = useState(false);
  const [gStep, setGStep] = useState(0);
  const [delSt, setDelSt] = useState(0);
  const [history, setHistory] = useState([]);
  const [wordDict, setWordDict] = useState({});
  const [showSylCount, setShowSylCount] = useState(true);
  const [selectedLine, setSelectedLine] = useState(0);
  const srcRef = useRef(null);
  const fileRef = useRef(null);

  const c = TH[theme];
  const bg = day ? c.bgL : c.bg;
  const cd = day ? c.cdL : c.cd;
  const bd = day ? c.bdL : c.bd;
  const tx = day ? "#1A1A1A" : "#E8E6E0";
  const sb = day ? "#777" : "#888";
  const t = TR[uLang] || TR.en;
  const rtl = ["he", "ar"].includes(uLang);
  const sl = LANGS[sLang];

  const accentHint = sLang === "he" ? "Israeli Hebrew pronunciation, native Israeli accent" : sLang === "ar" ? "native Arabic pronunciation" : "";
  const bpmText = bpmVal > 0 ? `${bpmVal} BPM` : "";
  const allStyles = [...STYLES, ...savedSty.map(s => ({ id: s.id, p: s.prompt }))];
  const styTxt = [...selSty.map(id => allStyles.find(s => s.id === id)?.p).filter(Boolean), ...selVocal.map(id => VOCAL_STYLES.find(s => s.id === id)?.p).filter(Boolean), bpmText, custSty.trim(), accentHint].filter(Boolean).join(", ");


  const lyricLines = src.split("\n").filter(l => l.trim() && !/^\s*[\[(]/.test(l));
  const speakLine = (line, slow=false) => {
    window.speechSynthesis.cancel();
    if (!line) return;
    const u = new SpeechSynthesisUtterance(line.trim());
    u.lang = sl.tts; u.rate = slow ? Math.max(0.55, rate - 0.3) : rate;
    u.onend = () => setSpeaking(null); u.onerror = () => setSpeaking(null);
    setSpeaking("line"); window.speechSynthesis.speak(u);
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
    
    // No AI connected: use offline rule-based engine
    if (!aiProvider) {
      if (m === "hybrid" || m === "optimized") {
        setErr(rtl ? "המצב הזה דורש חיבור AI. עובר לתעתיק מקומי..." : "This mode requires an AI connection. Using offline engine...");
        setTimeout(() => setErr(""), 3500);
      }
      setRes(ruleTranslit(src));
      return;
    }
    
    setLoading(true); setErr("");
    
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

    const prompt = m === "hybrid" ? hybridPrompt : m === "optimized" ? optimizedPrompt : fullPrompt;

    try {
      const out = await callAI(prompt);
      if (out?.trim()) setRes(out.trim());
      else setErr(t.errCon);
    } catch (e) {
      let msg = String(e?.message || e);
      if (msg.length > 90) msg = msg.slice(0, 90) + "...";
      setErr(msg);
    }
    setLoading(false);
  };

  const callAI = async (prompt) => {
    const p = aiProvider;
    if (p === "gemini") {
      const keys = aiKeys.gemini.split(/[\n,;]+/).map(s => s.trim()).filter(Boolean);
      return await callGemini(keys, prompt);
    }
    if (p === "claude") return await callClaude(aiKeys.claude, prompt);
    if (p === "builtin") return await callClaude("", prompt);
    if (p === "openai") return await callOpenAICompat("https://api.openai.com/v1/chat/completions", aiKeys.openai, prompt, "gpt-4o-mini");
    if (p === "device") return await callOpenAICompat(aiKeys.deviceUrl.replace(/\/+$/, "") + "/chat/completions", "", prompt, "llama3");
    if (p === "custom") return await callOpenAICompat(aiKeys.customUrl, aiKeys.customKey, prompt, "gpt-4o-mini");
    throw new Error("No provider");
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
    u.lang = isSrc ? sl.tts : (tMode === "optimized" || tMode === "hebrew" || tMode === "hybrid") ? sl.tts : "en-US"; u.rate = rate;
    u.onend = () => setSpeaking(null); u.onerror = () => setSpeaking(null);
    setSpeaking(k); window.speechSynthesis.speak(u);
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

  const expBk = () => {
    const d = JSON.stringify({ src, res, selSty, selVocal, custSty, bpmVal, savedSty, uname, sLang, uLang, theme, day }, null, 2);
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([d], { type: "application/json" }));
    a.download = `sunoprep-backup-${new Date().toISOString().slice(0, 10)}.json`; a.click();
  };

  const impBk = (e) => {
    const f = e.target.files?.[0]; if (!f) return;
    const r = new FileReader();
    r.onload = (ev) => {
      try {
        const d = JSON.parse(ev.target.result);
        if (d.src !== undefined) setSrc(d.src); if (d.res !== undefined) setRes(d.res);
        if (d.selSty) setSelSty(d.selSty); if (d.selVocal) setSelVocal(d.selVocal); if (d.custSty !== undefined) setCustSty(d.custSty); if (d.bpmVal !== undefined) setBpmVal(d.bpmVal); if (d.savedSty) setSavedSty(d.savedSty);
        if (d.uname) setUname(d.uname); if (d.sLang) setSLang(d.sLang);
        if (d.uLang) setULang(d.uLang); if (d.theme) setTheme(d.theme);
        if (d.day !== undefined) setDay(d.day);
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
        uB.lang = (tMode === "optimized" || tMode === "hebrew" || tMode === "hybrid") ? sl.tts : "en-US";
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

  const B = ({ children, onClick, pri, act, dis, sm, sx }) => (
    <button onClick={onClick} disabled={dis} style={{
      background: pri ? c.a : act ? `${c.a}22` : "transparent",
      color: pri ? (day ? "#fff" : "#0B0B0F") : act ? c.a : tx,
      border: pri ? "none" : `1px solid ${act ? c.a : bd}`,
      padding: sm ? "5px 10px" : pri ? "12px 24px" : "8px 14px",
      borderRadius: 10, cursor: dis ? "not-allowed" : "pointer",
      fontSize: sm ? 12 : pri ? 15 : 13, fontWeight: pri ? 600 : 400,
      fontFamily: "inherit", opacity: dis ? 0.5 : 1, transition: "all .15s", ...sx,
    }}>{children}</button>
  );

  /* ── GUIDE ── */
  if (guide) {
    const s = t.gSteps[gStep];
    return (
      <div style={{ background: bg, color: tx, minHeight: "100vh", direction: rtl ? "rtl" : "ltr", fontFamily: "'Segoe UI',sans-serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 30 }}>
        <div style={{ fontSize: 50, marginBottom: 16 }}>{s.i}</div>
        <div style={{ fontSize: 20, fontWeight: 600, color: c.a, marginBottom: 8 }}>{s.t}</div>
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
            <span style={{ minWidth: 18, height: 18, borderRadius: "50%", background: `${c.a}20`, color: c.a, fontSize: 10, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>{i + 1}</span>
            <span style={{ fontSize: 12, color: sb, lineHeight: 1.55 }}>{s}</span>
          </div>
        ))}
      </div>
    );
    return (
      <div style={{ background: bg, color: tx, minHeight: "100vh", direction: rtl ? "rtl" : "ltr", fontFamily: "'Segoe UI',sans-serif", padding: 20 }}>
        <B onClick={() => setScr("home")}>{t.back}</B>
        <h2 style={{ fontSize: 20, fontWeight: 600, color: c.a, margin: "14px 0 6px" }}>🔌 {st.title}</h2>

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
                  <div style={{ fontSize: 13.5, fontWeight: 500, color: on ? c.a : tx }}>{nm}</div>
                  <div style={{ fontSize: 11, color: sb, marginTop: 2 }}>{p.desc[uLang] || p.desc.en}</div>
                </div>
                <span style={{ fontSize: 10, padding: "3px 9px", borderRadius: 11, background: bc.bg, color: bc.fg, fontWeight: 500, flexShrink: 0 }}>{p.badge[uLang] || p.badge.en}</span>
                {on && <span style={{ color: c.a, fontSize: 15, flexShrink: 0 }}>✓</span>}
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
              <Steps items={st.gemini.steps} />
              <div style={{ marginTop: 11, padding: "9px 12px", background: "#0F6E5615", border: "1px solid #0F6E5635", borderRadius: 8, fontSize: 11.5, color: "#3DAA7D", lineHeight: 1.55 }}>{st.gemini.note}</div>
              <div style={{ marginTop: 9 }}><a href="https://aistudio.google.com" target="_blank" rel="noreferrer" style={{ color: c.a, fontSize: 12 }}>→ aistudio.google.com</a></div>
            </>)}

            {selProvider === "claude" && (<>
              <Field label={st.claude.label} value={aiKeys.claude} onChange={v => setAiKeys(k => ({ ...k, claude: v }))} ph={st.claude.ph} type="password" />
              <Steps items={st.claude.steps} />
              <div style={{ marginTop: 9 }}><a href="https://console.anthropic.com" target="_blank" rel="noreferrer" style={{ color: c.a, fontSize: 12 }}>→ console.anthropic.com</a></div>
            </>)}

            {selProvider === "openai" && (<>
              <Field label={st.openai.label} value={aiKeys.openai} onChange={v => setAiKeys(k => ({ ...k, openai: v }))} ph={st.openai.ph} type="password" />
              <Steps items={st.openai.steps} />
              <div style={{ marginTop: 9 }}><a href="https://platform.openai.com" target="_blank" rel="noreferrer" style={{ color: c.a, fontSize: 12 }}>→ platform.openai.com</a></div>
            </>)}

            {selProvider === "device" && (<>
              <div style={{ fontSize: 13, fontWeight: 500, color: c.a, marginBottom: 6 }}>{st.device.title}</div>
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
  if (scr === "history") return (
    <div style={{ background: bg, color: tx, minHeight: "100vh", direction: rtl ? "rtl" : "ltr", fontFamily: "'Segoe UI',sans-serif", padding: 24 }}>
      <B onClick={() => setScr("home")}>{t.back}</B>
      <h2 style={{ fontSize: 20, fontWeight: 600, color: c.a, margin: "16px 0" }}>📜 {rtl ? "היסטוריה" : "History"}</h2>
      {history.length === 0 && <div style={{ color: sb, fontSize: 13 }}>{rtl ? "אין שירים שמורים עדיין" : "No saved songs yet"}</div>}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {history.map(h => (
          <div key={h.id} style={{ background: cd, border: `1px solid ${bd}`, borderRadius: 10, padding: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <div>
                <span style={{ fontSize: 13, fontWeight: 500, color: c.a }}>{h.title}</span>
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
      <B onClick={() => setScr("home")}>{t.back}</B>
      <h2 style={{ fontSize: 20, fontWeight: 600, color: c.a, margin: "16px 0" }}>📖 {rtl ? "מילון מילים בעייתיות" : "Problem Words Dictionary"}</h2>
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
  if (scr === "about") return (
    <div style={{ background: bg, color: tx, minHeight: "100vh", direction: rtl ? "rtl" : "ltr", fontFamily: "'Segoe UI',sans-serif", padding: 24 }}>
      <B onClick={() => setScr("home")}>{t.back}</B>
      <div style={{ textAlign: "center", padding: "50px 0" }}>
        <div style={{ fontSize: 50, marginBottom: 12 }}>🎤</div>
        <div style={{ fontSize: 28, fontWeight: 700, color: c.a }}>SunoPrep</div>
        <div style={{ fontSize: 13, color: sb, marginBottom: 30 }}>{t.ver}</div>
        <div style={{ fontSize: 13, color: sb, maxWidth: 500, margin: "0 auto 30px", lineHeight: 1.8, whiteSpace: "pre-wrap", textAlign: rtl ? "right" : "left" }}>{t.aboutTxt}</div>
        <div style={{ fontSize: 13, color: sb }}>Barak Aflalo</div>
        <div style={{ fontSize: 11, color: `${sb}88`, marginTop: 4 }}>© AppNest 2026</div>
      </div>
    </div>
  );

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
        <B onClick={() => setScr("home")}>{t.back}</B>
        <h2 style={{ fontSize: 20, fontWeight: 600, color: c.a, margin: "16px 0" }}>⚙ {t.settings}</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 500 }}>
          {/* AI Connection */}
          <div onClick={() => setScr("aisetup")} style={{ background: aiProvider ? "#0F6E5612" : `${c.a}12`, border: `1px solid ${aiProvider ? "#0F6E5640" : `${c.a}30`}`, borderRadius: 12, padding: 14, cursor: "pointer" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: 9, background: aiProvider ? "#0F6E5622" : `${c.a}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, flexShrink: 0 }}>
                {aiProvider ? (AI_PROVIDERS.find(p => p.id === aiProvider)?.icon || "🔌") : "🔌"}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13.5, fontWeight: 500, color: aiProvider ? "#3DAA7D" : c.a }}>
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
          <Card label={t.srcLang}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {Object.entries(LANGS).map(([k, v]) => <B key={k} sm act={sLang === k} onClick={() => setSLang(k)}>{v.n}</B>)}
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
              <span style={{ fontSize: 14, color: c.a, direction: "ltr" }}>×{rate.toFixed(1)}</span>
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
      <style>{`textarea:focus,input:focus{outline:1px solid ${c.a}} @keyframes sp-p{0%,100%{opacity:1}50%{opacity:.4}} .sp-ld{animation:sp-p 1s infinite}`}</style>

      {/* HEADER */}
      <div style={{ padding: "10px 16px", borderBottom: `1px solid ${bd}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 22 }}>🎤</span>
          <div>
            <span style={{ fontSize: 17, fontWeight: 700, color: c.a }}>SunoPrep</span>
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
                    style={{ padding: "6px 10px", fontSize: 12, color: uLang === k ? c.a : tx, cursor: "pointer", borderRadius: 4, background: uLang === k ? `${c.a}15` : "transparent" }}>
                    {v}
                  </div>
                ))}
              </div>
            )}
          </div>
          <B sm onClick={() => setDay(!day)}>{day ? "🌙" : "☀️"}</B>
          <B sm onClick={() => setScr("history")}>📜</B>
          <B sm onClick={() => setScr("worddict")}>📖</B>
          <B sm onClick={share}>📤</B>
          <B sm onClick={() => setScr("settings")}>⚙</B>
          <B sm onClick={() => setScr("about")}>ℹ️</B>
        </div>
      </div>

      <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 14, maxWidth: 700, margin: "0 auto" }}>

        {/* SRC LANG */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
          <span style={{ fontSize: 11, color: sb }}>{t.srcLang}:</span>
          {Object.entries(LANGS).map(([k, v]) => <B key={k} sm act={sLang === k} onClick={() => setSLang(k)}>{v.n}</B>)}
        </div>

        {/* SOURCE */}
        <div style={{ background: cd, border: `1px solid ${bd}`, borderRadius: 14, padding: 14 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: c.a }}>{t.srcTitle}</span>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <B sm act={speaking === "s"} onClick={() => speak(src, true)}>{speaking === "s" ? `⏹ ${t.stop}` : `▶ ${t.listen}`}</B>
              <input type="range" min="0.5" max="2" step="0.1" value={rate}
                onChange={e => setRate(parseFloat(e.target.value))}
                style={{ width: 70 }} title={t.speed} />
              <span style={{ fontSize: 11, color: c.a, direction: "ltr", minWidth: 28 }}>×{rate.toFixed(1)}</span>
            </div>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 4 }}>
            <span style={{ fontSize: 10, color: sb, display: "flex", alignItems: "center" }}>{rtl ? "תבנית:" : "Template:"}</span>
            {TEMPLATES.map(tmpl => <B key={tmpl.id} sm onClick={() => insertTemplate(tmpl.t)} sx={{ fontSize: 11 }}>{tmpl.l}</B>)}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 4 }}>
            {TAGS.map(tag => <B key={tag} sm onClick={() => insertTag(tag)}>{tag}</B>)}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 8 }}>
            <span style={{ fontSize: 10, color: sb, display: "flex", alignItems: "center" }}>{rtl ? "קולות:" : "Vocals:"}</span>
            {VOICE_TAGS.map(vt => <B key={vt.l} sm onClick={() => insertTag(vt.l)} sx={{ fontSize: 11, borderStyle: "dashed" }}>{rtl ? vt.h : vt.l}</B>)}
          </div>
          <textarea ref={srcRef} dir={sl.d} value={src} onChange={e => { setSrc(e.target.value); setSelectedLine(0); }} placeholder={t.srcPh} style={TA} />
          {src.trim() && (
            <div style={{marginTop:12,padding:12,borderRadius:12,border:`1px solid ${c.a}55`,background:`${c.a}0d`}}>
              <div style={{fontWeight:700,color:c.a,marginBottom:5}}>🎧 אולפן בדיקת הגייה</div>
              <div style={{fontSize:11,color:sb,marginBottom:10}}>בחר שורה, שמע אותה רגיל או לאט, ובדוק אם המילים זורמות לפני ההמרה ל־Suno.</div>
              <div style={{display:"flex",flexDirection:"column",gap:6,maxHeight:230,overflowY:"auto"}}>
                {lyricLines.map((line,i)=><div key={i} onClick={()=>setSelectedLine(i)} style={{padding:"8px 9px",borderRadius:9,cursor:"pointer",background:selectedLine===i?`${c.a}22`:bg,border:`1px solid ${selectedLine===i?c.a:bd}`}}>
                  <div style={{fontSize:13,marginBottom:6}}>{line}</div>
                  <div style={{display:"flex",gap:6}}>
                    <B sm onClick={(e)=>{e.stopPropagation();speakLine(line)}}>▶️ שמע</B>
                    <B sm onClick={(e)=>{e.stopPropagation();speakLine(line,true)}}>🐢 לאט</B>
                  </div>
                </div>)}
              </div>
              {lyricLines[selectedLine] && <div style={{marginTop:9,fontSize:11,color:sb}}>שורה נבחרת: {selectedLine+1} • {countSyllables(lyricLines[selectedLine])} הברות משוערות</div>}
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
                    <span style={{ opacity: 0.6, maxWidth: "80%", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>{line.trim()}</span>
                    <span style={{ color: c.a, fontWeight: 500 }}>{syl}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* CONNECT AI BANNER */}
        {!aiProvider && (
          <div onClick={() => setScr("aisetup")}
            style={{ background: `${c.a}12`, border: `1px solid ${c.a}35`, borderRadius: 12, padding: "12px 14px", display: "flex", alignItems: "center", gap: 11, cursor: "pointer" }}>
            <span style={{ fontSize: 20, flexShrink: 0 }}>🔌</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: c.a, marginBottom: 3 }}>
                {rtl ? "חבר בינה מלאכותית לתעתיק חכם" : "Connect AI for smart transliteration"}
              </div>
              <div style={{ fontSize: 11, color: sb, lineHeight: 1.55 }}>
                {rtl
                  ? "עכשיו עובד במצב מקומי (בלי אינטרנט). חבר Gemini בחינם — בלי כרטיס אשראי — ותקבל תעתיק חכם ומצבים נוספים."
                  : "Currently in offline mode. Connect Gemini for free — no credit card — to unlock smart transliteration and extra modes."}
              </div>
            </div>
            <span style={{ color: c.a, fontSize: 16, flexShrink: 0 }}>{rtl ? "‹" : "›"}</span>
          </div>
        )}

        {/* VOICE TIP */}
        {showVoiceTip && (
          <div style={{ background: `${c.a}12`, border: `1px solid ${c.a}30`, borderRadius: 12, padding: "12px 16px", display: "flex", alignItems: "flex-start", gap: 10 }}>
            <span style={{ fontSize: 20, flexShrink: 0 }}>🎙️</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: c.a, marginBottom: 4 }}>
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
          <div style={{ fontSize: 13, fontWeight: 500, color: c.a, marginBottom: 8 }}>
            {rtl ? "מצב המרה:" : "Conversion mode:"}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
            <B sm act={tMode === "full"} onClick={() => setTMode("full")}>
              {rtl ? "🔤 תעתיק מלא (לטינית)" : "🔤 Full transliteration"}
            </B>
            <B sm act={tMode === "hybrid"} onClick={() => setTMode("hybrid")}>
              {rtl ? "🔀 היברידי" : "🔀 Hybrid"} {!aiProvider && <span style={{ fontSize: 9, color: c.a, marginInlineStart: 2 }}>AI</span>}
            </B>
            <B sm act={tMode === "optimized"} onClick={() => setTMode("optimized")}>
              {rtl ? "✨ עברית מותאמת" : "✨ Optimized Hebrew"} {!aiProvider && <span style={{ fontSize: 9, color: c.a, marginInlineStart: 2 }}>AI</span>}
            </B>
            <B sm act={tMode === "hebrew"} onClick={() => setTMode("hebrew")}>
              {rtl ? "🇮🇱 עברית ישירה" : "🇮🇱 Direct Hebrew"}
            </B>
          </div>
          <div style={{ fontSize: 11, color: sb, marginBottom: 12, lineHeight: 1.6 }}>
            {tMode === "full" && (rtl ? "ממיר את כל המילים לאותיות לטיניות. מתאים כשסונו לא מצליח לקרוא עברית בכלל." : "Converts all words to Latin letters. Use when Suno can't read the source language at all.")}
            {tMode === "hybrid" && (rtl ? "משאיר מילים פשוטות בעברית ומתעתק רק מילים בעייתיות. מנצל את היכולת החלקית של סונו v4.5 בעברית." : "Keeps simple words in Hebrew, transliterates only problematic ones. Uses Suno v4.5's partial Hebrew support.")}
            {tMode === "optimized" && (rtl ? "עברית מנוקדת + הפרדת תחיליות + פיסוק לנשימה + שורות קצרות. שומר על עברית אמיתית אבל עוזר לסונו לקרוא נכון!" : "Hebrew with nikud + prefix separation + breath punctuation + short lines. Keeps real Hebrew but helps Suno read correctly!")}
            {tMode === "hebrew" && (rtl ? "מעתיק את הטקסט בעברית כמו שהוא. סונו v4.5 יכול לקרוא עברית — נסה ותראה אם זה עובד!" : "Copies text in original script as-is. Suno v4.5 can partially read it — try and see!")}
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <B pri onClick={() => doTranslit()} dis={loading || !src.trim()} sx={{ minWidth: 240 }}>
              {loading ? <span className="sp-ld">⏳ {t.transing}</span> : 
                tMode === "hebrew" ? (rtl ? "📋 העתק עברית ישירה" : "📋 Copy direct Hebrew") :
                tMode === "hybrid" ? (rtl ? "🔀 המרה היברידית" : "🔀 Hybrid conversion") :
                tMode === "optimized" ? (rtl ? "✨ מטב עברית לסונו" : "✨ Optimize Hebrew for Suno") :
                `🔄 ${t.transBtn}`}
            </B>
          </div>
        </div>

        {err && <div style={{ padding: "8px 12px", borderRadius: 8, background: day ? "#FEE" : "#3A1515", border: `1px solid ${day ? "#E88" : "#5A2020"}`, color: "#E55", fontSize: 12, textAlign: "center" }}>{err}</div>}

        {/* ═══ RESULT: LYRICS ═══ */}
        <div style={{ background: cd, border: `1px solid ${bd}`, borderRadius: 14, padding: 14 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
            <div>
              <span style={{ fontSize: 14, fontWeight: 600, color: c.a }}>{t.resTitle}</span>
              <span style={{ fontSize: 10, color: sb, marginInlineStart: 6 }}>{t.resSub}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <B sm act={speaking === "r"} onClick={() => speak(res, false)}>{speaking === "r" ? `⏹ ${t.stop}` : `▶ ${t.listen}`}</B>
              <input type="range" min="0.5" max="2" step="0.1" value={rate}
                onChange={e => setRate(parseFloat(e.target.value))}
                style={{ width: 70 }} title={t.speed} />
              <span style={{ fontSize: 11, color: c.a, direction: "ltr", minWidth: 28 }}>×{rate.toFixed(1)}</span>
            </div>
          </div>
          <textarea dir={tMode === "hebrew" || tMode === "optimized" ? sl.d : "ltr"} value={res} onChange={e => setRes(e.target.value)} placeholder={t.resPh}
            style={{ ...TA, fontFamily: tMode === "hebrew" || tMode === "optimized" ? "inherit" : "'Courier New',monospace", direction: tMode === "hebrew" || tMode === "optimized" ? sl.d : "ltr", textAlign: tMode === "hebrew" || tMode === "optimized" ? (sl.d === "rtl" ? "right" : "left") : "left" }} />
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

        {/* ═══ STYLE ═══ */}
        <div style={{ background: cd, border: `1px solid ${bd}`, borderRadius: 14, padding: 14 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: c.a, marginBottom: 8 }}>{t.styTitle}</div>
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
              <B sm onClick={addSavedStyle} sx={{ background: `${c.a}20`, color: c.a, borderColor: c.a, whiteSpace: "nowrap" }}>
                {rtl ? "⭐ שמור" : "⭐ Save"}
              </B>
            )}
          </div>

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
            <div style={{ marginTop: 8, padding: "8px 12px", background: `${c.a}10`, borderRadius: 8, border: `1px solid ${c.a}25`, fontSize: 12, color: c.a, direction: "ltr", textAlign: "left" }}>
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

        {/* PRINT */}
        <div style={{ display: "flex", justifyContent: "center", gap: 6, flexWrap: "wrap" }}>
          <B sm onClick={() => print("lyrics")} dis={!res}>🖨 {t.prtLyr}</B>
          <B sm onClick={() => print("style")} dis={!styTxt}>🖨 {t.prtSty}</B>
          <B sm onClick={() => print("both")} dis={!res && !styTxt}>🖨 {t.prtAll}</B>
        </div>

        {/* FOOTER */}
        <div style={{ textAlign: "center", padding: "14px 0 6px", borderTop: `1px solid ${bd}`, fontSize: 10, color: `${sb}88` }}>
          SunoPrep by Barak Aflalo — © AppNest 2026
        </div>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(React.createElement(SunoPrep));
