# RunPod Design System

## Color Palette

### Primary Colors
| Name | Hex | Usage |
|------|-----|-------|
| White | `#FFFFFF` | Primary surfaces, text on dark |
| Black | `#0E0E0E` | Dark backgrounds, text on light |
| Accent Purple | `#bbb6fd` | Progress bars, highlights, CTAs |

### Background Colors
```css
--bg-primary: #0E0E0E;
--bg-surface: rgba(255, 255, 255, 0.08);
--bg-surface-hover: rgba(255, 255, 255, 0.14);
--bg-success: rgba(16, 185, 129, 0.18);
```

### Text Colors
```css
--text-primary: #FFFFFF;
--text-secondary: rgba(255, 255, 255, 0.95);
--text-muted: rgba(255, 255, 255, 0.7);
```

### Border Colors
```css
--border-default: rgba(255, 255, 255, 0.15);
--border-hover: rgba(255, 255, 255, 0.25);
--border-success: rgba(16, 185, 129, 0.45);
```

### Semantic Colors
```css
--success: #10b981;
--success-bg: rgba(16, 185, 129, 0.18);
--accent: #bbb6fd;
```

---

## Typography

### Font Family
```css
font-family: 'Roboto Mono', monospace;
```

### Font Weights
| Weight | Value | Usage |
|--------|-------|-------|
| Regular | 400 | Body text |
| Medium | 500 | Headings, emphasis |

### Font Smoothing
```css
-webkit-font-smoothing: antialiased;
-moz-osx-font-smoothing: grayscale;
```

### Text Sizes (Suggested Scale)
```css
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 2rem;      /* 32px */
--text-4xl: 3rem;      /* 48px - statement-xl */
```

### Line Clamping
```css
.line-clamp-1 { -webkit-line-clamp: 1; }
.line-clamp-2 { -webkit-line-clamp: 2; }
.line-clamp-3 { -webkit-line-clamp: 3; }
```

---

## Spacing

### Base Scale
```css
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
```

### Common Patterns
```css
/* Button padding */
padding: 6px 10px;

/* Section gaps */
gap: 32px;

/* Component gaps */
gap: 1.5rem; /* 24px */

/* Code block padding */
padding-right: 3.5em;
```

---

## Border Radius

```css
--radius-sm: 4px;
--radius-md: 6px;
--radius-lg: 8px;
--radius-xl: 12px;
--radius-full: 9999px;
```

### Common Usage
| Element | Radius |
|---------|--------|
| Buttons | 6px |
| Code blocks | 6px |
| Cards | 8px |
| Pills/Tags | 9999px |

---

## Shadows

```css
/* Subtle elevation */
--shadow-sm: 0 2px 6px rgba(0, 0, 0, 0.3);

/* Dropdown/Modal */
--shadow-lg: 0 4px 16px rgba(0, 0, 0, 0.4);
```

### Backdrop Blur
```css
backdrop-filter: blur(48px);
```

---

## Buttons

### Base Style
```css
.btn {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  padding: 6px 10px;
  border-radius: 6px;
  color: rgba(255, 255, 255, 0.95);
  transform: translateY(0);
  transition: all 150ms cubic-bezier(0.42, 0, 0.58, 1);
}
```

### Hover State
```css
.btn:hover {
  background: rgba(255, 255, 255, 0.14);
  border-color: rgba(255, 255, 255, 0.25);
}
```

### Active State
```css
.btn:active {
  transform: translateY(0.5px);
}
```

### Success State
```css
.btn-success {
  background: rgba(16, 185, 129, 0.18);
  border-color: rgba(16, 185, 129, 0.45);
}
```

### Primary CTA
```css
.btn-primary {
  background: #bbb6fd;
  color: #0E0E0E;
  border: none;
}
```

---

## Gradients

### Text Gradient
```css
.gradient-text {
  background: linear-gradient(135deg, #FFFFFF 0%, #bbb6fd 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

### Fade Mask (Bottom)
```css
.fade-bottom {
  mask-image: linear-gradient(to bottom, black 0%, black 70%, transparent 100%);
}
```

### Surface Overlay
```css
.surface-gradient {
  background: linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.03) 100%);
  background-blend-mode: overlay;
}
```

---

## Components

### Card
```css
.card {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  padding: 1.5rem;
}
```

### Code Block
```css
.code-block {
  background: rgba(0, 0, 0, 0.4);
  border-radius: 6px;
  padding: 1rem;
  padding-right: 3.5em; /* Reserve space for copy button */
  overflow: auto;
  font-family: 'Roboto Mono', monospace;
}
```

### Progress Bar
```css
.progress {
  height: 2px;
  background: rgba(255, 255, 255, 0.15);
}

.progress-fill {
  background: #bbb6fd;
  transition: width 5s linear;
}
```

### Navigation Dropdown
```css
.dropdown {
  transform: scale(0.9);
  opacity: 0;
  transition: all 150ms cubic-bezier(0.42, 0, 0.58, 1);
}

.dropdown.open {
  transform: scale(1);
  opacity: 1;
}
```

---

## Layout

### Container
```css
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}
```

### Width Utilities
```css
.max-w-70 { max-width: 70%; }
.max-w-50 { max-width: 50%; }
```

### Grid with Borders
```css
.grid-bordered {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  /* Borders between items handled via data attributes */
}
```

---

## Responsive Breakpoints

```css
/* Mobile first approach */
--breakpoint-sm: 360px;   /* Small mobile */
--breakpoint-md: 768px;   /* Tablet */
--breakpoint-lg: 992px;   /* Desktop */
--breakpoint-xl: 1200px;  /* Large desktop */
```

### Media Queries
```css
/* Mobile */
@media (max-width: 767px) { }

/* Tablet */
@media (min-width: 768px) and (max-width: 991px) { }

/* Desktop */
@media (min-width: 992px) { }
```

---

## Animations & Transitions

### Timing Function
```css
--ease-default: cubic-bezier(0.42, 0, 0.58, 1);
```

### Common Durations
```css
--duration-fast: 150ms;
--duration-normal: 300ms;
--duration-slow: 500ms;
--duration-hero: 1200ms;
```

### Fade In
```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

### Slide Up
```css
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### Icon Rotation
```css
.icon-rotate {
  transition: transform 150ms ease;
}

.icon-rotate.active {
  transform: rotate(180deg);
}
```

### Ripple Effect
```css
@keyframes ripple {
  0% { transform: scale(1); opacity: 1; }
  100% { transform: scale(1.5); opacity: 0; }
}

.ripple {
  animation: ripple 2s ease-out infinite;
}
```

---

## Icons

- **Style**: Outlined / stroke-based SVG
- **Default Size**: 14px × 14px (small), 20px × 20px (medium), 24px × 24px (large)
- **Color**: Inherits from text color
- **Stroke Width**: 1.5px - 2px

---

## CSS Variables Summary

```css
:root {
  /* Colors */
  --color-white: #FFFFFF;
  --color-black: #0E0E0E;
  --color-accent: #bbb6fd;
  --color-success: #10b981;

  /* Surfaces */
  --surface-primary: rgba(255, 255, 255, 0.08);
  --surface-hover: rgba(255, 255, 255, 0.14);

  /* Borders */
  --border-default: rgba(255, 255, 255, 0.15);
  --border-hover: rgba(255, 255, 255, 0.25);

  /* Typography */
  --font-mono: 'Roboto Mono', monospace;

  /* Spacing */
  --gap-sm: 0.5rem;
  --gap-md: 1rem;
  --gap-lg: 1.5rem;
  --gap-xl: 2rem;

  /* Radius */
  --radius-default: 6px;

  /* Shadows */
  --shadow-default: 0 2px 6px rgba(0, 0, 0, 0.3);

  /* Transitions */
  --ease: cubic-bezier(0.42, 0, 0.58, 1);
  --duration: 150ms;
}
```

---

## Design Principles

1. **Dark-first**: Design optimized for dark backgrounds with light text
2. **Subtle surfaces**: Use low-opacity white overlays for depth
3. **Smooth transitions**: 150ms cubic-bezier for micro-interactions
4. **Monospace typography**: Technical/developer-focused aesthetic
5. **Accent restraint**: Purple accent used sparingly for CTAs and highlights
6. **Generous spacing**: Ample whitespace for breathing room
7. **Glass morphism**: Backdrop blur on overlays for depth
