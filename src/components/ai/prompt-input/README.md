# Prompt Input Component

A premium, auto-expanding textarea for AI prompt entry.

## Usage
Add `<div id="prompt-input-demo"></div>` to your HTML and call `ComponentLoader.loadAI('prompt-input', 'target-id')`.

## Files
- `prompt-input.html`: The UI structure.
- `prompt-input.js`: Auto-resize and submit logic (IIFE).
- `prompt-input.css`: Scrollbar and micro-style overrides.

## Events
- Emits: `saasify:ai-request`.
- Listens: `saasify:ai-loading-start`, `saasify:ai-loading-end`.
