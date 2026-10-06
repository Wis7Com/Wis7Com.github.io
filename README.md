# J. Kang — Navigating Justice & AI

Personal portfolio website showcasing work at the intersection of Law, Artificial Intelligence, and Digital Economy.

- **Live site:** https://Wis7Com.github.io/
- **Blog:** https://law7tech.blogspot.com/
- **Hosting:** GitHub Pages (auto-deploys from `master`)

---

## Run locally

The site is plain HTML/CSS/JS with no build step and no dependencies.

```bash
git clone https://github.com/Wis7Com/Wis7Com.github.io.git
cd Wis7Com.github.io
python3 -m http.server 8000
```

Then open http://localhost:8000. On Windows, use `py -3 -m http.server 8000`.

---

## Structure

```
├── index.html    # Single-page site (Home, About, Projects, Blog, Contact)
├── style.css     # Glassmorphism, animations, responsive layout
├── script.js     # Nav, scroll spy, email CAPTCHA, Blogger feed
└── *.png         # Project thumbnails
```

The blog section reads Blogger's public JSONP feed and shows the three newest posts. If the feed is unavailable, the fallback cards in `index.html` stay visible.

---

© 2026 Wis7Com. All rights reserved.
