const { AwesomeQR } = require('awesome-qr');
// Prefer @napi-rs/canvas in production (no system deps). Fallback to node-canvas.
let createCanvas, loadImage;
try {
  ({ createCanvas, loadImage } = require('@napi-rs/canvas'));
  console.log('[QR] Using @napi-rs/canvas');
} catch (_) {
  ({ createCanvas, loadImage } = require('canvas'));
  console.log('[QR] Using node-canvas');
}
const fs = require('fs');
const QRCodeLib = require('qrcode');

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
    for (let i = 0; i < data.length; i += 16 * 4) {
      const r = data[i], g = data[i + 1], b = data[i + 2];
      const l = Math.round(0.2126 * r + 0.7152 * g + 0.0722 * b);
      if (l < min) min = l;
      if (l > max) max = l;
    }
    return max - min > 40;
  } catch (err) {
    console.warn('hasContrast check failed, treating as no-contrast:', err.message);
    return false;
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
      correctLevel: AwesomeQR.CorrectLevel.H,
      backgroundDimming: 'rgba(0,0,0,0)',
      logoImage: undefined,
      whiteMargin: true,
      dotScale: 1.0,
      maskedDots: false,
      colorDark: '#000000',
      colorLight: '#FFFFFF',
      autoColor: false,
      ...options
    };

    // Generate the base QR code
    let qrBuffer;
    try {
      qrBuffer = await new AwesomeQR(qrOptions).draw();
    } catch (err) {
      console.error('[QR] AwesomeQR failed:', err.message);
      throw new Error('QR generation failed');
    }
    const qrSizeBytes = Buffer.isBuffer(qrBuffer) ? qrBuffer.length : (qrBuffer?.byteLength || 0);
    if (QR_DEBUG) console.log('[QR] qrBuffer size:', qrSizeBytes);

    // Fallback: Empty buffer? Just return QR PNG directly
    if (!qrBuffer || qrSizeBytes < 1024) {
      console.warn('[QR] Buffer too small, fallback to base QR PNG');
      return bufferToDataUrl(qrBuffer || Buffer.alloc(0));
    }

    // Canvas composition
    let canvas, ctx, qrImage;
    try {
      const canvasWidth = 400, canvasHeight = 550;
      canvas = createCanvas(canvasWidth, canvasHeight);
      ctx = canvas.getContext('2d');

      // Burgundy background
      ctx.fillStyle = '#800020';
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      // Restaurant name (top)
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 26px serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      let fontSize = 26, maxNameWidth = canvasWidth - 60;
      while (ctx.measureText(restaurantName.toUpperCase()).width > maxNameWidth && fontSize > 16) {
        fontSize -= 2;
        ctx.font = `bold ${fontSize}px serif`;
      }

      ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
      ctx.shadowBlur = 2;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;
      ctx.fillText(restaurantName.toUpperCase(), canvasWidth / 2, 60);

      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;

      // QR panel
      const qrSize = 300, qrX = (canvasWidth - qrSize) / 2, qrY = 100, qrPadding = 15;
      const qrBgX = qrX - qrPadding, qrBgY = qrY - qrPadding, qrBgSize = qrSize + (qrPadding * 2);

      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(qrBgX, qrBgY, qrBgSize, qrBgSize);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.lineWidth = 2;
      ctx.strokeRect(qrBgX, qrBgY, qrBgSize, qrBgSize);

      // Load QR image robustly
      try {
        qrImage = await loadImage(bufferToDataUrl(qrBuffer));
        if (!qrImage || !qrImage.width || !qrImage.height) {
          throw new Error('QR image failed to load');
        }
      } catch (err) {
        console.error('[QR] loadImage failed, fallback to base QR PNG:', err.message);
        return bufferToDataUrl(qrBuffer);
      }

      ctx.drawImage(qrImage, qrX, qrY, qrSize, qrSize);

      // Check contrast: fallback if QR is blank
      if (!hasContrast(ctx, qrX, qrY, qrSize, qrSize)) {
        console.warn('[QR] QR region lacks contrast, fallback to base QR PNG');
        return bufferToDataUrl(qrBuffer);
      }

      // "SCAN THE CODE TO ORDER"
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 18px serif';
      ctx.textAlign = 'center';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
      ctx.shadowBlur = 2;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;
      ctx.fillText('SCAN THE CODE TO ORDER', canvasWidth / 2, qrY + qrSize + 40);

      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;

      // "POWERED BY QRUZINE" at bottom
      ctx.fillStyle = '#FFD700';
      ctx.font = 'bold 16px serif';
      ctx.textAlign = 'center';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
      ctx.shadowBlur = 2;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;
      ctx.fillText('POWERED BY QRUZINE', canvasWidth / 2, canvasHeight - 30);

      // Return composed PNG
      return canvas.toDataURL('image/png', 0.95);
    } catch (compositionErr) {
      console.error('[QR] Canvas composition failed, fallback to base QR PNG:', compositionErr.message);
      return bufferToDataUrl(qrBuffer);
    }
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
      correctLevel: AwesomeQR.CorrectLevel.H,
      logoImage: logoImage,
      logoScale: 0.15,
      logoMargin: 8,
      logoCornerRadius: 8,
      whiteMargin: true,
      dotScale: 1.0,
      colorDark: '#000000',
      colorLight: '#FFFFFF',
      ...options
    };
    return await generateProfessionalQR(data, restaurantName, qrOptions);
  } catch (error) {
    console.error('Professional QR with logo generation error:', error);
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
    const canvasWidth = 350;
    const canvasHeight = 450;
    const canvas = createCanvas(canvasWidth, canvasHeight);
    const ctx = canvas.getContext('2d');

    // Burgundy background
    ctx.fillStyle = '#800020';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Generate QR code
    const qrOptions = {
      text: data,
      size: 250,
      margin: 15,
      correctLevel: AwesomeQR.CorrectLevel.M,
      dotScale: 1.0,
      colorDark: '#000000',
      colorLight: '#FFFFFF',
      ...options
    };

    let qrBuffer;
    try {
      qrBuffer = await new AwesomeQR(qrOptions).draw();
    } catch (err) {
      console.error('[QR] AwesomeQR failed:', err.message);
      throw new Error('QR generation failed');
    }
    const qrSizeBytes = Buffer.isBuffer(qrBuffer) ? qrBuffer.length : (qrBuffer?.byteLength || 0);

    if (!qrBuffer || qrSizeBytes < 1024) {
      console.warn('[QR] Buffer too small, fallback to base QR PNG');
      return bufferToDataUrl(qrBuffer || Buffer.alloc(0));
    }

    let qrImage;
    try {
      qrImage = await loadImage(bufferToDataUrl(qrBuffer));
      if (!qrImage || !qrImage.width || !qrImage.height) {
        throw new Error('QR image failed to load');
      }
    } catch (err) {
      console.error('[QR] loadImage failed, fallback to base QR PNG:', err.message);
      return bufferToDataUrl(qrBuffer);
    }

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

    // Check contrast: fallback if QR is blank
    if (!hasContrast(ctx, qrX, qrY, qrSize, qrSize)) {
      console.warn('[QR] QR region lacks contrast, fallback to base QR PNG');
      return bufferToDataUrl(qrBuffer);
    }

    const base64Image = canvas.toDataURL('image/png', 0.95);
    return base64Image;
  } catch (error) {
    console.error('Compact professional QR generation error:', error);
    throw new Error('Failed to generate compact professional QR code');
  }
};

module.exports = {
  generateProfessionalQR,
  generateProfessionalQRWithLogo,
  generateCompactProfessionalQR
};