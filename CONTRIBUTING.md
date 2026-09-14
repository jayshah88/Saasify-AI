# Contributing to Saasify AI

Thank you for your interest in contributing to **Saasify AI**! We welcome contributions from developers of all skill levels to help make this the premier open-source AI SaaS starter kit and template.

---

## Code of Conduct

All contributors and participants agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md). Please report unacceptable behavior to the maintainer.

---

## Getting Started

1. **Fork the Repository**:
   Click the "Fork" button at the top right of the [GitHub Repository](https://github.com/jayshah88/Saasify-AI).

2. **Clone Your Fork**:
   ```bash
   git clone https://github.com/YOUR-USERNAME/Saasify-AI.git
   cd Saasify-AI
   ```

3. **Install Dependencies**:
   ```bash
   npm install
   ```

4. **Launch Local Dev Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

---

## Development Workflow

### Branch Naming Conventions
- `feature/short-description`: New features or components
- `fix/short-description`: Bug fixes and styling corrections
- `docs/short-description`: Documentation improvements
- `perf/short-description`: Performance optimizations

### Code Style & Quality Standards
- **Clean HTML**: Semantic HTML5 tags, valid accessibility attributes (`aria-*`, `role`), and self-closing tags where appropriate.
- **Tailwind CSS**: Use utility classes consistently. Keep custom utility overrides in `src/style.css`.
- **Zero Console Errors**: Ensure no uncaught exceptions or broken resource links exist in the browser console.
- **Responsive by Design**: Verify responsive layouts across mobile (375px), tablet (768px), and desktop (1280px+).

---

## Running Verification & Tests

Before submitting a Pull Request, run the local build and quality checks:

```bash
# Verify production build & asset compilation
npm run build

# Run quality audit test suite
npm test
```

Ensure that:
1. `npm run build` exits with code 0.
2. All test assertions in `tests/quality-audit.test.cjs` pass.
3. No relative links are broken in `dist/`.

---

## Submitting a Pull Request

1. Push your changes to your feature branch on GitHub:
   ```bash
   git push origin feature/your-feature-name
   ```
2. Open a Pull Request against `main` on the official repository.
3. Fill out the PR description with:
   - What changed and why.
   - Screenshots or video for visual/UI changes.
   - Verification steps taken.
4. Respond to review comments promptly.

---

## Questions & Feedback

If you have questions or ideas before starting work, please open an Issue on GitHub. Thank you for making Saasify AI better!

