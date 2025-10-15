const { AwesomeQR } = require('awesome-qr');
// Prefer @napi-rs/canvas in production (no system deps). Fallback to node-canvas.
let createCanvas, loadImage, registerFont;
try {
  ({ createCanvas, loadImage, registerFont } = require('@napi-rs/canvas'));
  
} catch (_) {
  ({ createCanvas, loadImage, registerFont } = require('canvas'));
  
}
const fs = require('fs');
const path = require('path');
const QRCodeLib = require('qrcode');

// Set QR_DEBUG=1 to enable extra logging.
const QR_DEBUG = process.env.QR_DEBUG === '1' || process.env.QR_DEBUG === 'true';

// Fallback QR generator using the qrcode library that returns a PNG data URL
// Used when AwesomeQR fails or as a last resort in production
const generateSafeBaseQR = async (text) => {
  try {
    const dataUrl = await QRCodeLib.toDataURL(text, {
      errorCorrectionLevel: 'H',
      margin: 2,
      scale: 10,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
      // type defaults to image/png for toDataURL
    });
    return dataUrl;
  } catch (e) {
    throw new Error('qrcode fallback failed: ' + e.message);
  }
};

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
    let blackPixels = 0;
    let whitePixels = 0;
    let totalSampled = 0;
    
    // Sample every 8th pixel for better coverage (was 16th)
    for (let i = 0; i < data.length; i += 8 * 4) {
      const r = data[i], g = data[i + 1], b = data[i + 2];
      const a = data[i + 3]; // Check alpha channel
      
      // Skip fully transparent pixels
      if (a < 10) continue;
      
      const l = Math.round(0.2126 * r + 0.7152 * g + 0.0722 * b);
      if (l < min) min = l;
      if (l > max) max = l;
      
      if (l < 50) blackPixels++;
      if (l > 200) whitePixels++;
      totalSampled++;
    }
    
    const contrast = max - min;
    const hasBlackAndWhite = blackPixels > 0 && whitePixels > 0;
    
    if (QR_DEBUG) {
      //console.log(`[QR] Contrast check: min=${min}, max=${max}, diff=${contrast}`);
      //console.log(`[QR] Pixels sampled: ${totalSampled}, black: ${blackPixels}, white: ${whitePixels}`);
      //console.log(`[QR] Has B&W pixels: ${hasBlackAndWhite}`);
    }
    
    // QR code should have both black and white pixels with good contrast
    return contrast > 100 && hasBlackAndWhite;
  } catch (err) {
    //console.warn('[QR] hasContrast check failed:', err.message);
    return false;
  }
};

// Helper: wrap text into lines that fit within maxWidth using the current ctx.font
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

// Helper: draw up to maxLines centered lines around centerY
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
    // Optional styling
    strokeStyle,
    strokeWidth = 2,
    fillStyle,
  } = options;

  let size = initialSize;
  let lines = [];
  while (size >= minSize) {
    ctx.font = `${weight} ${size}px ${fontFamily}`;
    lines = wrapTextLines(ctx, text, maxWidth, transform);
    const widest = Math.max(...lines.map(l => ctx.measureText(transform(l)).width));
    if (lines.length <= maxLines && widest <= maxWidth) break;
    size -= 2;
  }
  if (lines.length > maxLines) {
    const merged = [lines[0], lines.slice(1).join(' ')];
    lines = merged.slice(0, maxLines);
  }
  const lineHeight = size + 4;
  const totalHeight = lineHeight * (lines.length - 1);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  if (fillStyle) ctx.fillStyle = fillStyle;
  lines.forEach((line, idx) => {
    const y = centerY - totalHeight / 2 + idx * lineHeight;
    if (strokeStyle) {
      ctx.save();
      ctx.lineWidth = strokeWidth;
      ctx.strokeStyle = strokeStyle;
      ctx.strokeText(transform(line), centerX, y);
      ctx.restore();
    }
    ctx.fillText(transform(line), centerX, y);
  });
  return size;
};

/**
 * Generate professional QR code with burgundy background and Playfair font
 * Enhanced with better error handling and production support
 */
const generateMinimalProfessionalQR = async (data, restaurantName, options = {}) => {
  //console.log('[QR] Starting generateMinimalProfessionalQR');
  //console.log('[QR] Data URL:', data);
  //console.log('[QR] Restaurant:', restaurantName);
  
  try {
    // Register Playfair optionally
    let fontFamily = 'serif';
    const playfairPath = options.playfairFontPath || process.env.PLAYFAIR_TTF;
    try {
      if (playfairPath && fs.existsSync(playfairPath)) {
        registerFont(playfairPath, { family: 'Playfair Display' });
        fontFamily = 'Playfair Display';
        //console.log('[QR] Playfair font registered');
      }
    }   catch (fontErr) {
      //console.warn('[QR] Font registration failed, using serif:', fontErr.message);
    }

    // Step 1: Generate base QR code
    let qrDataUrl;
    let qrBuffer;
    
    try {
      //console.log('[QR] Attempting QR generation with AwesomeQR');
      const qrOptions = {
        text: data,
        size: 480,
        margin: 20, // Increased margin for safety
        correctLevel: AwesomeQR.CorrectLevel.H,
        whiteMargin: true,
        dotScale: 1.0,
        colorDark: '#000000',
        colorLight: '#FFFFFF',
        autoColor: false,
        binarize: true, // Force proper black/white binarization
        ...options
      };
      
      qrBuffer = await new AwesomeQR(qrOptions).draw();
      const qrSizeBytes = Buffer.isBuffer(qrBuffer) ? qrBuffer.length : (qrBuffer?.byteLength || 0);
      //console.log('[QR] AwesomeQR buffer size:', qrSizeBytes, 'bytes');
      
      // Validate buffer size
      if (!qrBuffer || qrSizeBytes < 1000) {
        //console.warn('[QR] AwesomeQR buffer too small, switching to fallback');
        throw new Error('AwesomeQR buffer invalid');
      }
      
      // CRITICAL FIX: Create a temporary canvas to verify the QR is valid
      console.log('[QR] Verifying QR image validity');
      const tempCanvas = createCanvas(480, 480);
      const tempCtx = tempCanvas.getContext('2d');
      
      qrDataUrl = bufferToDataUrl(qrBuffer);
      const testImage = await loadImage(qrDataUrl);
      tempCtx.drawImage(testImage, 0, 0);
      
      // Check if the temp canvas has proper QR data
      const testData = tempCtx.getImageData(240, 240, 1, 1).data;
      //console.log('[QR] Test QR center pixel:', testData[0], testData[1], testData[2], testData[3]);
      
      // Sample a larger area to check contrast
      const sampleData = tempCtx.getImageData(0, 0, 480, 480).data;
      let hasWhite = false, hasBlack = false;
      
      for (let i = 0; i < sampleData.length; i += 40 * 4) {
        const r = sampleData[i], g = sampleData[i + 1], b = sampleData[i + 2];
        const l = Math.round(0.2126 * r + 0.7152 * g + 0.0722 * b);
        if (l > 200) hasWhite = true;
        if (l < 50) hasBlack = true;
        if (hasWhite && hasBlack) break;
      }
      
      //console.log('[QR] Test QR has white pixels:', hasWhite, 'black pixels:', hasBlack);
      
      // If the QR doesn't have proper contrast, regenerate with qrcode library
      if (!hasWhite || !hasBlack) {
        //console.warn('[QR] AwesomeQR produced invalid image, switching to qrcode library');
        throw new Error('AwesomeQR produced invalid QR');
      }
      
      //console.log('[QR] AwesomeQR generation successful and validated');
      
    } catch (awesomeQrErr) {
      //console.error('[QR] AwesomeQR failed:', awesomeQrErr.message);
      //console.log('[QR] Falling back to qrcode library');
      
      // Fallback to qrcode library
      qrDataUrl = await generateSafeBaseQR(data);
      console.log('[QR] Fallback QR generation successful');
      
      // Validate the fallback QR as well
      try {
        const tempCanvas = createCanvas(512, 512);
        const tempCtx = tempCanvas.getContext('2d');
        const testImage = await loadImage(qrDataUrl);
        tempCtx.drawImage(testImage, 0, 0);
        
        const testData = tempCtx.getImageData(256, 256, 1, 1).data;
        //console.log('[QR] Fallback QR center pixel:', testData[0], testData[1], testData[2], testData[3]);
      } catch (validateErr) {
        //console.warn('[QR] Could not validate fallback QR:', validateErr.message);
      }
    }

    // Step 2: Compose the branded design
    try {
      //console.log('[QR] Starting canvas composition');
      
      const canvasWidth = 682;
      const canvasHeight = 1224;
      const canvas = createCanvas(canvasWidth, canvasHeight);
      const ctx = canvas.getContext('2d');
      
      // CRITICAL: Set proper canvas context settings
      ctx.globalCompositeOperation = 'source-over'; // Default, but explicit
      ctx.globalAlpha = 1.0; // Full opacity
      ctx.imageSmoothingEnabled = true; // Enable for background/text
      
      const burgundy = '#6B0D13';
      const cream = '#FFF2DC';
      const gold = '#D4AF37';

      // Background (snow white shade)
      ctx.fillStyle = '#FFFAFA';
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);
      //console.log('[QR] Background drawn');

      // Title (auto-wrap for long names)
      const title = (restaurantName || 'RESTAURANT NAME').trim();
      // Title as gold text (no stroke)
      ctx.fillStyle = gold;
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
        initialSize: 56,
        minSize: 20,
        maxLines: 2,
        transform: (s) => s.toUpperCase(),
        fillStyle: gold,
      });
      
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      //console.log('[QR] Title drawn');

      // Rounded cream panel for QR
      const panelW = 520;
      const panelH = 520;
      const panelX = (canvasWidth - panelW) / 2;
      const panelY = 228; // gentle extra spacing below title
      
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
      //console.log('[QR] Panel drawn');

      // Load and draw QR image
      //console.log('[QR] Loading QR image');
      let qrImage;
      
      try {
        qrImage = await loadImage(qrDataUrl);
        //console.log('[QR] QR image loaded, dimensions:', qrImage.width, 'x', qrImage.height);
        
        // Verify the image actually has data
        if (!qrImage.width || !qrImage.height || qrImage.width < 100 || qrImage.height < 100) {
          throw new Error(`Invalid QR image dimensions: ${qrImage.width}x${qrImage.height}`);
        }
      } catch (loadErr) {
        console.error('[QR] Failed to load QR image:', loadErr.message);
        console.log('[QR] Returning base QR due to image load failure');
        return qrDataUrl;
      }
      
      const innerMargin = 26;
      const qrSize = panelW - innerMargin * 2;
      const qrX = panelX + innerMargin;
      const qrY = panelY + innerMargin;
      
      // CRITICAL FIX: Draw on a white background first to ensure visibility
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(qrX, qrY, qrSize, qrSize);
      console.log('[QR] White background drawn at QR position');
      
      // Reset any transformations and set proper context for QR drawing
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1.0;
      ctx.imageSmoothingEnabled = false; // Crisp QR code rendering
      
      try {
        // Draw the QR image
        ctx.drawImage(qrImage, qrX, qrY, qrSize, qrSize);
        console.log('[QR] QR image drawn');
        
        // Verify immediately after drawing
        const immediateCheck = ctx.getImageData(qrX + 100, qrY + 100, 1, 1).data;
        //console.log('[QR] Immediate post-draw pixel check:', immediateCheck[0], immediateCheck[1], immediateCheck[2], immediateCheck[3]);
        
      } catch (drawErr) {
        //console.error('[QR] Failed to draw QR image:', drawErr.message);
        //console.log('[QR] Returning base QR due to draw failure');
        return qrDataUrl;
      }
      
      // Reset image smoothing for text
      ctx.imageSmoothingEnabled = true;
      
      // Sample a few pixels to verify the image actually rendered
      try {
        const testPixel = ctx.getImageData(qrX + qrSize/2, qrY + qrSize/2, 1, 1).data;
          //console.log('[QR] Sample center pixel RGBA:', testPixel[0], testPixel[1], testPixel[2], testPixel[3]);
        
        // If center pixel is pure black or pure white, something went wrong
        if ((testPixel[0] === 0 && testPixel[1] === 0 && testPixel[2] === 0 && testPixel[3] === 0) ||
            (testPixel[3] === 0)) {
          //console.warn('[QR] Center pixel is fully transparent, image may not have rendered');
        }
      } catch (e) {
        //console.warn('[QR] Could not sample pixel:', e.message);
      }

      // Validate QR contrast
      const hasQRContrast = hasContrast(ctx, qrX, qrY, qrSize, qrSize);
      //console.log('[QR] QR contrast check:', hasQRContrast);
      
      if (!hasQRContrast) {
        //console.warn('[QR] No contrast detected in QR region, returning base QR');
        return qrDataUrl;
      }

      // Middle caption between QR and icons
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#4A5568';
      const midCaption = (options && (options.qrLabel || options.qrName || options.qrType)) || 'Digital Menu Scan To Order';

      // Compute position and auto-size to fit without overlapping QR or icons
      const instructionsTop = panelY + panelH + 66; // gentle spacing between QR and icons
      const bandTop = panelY + panelH + 16;  // margin below QR panel
      const bandBottom = instructionsTop - 16; // margin above icons row
      const bandHeight = Math.max(1, bandBottom - bandTop);
      let midSize = 42; // start bigger
      const maxMidWidth = canvasWidth - 140; // slightly wider allowance
      ctx.font = `700 ${midSize}px ${fontFamily}`;
      while ((ctx.measureText(midCaption).width > maxMidWidth || midSize > bandHeight) && midSize > 18) {
        midSize -= 1;
        ctx.font = `700 ${midSize}px ${fontFamily}`;
      }
      const midY = bandTop + bandHeight / 2; // centered in the band
      ctx.fillText(midCaption, canvasWidth / 2, midY);
      const circleD = 120;
      const circleR = circleD / 2;
      const stepsGap = 40;
      const totalStepsWidth = circleD * 4 + stepsGap * 3;
      const startX = (canvasWidth - totalStepsWidth) / 2 + circleR;
      const circleY = instructionsTop + circleR;

      const drawCircle = (cx, cy, r) => {
        ctx.beginPath();
        ctx.fillStyle = '#E9EEF5';
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fill();
      };

      const drawLens = (cx, cy) => {
        ctx.save();
        ctx.lineWidth = 10;
        ctx.strokeStyle = '#4285F4';
        ctx.beginPath();
        ctx.arc(cx, cy, 26, -Math.PI / 4, Math.PI / 4);
        ctx.stroke();
        ctx.strokeStyle = '#EA4335';
        ctx.beginPath();
        ctx.arc(cx, cy, 26, Math.PI / 4, (3 * Math.PI) / 4);
        ctx.stroke();
        ctx.strokeStyle = '#34A853';
        ctx.beginPath();
        ctx.arc(cx, cy, 26, (3 * Math.PI) / 4, (5 * Math.PI) / 4);
        ctx.stroke();
        ctx.strokeStyle = '#FBBC05';
        ctx.beginPath();
        ctx.arc(cx, cy, 26, (5 * Math.PI) / 4, (7 * Math.PI) / 4);
        ctx.stroke();
        ctx.fillStyle = '#4285F4';
        ctx.beginPath();
        ctx.arc(cx, cy, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      };

      const drawCamera = (cx, cy) => {
        ctx.save();
        ctx.strokeStyle = '#1F2D3D';
        ctx.lineWidth = 6;
        const w = 64, h = 40, r = 8;
        const x = cx - w / 2, y = cy - h / 2;
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(cx, cy, 12, 0, Math.PI * 2);
        ctx.stroke();
        ctx.strokeStyle = '#1F7AFC';
        ctx.beginPath();
        ctx.arc(cx, cy, 6, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      };

      const drawPhoneQR = (cx, cy) => {
        ctx.save();
        ctx.strokeStyle = '#1F2D3D';
        ctx.lineWidth = 5;
        const w = 48, h = 74, r = 8;
        const x = cx - w / 2, y = cy - h / 2;
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.stroke();
        ctx.fillStyle = '#1F7AFC';
        ctx.fillRect(x + 12, y + 18, 8, 8);
        ctx.fillRect(x + 26, y + 18, 8, 8);
        ctx.fillRect(x + 12, y + 32, 8, 8);
        ctx.fillStyle = '#1F2D3D';
        ctx.fillRect(x + 26, y + 32, 8, 8);
        ctx.restore();
      };

      const drawTap = (cx, cy) => {
        ctx.save();
        ctx.strokeStyle = '#1F2D3D';
        ctx.lineWidth = 5;
        const w = 46, h = 70, r = 8;
        const x = cx - w / 2, y = cy - h / 2;
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.stroke();
        ctx.fillStyle = '#1F7AFC';
        ctx.fillRect(x + w - 24, y + 10, 16, 12);
        ctx.strokeStyle = '#1F2D3D';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(cx - 6, cy + 8);
        ctx.lineTo(cx - 6, cy + 28);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(cx - 6, cy + 8, 6, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      };

      // Try to load custom Google Search icon if provided
      let googleSearchIconImage = null;
      try {
        let iconPath = (options && options.googleSearchIconPath) || process.env.GOOGLE_SEARCH_ICON;
        if (!iconPath) {
          const defaultIconPath = path.join(__dirname, '..', 'public', 'images', 'google.png');
          if (fs.existsSync(defaultIconPath)) {
            iconPath = defaultIconPath;
          }
        }
        if (iconPath && fs.existsSync(iconPath)) {
          googleSearchIconImage = await loadImage(iconPath);
        }
      } catch (_) { /* ignore icon load failure */ }

      const centers = [0, 1, 2, 3].map(i => startX + i * (circleD + stepsGap));
      centers.forEach(c => drawCircle(c, circleY, circleR));
      if (googleSearchIconImage) {
        // Draw the provided icon centered within the first circle, keeping aspect ratio
        const maxIconSize = circleD * 0.68; // leave padding inside the circle
        const iw = googleSearchIconImage.width || maxIconSize;
        const ih = googleSearchIconImage.height || maxIconSize;
        const scale = Math.min(maxIconSize / iw, maxIconSize / ih);
        const dw = iw * scale;
        const dh = ih * scale;
        ctx.drawImage(
          googleSearchIconImage,
          centers[0] - dw / 2,
          circleY - dh / 2,
          dw,
          dh
        );
      } else {
        drawLens(centers[0], circleY);
      }
      drawCamera(centers[1], circleY);
      drawPhoneQR(centers[2], circleY);
      drawTap(centers[3], circleY);

      ctx.textAlign = 'center';
      ctx.textBaseline = 'alphabetic';
      ctx.fillStyle = '#4A5568';
      ctx.font = `700 16px ${fontFamily}`;
      const labelY = instructionsTop + circleD + 36;
      ctx.fillText('Open Google Search', centers[0], labelY);
      ctx.fillStyle = '#4A5568';
      ctx.fillText('Turn on camera', centers[1], labelY);
      ctx.fillText('Frame the QR', centers[2], labelY);
      ctx.fillText('Click the pop-up', centers[3], labelY);

      // Center the OR between the first two icons
      ctx.save();
      ctx.fillStyle = '#E1584B';
      ctx.textBaseline = 'middle';
      ctx.font = `800 20px ${fontFamily}`;
      ctx.fillText('OR', (centers[0] + centers[1]) / 2, circleY);
      ctx.restore();

      const instructionsHeight = circleD + 56;

      // Red pill CTA
      const pillW = 520;
      const pillH = 96;
      const pillX = (canvasWidth - pillW) / 2;
      const pillY = instructionsTop + instructionsHeight + 28; // gentle extra spacing below icons
      
      roundRect(pillX, pillY, pillW, pillH, 24);
      // Apply 135° gradient background (top-left to bottom-right)
      const pillGradient = ctx.createLinearGradient(pillX, pillY, pillX + pillW, pillY + pillH);
      pillGradient.addColorStop(0, '#800020');
      pillGradient.addColorStop(1, '#000000');
      ctx.fillStyle = pillGradient;
      ctx.shadowColor = 'rgba(0,0,0,0.25)';
      ctx.shadowBlur = 6;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 3;
      ctx.fill();
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      // Gold border stroke for CTA pill
      roundRect(pillX, pillY, pillW, pillH, 24);
      ctx.lineWidth = 3;
      ctx.strokeStyle = 'rgb(212, 175, 55)';
      ctx.stroke();
      
      // CTA text styling (white)
      ctx.fillStyle = '#FFFFFF';
      let scanSize = 32;
      ctx.font = `700 ${scanSize}px ${fontFamily}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      const lines = ['Digital Menu', 'Scan To Order'];
      const maxScanWidth = pillW - 80;
      
      while (Math.max(...lines.map(l => ctx.measureText(l).width)) > maxScanWidth && scanSize > 20) {
        scanSize -= 2;
        ctx.font = `700 ${scanSize}px ${fontFamily}`;
      }
      
      const lh = scanSize + 2;
      const cx = canvasWidth / 2;
      const centerY = pillY + pillH / 2;
      
      ctx.fillText(lines[0], cx, centerY - lh / 2);
      ctx.fillText(lines[1], cx, centerY + lh / 2);
      ctx.textBaseline = 'alphabetic';
      //console.log('[QR] CTA button drawn');

      // Gold footer branding (aligned sizes)
      ctx.fillStyle = gold;
      ctx.shadowColor = 'rgba(0,0,0,0.3)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 2;

      // Compute a common font size so both lines share the same size
      let footerSize = 40;
      const maxFooterWidth = canvasWidth - 120;
      ctx.font = `900 ${footerSize}px ${fontFamily}`;
      while (
        Math.max(
          ctx.measureText('POWERED BY').width,
          ctx.measureText('QRUZINE').width
        ) > maxFooterWidth && footerSize > 20
      ) {
        footerSize -= 2;
        ctx.font = `900 ${footerSize}px ${fontFamily}`;
      }
      // Reduce slightly more for a gentler look
      footerSize = Math.max(18, footerSize - 4);
      ctx.font = `900 ${footerSize}px ${fontFamily}`;

      ctx.textAlign = 'center';
      ctx.fillText('POWERED BY', canvasWidth / 2, canvasHeight - 56);
      ctx.fillText('QRUZINE', canvasWidth / 2, canvasHeight - 12);
      //console.log('[QR] Footer branding drawn');

      // Convert to data URL
      const finalDataUrl = canvas.toDataURL('image/png', 0.95);
      //console.log('[QR] Canvas composition complete, data URL length:', finalDataUrl.length);
      
      return finalDataUrl;
      
    } catch (compositionErr) {
      //console.error('[QR] Canvas composition failed:', compositionErr);
      //console.error('[QR] Stack trace:', compositionErr.stack);
      //console.log('[QR] Returning base QR as fallback');
      
      // Return the base QR if composition fails
      return qrDataUrl;
    }

  } catch (error) {
    //console.error('[QR] Critical error in generateMinimalProfessionalQR:', error);
    //console.error('[QR] Stack trace:', error.stack);
    
    // Last resort: generate simple QR with qrcode library
    try {
      //console.log('[QR] Attempting last resort QR generation');
      return await generateSafeBaseQR(data);
    } catch (lastResortErr) {
      //console.error('[QR] Last resort failed:', lastResortErr);
      throw new Error('Failed to generate QR code: ' + error.message);
    }
  }
};

/**
 * Generate professional QR code (legacy function for backward compatibility)
 */
const generateProfessionalQR = async (data, restaurantName, options = {}) => {
  return generateMinimalProfessionalQR(data, restaurantName, options);
};

/**
 * Generate professional QR code with custom logo
 */
const generateProfessionalQRWithLogo = async (data, restaurantName, logoPath = null, options = {}) => {
  try {
    let logoImage = undefined;
    
    if (logoPath && fs.existsSync(logoPath)) {
      logoImage = await loadImage(logoPath);
    }

    const qrOptions = {
      ...options,
      logoImage: logoImage,
      logoScale: 0.15,
      logoMargin: 8,
      logoCornerRadius: 8,
    };

    return await generateMinimalProfessionalQR(data, restaurantName, qrOptions);
  } catch (error) {
    //console.error('[QR] Logo QR generation error:', error);
    return await generateMinimalProfessionalQR(data, restaurantName, options);
  }
};

/**
 * Generate compact professional QR code
 */
const generateCompactProfessionalQR = async (data, restaurantName, options = {}) => {
  return generateMinimalProfessionalQR(data, restaurantName, { ...options, compact: true });
};

/**
 * Generate QR with Playfair Display font
 */
const generateQRWithPlayfairFont = async (data, restaurantName, playfairFontPath = null, options = {}) => {
  return generateMinimalProfessionalQR(data, restaurantName, {
    ...options,
    playfairFontPath
  });
};

/**
 * Register Playfair Display font
 */
const registerPlayfairFont = (fontPath) => {
  try {
    if (fs.existsSync(fontPath)) {
      registerFont(fontPath, { family: 'Playfair Display' });
      //console.log('[QR] Playfair Display font registered successfully');
    }
  } catch (error) {
    //console.warn('[QR] Could not register Playfair Display font:', error.message);
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