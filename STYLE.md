# Style Guide — BBox & Segmentation Visualizer

## Tech Stack
- Vanilla HTML5, CSS3, JavaScript (ES6+)
- No frameworks, no build tools, no transpilation
- Single HTML file, single CSS file, single JS file

## JavaScript Conventions

### File Organization
`script.js` is organized into clearly labeled sections:
```javascript
// ============================================
// Section Name
// ============================================
```

Section order:
1. DOM Elements (const references)
2. File Input & Drag/Drop
3. Parsers
4. Utilities
5. Drawing
6. Actions
7. Event Listeners
8. Zoom & Pan
9. Full View Modal
10. Initialization

### Naming
- **Variables**: `camelCase` — `currentImage`, `zoomLevel`, `isPanMode`
- **Constants**: `UPPER_SNAKE_CASE` — `COLORS`, `ZOOM_MIN`, `ZOOM_MAX`, `ZOOM_STEP`
- **Functions**: `camelCase`, verb-first — `loadImage()`, `draw()`, `parseBboxes()`
- **Booleans**: `is`/`has` prefix — `isPanning`, `isPanMode`
- **DOM references**: Match element ID — `const canvas = document.getElementById('canvas')`

### DOM Element IDs
- Descriptive, camelCase: `canvasWrapper`, `dropHint`, `imgStats`
- Prefixed by annotation type: `bbox*`, `seg*`, `line*`, `point*`
- Control suffix matches type: `*Input`, `*Color`, `*Width`, `*Multi`, `*Fill`, `*Radius`, `*Opacity`

### Patterns
- **Event-driven redraw**: All inputs trigger `draw()` on `input`, `paste`, and `change`
- **Parser pattern**: Each annotation type has a dedicated `parse*()` function that:
  1. Collects raw values
  2. Calls `isNormalized()` to detect coord type
  3. Scales if normalized
  4. Returns structured data
- **No classes/prototypes**: Plain functions and global state
- **DOM access**: `document.getElementById()` — no query selectors for element access
- **Inline onclick**: Used for top-bar buttons (`onclick="downloadImage()"`)
- **addEventListener**: Used for dynamic bindings (inputs, keyboard, mouse)

### Error Handling
- Parsers silently skip invalid lines (no alerts/console errors)
- Guard clauses at function top (`if (!currentImage) return`)

### Comments
- Sparse — code is self-documenting via clear function/variable names
- Section headers use `// ====` dividers
- Inline comments only for non-obvious logic (e.g., normalization detection)

## CSS Conventions

### Architecture
- Single `styles.css` file
- CSS custom properties (variables) in `:root`
- Organized into labeled sections matching component hierarchy

### Section Organization
```css
/* ============================================
   Section Name
   ============================================ */
```

Section order:
1. Root Variables & Reset
2. Body & Typography
3. Layout (container, panels)
4. Top Bar
5. Canvas & Drop Hint
6. Controls Row & Control Groups
7. Form Elements (inputs, textareas, buttons)
8. Viewer Controls (zoom/pan)
9. Modal
10. Responsive Media Queries
11. Utility Classes

### Custom Properties
Organized by category in `:root`:
```css
/* Colors */       --color-white, --color-black, --color-accent, --color-accent-secondary
/* Glass */        --glass-bg, --glass-bg-hover, --glass-border, --glass-border-hover
/* Text */         --text-primary, --text-secondary, --text-muted, --text-hint
/* Backgrounds */  --bg-body, --bg-surface, --bg-input
/* Spacing */      --space-xs (4px) through --space-2xl (48px)
/* Radius */       --radius-sm (6px) through --radius-xl (20px)
/* Shadows */      --shadow-sm through --shadow-lg
/* Transitions */  --ease, --ease-bounce, --duration-fast/normal/slow
```

### Naming
- **Classes**: `kebab-case` — `canvas-wrapper`, `control-group`, `drop-hint`
- **Modifiers**: Descriptive — `has-image`, `collapsed`, `active`, `panning`
- **Prefixes by component**: `viewer-*`, `modal-*`, `upload-*`, `drop-*`

### Design System
- **Dark-first**: Dark backgrounds with light text
- **Glass morphism**: `backdrop-filter: blur()` + low-opacity overlays
- **Gradient accents**: Linear gradients for title and interactive borders
- **Font**: Roboto Mono (monospace) — technical aesthetic
- **Hover states**: Background/border color transitions
- **Focus-visible**: Outline only on keyboard focus

### Responsive
Three breakpoints, desktop-first:
```css
@media (max-width: 1200px)  /* 2x2 grid */
@media (max-width: 768px)   /* Stack + wrap */
@media (max-width: 600px)   /* Compact controls */
```

## HTML Conventions

### Structure
- Semantic grouping via `<div>` with descriptive classes
- Hidden `<input type="file">` triggered by visible `<button>`
- `<canvas>` for rendering, `<textarea>` for data input
- Lucide icons via `<i data-lucide="icon-name">`

### Attributes
- IDs for JS-accessed elements (always camelCase)
- Classes for CSS styling (always kebab-case)
- Inline `onclick` for simple top-bar actions
- `type`, `min`, `max`, `value` attributes on form controls

### Cache Busting
```html
<link rel="stylesheet" href="styles.css?v=N">
<script src="script.js?v=N"></script>
```
**Always increment `?v=N` when modifying CSS or JS files.**

## Animations, Transitions & Visual Effects

### Timing Variables
```css
--ease: cubic-bezier(0.16, 1, 0.3, 1);       /* Primary easing — fast start, smooth decel */
--ease-bounce: cubic-bezier(0.34, 1.56, 0.64, 1); /* Overshoot for playful interactions */
--duration-fast: 150ms;    /* Micro-interactions: hover, active, focus */
--duration-normal: 250ms;  /* State changes: panel hover, modal open */
--duration-slow: 400ms;    /* Larger animations: shine sweep, collapsible toggle */
```

### Standard Transition Pattern
Most interactive elements follow the same pattern:
```css
transition: all var(--duration-fast) var(--ease);
```
Panels and larger surfaces use `--duration-normal` instead.

### Hover & Active States

**Buttons (primary)**:
- Hover: `transform: translateY(-2px)` + `box-shadow: var(--glow-accent-strong), var(--shadow-md)`
- Active: `transform: translateY(0)` (snap back)

**Buttons (secondary / glass)**:
- Hover: Background `--glass-bg` → `--glass-bg-hover`, border `--glass-border` → `--glass-border-hover`
- Hover: `transform: translateY(-2px)` + `box-shadow: var(--shadow-sm)`

**Control groups**:
- Hover: `transform: translateY(-2px)`, border brightens, gradient accent line at top fades in
- Pseudo-element `::before` gradient line: `opacity: 0` → `opacity: 1`

**Textareas**:
- Hover: border `--glass-border` → `--glass-border-hover`
- Focus: border `--color-accent` + `box-shadow: 0 0 0 3px rgba(0, 217, 255, 0.1), var(--glow-accent)`

**Color inputs**:
- Hover: border brightens + `transform: scale(1.05)`

**Canvas wrapper**:
- Hover: border color brightens, background darkens slightly
- With image: solid cyan border + `box-shadow: var(--glow-accent), inset 0 0 60px rgba(0, 217, 255, 0.03)`

### Button Shine Effect
Primary buttons have a sweep highlight on hover:
```css
button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%);
  transition: left var(--duration-slow) var(--ease);
}

button:hover::before {
  left: 100%;   /* Sweeps left-to-right on hover */
}
```
Secondary buttons disable this: `button.secondary::before { display: none; }`

### Glass Morphism Pattern
Used on panels, control groups, stats pill, viewer controls, and modal close button:
```css
background: var(--glass-bg);                /* rgba(255, 255, 255, 0.03) */
border: 1px solid var(--glass-border);      /* rgba(255, 255, 255, 0.08) */
backdrop-filter: blur(20px);
-webkit-backdrop-filter: blur(20px);        /* Safari support */
```
Blur values vary: `blur(10px)` for small elements, `blur(20px)` for panels, `blur(48px)` for heavy overlays.

### Glow Effects
```css
--glow-accent: 0 0 20px rgba(0, 217, 255, 0.3);          /* Subtle glow */
--glow-accent-strong: 0 0 40px rgba(0, 217, 255, 0.4);    /* Hover emphasis */
--color-accent-glow: rgba(0, 217, 255, 0.4);              /* For drop-shadow/text-shadow */
```
Used on:
- Button hover: `box-shadow: var(--glow-accent-strong)`
- Canvas wrapper with image: `box-shadow: var(--glow-accent)`
- Textarea focus: `box-shadow: ... var(--glow-accent)`
- Stats numbers: `text-shadow: 0 0 10px var(--color-accent-glow)`
- Checkbox icon hover: `filter: drop-shadow(0 0 4px var(--color-accent-glow))`
- Modal image: `box-shadow: var(--shadow-lg), var(--glow-accent)`

### Gradient Border Effect (Canvas Panel)
Animated gradient border that fades in on hover using mask compositing:
```css
.canvas-panel::before {
  background: linear-gradient(135deg, transparent 0%, rgba(0, 217, 255, 0.2) 50%, transparent 100%);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0;
  transition: opacity var(--duration-normal) var(--ease);
}

.canvas-panel:hover::before { opacity: 1; }
```

### Modal Animation
Open/close with opacity + scale:
```css
.modal-overlay {
  opacity: 0; visibility: hidden;
  transition: all var(--duration-normal) var(--ease);
}
.modal-overlay.active { opacity: 1; visibility: visible; }

.modal-content {
  transform: scale(0.9);
  transition: transform var(--duration-normal) var(--ease);
}
.modal-overlay.active .modal-content { transform: scale(1); }
```

### Viewer Controls Reveal
Controls slide up + fade in when canvas is hovered or has an image:
```css
.viewer-controls {
  opacity: 0;
  transform: translateY(8px);
  transition: all var(--duration-normal) var(--ease);
}

.canvas-wrapper:hover .viewer-controls,
.canvas-wrapper.has-image .viewer-controls {
  opacity: 1;
  transform: translateY(0);
}
```

Individual viewer buttons:
- Hover: background brightens, `transform: none` (override global button lift)
- Active: `transform: scale(0.95)` (press-in feel)
- Active toggle (`.active`): cyan background + border

### Collapsible Arrow Rotation
Control group headers have a CSS triangle that rotates on collapse:
```css
h3::after {
  /* CSS border-triangle */
  transform: rotate(45deg);       /* Open: points down */
  transition: transform var(--duration-fast) var(--ease);
}

.collapsed h3::after {
  transform: rotate(-135deg);     /* Collapsed: points right */
}
```

### Cursor States
```css
#canvas             { cursor: default; }
#canvas.panning     { cursor: grab; }
#canvas.panning:active { cursor: grabbing; }
```

### Scrollbar Styling
Custom webkit scrollbar with glass aesthetic:
```css
::-webkit-scrollbar-track { background: rgba(0, 0, 0, 0.2); }
::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.15); }
::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.25); }
```

### Selection Styling
```css
::selection { background: rgba(0, 217, 255, 0.3); color: #FFFFFF; }
```

### Focus Accessibility
```css
:focus-visible { outline: 2px solid var(--color-accent); outline-offset: 2px; }
```

### Title Gradient
```css
h1 {
  background: linear-gradient(135deg, #FFFFFF 0%, var(--color-accent) 50%, var(--color-accent-secondary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 0 6px var(--color-accent-glow));
}
```

## General Principles

1. **No build step** — everything runs directly in the browser
2. **Single-file-per-language** — one HTML, one CSS, one JS
3. **Self-documenting code** — clear names over comments
4. **Immediate feedback** — every input change triggers a redraw
5. **Graceful degradation** — invalid input is silently skipped
6. **Minimal dependencies** — only Lucide icons (CDN) and Google Fonts
