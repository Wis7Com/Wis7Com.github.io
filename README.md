# J. Kang — Navigating Justice & AI

Personal portfolio website showcasing work at the intersection of Law, Artificial Intelligence, and Digital Economy.

- **Live site:** https://Wis7Com.github.io/
- **Blog:** https://justice-ai.hashnode.dev/
- **Hosting:** GitHub Pages (auto-deploys from `master`)
- **Blog proxy:** Cloudflare Worker at `hashnode-proxy.jkhome.workers.dev`

---

## Quick Start (fresh clone on macOS)

```bash
git clone https://github.com/Wis7Com/Wis7Com.github.io.git
cd Wis7Com.github.io

# Option A — Python (no install needed)
python3 -m http.server 8000

# Option B — Node
npm run serve
```

Then open http://localhost:8000 in your browser.

That's it for viewing/editing the site. The steps below are only needed if you also want to run the utility scripts or deploy the Cloudflare Worker.

---

## Prerequisites

The static site itself has **no build step** and **no dependencies** — just HTML/CSS/JS served from the repo root. Install these only if you want the full tooling.

| Tool | Version | Used for |
|------|---------|----------|
| Node.js | ≥ 18 | Local dev server, blog scripts, Cloudflare Worker |
| Python | ≥ 3.9 | CV markdown → DOCX generator |
| Homebrew | latest | Easiest way to install the above on macOS |

### One-time Mac setup

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

---

## Install project dependencies

```bash
# Node (installs wrangler locally for the Cloudflare Worker)
npm install

# Python (create a virtualenv to keep it isolated)
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

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

### Verify Hashnode blog integration

```bash
npm run check:blog     # hits Hashnode GraphQL directly
npm run verify:blog    # validates the fetch/filter logic used by the site
```

### Generate the CV DOCX from Markdown

```bash
source .venv/bin/activate
python execution/md_to_docx.py
```

Reads `data/CV_Jisung_Kang(Mar2026).md` and writes `data/CV_Jisung_Kang(Mar2026).docx`. The `data/` directory is gitignored — bring your own source files.

### Deploy the Cloudflare Worker (blog proxy)

```bash
npm run worker:deploy  # cd execution/cloudflare-worker && wrangler deploy
npm run worker:tail    # stream live logs
```

First deploy: `npx wrangler login` will open a browser to authenticate.

---

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
├── script.js                     # Nav, scroll spy, email CAPTCHA, Hashnode blog fetch
├── *.png                         # Site-referenced project thumbnails
├── README.md                     # You are here
├── LICENSE
├── package.json                  # Node scripts + wrangler devDependency
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
│   ├── check_hashnode.js         # Hashnode API smoke test
│   ├── verify_blog_logic.js      # Blog fetch/filter sanity check
│   ├── md_to_docx.py             # CV Markdown → styled DOCX
│   └── cloudflare-worker/        # Hashnode GraphQL proxy (bypasses CDN cache)
│       ├── worker.js
│       └── wrangler.toml
│
├── data/                         # Personal inputs (CVs, planning docs) — GITIGNORED
└── .tmp/                         # Intermediates — GITIGNORED
```

---

## Hashnode blog architecture

```
Browser ──▶ Cloudflare Worker ──▶ Hashnode GraphQL API
            (hashnode-proxy)        (gql.hashnode.com)
```

The Worker exists because Hashnode's CDN caches browser requests aggressively, which causes stale posts to show. Proxying through a Worker sidesteps the CDN.

The client (`script.js`) filters out the Hashnode *pinned* post by URL and shows only the 3 most recent non-pinned posts — pinning on Hashnode is otherwise sticky and has no unpin UI.

---

## Troubleshooting

| Symptom | Check |
|---------|-------|
| Site shows old blog posts | `npm run check:blog` — if stale, redeploy the Worker: `npm run worker:deploy` |
| Local server port in use | Use a different port: `python3 -m http.server 8001` |
| `wrangler` auth error | `npx wrangler login` then retry |
| `python-docx` import fails | Make sure the venv is active: `source .venv/bin/activate` |
| Thumbnails broken | They live at the repo root (`*_thumbnail.png`); verify they're committed |

---

© 2026 Wis7Com. All rights reserved.
