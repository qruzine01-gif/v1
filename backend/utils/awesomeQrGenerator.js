const { AwesomeQR } = require('awesome-qr');
const { createCanvas, loadImage, registerFont } = require('canvas');
const fs = require('fs');
const path = require('path');

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

module.exports = {
  generateProfessionalQR,
  generateProfessionalQRWithLogo,
  generateCompactProfessionalQR,
  generateQRWithPlayfairFont,
  registerPlayfairFont
};