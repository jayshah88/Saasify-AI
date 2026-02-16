# Citation Drawer Component

A slide-over drawer for displaying verified source intelligence, building trust in AI responses.

## Usage
Trigger via global event:
```javascript
window.dispatchEvent(new CustomEvent('saasify:open-citation', { 
    detail: { name: 'Source_Document.pdf' } 
}));
```

## Features
- **Global Access:** Can be triggered from any component (chat, dashboard, etc.).
- **Focus Trap:** Manages focus for accessibility.
- **Backdrop Blur:** Adds depth and context.

## Files
- `citation-drawer.html`: Drawer structure.
- `citation-drawer.js`: Interaction logic (IIFE).
- `citation-drawer.css`: Slide animations.
