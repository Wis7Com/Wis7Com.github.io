# CLAUDE.md

> Constitution: See `AGENT.md` for the full 3-layer WAT architecture. This file maps it to this project.

## The 3-Layer Architecture (This Project)

**Layer 1: Directives** — `directives/`
- `project-guide.md` — Project overview, tech stack, development workflow, Hashnode integration, deployment, troubleshooting

**Layer 2: Orchestration** — You (the AI agent)
- Read directives, call execution tools, handle errors, update directives with learnings

**Layer 3: Execution** — `execution/`
- `cloudflare-worker/` — Hashnode API proxy (Cloudflare Worker). Deploy: `cd execution/cloudflare-worker && npx wrangler deploy`
- `check_hashnode.js` — Verify Hashnode API integration
- `verify_blog_logic.js` — Validate blog fetching logic

## Directory Structure

```
├── index.html           # Site entry (root for GitHub Pages)
├── style.css            # Glassmorphism, animations, responsive
├── script.js            # Nav, scroll spy, email CAPTCHA, blog fetch
├── *.png                # Site-referenced project thumbnails
├── data/                # User input files (banners, QR codes, planning docs)
│   └── Contents/        # Personal documents (not committed)
├── directives/          # SOPs & workflow instructions
├── execution/           # Deterministic scripts & workers
├── .tmp/                # Intermediate/temp files (not committed)
├── .env                 # Environment variables (not committed)
├── AGENT.md             # WAT Constitution (원본)
└── CLAUDE.md            # This file (project mapping)
```

## Key Principles

1. **Check `execution/` first** before writing new scripts
2. **Self-anneal**: Fix errors → update tool → test → update directive
3. **Directives are living documents**: Update them as you learn
4. **Site files at root**: GitHub Pages deploys from root of `master` branch
5. **Local files for processing only**: Everything in `.tmp/` can be deleted and regenerated

## Deployment

- **GitHub Pages**: Push to `master` branch — auto-deploys from root
- **Cloudflare Worker**: `cd execution/cloudflare-worker && npx wrangler deploy`
