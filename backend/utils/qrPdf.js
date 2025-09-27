const PDFDocument = require('pdfkit');

// Convert data URL base64 to Buffer
function dataUrlToBuffer(dataUrl) {
  const matches = dataUrl.match(/^data:(.+);base64,(.*)$/);
  if (!matches) return null;
  return Buffer.from(matches[2], 'base64');
}

/**
 * Generate a single-page PDF containing the branded QR card image
 * @param {Object} opts
 * @param {string} opts.restaurantName
 * @param {string} opts.qrPngDataUrl - data:image/png;base64,...
 * @param {Object} [opts.meta]
 * @returns {PDFDocument} readable stream (PDFKit document)
 */
function createQrPdf({ restaurantName = 'Restaurant', qrPngDataUrl, meta = {} }) {
  const doc = new PDFDocument({ size: 'A5', margin: 12 });

  // Meta
  doc.info.Title = `${restaurantName} QR`;
  doc.info.Author = 'Qruzine';

  // Only the QR poster image
  const buf = dataUrlToBuffer(qrPngDataUrl);
  if (buf) {
    const fitWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
    const fitHeight = doc.page.height - doc.page.margins.top - doc.page.margins.bottom;
    const x = doc.page.margins.left;
    const y = doc.page.margins.top;
    doc.image(buf, x, y, { fit: [fitWidth, fitHeight], align: 'center' });
  } else {
    doc.fillColor('red').text('Failed to embed QR image', { align: 'center' });
    doc.fillColor('black');
  }

  return doc;
}

module.exports = { createQrPdf };
