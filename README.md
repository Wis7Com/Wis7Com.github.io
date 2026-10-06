# J. Kang — Navigating Justice & AI

Personal portfolio website showcasing work at the intersection of Law, Artificial Intelligence, and Digital Economy.

- **Live site:** https://Wis7Com.github.io/
- **Blog:** https://law7tech.blogspot.com/
- **Hosting:** GitHub Pages (auto-deploys from `master`)
- **Blog feed:** Blogger JSONP feed (no API key or proxy required)

---

## Quick Start

```bash
git clone https://github.com/Wis7Com/Wis7Com.github.io.git
cd Wis7Com.github.io

# Option A — Python
python3 -m http.server 8000

# Option B — Node
npm run serve
```

Then open http://localhost:8000 in your browser.

That's it for viewing/editing the site. The steps below are only needed if you also want to run the utility scripts.

---

## Prerequisites

The static site itself has **no build step** and **no runtime dependencies** — just HTML/CSS/JS served from the repo root. Install these only if you want the full tooling.

| Tool | Version | Used for |
|------|---------|----------|
| Node.js | ≥ 18 | Local dev server and blog verification scripts |
| Python | ≥ 3.9 | CV markdown → DOCX generator |
| A Node version manager | latest | Recommended for honoring `.nvmrc` on macOS or Windows |
| Homebrew | latest | Optional convenience install on macOS |

### About `.nvmrc`

`.nvmrc` is not an extra dependency. It is a small version pin that tells your Node version manager which Node release this repo expects.

- On macOS/Linux with `nvm`: run `nvm install` then `nvm use`
- On Windows with `nvm-windows`: run `nvm install <version from .nvmrc>` then `nvm use <that version>`
- If you already have a compatible Node version installed, you can skip a version manager entirely

### macOS setup

```bash
# 1. Install Homebrew (if not already)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# 2. Install Node (use nvm to respect .nvmrc) and Python
brew install nvm python@3.12
mkdir -p ~/.nvm
echo 'export NVM_DIR="$HOME/.nvm"' >> ~/.zshrc
echo '[ -s "/opt/homebrew/opt/nvm/nvm.sh" ] && . "/opt/homebrew/opt/nvm/nvm.sh"' >> ~/.zshrc
source ~/.zshrc

# 3. In the repo, pick the Node version declared in .nvmrc
nvm install
nvm use
```

### Windows setup

Use PowerShell or Windows Terminal:

```powershell
# 1. Install Node.js 18+ directly, or install nvm-windows first
#    https://github.com/coreybutler/nvm-windows

# 2. If using nvm-windows, install and activate the repo's pinned version
$nodeVersion = Get-Content .nvmrc
nvm install $nodeVersion
nvm use $nodeVersion

# 3. Optional Python setup for DOCX generation
py -3 -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

---

## Install project dependencies

```bash
# Node
npm install

# Python (create a virtualenv to keep it isolated on macOS/Linux)
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Windows activation uses `.venv\Scripts\Activate.ps1` instead of `source .venv/bin/activate`.

Both are optional — skip whichever you don't need.

---

## How to run

### Run the site locally

```bash
npm run serve          # uses `npx serve` on port 8000
# or
python3 -m http.server 8000
```

Any edit to `index.html`, `style.css`, or `script.js` is picked up on refresh.

On Windows, use `py -3 -m http.server 8000` in place of `python3`.

### Verify Blogger integration

```bash
npm run check:blog     # checks the live Blogger feed
npm run verify:blog    # validates the fetch/filter logic used by the site
```

### Generate the CV DOCX from Markdown

macOS/Linux:

```bash
source .venv/bin/activate
python execution/md_to_docx.py
```

Windows PowerShell:

```powershell
.venv\Scripts\Activate.ps1
py -3 execution\md_to_docx.py
```

Input and output files live in the gitignored `data/` directory — bring your own source file.

## Deployment (site)

Push to the `master` branch — GitHub Pages auto-deploys from the repository root. No build step, no workflow file needed.

```bash
git add <files>
git commit -m "feat: ..."
git push
```

The live site usually reflects the change within a minute.

---

## Project structure

```
├── index.html                    # Single-page site (Home, About, Projects, Blog, Contact)
├── style.css                     # Glassmorphism, animations, responsive layout
├── script.js                     # Nav, scroll spy, email CAPTCHA, Blogger feed
├── *.png                         # Site-referenced project thumbnails
├── README.md                     # You are here
├── LICENSE
├── package.json                  # Local server and blog verification scripts
├── requirements.txt              # Python deps (python-docx)
├── .nvmrc                        # Node version pin
├── .gitignore
│
├── AGENT.md                      # 3-layer WAT architecture (constitution)
├── CLAUDE.md                     # Project-specific mapping of AGENT.md
│
├── directives/                   # Layer 1 — SOPs for AI agents
│   └── project-guide.md
│
├── execution/                    # Layer 3 — deterministic scripts/tools
│   ├── check_blog_posts.js       # Live Blogger feed smoke test
│   ├── verify_blog_logic.js      # Blog fetch/filter sanity check
│   └── md_to_docx.py             # CV Markdown → styled DOCX
│
├── data/                         # Personal inputs (CVs, planning docs) — GITIGNORED
└── .tmp/                         # Intermediates — GITIGNORED
```

---

## Blogger integration

```
Browser ──▶ Blogger JSONP feed ──▶ Latest three posts
```

The client (`script.js`) requests Blogger's public JSONP feed and renders up to three recent posts. JSONP allows the static GitHub Pages site to read the feed without a server, API key, or cross-origin proxy. If the feed is temporarily unavailable, the fallback cards already present in `index.html` remain visible.

---

## Troubleshooting

| Symptom | Check |
|---------|-------|
| Site shows old blog posts | Run `npm run check:blog`, then hard-refresh the page if the live feed is current |
| Local server port in use | Use a different port: `python3 -m http.server 8001` |
| `python-docx` import fails | Make sure the venv is active: macOS/Linux `source .venv/bin/activate`, Windows `.venv\Scripts\Activate.ps1` |
| Thumbnails broken | They live at the repo root (`*_thumbnail.png`); verify they're committed |

---

© 2026 Wis7Com. All rights reserved.
