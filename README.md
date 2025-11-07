# Study Smart IAS PCS - UPSC Preparation Website

A frontend-only responsive website for showcasing UPSC courses, faculty, and study materials. Built with HTML, CSS, and JavaScript - ready for GitHub Pages deployment.

## 📁 Project Structure

```
/
├── index.html          # Home page
├── courses.html        # Courses listing page
├── gethelp.html        # Help & Support page
├── about.html          # About Us page
├── data/
│   └── courses.json    # Course data (course name, faculty, topics, duration, price, Telegram links)
├── assets/
│   ├── css/
│   │   └── style.css   # Main stylesheet
│   ├── js/
│   │   ├── main.js     # General JavaScript (navigation, mobile menu)
│   │   └── courses.js   # Course loading and filtering logic
│   └── images/         # Course poster images (placeholder images)
└── README.md
```

## 🚀 Features

- **Responsive Design**: Mobile-friendly layout that works on all devices
- **Dynamic Course Loading**: Courses loaded from `data/courses.json`
- **Search & Filter**: Search courses by name, faculty, or topics
- **Telegram Integration**: Direct links to join course Telegram channels
- **Clean UI**: Professional design with UPSC theme colors (blue, beige, white)
- **No Backend Required**: 100% static site, perfect for GitHub Pages

## 🎨 Design Theme

- **Colors**: Blue (#1e3a8a, #3b82f6), Beige (#f5f5dc), White
- **Typography**: Segoe UI, Tahoma, Geneva, Verdana, sans-serif
- **Style**: Professional, clean, education-focused

## 📝 Course Data Structure

Each course in `data/courses.json` contains:
- `id`: Unique identifier
- `name`: Course name
- `faculty`: Instructor name
- `topics`: Array of topics covered
- `duration`: Course duration (e.g., "12 Months")
- `price`: Course price (e.g., "₹25,000")
- `poster`: Image path (optional)
- `telegramLink`: Telegram channel/group link

## 🔧 Setup Instructions

1. **Clone or download this repository**
2. **Update course data**: Edit `data/courses.json` with your actual course information
3. **Update contact information**: Edit footer sections in all HTML files
4. **Add course images** (optional): Place course poster images in `assets/images/` and update paths in `courses.json`
5. **Test locally**: Open `index.html` in a browser or use a local server
6. **Deploy**: Push to GitHub and enable GitHub Pages

## 📱 Pages

### Home (`index.html`)
- Hero banner with tagline
- "Explore Courses" button
- Features overview

### Courses (`courses.html`)
- Dynamic course cards loaded from JSON
- Search functionality
- Filter buttons
- Each card shows: name, faculty, topics, duration, price, and "Join on Telegram" button

### Get Help (`gethelp.html`)
- Telegram support information
- Contact details (email, phone, address)
- FAQ section

### About Us (`about.html`)
- Mission and values
- Achievements/statistics
- About the organization

## 🌐 GitHub Pages Deployment

1. Create a new GitHub repository
2. Push all files to the repository
3. Go to Settings → Pages
4. Select the main branch as source
5. Your site will be live at: `https://yourusername.github.io/repository-name/`

## 📦 Dependencies

- **Font Awesome**: Loaded via CDN for icons
- No other dependencies required

## 🔄 Customization

- **Colors**: Update CSS variables in `assets/css/style.css` (root section)
- **Course Data**: Edit `data/courses.json`
- **Content**: Edit HTML files for text content
- **Images**: Add images to `assets/images/` and reference in JSON

## 📞 Support

For issues or questions, contact:
- Email: studysmartiaspcs@gmail.com
- Telegram: [Join our community](https://t.me/StudySmartIASPCS)

---

© 2024 Study Smart IAS PCS. All Rights Reserved.
