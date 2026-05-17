const PDFParser = require('pdf2json');

const extractTextFromPDF = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser(this, 1);
    
    pdfParser.on('pdfParser_dataError', (errData) => {
      console.error("PDF Parsing Error detail:", errData.parserError);
      reject(new Error('Failed to parse PDF: ' + errData.parserError));
    });

    pdfParser.on('pdfParser_dataReady', (pdfData) => {
      let extractedText = pdfParser.getRawTextContent();
      resolve(extractedText);
    });

    pdfParser.parseBuffer(fileBuffer);
  });
};

module.exports = { extractTextFromPDF };
