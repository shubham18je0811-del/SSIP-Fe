# How to Run the Website

This is a static website (HTML, CSS, JavaScript) with no backend. Here are different ways to run it:

## 🚀 Method 1: Open Directly in Browser (Simplest)

1. **Navigate to the project folder**:
   ```bash
   cd /Users/nitin/personal_web/SSIP-Fe
   ```

2. **Open `index.html` in your browser**:
   - **Mac**: Double-click `index.html` or right-click → "Open with" → Browser
   - **Or via terminal**: 
     ```bash
     open index.html
     ```

3. **Important**: For best results, use a local server (see Method 2 or 3) because:
   - Some browsers block loading JSON files from `file://` protocol
   - External resources might not load properly

---

## 🌐 Method 2: Using Python's Built-in Server (Recommended)

1. **Navigate to project folder**:
   ```bash
   cd /Users/nitin/personal_web/SSIP-Fe
   ```

2. **Run Python 3 server**:
   ```bash
   python3 -m http.server 8000
   ```

3. **Open in browser**:
   - Go to: `http://localhost:8000`
   - Or: `http://127.0.0.1:8000`

4. **To stop server**: Press `Ctrl + C` in terminal

---

## 📦 Method 3: Using Node.js http-server

If you have Node.js installed:

1. **Install http-server globally** (one time only):
   ```bash
   npm install -g http-server
   ```

2. **Navigate to project folder**:
   ```bash
   cd /Users/nitin/personal_web/SSIP-Fe
   ```

3. **Start server**:
   ```bash
   http-server -p 8000
   ```

4. **Open in browser**: `http://localhost:8000`

---

## 🔧 Method 4: Using VS Code Live Server

If you use VS Code:

1. **Install "Live Server" extension** in VS Code
2. **Right-click on `index.html`**
3. **Select "Open with Live Server"**
4. Website will open automatically in browser

---

## 📱 Method 5: Deploy to GitHub Pages (Production)

For public access:

1. **Create GitHub repository**
2. **Push all files to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_REPO_URL
   git push -u origin main
   ```

3. **Enable GitHub Pages**:
   - Go to repository Settings → Pages
   - Select branch: `main`
   - Select folder: `/ (root)`
   - Click Save

4. **Your site will be live at**:
   `https://YOUR_USERNAME.github.io/REPO_NAME/`

---

## ✅ Quick Test

After starting a local server, you should see:
- ✅ Home page loads
- ✅ Navigation works (Home, Courses, Get Help, About Us)
- ✅ Courses page shows 3 courses (Maha Granth, Spark, UP Special)
- ✅ All "Join on Telegram" buttons link to: https://t.me/StudySmartIASPCS
- ✅ Search functionality works on courses page

---

## 🐛 Troubleshooting

**If courses don't load:**
- Make sure you're using a local server (Method 2 or 3)
- Check browser console for errors (F12 → Console)
- Verify `data/courses.json` exists and is valid JSON

**If styles don't load:**
- Check that `assets/css/style.css` exists
- Verify file paths are correct

**If navigation doesn't work:**
- Make sure `assets/js/main.js` is loaded
- Check browser console for JavaScript errors

---

## 📝 File Structure

```
SSIP-Fe/
├── index.html          ← Start here
├── courses.html
├── gethelp.html
├── about.html
├── data/
│   └── courses.json    ← Course data
└── assets/
    ├── css/
    │   └── style.css   ← Styles
    └── js/
        ├── main.js     ← Navigation
        └── courses.js  ← Course loading
```

---

**Recommended**: Use **Method 2 (Python server)** for local development - it's simple and works perfectly!

