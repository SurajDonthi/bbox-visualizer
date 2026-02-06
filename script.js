// DOM Elements
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const wrapper = document.getElementById('canvasWrapper');
const dropHint = document.getElementById('dropHint');

let currentImage = null;

// Color palette for multi-instance coloring
const COLORS = [
  '#ff3366', '#00ff88', '#ffaa00', '#00d9ff', '#ff00ff',
  '#00ffff', '#ffff00', '#ff6600', '#66ff00', '#0066ff',
  '#ff0066', '#00ff66', '#6600ff', '#ff9900', '#99ff00'
];

// ============================================
// File Input & Drag/Drop
// ============================================

document.getElementById('imageInput').addEventListener('change', (e) => {
  if (e.target.files[0]) loadImage(e.target.files[0]);
});

wrapper.addEventListener('dragover', (e) => {
  e.preventDefault();
  wrapper.style.borderColor = '#00ff88';
});

wrapper.addEventListener('dragleave', () => {
  wrapper.style.borderColor = currentImage ? '#00d9ff' : '#444';
});

wrapper.addEventListener('drop', (e) => {
  e.preventDefault();
  wrapper.style.borderColor = currentImage ? '#00d9ff' : '#444';
  const file = e.dataTransfer.files[0];
  if (file && file.type.startsWith('image/')) loadImage(file);
});

function loadImage(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      currentImage = img;
      canvas.width = img.width;
      canvas.height = img.height;
      wrapper.classList.add('has-image');
      dropHint.style.display = 'none';
      canvas.style.display = 'block';
      draw();
      document.getElementById('imgStats').textContent = `${img.width} x ${img.height}`;
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

// ============================================
// Parsers
// ============================================

// Check if all values in an array appear to be normalized (0-1 range)
// Uses a threshold: if ALL values are <= 1 AND at least one is a decimal (not 0 or 1), treat as normalized
function isNormalized(values) {
  if (values.length === 0) return false;
  const allInRange = values.every(v => v >= 0 && v <= 1);
  const hasDecimal = values.some(v => v > 0 && v < 1);
  return allInRange && hasDecimal;
}

function parseBboxes(text, imgWidth, imgHeight) {
  const boxes = [];
  const lines = text.trim().split('\n').filter(l => l.trim());

  // Collect all values first to determine if normalized
  const allValues = [];
  const parsedLines = [];

  for (const line of lines) {
    const cleaned = line.replace(/[\[\]]/g, '').replace(/,\s*$/, '');
    const nums = cleaned.split(',').map(n => parseFloat(n.trim()));
    if (nums.length === 4 && nums.every(n => !isNaN(n))) {
      allValues.push(...nums);
      parsedLines.push(nums);
    }
  }

  const normalized = isNormalized(allValues);

  for (const nums of parsedLines) {
    const x1 = normalized ? nums[0] * imgWidth : nums[0];
    const y1 = normalized ? nums[1] * imgHeight : nums[1];
    const x2 = normalized ? nums[2] * imgWidth : nums[2];
    const y2 = normalized ? nums[3] * imgHeight : nums[3];
    boxes.push({ x1, y1, x2, y2 });
  }

  return boxes;
}

function parsePolygons(text, imgWidth, imgHeight) {
  const polygons = [];
  let cleaned = text.trim();
  if (!cleaned) return polygons;

  // Collect all raw polygons first
  let rawPolygons = [];

  // Try parsing as array of polygons first: [[...], [...], ...]
  try {
    let wrapped = cleaned;
    if (cleaned.startsWith('[[') && !cleaned.startsWith('[[[')) {
      wrapped = '[' + cleaned.replace(/,\s*$/, '') + ']';
    }
    const parsed = JSON.parse(wrapped);
    if (Array.isArray(parsed) && parsed.length > 0) {
      for (const poly of parsed) {
        if (Array.isArray(poly) && poly.length >= 2) {
          rawPolygons.push(poly);
        }
      }
    }
  } catch (e) {
    // Fallback: one polygon per line
    const lines = cleaned.split('\n').filter(l => l.trim());
    for (const line of lines) {
      try {
        const points = JSON.parse(line.replace(/,\s*$/, ''));
        if (Array.isArray(points) && points.length >= 2) {
          rawPolygons.push(points);
        }
      } catch (e) { /* skip invalid lines */ }
    }
  }

  // Collect all coordinate values to determine normalization
  const allValues = [];
  for (const poly of rawPolygons) {
    for (const pt of poly) {
      if (Array.isArray(pt) && pt.length >= 2) {
        allValues.push(pt[0], pt[1]);
      }
    }
  }

  const normalized = isNormalized(allValues);

  // Scale polygons
  for (const poly of rawPolygons) {
    const scaled = poly.map(pt => {
      const x = normalized ? pt[0] * imgWidth : pt[0];
      const y = normalized ? pt[1] * imgHeight : pt[1];
      return [x, y];
    });
    polygons.push(scaled);
  }

  return polygons;
}

function parsePoints(text, imgWidth, imgHeight) {
  const points = [];
  let cleaned = text.trim();
  if (!cleaned) return points;

  // Collect raw points first
  let rawPoints = [];

  // Try parsing as array of points: [[x1,y1], [x2,y2], ...]
  try {
    let wrapped = cleaned;
    if (cleaned.startsWith('[[') || cleaned.startsWith('[')) {
      if (!cleaned.startsWith('[[')) wrapped = '[' + cleaned + ']';
      else if (!cleaned.startsWith('[[[')) wrapped = '[' + cleaned.replace(/,\s*$/, '') + ']';
    }
    const parsed = JSON.parse(wrapped);
    if (Array.isArray(parsed) && parsed.length > 0) {
      for (const pt of parsed) {
        if (Array.isArray(pt) && pt.length >= 2) {
          rawPoints.push([pt[0], pt[1]]);
        }
      }
    }
  } catch (e) { /* fall through */ }

  // Fallback: x, y per line (only if JSON parsing failed)
  if (rawPoints.length === 0) {
    const lines = cleaned.split('\n').filter(l => l.trim());
    for (const line of lines) {
      const nums = line.split(',').map(n => parseFloat(n.trim()));
      if (nums.length >= 2 && !isNaN(nums[0]) && !isNaN(nums[1])) {
        rawPoints.push([nums[0], nums[1]]);
      }
    }
  }

  // Collect all values to determine normalization
  const allValues = rawPoints.flat();
  const normalized = isNormalized(allValues);

  // Scale points
  for (const pt of rawPoints) {
    const x = normalized ? pt[0] * imgWidth : pt[0];
    const y = normalized ? pt[1] * imgHeight : pt[1];
    points.push([x, y]);
  }

  return points;
}

// ============================================
// Utilities
// ============================================

function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// ============================================
// Drawing
// ============================================

function draw() {
  if (!currentImage) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    return;
  }

  // Draw image
  ctx.drawImage(currentImage, 0, 0);

  // Draw bounding boxes
  const bboxes = parseBboxes(document.getElementById('bboxInput').value, canvas.width, canvas.height);
  const bboxColor = document.getElementById('bboxColor').value;
  const bboxWidth = parseInt(document.getElementById('bboxWidth').value);
  const bboxMulti = document.getElementById('bboxMulti').checked;

  ctx.lineWidth = bboxWidth;
  bboxes.forEach((box, i) => {
    ctx.strokeStyle = bboxMulti ? COLORS[i % COLORS.length] : bboxColor;
    ctx.strokeRect(box.x1, box.y1, box.x2 - box.x1, box.y2 - box.y1);
  });

  // Draw segmentation polygons (closed)
  const segments = parsePolygons(document.getElementById('segInput').value, canvas.width, canvas.height);
  const segColor = document.getElementById('segColor').value;
  const segWidth = parseInt(document.getElementById('segWidth').value);
  const segFill = parseInt(document.getElementById('segFill').value) / 100;
  const segMulti = document.getElementById('segMulti').checked;

  segments.forEach((points, i) => {
    if (points.length < 2) return;
    const color = segMulti ? COLORS[i % COLORS.length] : segColor;

    ctx.beginPath();
    ctx.moveTo(points[0][0], points[0][1]);
    for (let j = 1; j < points.length; j++) {
      ctx.lineTo(points[j][0], points[j][1]);
    }
    ctx.closePath();

    if (segFill > 0) {
      ctx.fillStyle = hexToRgba(color, segFill);
      ctx.fill();
    }
    ctx.strokeStyle = color;
    ctx.lineWidth = segWidth;
    ctx.stroke();
  });

  // Draw polylines (open)
  const lines = parsePolygons(document.getElementById('lineInput').value, canvas.width, canvas.height);
  const lineColor = document.getElementById('lineColor').value;
  const lineWidth = parseInt(document.getElementById('lineWidth').value);
  const lineMulti = document.getElementById('lineMulti').checked;

  ctx.lineWidth = lineWidth;
  lines.forEach((points, i) => {
    if (points.length < 2) return;
    ctx.strokeStyle = lineMulti ? COLORS[i % COLORS.length] : lineColor;
    ctx.beginPath();
    ctx.moveTo(points[0][0], points[0][1]);
    for (let j = 1; j < points.length; j++) {
      ctx.lineTo(points[j][0], points[j][1]);
    }
    ctx.stroke();
  });

  // Draw points
  const points = parsePoints(document.getElementById('pointInput').value, canvas.width, canvas.height);
  const pointColor = document.getElementById('pointColor').value;
  const pointRadius = parseInt(document.getElementById('pointRadius').value);
  const pointOpacity = parseInt(document.getElementById('pointOpacity').value) / 100;
  const pointMulti = document.getElementById('pointMulti').checked;

  points.forEach((pt, i) => {
    const color = pointMulti ? COLORS[i % COLORS.length] : pointColor;
    ctx.beginPath();
    ctx.arc(pt[0], pt[1], pointRadius, 0, Math.PI * 2);
    ctx.fillStyle = hexToRgba(color, pointOpacity);
    ctx.fill();
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.stroke();
  });

  // Update stats
  document.getElementById('boxCount').textContent = bboxes.length;
  document.getElementById('segCount').textContent = segments.length;
  document.getElementById('lineCount').textContent = lines.length;
  document.getElementById('pointCount').textContent = points.length;
}

// ============================================
// Actions
// ============================================

function clearAnnotations() {
  document.getElementById('bboxInput').value = '';
  document.getElementById('segInput').value = '';
  document.getElementById('lineInput').value = '';
  document.getElementById('pointInput').value = '';
  draw();
}

function clearAll() {
  clearAnnotations();
  currentImage = null;
  canvas.width = 0;
  canvas.height = 0;
  wrapper.classList.remove('has-image');
  dropHint.style.display = 'block';
  canvas.style.display = 'none';
  document.getElementById('imgStats').textContent = 'No image loaded';
}

function downloadImage() {
  if (!currentImage) {
    alert('No image to download');
    return;
  }
  const link = document.createElement('a');
  link.download = 'annotated-image.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
}

// ============================================
// Event Listeners
// ============================================

// Auto-draw on input change
const inputIds = [
  'bboxInput', 'segInput', 'lineInput', 'pointInput',
  'bboxColor', 'bboxWidth', 'segColor', 'segWidth', 'segFill',
  'lineColor', 'lineWidth', 'pointColor', 'pointRadius', 'pointOpacity',
  'bboxMulti', 'segMulti', 'lineMulti', 'pointMulti'
];

inputIds.forEach(id => {
  const el = document.getElementById(id);
  el.addEventListener('input', draw);
  el.addEventListener('paste', () => setTimeout(draw, 10));
  el.addEventListener('change', draw);
});

// Toggle color picker based on multi-color checkbox
function updateColorPickers() {
  document.getElementById('bboxColor').disabled = document.getElementById('bboxMulti').checked;
  document.getElementById('segColor').disabled = document.getElementById('segMulti').checked;
  document.getElementById('lineColor').disabled = document.getElementById('lineMulti').checked;
  document.getElementById('pointColor').disabled = document.getElementById('pointMulti').checked;
}

['bboxMulti', 'segMulti', 'lineMulti', 'pointMulti'].forEach(id => {
  document.getElementById(id).addEventListener('change', updateColorPickers);
});

// Paste image from clipboard
document.addEventListener('paste', (e) => {
  const cd = e.clipboardData;
  if (!cd) return;
  // Check items (index-based since DataTransferItemList may not be iterable)
  for (let i = 0; i < cd.items.length; i++) {
    if (cd.items[i].type.startsWith('image/')) {
      e.preventDefault();
      loadImage(cd.items[i].getAsFile());
      return;
    }
  }
  // Fallback: check files
  for (let i = 0; i < cd.files.length; i++) {
    if (cd.files[i].type.startsWith('image/')) {
      e.preventDefault();
      loadImage(cd.files[i]);
      return;
    }
  }
});

// Collapsible sections
document.querySelectorAll('.control-group h3').forEach(h3 => {
  h3.addEventListener('click', () => {
    h3.parentElement.classList.toggle('collapsed');
  });
});

// ============================================
// Zoom & Pan
// ============================================

let zoomLevel = 1;
let panX = 0;
let panY = 0;
let isPanning = false;
let isPanMode = false;
let panStart = { x: 0, y: 0 };

const ZOOM_MIN = 0.25;
const ZOOM_MAX = 5;
const ZOOM_STEP = 0.25;

function updateCanvasTransform() {
  canvas.style.transform = `translate(${panX}px, ${panY}px) scale(${zoomLevel})`;
  document.getElementById('zoomLevel').textContent = `${Math.round(zoomLevel * 100)}%`;
}

function resetView() {
  zoomLevel = 1;
  panX = 0;
  panY = 0;
  updateCanvasTransform();
}

function zoomIn() {
  if (zoomLevel < ZOOM_MAX) {
    zoomLevel = Math.min(ZOOM_MAX, zoomLevel + ZOOM_STEP);
    updateCanvasTransform();
  }
}

function zoomOut() {
  if (zoomLevel > ZOOM_MIN) {
    zoomLevel = Math.max(ZOOM_MIN, zoomLevel - ZOOM_STEP);
    // Reset pan if zooming out to fit
    if (zoomLevel <= 1) {
      panX = 0;
      panY = 0;
    }
    updateCanvasTransform();
  }
}

function togglePanMode() {
  isPanMode = !isPanMode;
  const btn = document.getElementById('panToggle');
  btn.classList.toggle('active', isPanMode);
  canvas.classList.toggle('panning', isPanMode);
}

// Zoom/Pan button listeners
document.getElementById('zoomIn').addEventListener('click', zoomIn);
document.getElementById('zoomOut').addEventListener('click', zoomOut);
document.getElementById('zoomReset').addEventListener('click', resetView);
document.getElementById('panToggle').addEventListener('click', togglePanMode);

// Mouse wheel zoom
wrapper.addEventListener('wheel', (e) => {
  if (!currentImage) return;
  e.preventDefault();

  if (e.deltaY < 0) {
    zoomIn();
  } else {
    zoomOut();
  }
}, { passive: false });

// Pan with mouse drag (when pan mode is active)
canvas.addEventListener('mousedown', (e) => {
  if (!isPanMode || !currentImage) return;
  isPanning = true;
  panStart = { x: e.clientX - panX, y: e.clientY - panY };
});

document.addEventListener('mousemove', (e) => {
  if (!isPanning) return;
  panX = e.clientX - panStart.x;
  panY = e.clientY - panStart.y;
  updateCanvasTransform();
});

document.addEventListener('mouseup', () => {
  isPanning = false;
});

// Reset view when new image is loaded
const originalLoadImage = loadImage;
loadImage = function(file) {
  resetView();
  originalLoadImage(file);
};

// ============================================
// Full View Modal
// ============================================

const modalOverlay = document.getElementById('modalOverlay');
const modalImage = document.getElementById('modalImage');
const modalClose = document.getElementById('modalClose');
const fullViewBtn = document.getElementById('fullView');

function openFullView() {
  if (!currentImage) return;
  // Use canvas data URL to show annotated image
  modalImage.src = canvas.toDataURL('image/png');
  modalOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeFullView() {
  modalOverlay.classList.remove('active');
  document.body.style.overflow = '';
}

fullViewBtn.addEventListener('click', openFullView);
modalClose.addEventListener('click', closeFullView);

// Close on overlay click (outside image)
modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) {
    closeFullView();
  }
});

// Close on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
    closeFullView();
  }
});

// ============================================
// Initialization
// ============================================

canvas.style.display = 'none';
updateColorPickers();
lucide.createIcons();
