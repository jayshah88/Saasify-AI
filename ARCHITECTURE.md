# Architecture & Technical Design - Saasify AI

This document provides a comprehensive technical overview of the architecture, design patterns, and engineering principles behind **Saasify AI**.

---

## 1. High-Level System Architecture

Saasify AI is engineered as a modern, decoupled, framework-agnostic client application with zero heavy runtime overhead. It leverages modern ECMAScript modules, Tailwind CSS JIT compilation, and an asynchronous custom event bus to facilitate communication between decoupled UI widgets and AI services.

```
+-------------------------------------------------------------------------+
|                               Browser Context                           |
|                                                                         |
|  +---------------------+  saasify:ai-request   +---------------------+  |
|  |     Omni-Bar /      | --------------------> |     MockAI Engine   |  |
|  |    Prompt-Input     |                       |  (Token Streaming)  |  |
|  +---------------------+                       +---------------------+  |
|             |                                             |             |
|             |                                             | saasify:    |
|             | saasify:open-citation                       | ai-response |
|             v                                             v             |
|  +---------------------+                       +---------------------+  |
|  |   Citation-Drawer   |                       |   Syntax-Terminal   |  |
|  +---------------------+                       +---------------------+  |
|                                                                         |
|  +---------------------+  window.SaasifyRoot   +---------------------+  |
|  |   Sidebar / Nav     | --------------------> |   ComponentLoader   |  |
|  |   Profile-Drawer    |                       |  (Dynamic Injector) |  |
|  +---------------------+                       +---------------------+  |
|                                                                         |
+-------------------------------------------------------------------------+
                                    |
                             Vite Build Pipeline
                                    v
+-------------------------------------------------------------------------+
|                              Distribution                               |
|   dist/                                                                 |
|    ├── index.html (landing)                                             |
|    ├── features.html, pricing.html, etc. (flattened pages)              |
|    ├── auth/ & dashboard/ (nested routes)                               |
|    ├── assets/ (hashed CSS & bundled JS)                                |
|    └── src/components/ (dynamically injected HTML snippets & modules)   |
+-------------------------------------------------------------------------+
```

---

## 2. Decoupled Custom Event Bus

To maintain 100% loose coupling across modular components without pulling in a heavy state-management library (like Redux or Vuex), Saasify AI utilizes a native **Window CustomEvent Bus**.

### Event Catalog

| Event Name | Dispatcher | Listener | Payload (`event.detail`) | Description |
| :--- | :--- | :--- | :--- | :--- |
| `saasify:ai-request` | `OmniBar`, `PromptInput` | `MockAI` (in `main.js`) | `{ prompt: string }` | Initiates an AI generation or command execution. |
| `saasify:ai-response` | `MockAI` | `SyntaxTerminal` | `{ token: string, done: boolean }` | Emits streamed tokens and completion signals for live typing. |
| `saasify:open-citation` | Interactive cards, badges | `CitationDrawer` | `{ name: string, title?: string }` | Opens the source verification citation panel. |
| `saasify:prompt-select` | Suggestion pills, hero chips | `PromptInput` | `{ text: string }` | Fills the prompt input with recommended queries. |
| `saasify:profile-toggle` | Top-right avatar | `ProfileDrawer` | `{}` | Toggles user session profile drawer. |
| `saasify:notify` | Any trigger | `NotificationDrawer`, `UI` | `{ title, message, type }` | Spawns system toasts or notification drawer badges. |

### Architectural Benefit
- Any component can be replaced, updated, or omitted without breaking dependent UI blocks.
- Works identically in pure static HTML, server-rendered templates, or embedded web views.

---

## 3. Dynamic Component Loader (`ComponentLoader`)

The `ComponentLoader` in `src/main.js` enables micro-frontend-like modularity. Sub-widgets (sidebar, omni-bar, citation drawer, profile drawer) exist as self-contained HTML/JS bundles that are dynamically loaded on demand.

### Deterministic Path Resolution (`getProjectRoot()`)

To run seamlessly across:
1. Local Vite dev server (`http://localhost:5173/`)
2. Local subdirectory servers (e.g. XAMPP `http://localhost/Saasify-AI/dist/`)
3. Static CDN & GitHub Pages (`https://username.github.io/Saasify-AI/`)

`ComponentLoader` calculates the canonical base path relative to `import.meta.url`:

```javascript
getProjectRoot() {
    try {
        const moduleUrl = new URL(import.meta.url);
        const rootUrl = new URL('../', moduleUrl);
        let rootPath = rootUrl.pathname;
        if (!rootPath.endsWith('/')) rootPath += '/';
        window.SaasifyRoot = rootPath;
        return rootPath;
    } catch (e) {
        window.SaasifyRoot = '/';
        return '/';
    }
}
```

This guarantees that `fetch('${window.SaasifyRoot}src/components/...')` resolves with 100% path accuracy regardless of nested folder depth or hosting structure.

---

## 4. Design System & CSS Architecture

Saasify AI is styled with **Tailwind CSS JIT** augmented with custom design tokens.

### Theme Strategy (Dual-Mode Dark/Light)
- **Zero Flash of Unstyled Content (FOUC)**: Every page includes an inline critical script in the `<head>` reading `localStorage.getItem('saasify-theme')` and applying the `.dark` class before the first paint.
- **Glassmorphic Surface Hierarchy**:
  - `glass-card`: Translucent panel with backdrop blur, border shine, and theme-adaptive opacity (`rgba(15, 23, 42, 0.6)` in dark mode, `rgba(255, 255, 255, 0.8)` in light mode).
  - `bg-mesh-gradient`: Deep dark cosmic ambiance with subtle radial indigo and emerald glows.
  - `noise-overlay`: Fine-grain SVG texture overlay delivering tactical tactile realism.
- **Accessible Contrast Ratios**: All text, buttons, and badges meet WCAG 2.1 AA standards in both themes.

---

## 5. Mock AI Streaming Engine

Located in `src/main.js`, `MockAI` simulates real LLM streaming (similar to OpenAI Server-Sent Events or Vercel AI SDK):
- Accepts natural language inputs via `saasify:ai-request`.
- Selects contextual response templates (code generation, architectural analysis, performance auditing, reasoning steps).
- Simulates realistic human-like typing delays (30ms per token) using asynchronous intervals.
- Emits chunks via `saasify:ai-response` directly into `SyntaxTerminal` with simulated syntax highlighting and latency metrics.

---

## 6. Build & Deployment Pipeline

- **Vite 5**: Compiles ES modules, bundles CSS, and hashes assets for cache-busting.
- **Multi-Page Entry (`vite.config.js`)**: Dynamically discovers all root, auth, and dashboard HTML templates.
- **Post-Build Script (`scripts/copy-components.js`)**:
  - Flattens `src/pages/*.html` to `dist/*.html` for clean URLs.
  - Rewrites asset and component paths for depth 0 and depth 1 routes.
  - Recursively mirrors `src/components/` into `dist/src/components/` for runtime dynamic fetches.
  - Cleans up intermediate build artifacts.

