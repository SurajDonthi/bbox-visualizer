# BBox & Segmentation Visualizer - Project Context

## Project Overview
A web-based visualization tool for bounding boxes, segmentation polygons, polylines, and points overlaid on images. Pure vanilla HTML/CSS/JS — no frameworks, no build step.

## File Structure
```
visualizer/
├── index.html          # Main HTML markup
├── styles.css          # All CSS styles
├── script.js           # All JavaScript logic
├── package.json        # Node config (serve for deployment)
├── CLAUDE.md           # This file — project context for AI
├── STYLE.md            # Coding conventions & style guide
├── runpod-style.md     # Design system reference (RunPod-inspired)
└── favicon_io/         # Favicon assets
    ├── favicon.ico
    ├── favicon-16x16.png
    ├── favicon-32x32.png
    ├── favicon-64x64.png
    ├── apple-touch-icon.png
    ├── android-chrome-192x192.png
    ├── android-chrome-512x512.png
    └── logo-2000x2000.png
```

## Running the App

### Local development
```bash
cd visualizer/
python3 -m http.server 9000
# Open http://localhost:9000
```

### Production (Railway)
```bash
npm start  # Runs: npx serve -s . -l $PORT
```

Deployed on Railway. Repo: `github.com:SurajDonthi/bbox-visualizer.git`

## Cache Busting
CSS and JS include version query strings in `index.html`:
- `styles.css?v=N`
- `script.js?v=N`

**Always bump version numbers when modifying these files**, otherwise browsers serve stale cached versions.

## Layout Structure
```
┌─────────────────────────────────────────────────────────┐
│ [Upload] [Download] [Clear Annotations] [Clear All] Stats│  <- top-bar
├─────────────────────────────────────────────────────────┤
│                                                          │
│              Canvas (with zoom/pan controls)              │  <- canvas-panel
│         Drop hint + Upload button when no image          │
│                                                          │
├──────────────┬──────────────┬─────────────┬─────────────┤
│  BBox        │ Segmentation │  Polylines  │   Points    │  <- controls-row
│  [textarea]  │  [textarea]  │  [textarea] │  [textarea] │
│  [controls]  │  [controls]  │  [controls] │  [controls] │
└──────────────┴──────────────┴─────────────┴─────────────┘
```

## Input Formats

### Bounding Boxes
- Format: `x1, y1, x2, y2` (one per line)
- Also accepts bracketed: `[x1, y1, x2, y2],`
- (x1, y1) = top-left, (x2, y2) = bottom-right
- Supports both pixel coords and normalized (0-1) coords
- Examples:
  ```
  100, 100, 300, 250
  0.1, 0.1, 0.3, 0.25
  [0.38, 0.05, 0.58, 0.32],
  [0.62, 0.05, 0.82, 0.32],
  ```

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

### Coordinate Auto-Detection
All parsers auto-detect normalized vs pixel coords:
- If ALL values are in [0, 1] AND at least one is strictly between 0 and 1 → normalized
- Otherwise → pixel coordinates
- Normalized coords are scaled to image dimensions

## Features

### Image Loading
- Upload button (top bar + drop zone)
- Drag and drop onto canvas
- Paste from clipboard (Ctrl+V / Cmd+V)

### Annotation Types
- **Bounding boxes**: Rectangles with color & line width
- **Segmentation polygons**: Closed shapes with fill opacity
- **Polylines**: Open connected lines
- **Points**: Circles with radius & opacity

### Visualization Controls
- Per-type color picker
- Per-type line width / radius / opacity
- Multi-color mode (cycles through 15-color palette)
- Color picker auto-disables when multi-color is on

### Viewer
- Zoom in/out (mouse wheel or buttons, 25%-500%)
- Pan mode (toggle + drag)
- Reset view
- Full-view modal (Escape to close)
- Download annotated image as PNG

### UI
- Collapsible control groups (click header)
- Real-time stats (image size, annotation counts)
- Auto-redraw on any input/paste/change
- Responsive layout (4-col → 2x2 → stacked)

## Control Defaults

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

## Color Palette (Multi-Color Mode)
```javascript
const COLORS = [
  '#ff3366', '#00ff88', '#ffaa00', '#00d9ff', '#ff00ff',
  '#00ffff', '#ffff00', '#ff6600', '#66ff00', '#0066ff',
  '#ff0066', '#00ff66', '#6600ff', '#ff9900', '#99ff00'
];
```

## Key DOM Element IDs
```
imageInput, canvasWrapper, canvas, dropHint
imgStats, boxCount, segCount, lineCount, pointCount
bboxInput, bboxColor, bboxWidth, bboxMulti
segInput, segColor, segWidth, segFill, segMulti
lineInput, lineColor, lineWidth, lineMulti
pointInput, pointColor, pointRadius, pointOpacity, pointMulti
zoomIn, zoomOut, zoomReset, panToggle, fullView, zoomLevel
modalOverlay, modalImage, modalClose
```

## Functions (script.js)

### Image
- `loadImage(file)` — Load image onto canvas via FileReader

### Parsers
- `isNormalized(values)` — Detect if coords are 0-1 range
- `parseBboxes(text, imgWidth, imgHeight)` — Parse bbox input (plain or bracketed)
- `parsePolygons(text, imgWidth, imgHeight)` — Parse polygon/polyline input
- `parsePoints(text, imgWidth, imgHeight)` — Parse points input

### Drawing
- `draw()` — Full canvas redraw (image + all annotations + stats)

### Actions
- `clearAnnotations()` — Clear all textarea inputs
- `clearAll()` — Clear annotations + image
- `downloadImage()` — Export canvas as PNG

### Utilities
- `hexToRgba(hex, alpha)` — Color conversion
- `updateColorPickers()` — Toggle color pickers based on multi-color state

### Zoom & Pan
- `updateCanvasTransform()` — Apply zoom/pan CSS transform
- `resetView()` — Reset to 1x zoom, no pan
- `zoomIn()` / `zoomOut()` — Step zoom (0.25x increments)
- `togglePanMode()` — Toggle mouse drag panning

### Modal
- `openFullView()` — Show annotated image in fullscreen modal
- `closeFullView()` — Close modal

## External Dependencies
- **Lucide Icons**: `https://unpkg.com/lucide@latest`
- **Google Fonts**: Roboto Mono (loaded in CSS)

## Responsive Breakpoints
- `<1200px`: Control groups wrap to 2x2 grid
- `<768px`: Top bar wraps, control groups stack vertically
- `<600px`: Control items can wrap

## Deployment
- **Platform**: Railway (auto-deploy from GitHub `main` branch)
- **Repo**: `SurajDonthi/bbox-visualizer`
- **Server**: `npx serve -s . -l $PORT` (static files, no build)
- **Node**: >=18
