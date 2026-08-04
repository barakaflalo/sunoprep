# 🎤 SunoPrep 2.0

**כלי מתקדם להכנת שירים לסונו AI**

Advanced song preparation tool for Suno AI - supports Hebrew, Arabic, Russian, and more.

---

## 🚀 איך להעלות ל-GitHub ולהתקין כאפליקציה בנייד

### שלב 1: צור חשבון GitHub (אם אין לך)
1. לך ל-[github.com](https://github.com) ותירשם
2. אשר את המייל

### שלב 2: צור Repository חדש
1. לחץ על **+** למעלה ← **New repository**
2. שם: `sunoprep`
3. סמן **Public**
4. לחץ **Create repository**

### שלב 3: העלה את הקבצים
1. בדף ה-repository, לחץ **uploading an existing file**
2. גרור את כל הקבצים מהתיקייה:
   - `index.html`
   - `app.jsx`
   - `manifest.json`
   - `sw.js`
   - `icons/icon-192.png`
   - `icons/icon-512.png`
3. כתוב הודעה: "SunoPrep 2.0"
4. לחץ **Commit changes**

### שלב 4: הפעל GitHub Pages
1. לך ל-**Settings** (של ה-repository)
2. בתפריט צד: **Pages**
3. ב-Source בחר **Deploy from a branch**
4. ב-Branch בחר **main** ← **/root**
5. לחץ **Save**
6. חכה 2-3 דקות
7. הלינק שלך יהיה: `https://YOUR-USERNAME.github.io/sunoprep/`

### שלב 5: התקן על הנייד כאפליקציה
**אנדרואיד (Chrome):**
1. פתח את הלינק בכרום
2. לחץ על ⋮ (שלוש נקודות) למעלה
3. בחר **"הוסף למסך הבית"** / **"Install app"**
4. האפליקציה תופיע כאייקון בנייד!

**אייפון (Safari):**
1. פתח את הלינק בספארי
2. לחץ על כפתור השיתוף (ריבוע עם חץ למעלה)
3. גלול למטה ובחר **"הוסף למסך הבית"**
4. לחץ **הוסף**

---

## 🔑 API Key

האפליקציה דורשת מפתח API של Anthropic לתעתיק.
- הירשם ב-[console.anthropic.com](https://console.anthropic.com)
- צור API key
- הכנס אותו באפליקציה (בפעם הראשונה או בהגדרות)
- המפתח נשמר רק במכשיר שלך (localStorage)

---

## 📁 מבנה הקבצים

```
sunoprep/
├── index.html          # דף ראשי
├── app.jsx             # קוד האפליקציה (React)
├── manifest.json       # הגדרות PWA
├── sw.js               # Service Worker (עבודה אופליין)
├── icons/
│   ├── icon-192.png    # אייקון קטן
│   └── icon-512.png    # אייקון גדול
└── README.md           # הקובץ הזה
```

---

## ✨ תכונות

- 4 מצבי המרה (תעתיק מלא, היברידי, עברית מותאמת, ישירה)
- בניית סגנון מוזיקלי (ז'אנרים, קול, BPM)
- סגנונות מועדפים אישיים ⭐
- תגיות מבנה + קול (דואט, מקהלה...)
- תבניות שיר מוכנות
- השמעה TTS + השוואה A/B
- מונה הברות
- מילון מילים בעייתיות
- היסטוריית שירים
- הנחיית מבטא ישראלי אוטומטית
- 5 שפות ממשק, 9 שפות מקור
- 4 ערכות צבע + יום/לילה
- PWA — עובד כאפליקציה בנייד
- הדפסה, שיתוף, גיבוי

---

**SunoPrep by Barak Aflalo — © AppNest 2026**


## SunoPrep 4.3
Added personal pronunciation dictionary with local persistence and one-click application to Suno output.


## Version 4.5
Added a visible final pre-Suno readiness check with warnings for mixed scripts, stretched letters, long lines, and source/output differences.