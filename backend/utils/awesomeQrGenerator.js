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

// Helper: convert AwesomeQR buffer/ArrayBuffer/Uint8Array to data URL
const bufferToDataUrl = (buf) => {
  let nodeBuf;
  if (Buffer.isBuffer(buf)) nodeBuf = buf;
  else if (buf instanceof ArrayBuffer) nodeBuf = Buffer.from(buf);
  else if (ArrayBuffer.isView(buf)) nodeBuf = Buffer.from(buf.buffer);
  else nodeBuf = Buffer.from(buf);
  const base64 = nodeBuf.toString('base64');
  return `data:image/png;base64,${base64}`;
};

// Helper: sanity-check a drawn region to ensure it contains both light and dark pixels
// Returns true if looks valid (has contrast), false if mostly uniform (likely blank/black)
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
    return max - min > 40; // arbitrary threshold for QR black/white contrast
  } catch (_) {
    // If we cannot read pixels, assume valid to avoid false negatives
    return true;
  }
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
    
    // Draw the QR code
    const qrImage = await loadImage(qrBuffer);
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
    const qrImage = await loadImage(qrBuffer);
    
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
    const qrImage = await loadImage(qrBuffer);
    
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

// Exact layout generator requested by product (burgundy background, cream QR panel with rounded corners,
// red pill CTA, and gold footer; Playfair font if provided via options.playfairFontPath or env PLAYFAIR_TTF)
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

      // Title
      const title = (restaurantName || 'RESTAURANT NAME').toUpperCase();
      ctx.fillStyle = cream;
      ctx.textAlign = 'center';
      let titleSize = 84;
      ctx.font = `900 ${titleSize}px ${fontFamily}`;
      const maxTitleWidth = canvasWidth - 80;
      while (ctx.measureText(title).width > maxTitleWidth && titleSize > 36) {
        titleSize -= 4;
        ctx.font = `900 ${titleSize}px ${fontFamily}`;
      }
      ctx.shadowColor = 'rgba(0,0,0,0.25)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      ctx.fillText(title, canvasWidth / 2, 150);
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
      const qrImage = await loadImage(qrBuffer);
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