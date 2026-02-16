# Syntax Terminal Component

A high-fidelity code terminal with syntax highlighting and haptic copy feedback.

## Usage
Add a placeholder and load via `ComponentLoader`:
```javascript
await ComponentLoader.loadAI('syntax-terminal', 'terminal-id');
```

## Features
- **Haptic Feedback:** The copy button changes to a success state.
- **Responsive:** Clean horizontal scroll for long lines.
- **Themed:** Uses the Slate/Indigo brand palette.

## Files
- `syntax-terminal.html`: Structure and inline sample code.
- `syntax-terminal.js`: Copy logic (IIFE).
- `syntax-terminal.css`: Typography and scroll styles.
