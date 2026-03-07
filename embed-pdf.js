/**
 * 將 PDF 題本直接嵌入 FRI.html，產生無需手動掛載的版本
 * 用法：將 PDF 放在同目錄，執行 node embed-pdf.js
 *       或：node embed-pdf.js 流體推理(電腦測驗用題本).pdf
 */
const fs = require('fs');
const path = require('path');

const PDF_NAME = '流體推理(電腦測驗用題本).pdf';
const HTML_PATH = path.join(__dirname, 'FRI.html');
const OUTPUT_PATH = path.join(__dirname, 'FRI.html');

const pdfPath = process.argv[2] ? path.resolve(process.argv[2]) : path.join(__dirname, PDF_NAME);

if (!fs.existsSync(pdfPath)) {
  console.error('找不到 PDF 檔案：', pdfPath);
  console.error('請將 PDF 放在專案目錄，檔名：', PDF_NAME);
  console.error('或執行：node embed-pdf.js <PDF路徑>');
  process.exit(1);
}

const pdfBuffer = fs.readFileSync(pdfPath);
const base64 = pdfBuffer.toString('base64');

let html = fs.readFileSync(HTML_PATH, 'utf8');
const re = /var EMBEDDED_PDF_BASE64 = (?:null|'[^']*');/;
if (!re.test(html)) {
  console.error('FRI.html 格式已變更，無法嵌入。');
  process.exit(1);
}
html = html.replace(re, `var EMBEDDED_PDF_BASE64 = '${base64}';`);

fs.writeFileSync(OUTPUT_PATH, html);
console.log('✓ 題本已嵌入 FRI.html，直接雙擊開啟即可使用，無需手動掛載。');
