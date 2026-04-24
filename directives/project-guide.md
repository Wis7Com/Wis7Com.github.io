# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A personal portfolio website for J. Kang, showcasing work at the intersection of Law, AI, and Digital Economy. Deployed to GitHub Pages at https://Wis7Com.github.io/

## Tech Stack

- **Static site**: Pure HTML, CSS, JavaScript (no build tools or frameworks)
- **Hosting**: GitHub Pages
- **Blog API Proxy**: Cloudflare Worker (`hashnode-proxy.jkhome.workers.dev`)
- **External APIs**: Hashnode GraphQL API for blog posts
- **Fonts**: Google Fonts (Outfit)

## Development

Open `index.html` directly in a browser or use any local server:
```bash
# Python
python -m http.server 8000

# Node.js (if npx available)
npx serve .
```

## Architecture

### Files
- `index.html` - Single-page site with sections: Home, About, Projects, Blog, Contact
- `style.css` - All styling including glassmorphism effects, animations, responsive design
- `script.js` - Client-side functionality
- `cloudflare-worker/` - Hashnode API proxy (Cloudflare Worker)

### Key Features in script.js
- **Mobile navigation**: Hamburger menu toggle
- **Scroll spy**: Active nav link highlighting based on scroll position
- **Email CAPTCHA**: Math-based verification before revealing email (Base64 encoded for scrape protection)
- **Hashnode integration**: Fetches pinned + 2 latest unique posts via GraphQL API

### Styling Patterns
- CSS custom properties defined in `:root` for theming (Deep Ocean/Nordic palette)
- Glassmorphism: `var(--glass-bg)`, `var(--glass-border)`, `backdrop-filter: blur()`
- Accent colors: `--accent-1` (teal), `--accent-2` (sky), `--accent-3` (violet)
- Animated background blobs with breathing/color-shift keyframes

## Hashnode Blog Integration

### Architecture
```
Browser → Cloudflare Worker → Hashnode GraphQL API
         (hashnode-proxy)     (gql.hashnode.com)
```

**Why Cloudflare Worker?**
- Hashnode CDN caches browser requests aggressively → stale posts
- Worker makes server-side requests → bypasses CDN caching
- Always returns fresh data

### Worker Location
- **Source**: `cloudflare-worker/` directory
- **Deployed URL**: `https://hashnode-proxy.jkhome.workers.dev`
- **Deploy command**: `cd cloudflare-worker && npx wrangler deploy`

### GraphQL Query
```graphql
query {
  publication(host: "justice-ai.hashnode.dev") {
    pinnedPost { ... }
    posts(first: 5) { edges { node { ... } } }
  }
}
```

### Troubleshooting Blog Updates
1. **Worker 테스트**: `curl -s https://hashnode-proxy.jkhome.workers.dev -H "Content-Type: application/json" -d '{"query":"{ publication(host: \"justice-ai.hashnode.dev\") { posts(first: 1) { edges { node { title } } } } }"}'`
2. **Worker 로그**: `cd cloudflare-worker && npx wrangler tail`
3. 새 글이 curl 응답에 있으면 → JS 렌더링 로직 문제
4. 새 글이 curl 응답에 없으면 → Hashnode API 문제

## Deployment

Push to `master` branch - GitHub Pages auto-deploys from root.
