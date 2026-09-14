# Saasify AI — Modern Generative AI SaaS Platform & Starter Kit

<p align="center">
  <img src="assets/img/hero_3d_abstract_render_1769957422989.png" alt="Saasify AI Hero Banner" width="480" style="border-radius: 24px; box-shadow: 0 20px 50px rgba(99, 102, 241, 0.3);" />
</p>

<p align="center">
  <strong>Production-grade, hyper-performant Generative AI SaaS platform template and UI component framework built for modern engineering teams.</strong>
</p>

<p align="center">
  <a href="https://github.com/jayshah88/Saasify-AI/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License: MIT" /></a>
  <a href="https://vitejs.dev/"><img src="https://img.shields.io/badge/vite-5.4-646CFF.svg?logo=vite" alt="Vite 5" /></a>
  <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/tailwindcss-3.3-38B2AC.svg?logo=tailwind-css" alt="Tailwind CSS 3" /></a>
  <a href="https://nodejs.org/"><img src="https://img.shields.io/badge/node-%3E%3D18.0.0-339933.svg?logo=node.js" alt="Node.js" /></a>
  <a href="https://github.com/jayshah88/Saasify-AI/actions"><img src="https://img.shields.io/badge/tests-passing-brightgreen.svg" alt="Tests Passing" /></a>
  <a href="https://github.com/jayshah88/Saasify-AI/pulls"><img src="https://img.shields.io/badge/PRs-welcome-orange.svg" alt="PRs Welcome" /></a>
</p>

---

## Table of Contents

- [Overview](#overview)
- [Live Demo & Pages](#live-demo--pages)
- [Key Features](#key-features)
- [System Architecture](#system-architecture)
- [Technology Stack](#technology-stack)
- [Directory Structure](#directory-structure)
- [Quick Start](#quick-start)
- [Production Build & Deployment](#production-build--deployment)
  - [GitHub Pages](#github-pages)
  - [Vercel](#vercel)
  - [Netlify](#netlify)
  - [Apache / Nginx / XAMPP](#apache--nginx--xampp)
- [AI Engine & Custom Event Bus](#ai-engine--custom-event-bus)
- [Quality Audit & Testing](#quality-audit--testing)
- [Roadmap](#roadmap)
- [Contributing & Code of Conduct](#contributing--code-of-conduct)
- [License & Author](#license--author)

---

## Overview

**Saasify AI** is an open-source, production-ready frontend template and application starter kit engineered for developers building the next generation of AI products. 

Designed with zero runtime framework lock-in, Saasify AI delivers a blistering sub-50ms first paint, native dark/light theme switching with zero layout shift or FOUC, and an integrated event-driven architecture that connects real-time AI token streaming to terminal widgets, citation drawers, and omni-search interfaces.

Whether you are building an AI agent orchestration hub, a developer tools dashboard, or launching a high-converting SaaS product, Saasify AI provides a complete end-to-end design and code foundation.

---

## Live Demo & Pages

The application includes over **35+ production-tested, fully responsive pages**:

| Category | Pages Included |
| :--- | :--- |
| **Landing & Marketing** | `index.html` (Home v1 SaaS), `index-v2.html` (Product Showpiece), `index-v3.html` (Enterprise), `features.html`, `how-it-works.html`, `use-cases.html`, `pricing.html`, `testimonials.html`, `integrations.html` |
| **Product & UI Kit** | `components.html` (Comprehensive UI Kit), `product.html` |
| **Company & Support** | `about.html`, `careers.html`, `blog.html`, `blog-single.html`, `contact.html`, `faq.html`, `changelog.html`, `roadmap.html` |
| **Authentication Flow** | `auth/login.html`, `auth/register.html`, `forgot-password.html`, `email-verification.html` |
| **AI Application Dashboard** | `dashboard/index.html` (Overview), `dashboard/analytics.html` (Metrics), `dashboard/lab.html` (Prompt Engineering Playground), `dashboard/team.html` (Seat Management), `dashboard/billing.html` (Subscription & Invoices), `dashboard/settings.html` (API Keys & Config) |
| **System Pages** | `404.html`, `maintenance.html`, `coming-soon.html`, `privacy.html`, `terms.html`, `security.html` |
| **Documentation Suite** | `documentation/index.html` (Interactive, search-enabled technical manual) |

---

## Key Features

- ⚡ **Zero-Framework Speed**: Pure vanilla ECMAScript modules and native browser Web APIs for maximum performance and minimum bundle size.
- 🌓 **Dual-Theme Engine**: Smooth dark/light switching with instant local storage persistence and zero flash of unstyled content (FOUC).
- 🤖 **Interactive AI Widgets**:
  - **Omni-Bar (`src/components/ai/omni-bar/`)**: Global command palette with search filtering, keyboard navigation, and instant execution.
  - **Syntax-Terminal (`src/components/ai/syntax-terminal/`)**: Real-time token streaming visualization simulating LLM code generation.
  - **Citation-Drawer (`src/components/ai/citation-drawer/`)**: Source inspection panel with trust and grounding metrics.
  - **Prompt-Input (`src/components/ai/prompt-input/`)**: AI prompt input box with suggestion chips, token estimation, and keyboard triggers.
- 📱 **100% Responsive Design**: Tested across 375px mobile viewports, tablets, laptops, and 4K desktop screens with zero horizontal overflow.
- 🧩 **Decoupled Architecture**: Window-level CustomEvent bus decouples user triggers from AI engines and UI updates.
- 🔒 **Client-Side Form Validation & Session Mocking**: Built-in credential validation, toast feedback notifications, and session state persistence in `localStorage`.
- 📚 **Self-Contained Documentation**: Responsive, searchable documentation suite with mobile navigation and code copy snippets.

---

## System Architecture

```
+-------------------------------------------------------------------------+
|                               Browser Context                           |
|                                                                         |
|  +---------------------+  saasify:ai-request   +---------------------+  |
|  |     Omni-Bar /      | --------------------> |     MockAI Engine   |  |
|  |    Prompt-Input     |                       |  (Token Streaming)  |  |
|  +---------------------+                       +---------------------+  |
|             |                                             |             |
|             | saasify:open-citation                       | saasify:    |
|             v                                             | ai-response |
|  +---------------------+                                  v             |
|  |   Citation-Drawer   |                       +---------------------+  |
|  +---------------------+                       |   Syntax-Terminal   |  |
|                                                +---------------------+  |
+-------------------------------------------------------------------------+
```

For complete architectural details, see [ARCHITECTURE.md](ARCHITECTURE.md).

---

## Technology Stack

- **Tooling**: [Vite 5.4](https://vitejs.dev/) (lightning-fast HMR and optimized production bundling)
- **Styling**: [Tailwind CSS 3.3](https://tailwindcss.com/) with JIT compilation & custom design tokens
- **PostCSS**: Autoprefixer and nesting extensions
- **Fonts**: Google Fonts ([Outfit](https://fonts.google.com/specimen/Outfit) for display headers, [Inter](https://fonts.google.com/specimen/Inter) for body copy)
- **Icons**: Inline scalable SVGs (Heroicons & custom brand icons)
- **Runtime**: Vanilla ES6+ Modules (Zero heavy JS framework dependencies)

---

## Directory Structure

```
Saasify-AI/
├── .env.example              # Example environment configuration
├── ARCHITECTURE.md           # Deep-dive architectural documentation
├── CONTRIBUTING.md           # Contribution guidelines & standards
├── CODE_OF_CONDUCT.md        # Contributor Covenant v2.1
├── LICENSE                   # Open-source MIT License
├── README.md                 # Primary project overview & documentation
├── SECURITY.md               # Vulnerability reporting policy
├── package.json              # Project scripts & devDependencies
├── tailwind.config.js        # Design tokens, fonts, and dark mode configuration
├── vite.config.js            # Multi-page input resolution & build pipeline
├── index.html                # Main SaaS Landing Page (Home v1)
│
├── assets/                   # Public static assets
│   ├── css/                  # Pre-compiled styles & font configurations
│   ├── img/                  # 3D renders, hero graphics, and avatars
│   └── js/                   # Legacy helpers & standalone assets
│
├── documentation/            # Comprehensive documentation portal
│   └── index.html            # Documentation hub with mobile drawer
│
├── scripts/                  # Build & automation scripts
│   └── copy-components.js    # Post-build path flattening & component copier
│
├── src/                      # Source code
│   ├── main.js               # Application bootstrap, MockAI, & Event Bus
│   ├── style.css             # Tailwind source directives & glassmorphic classes
│   ├── compiled-style.css    # JIT-compiled development stylesheet
│   ├── components/           # Decoupled web components
│   │   ├── ai/               # AI-specific widgets (omni-bar, terminal, etc.)
│   │   └── base/             # Shell components (sidebar, profile-drawer, etc.)
│   ├── core/                 # Utility helpers & UI notification bus
│   └── pages/                # Application page templates
│       ├── auth/             # Login, register, email verification
│       ├── dashboard/        # Dashboard overview, lab, team, analytics
│       └── *.html            # Landing, features, pricing, blog, contact
│
└── tests/                    # Automated test suites
    └── quality-audit.test.cjs # Automated quality, link, and structure verification
```

---

## Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) version `18.0.0` or higher
- `npm` version `9.0.0` or higher

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/jayshah88/Saasify-AI.git
   cd Saasify-AI
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the local development server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

---

## Production Build & Deployment

To compile and bundle the project for production:

```bash
npm run build
```

This compiles Tailwind CSS, optimizes assets through Vite, flattens page templates, copies dynamic components, and outputs the production bundle to the `dist/` directory.

### Preview Local Build
```bash
npm run preview
```

---

### Deployment Guides

#### GitHub Pages
1. Push your code to GitHub.
2. Under repository **Settings** → **Pages**, select **GitHub Actions** as the source.
3. Add the following workflow to `.github/workflows/deploy.yml`:
   ```yaml
   name: Deploy to GitHub Pages
   on:
     push:
       branches: [main]
   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4
         - uses: actions/setup-node@v4
           with:
             node-version: 20
         - run: npm ci
         - run: npm run build
         - uses: peaceiris/actions-gh-pages@v3
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: ./dist
   ```

#### Vercel
1. Import the repository into [Vercel](https://vercel.com).
2. Configure settings:
   - **Framework Preset**: Other / Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Click **Deploy**.

#### Netlify
1. Connect your repository in [Netlify](https://netlify.com).
2. Set build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
3. Click **Deploy Site**.

#### Apache / Nginx / XAMPP
Copy the contents of the `dist/` folder directly into your server web root (e.g. `/var/www/html` or `c:/xampp/htdocs/Saasify-AI/`). All links and asset references use relative paths (`./`) and resolve seamlessly in root or subdirectory paths.

---

## AI Engine & Custom Event Bus

You can interact with Saasify AI's built-in AI simulator from any browser console or script:

```javascript
// Trigger an AI query into the SyntaxTerminal
window.dispatchEvent(new CustomEvent('saasify:ai-request', {
    detail: { prompt: 'Write an edge function for streaming telemetry' }
}));

// Open the verification citation drawer
window.dispatchEvent(new CustomEvent('saasify:open-citation', {
    detail: { name: 'Grounding_Model_Whitepaper.pdf' }
}));

// Spawn a system notification toast
window.dispatchEvent(new CustomEvent('saasify:notify', {
    detail: { title: 'Workspace Synchronized', message: 'All model parameters updated.', type: 'success' }
}));
```

To connect to a live backend (e.g. OpenAI, Anthropic, or an internal LLM endpoint), update the `saasify:ai-request` listener in `src/main.js` to execute a `fetch()` call to your API endpoint.

---

## Quality Audit & Testing

Saasify AI includes an automated audit test runner ensuring 100% production readiness:

```bash
npm test
```

The test runner verifies:
- Production build compilation with zero exit errors.
- 100% relative link resolution across all generated HTML pages (zero 404 dead links).
- Presence and integrity of `<meta name="viewport">` across all views.
- Clean separation of component templates and valid markup.

---

## Roadmap

- [x] **v1.2.0**: Full open-source release, mobile responsive audits, decoupled sidebar and mobile menus, MockAI token streaming, open-source compliance.
- [ ] **v1.3.0**: Native WebSockets connector for live multi-user collaboration in AI Lab.
- [ ] **v1.4.0**: Headless component adapters for React, Vue 3, and Svelte.
- [ ] **v1.5.0**: Built-in WebGPU / ONNX client-side model inference integration.

---

## Contributing & Code of Conduct

We welcome community contributions, bug reports, and enhancements!
- Please read our [Contributing Guide](CONTRIBUTING.md) for branch naming conventions, development guidelines, and PR procedures.
- Please review our [Code of Conduct](CODE_OF_CONDUCT.md) before participating in the community.

---

## License & Author

Crafted with care by **[Jay Shah](https://github.com/jayshah88)**.

Distributed under the **MIT License**. See [LICENSE](LICENSE) for full licensing terms.

