const { AwesomeQR } = require('awesome-qr');
// Prefer @napi-rs/canvas in production (no system deps). Fallback to node-canvas.
let createCanvas, loadImage, registerFont;
try {
  ({ createCanvas, loadImage, registerFont } = require('@napi-rs/canvas'));
  console.log('[QR] Using @napi-rs/canvas');
} catch (_) {
  ({ createCanvas, loadImage, registerFont } = require('canvas'));
  console.log('[QR] Using node-canvas');
}
const fs = require('fs');
const path = require('path');

// Feature flag: when QR_COMPOSE=false, skip canvas composition and return raw AwesomeQR PNG
// Default is true (compose enabled). Set QR_DEBUG=1 to enable extra logging.
const QR_COMPOSE = process.env.QR_COMPOSE !== 'false';
const QR_DEBUG = process.env.QR_DEBUG === '1' || process.env.QR_DEBUG === 'true';

const bufferToDataUrl = (buf) => {
  let nodeBuf;
  if (Buffer.isBuffer(buf)) nodeBuf = buf;
  else if (buf instanceof ArrayBuffer) nodeBuf = Buffer.from(buf);
  else if (ArrayBuffer.isView(buf)) nodeBuf = Buffer.from(buf.buffer);
  else nodeBuf = Buffer.from(buf);
  const base64 = nodeBuf.toString('base64');
  return `data:image/png;base64,${base64}`;
};

const hasContrast = (ctx, x, y, w, h) => {
  try {
    const data = ctx.getImageData(x, y, w, h).data;
    let min = 255, max = 0;
    // sample every 16th pixel to reduce cost
    for (let i = 0; i < data.length; i += 16 * 4) {
      const r = data[i], g = data[i + 1], b = data[i + 2];
      const l = Math.round(0.2126 * r + 0.7152 * g + 0.0722 * b);
      if (l < min) min = l;
      if (l > max) max = l;
    }
    return max - min > 40;
  } catch (err) {
    // If we cannot read pixels (common when decode/draw fails), treat as NO contrast
    // so that callers can fallback to the base AwesomeQR output.
    console.warn('hasContrast check failed, treating as no-contrast:', err.message);
    return false;
  }
};

// Helper: wrap text into lines that fit within maxWidth using the current ctx.font
// Optionally provide a transform (e.g., toUpperCase) applied before measuring
const wrapTextLines = (ctx, text, maxWidth, transform = (s) => s) => {
  const words = text.split(/\s+/).filter(Boolean);
  const lines = [];
  let current = '';
  for (const w of words) {
    const test = current ? current + ' ' + w : w;
    const measured = transform(test);
    if (ctx.measureText(measured).width <= maxWidth) {
      current = test;
    } else {
      if (current) lines.push(current);
      current = w;
    }
  }
  if (current) lines.push(current);
  return lines;
};

// Helper: draw up to maxLines centered lines around centerY and return the used font size
const drawWrappedCentered = (ctx, text, options) => {
  const {
    centerX,
    centerY,
    maxWidth,
    fontFamily = 'serif',
    weight = '900',
    initialSize = 84,
    minSize = 28,
    maxLines = 2,
    transform = (s) => s.toUpperCase(),
  } = options;

  let size = initialSize;
  let lines = [];
  while (size >= minSize) {
    ctx.font = `${weight} ${size}px ${fontFamily}`;
    lines = wrapTextLines(ctx, text, maxWidth, transform);
    // Ensure each line (after transform) fits maxWidth
    const widest = Math.max(...lines.map(l => ctx.measureText(transform(l)).width));
    if (lines.length <= maxLines && widest <= maxWidth) break;
    size -= 2;
  }
  if (lines.length > maxLines) {
    // Force into maxLines by merging overflow
    const merged = [lines[0], lines.slice(1).join(' ')];
    lines = merged.slice(0, maxLines);
  }
  const lineHeight = size + 4;
  const totalHeight = lineHeight * (lines.length - 1);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  lines.forEach((line, idx) => {
    const y = centerY - totalHeight / 2 + idx * lineHeight;
    ctx.fillText(transform(line), centerX, y);
  });
  return size;
};

/**
 * Generate a professional QR code with burgundy background and Playfair font
 * @param {string} data - The URL to encode in QR code
 * @param {string} restaurantName - Name of the restaurant
 * @param {Object} options - Additional options for QR generation
 * @returns {Promise<string>} Base64 encoded image
 */
const generateProfessionalQR = async (data, restaurantName, options = {}) => {
  try {
    // Professional QR code options with block style (not dotted)
    const qrOptions = {
      text: data,
      size: 300,
      margin: 20,
      correctLevel: AwesomeQR.CorrectLevel.H, // High error correction
      backgroundImage: undefined,
      backgroundDimming: 'rgba(0,0,0,0)',
      logoImage: undefined,
      whiteMargin: true,
      dotScale: 1.0, // Full blocks instead of dots for professional look
      maskedDots: false,
      colorDark: '#000000', // Pure black for QR pattern
      colorLight: '#FFFFFF', // Pure white
      autoColor: false,
      ...options
    };

    // Generate the base QR code
    const qrBuffer = await new AwesomeQR(qrOptions).draw();
    if (QR_DEBUG) {
      const size = Buffer.isBuffer(qrBuffer) ? qrBuffer.length : (qrBuffer?.byteLength || 0);
      console.log('[QR] generateProfessionalQR: qrBuffer size=', size);
    }
    
    // Create canvas for professional layout
    const canvasWidth = 400;
    const canvasHeight = 550;
    const canvas = createCanvas(canvasWidth, canvasHeight);
    const ctx = canvas.getContext('2d');

    // Burgundy background
    ctx.fillStyle = '#800020'; // Professional burgundy color
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Restaurant name at the top with Playfair-style font
    ctx.fillStyle = '#FFFFFF'; // White text
    ctx.font = 'bold 26px serif'; // Using serif as closest to Playfair
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Auto-adjust font size for restaurant name
    let fontSize = 26;
    const maxNameWidth = canvasWidth - 60;
    while (ctx.measureText(restaurantName.toUpperCase()).width > maxNameWidth && fontSize > 16) {
      fontSize -= 2;
      ctx.font = `bold ${fontSize}px serif`;
    }
    
    // Add text shadow for better visibility
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 2;
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;
    
    ctx.fillText(restaurantName.toUpperCase(), canvasWidth / 2, 60);
    
    // Reset shadow
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    // QR code positioning
    const qrSize = 300;
    const qrX = (canvasWidth - qrSize) / 2;
    const qrY = 100;
    
    // Create white background for QR code with padding
    const qrPadding = 15;
    const qrBgX = qrX - qrPadding;
    const qrBgY = qrY - qrPadding;
    const qrBgSize = qrSize + (qrPadding * 2);
    
    // White background for QR code
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(qrBgX, qrBgY, qrBgSize, qrBgSize);
    
    // Add subtle border around QR background
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.lineWidth = 2;
    ctx.strokeRect(qrBgX, qrBgY, qrBgSize, qrBgSize);
    
    // Draw the QR code (use data URL to maximize decoder compatibility)
    const qrImage = await loadImage(bufferToDataUrl(qrBuffer));
    ctx.drawImage(qrImage, qrX, qrY, qrSize, qrSize);

    // "SCAN THE CODE TO ORDER" text
    ctx.fillStyle = '#FFFFFF'; // White text
    ctx.font = 'bold 18px serif';
    ctx.textAlign = 'center';
    
    // Add shadow for scan text
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 2;
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;
    
    ctx.fillText('SCAN THE CODE TO ORDER', canvasWidth / 2, qrY + qrSize + 40);
    
    // Reset shadow
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    // "POWERED BY QRUZINE" at the bottom with gold color
    ctx.fillStyle = '#FFD700'; // Gold color
    ctx.font = 'bold 16px serif'; // Playfair-style font
    ctx.textAlign = 'center';
    
    // Add subtle shadow for gold text
    ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
    ctx.shadowBlur = 2;
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;
    
    ctx.fillText('POWERED BY QRUZINE', canvasWidth / 2, canvasHeight - 30);

    // If the drawn QR region appears uniform (common when image decode fails silently),
    // fall back to raw AwesomeQR output which does not require composition.
    const valid = hasContrast(ctx, qrX, qrY, qrSize, qrSize);
    if (!valid) {
      return bufferToDataUrl(qrBuffer);
    }

    // Convert canvas to base64
    const base64Image = canvas.toDataURL('image/png', 0.95);
    return base64Image;

  } catch (error) {
    console.error('Professional QR code generation error:', error);
    throw new Error('Failed to generate professional QR code');
  }
};

/**
 * Generate professional QR code with custom logo
 * @param {string} data - The URL to encode
 * @param {string} restaurantName - Restaurant name
 * @param {string} logoPath - Path to logo image (optional)
 * @param {Object} options - Additional options
 * @returns {Promise<string>} Base64 encoded image
 */
const generateProfessionalQRWithLogo = async (data, restaurantName, logoPath = null, options = {}) => {
  try {
    let logoImage = undefined;
    
    if (logoPath && fs.existsSync(logoPath)) {
      logoImage = await loadImage(logoPath);
    }

    const qrOptions = {
      text: data,
      size: 300,
      margin: 20,
      correctLevel: AwesomeQR.CorrectLevel.H, // High error correction for logo
      logoImage: logoImage,
      logoScale: 0.15, // Logo size
      logoMargin: 8,
      logoCornerRadius: 8,
      whiteMargin: true,
      dotScale: 1.0, // Full blocks instead of dots
      colorDark: '#000000', // Black QR pattern
      colorLight: '#FFFFFF', // White background
      ...options
    };

    return await generateProfessionalQR(data, restaurantName, qrOptions);
  } catch (error) {
    console.error('Professional QR with logo generation error:', error);
    // Fallback to regular professional QR if logo fails
    return await generateProfessionalQR(data, restaurantName, options);
  }
};

/**
 * Generate compact professional QR code
 * @param {string} data - The URL to encode
 * @param {string} restaurantName - Restaurant name  
 * @param {Object} options - Options for QR generation
 * @returns {Promise<string>} Base64 encoded image
 */
const generateCompactProfessionalQR = async (data, restaurantName, options = {}) => {
  try {
    // Create a more compact version
    const canvasWidth = 350;
    const canvasHeight = 450;
    const canvas = createCanvas(canvasWidth, canvasHeight);
    const ctx = canvas.getContext('2d');

    // Burgundy background
    ctx.fillStyle = '#800020'; // Professional burgundy
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Generate QR code
    const qrOptions = {
      text: data,
      size: 250,
      margin: 15,
      correctLevel: AwesomeQR.CorrectLevel.M,
      dotScale: 1.0, // Full blocks
      colorDark: '#000000',
      colorLight: '#FFFFFF',
      ...options
    };

    const qrBuffer = await new AwesomeQR(qrOptions).draw();
    if (QR_DEBUG) {
      const size = Buffer.isBuffer(qrBuffer) ? qrBuffer.length : (qrBuffer?.byteLength || 0);
      console.log('[QR] generateCompactProfessionalQR: qrBuffer size=', size);
    }
    const qrImage = await loadImage(bufferToDataUrl(qrBuffer));
    
    // Restaurant name
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 22px serif';
    ctx.textAlign = 'center';
    
// Auto-adjust font size
let fontSize = 22;
const maxWidth = canvasWidth - 40;
while (ctx.measureText(restaurantName.toUpperCase()).width > maxWidth && fontSize > 14) {
  fontSize -= 2;
  ctx.font = `bold ${fontSize}px serif`;
}
    
ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
ctx.shadowBlur = 2;
ctx.shadowOffsetX = 1;
ctx.shadowOffsetY = 1;
    
ctx.fillText(restaurantName.toUpperCase(), canvasWidth / 2, 45);
    
// Reset shadow
ctx.shadowColor = 'transparent';
ctx.shadowBlur = 0;
ctx.shadowOffsetX = 0;
ctx.shadowOffsetY = 0;
    
// QR code with white background
const qrSize = 250;
const qrX = (canvasWidth - qrSize) / 2;
const qrY = 70;
const padding = 12;
    
ctx.fillStyle = '#FFFFFF';
ctx.fillRect(qrX - padding, qrY - padding, qrSize + padding * 2, qrSize + padding * 2);
ctx.drawImage(qrImage, qrX, qrY, qrSize, qrSize);
    
// Scan text
ctx.fillStyle = '#FFFFFF';
ctx.font = 'bold 16px serif';
ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
ctx.shadowBlur = 2;
ctx.shadowOffsetX = 1;
ctx.shadowOffsetY = 1;
ctx.fillText('SCAN THE CODE TO ORDER', canvasWidth / 2, qrY + qrSize + 35);
    
// Reset shadow
ctx.shadowColor = 'transparent';
ctx.shadowBlur = 0;
ctx.shadowOffsetX = 0;
ctx.shadowOffsetY = 0;
    
// Powered by text in gold
ctx.fillStyle = '#FFD700';
ctx.font = 'bold 14px serif';
ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
ctx.shadowBlur = 2;
ctx.shadowOffsetX = 1;
ctx.shadowOffsetY = 1;
ctx.fillText('POWERED BY QRUZINE', canvasWidth / 2, canvasHeight - 25);

const base64Image = canvas.toDataURL('image/png', 0.95);
return base64Image;
} catch (error) {
console.error('Compact professional QR generation error:', error);
throw new Error('Failed to generate compact professional QR code');
}
};

/**
 * Generate QR with actual Playfair Display font (if available)
 * @param {string} data - URL to encode
 * @param {string} restaurantName - Restaurant name
 * @param {string} playfairFontPath - Path to Playfair Display font file
 * @param {Object} options - Additional options
 * @returns {Promise<string>} Base64 encoded image
 */
const generateQRWithPlayfairFont = async (data, restaurantName, playfairFontPath = null, options = {}) => {
try {
// Register font if path provided
if (playfairFontPath) {
  registerPlayfairFont(playfairFontPath);
}
    
// Use the same generation logic but with Playfair font
const canvasWidth = 400;
const canvasHeight = 550;
const canvas = createCanvas(canvasWidth, canvasHeight);
const ctx = canvas.getContext('2d');

// Burgundy background
ctx.fillStyle = '#800020';
ctx.fillRect(0, 0, canvasWidth, canvasHeight);

// QR code generation
const qrOptions = {
  text: data,
  size: 300,
  margin: 20,
  correctLevel: AwesomeQR.CorrectLevel.H,
  dotScale: 1.0,
  colorDark: '#000000',
  colorLight: '#FFFFFF',
  ...options
};

const qrBuffer = await new AwesomeQR(qrOptions).draw();
const qrImage = await loadImage(bufferToDataUrl(qrBuffer));
    
// Restaurant name with Playfair font (or serif fallback)
ctx.fillStyle = '#FFFFFF';
const fontFamily = playfairFontPath ? 'Playfair Display' : 'serif';
ctx.font = `bold 26px ${fontFamily}`;
ctx.textAlign = 'center';
    
// Auto-adjust font size
let fontSize = 26;
const maxWidth = canvasWidth - 60;
while (ctx.measureText(restaurantName.toUpperCase()).width > maxWidth && fontSize > 16) {
  fontSize -= 2;
  ctx.font = `bold ${fontSize}px ${fontFamily}`;
}
    
ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
ctx.shadowBlur = 2;
ctx.shadowOffsetX = 1;
ctx.shadowOffsetY = 1;
    
ctx.fillText(restaurantName.toUpperCase(), canvasWidth / 2, 60);
    
// Reset shadow
ctx.shadowColor = 'transparent';
ctx.shadowBlur = 0;
ctx.shadowOffsetX = 0;
ctx.shadowOffsetY = 0;

// QR code positioning and white background
const qrSize = 300;
const qrX = (canvasWidth - qrSize) / 2;
const qrY = 100;
const padding = 15;
    
ctx.fillStyle = '#FFFFFF';
ctx.fillRect(qrX - padding, qrY - padding, qrSize + padding * 2, qrSize + padding * 2);
ctx.drawImage(qrImage, qrX, qrY, qrSize, qrSize);

// Scan text
ctx.fillStyle = '#FFFFFF';
ctx.font = `bold 18px ${fontFamily}`;
ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
ctx.shadowBlur = 2;
ctx.shadowOffsetX = 1;
ctx.shadowOffsetY = 1;
ctx.fillText('SCAN THE CODE TO ORDER', canvasWidth / 2, qrY + qrSize + 40);
    
// Reset shadow
ctx.shadowColor = 'transparent';
ctx.shadowBlur = 0;
ctx.shadowOffsetX = 0;
ctx.shadowOffsetY = 0;

// Powered by text in gold
ctx.fillStyle = '#FFD700';
ctx.font = `bold 16px ${fontFamily}`;
ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
ctx.shadowBlur = 2;
ctx.shadowOffsetX = 1;
ctx.shadowOffsetY = 1;
ctx.fillText('POWERED BY QRUZINE', canvasWidth / 2, canvasHeight - 30);

const base64Image = canvas.toDataURL('image/png', 0.95);
return base64Image;

} catch (error) {
console.error('QR with Playfair font generation error:', error);
throw new Error('Failed to generate QR with Playfair font');
}
};

/**
 * Register Playfair Display font (call this once at startup if you have the font file)
 * @param {string} fontPath - Path to Playfair Display font file
 */
const registerPlayfairFont = (fontPath) => {
try {
if (fs.existsSync(fontPath)) {
  registerFont(fontPath, { family: 'Playfair Display' });
  console.log('Playfair Display font registered successfully');
}
} catch (error) {
console.warn('Could not register Playfair Display font, using serif fallback:', error.message);
}
};

/**
 * Generate professional QR code with custom layout
 * @param {string} data - The URL to encode
 * @param {string} restaurantName - Restaurant name
 * @param {Object} options - Additional options
 * @returns {Promise<string>} Base64 encoded image
 */
const generateMinimalProfessionalQR = async (data, restaurantName, options = {}) => {
  try {
    // Register Playfair optionally
    let fontFamily = 'serif';
    const playfairPath = options.playfairFontPath || process.env.PLAYFAIR_TTF;
    try {
      if (playfairPath && fs.existsSync(playfairPath)) {
        registerFont(playfairPath, { family: 'Playfair Display' });
        fontFamily = 'Playfair Display';
      }
    } catch (_) {}

    // Generate base QR (block style)
    const qrOptions = {
      text: data,
      size: 480,
      margin: 0,
      correctLevel: AwesomeQR.CorrectLevel.H,
      whiteMargin: false,
      dotScale: 1.0,
      colorDark: '#000000',
      colorLight: '#FFFFFF',
      ...options
    };
    const qrBuffer = await new AwesomeQR(qrOptions).draw();
    // Diagnostics and safety checks on base QR buffer
    const qrSizeBytes = Buffer.isBuffer(qrBuffer) ? qrBuffer.length : (qrBuffer?.byteLength || 0);
    if (QR_DEBUG) {
      console.log('[QR] generateMinimalProfessionalQR: qrBuffer size=', qrSizeBytes, 'compose=', QR_COMPOSE);
    }
    if (!qrBuffer || qrSizeBytes < 1024) {
      console.warn('[QR] Warning: qrBuffer too small or empty, returning base QR without composition');
      return bufferToDataUrl(qrBuffer || Buffer.alloc(0));
    }
    // Allow disabling composition via env flag to avoid canvas issues in production
    if (!QR_COMPOSE) {
      if (QR_DEBUG) console.log('[QR] Composition disabled via QR_COMPOSE=false. Returning base AwesomeQR PNG');
      return bufferToDataUrl(qrBuffer);
    }

    // In some production environments, node-canvas system deps may be missing.
    // If any of the composition steps fail, fall back to returning the raw QR buffer as a PNG data URL.
    try {
      // Canvas composition
      const canvasWidth = 682;
      const canvasHeight = 1024;
      const canvas = createCanvas(canvasWidth, canvasHeight);
      const ctx = canvas.getContext('2d');

      const burgundy = '#6B0D13';
      const cream = '#FFF2DC';
      const red = '#B22020';
      const gold = '#D4AF37';

      // Background
      ctx.fillStyle = burgundy;
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      // Title (auto-wrap to next line for long names)
      const title = (restaurantName || 'RESTAURANT NAME');
      ctx.fillStyle = cream;
      ctx.shadowColor = 'rgba(0,0,0,0.25)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      drawWrappedCentered(ctx, title, {
        centerX: canvasWidth / 2,
        centerY: 146,
        maxWidth: canvasWidth - 160,
        fontFamily,
        weight: '900',
        initialSize: 64,
        minSize: 20,
        maxLines: 2,
        transform: (s) => s.toUpperCase(),
      });
      ctx.shadowColor = 'transparent';

      // Rounded cream panel for QR
      const panelW = 520;
      const panelH = 520;
      const panelX = (canvasWidth - panelW) / 2;
      const panelY = 210;
      const roundRect = (x, y, w, h, r) => {
        const rr = Math.min(r, w / 2, h / 2);
        ctx.beginPath();
        ctx.moveTo(x + rr, y);
        ctx.lineTo(x + w - rr, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + rr);
        ctx.lineTo(x + w, y + h - rr);
        ctx.quadraticCurveTo(x + w, y + h, x + w - rr, y + h);
        ctx.lineTo(x + rr, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - rr);
        ctx.lineTo(x, y + rr);
        ctx.quadraticCurveTo(x, y, x + rr, y);
        ctx.closePath();
      };
      roundRect(panelX, panelY, panelW, panelH, 18);
      ctx.fillStyle = cream;
      ctx.fill();
      ctx.lineWidth = 6;
      ctx.strokeStyle = '#E7D7BD';
      ctx.stroke();

      // Draw QR inside panel
      const qrImage = await loadImage(bufferToDataUrl(qrBuffer));
      // Basic sanity check on decoded image if API provides dimensions
      if (QR_DEBUG && (qrImage?.width && qrImage?.height)) {
        console.log('[QR] Decoded QR image size:', qrImage.width, 'x', qrImage.height);
      }
      const innerMargin = 26;
      const qrSize = panelW - innerMargin * 2;
      const qrX = panelX + innerMargin;
      const qrY = panelY + innerMargin;
      ctx.drawImage(qrImage, qrX, qrY, qrSize, qrSize);

      // Validate that the QR region actually contains black/white contrast; otherwise fallback
      if (!hasContrast(ctx, qrX, qrY, qrSize, qrSize)) {
        return bufferToDataUrl(qrBuffer);
      }

      // Red pill CTA with two-line text
      const pillW = 520;
      const pillH = 96;
      const pillX = (canvasWidth - pillW) / 2;
      const pillY = panelY + panelH + 40;
      roundRect(pillX, pillY, pillW, pillH, 24);
      ctx.fillStyle = red;
      ctx.shadowColor = 'rgba(0,0,0,0.25)';
      ctx.shadowBlur = 6;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 3;
      ctx.fill();
      ctx.shadowColor = 'transparent';
      ctx.fillStyle = '#FFFFFF';
      let scanSize = 32; // slight reduction to ensure it stays inside the pill
      ctx.font = `700 ${scanSize}px ${fontFamily}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const lines = ['SCAN THE CODE', 'TO ORDER'];
      const maxScanWidth = pillW - 80; // increase side padding for safety
      while (Math.max(...lines.map(l => ctx.measureText(l).width)) > maxScanWidth && scanSize > 20) {
        scanSize -= 2;
        ctx.font = `700 ${scanSize}px ${fontFamily}`;
      }
      const lh = scanSize + 2; // slightly tighter line height
      const cx = canvasWidth / 2;
      const centerY = pillY + pillH / 2;
      // Draw lines evenly around vertical center
      ctx.fillText(lines[0], cx, centerY - lh / 2);
      ctx.fillText(lines[1], cx, centerY + lh / 2);
      ctx.textBaseline = 'alphabetic';

      // Gold footer branding
      ctx.fillStyle = gold;
      ctx.shadowColor = 'rgba(0,0,0,0.3)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 2;
      ctx.font = `800 24px ${fontFamily}`; // slightly smaller
      ctx.fillText('POWERED BY', canvasWidth / 2, canvasHeight - 90);
      let brandSize = 40; // slightly smaller brand
      ctx.font = `900 ${brandSize}px ${fontFamily}`;
      const maxBrand = canvasWidth - 120;
      while (ctx.measureText('QRUZINE').width > maxBrand && brandSize > 28) {
        brandSize -= 2;
        ctx.font = `900 ${brandSize}px ${fontFamily}`;
      }
      ctx.fillText('QRUZINE', canvasWidth / 2, canvasHeight - 30);

      return canvas.toDataURL('image/png', 0.95);
    } catch (compositionErr) {
      console.warn('QR composition failed, returning base QR. Hint: install system deps for node-canvas or use @napi-rs/canvas. Error:', compositionErr?.message);
      // Fallback to raw AwesomeQR buffer as data URL
      return bufferToDataUrl(qrBuffer);
    }
  } catch (error) {
    console.error('Minimal professional QR generation error:', error);
    throw new Error('Failed to generate minimal professional QR');
  }
};

module.exports = {
  generateProfessionalQR,
  generateProfessionalQRWithLogo,
  generateCompactProfessionalQR,
  generateQRWithPlayfairFont,
  registerPlayfairFont,
  generateMinimalProfessionalQR
};