# BBox & Segmentation Visualizer - Project Context

## Project Overview
A web-based visualization tool for bounding boxes, segmentation polygons, polylines, and points overlaid on images.

## File Structure
```
visualizer/
├── index.html          # Main HTML (107 lines)
├── styles.css          # All CSS styles (350 lines)
├── script.js           # All JavaScript (348 lines)
├── favicon_io/         # Favicon assets
│   ├── favicon.ico
│   ├── favicon-16x16.png
│   ├── favicon-32x32.png
│   ├── apple-touch-icon.png
│   ├── android-chrome-192x192.png
│   ├── android-chrome-512x512.png
│   └── logo-2000x2000.png
└── CLAUDE.md           # This file
```

## Running the App
```bash
cd /mnt/d/OneDrive/Work/Projects/Work_n_Consulting_Projects/QuickPlansAI/repos/crewai-exps/visualizer
python3 -m http.server 9000
# Open http://localhost:9000
```

## Layout Structure
```
┌─────────────────────────────────────────────────────────┐
│ [Upload] [Download] [Clear Annotations] [Clear All] Stats│  <- top-bar
├─────────────────────────────────────────────────────────┤
│                      Canvas                              │  <- canvas-panel
├──────────────┬──────────────┬─────────────┬─────────────┤
│  BBox        │ Segmentation │  Polylines  │   Points    │  <- controls-row
│  [textarea]  │  [textarea]  │  [textarea] │  [textarea] │
│  [controls]  │  [controls]  │  [controls] │  [controls] │
└──────────────┴──────────────┴─────────────┴─────────────┘
```

## Input Formats

### Bounding Boxes
- Format: `x1, y1, x2, y2` (one per line)
- (x1, y1) = top-left, (x2, y2) = bottom-right
- Supports both pixel coords and normalized (0-1) coords
- Example: `100, 100, 300, 250` or `0.1, 0.1, 0.3, 0.25`

### Segmentation (Closed Polygons)
- Format: `[[x1,y1], [x2,y2], ...]`
- Multiple polygons: comma-separated on same line or one per line
- Auto-closes (connects last point to first)
- Supports normalized coords (0-1)

### Polylines (Open Lines)
- Same format as segmentation
- Does NOT auto-close

### Points
- Format: `[[x1,y1], [x2,y2], ...]` or `x, y` per line
- Drawn as circles with configurable radius and opacity

## Default Values

### Colors
```javascript
const COLORS = [
  '#ff3366', '#00ff88', '#ffaa00', '#00d9ff', '#ff00ff',
  '#00ffff', '#ffff00', '#ff6600', '#66ff00', '#0066ff',
  '#ff0066', '#00ff66', '#6600ff', '#ff9900', '#99ff00'
];
```

### Control Defaults
| Control | Default | Range |
|---------|---------|-------|
| bboxColor | #ff3366 | - |
| bboxWidth | 2 | 1-10 |
| bboxMulti | unchecked | - |
| segColor | #00ff88 | - |
| segWidth | 2 | 1-10 |
| segFill | 20% | 0-100 |
| segMulti | checked | - |
| lineColor | #ffaa00 | - |
| lineWidth | 2 | 1-10 |
| lineMulti | unchecked | - |
| pointColor | #ff00ff | - |
| pointRadius | 5 | 1-50 |
| pointOpacity | 80% | 0-100 |
| pointMulti | unchecked | - |

## Features

### Implemented
- Image upload (button or drag-drop)
- Bounding box visualization
- Segmentation polygon visualization (with fill)
- Polyline visualization
- Point visualization (with radius & opacity)
- Multi-color mode (cycles through 15-color palette)
- Color picker (disabled when multi-color is on)
- Line width control
- Fill opacity control (segmentation)
- Point radius & opacity controls
- Auto-update on input/paste
- Download annotated image as PNG
- Collapsible control groups (click header to toggle)
- Normalized coordinates support (0-1 auto-scales to image)
- Responsive layout (2x2 grid at <1200px, stack at <768px)
- Stats display (image size, annotation counts)

### External Dependencies
- **Lucide Icons**: `https://unpkg.com/lucide@latest` (for UI icons)

## CSS Variables / Theme
```css
/* Colors */
--bg-primary: #1a1a2e;      /* Body background */
--bg-secondary: #16213e;    /* Panels background */
--bg-input: #0f0f23;        /* Input/textarea background */
--accent: #00d9ff;          /* Primary accent (cyan) */
--accent-hover: #00b8d9;    /* Button hover */
--text-primary: #eee;       /* Main text */
--text-secondary: #aaa;     /* Labels */
--text-muted: #888;         /* Hints */
--border: #333;             /* Borders */
--border-active: #00d9ff;   /* Active borders */
```

## Responsive Breakpoints
- `<1200px`: Control groups wrap to 2x2 grid
- `<768px`: Top bar wraps, control groups stack vertically
- `<600px`: Control bar items can wrap

## Cache Busting
CSS and JS files include version query strings:
- `styles.css?v=4`
- `script.js?v=2`

Increment version numbers when making changes to bypass browser cache.

## Key DOM Element IDs
```
imageInput      - Hidden file input
canvasWrapper   - Canvas container (for drag-drop)
canvas          - The drawing canvas
dropHint        - "Drop image here" text
imgStats        - Image dimensions display
boxCount        - Bbox count display
segCount        - Polygon count display
lineCount       - Polyline count display
pointCount      - Point count display

bboxInput       - Bbox textarea
bboxColor       - Bbox color picker
bboxWidth       - Bbox line width
bboxMulti       - Bbox multi-color checkbox

segInput        - Segmentation textarea
segColor        - Segmentation color picker
segWidth        - Segmentation line width
segFill         - Segmentation fill opacity slider
segMulti        - Segmentation multi-color checkbox

lineInput       - Polyline textarea
lineColor       - Polyline color picker
lineWidth       - Polyline line width
lineMulti       - Polyline multi-color checkbox

pointInput      - Points textarea
pointColor      - Points color picker
pointRadius     - Points radius
pointOpacity    - Points opacity slider
pointMulti      - Points multi-color checkbox
```

## Functions (script.js)

### Core Functions
- `loadImage(file)` - Load image from file input
- `draw()` - Redraw canvas with all annotations
- `downloadImage()` - Export canvas as PNG
- `clearAnnotations()` - Clear all annotation inputs
- `clearAll()` - Clear annotations and image

### Parsers
- `parseBboxes(text, imgWidth, imgHeight)` - Parse bbox text
- `parsePolygons(text, imgWidth, imgHeight)` - Parse polygon/polyline text
- `parsePoints(text, imgWidth, imgHeight)` - Parse points text

### Utilities
- `hexToRgba(hex, alpha)` - Convert hex color to rgba
- `updateColorPickers()` - Disable color pickers when multi-color is on

## Notes
- Coordinates with values <= 1 are treated as normalized (0-1) and scaled to image dimensions
- Segmentation ending with same point as start is redundant (closePath handles it)
- Multi-color checkbox disables the color picker and cycles through COLORS array
- All inputs auto-trigger redraw on input/paste/change events
