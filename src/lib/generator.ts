import { PDFDocument, rgb, StandardFonts, PDFPage, PDFFont } from "pdf-lib";

const TEMPLATE_CERTIFICATE: string = "template.pdf";
const OUTPUT_DIR: string = "./certificates";
const FONT_SIZE: number = 50;
const COLOR = rgb(0, 108 / 256, 137 / 256);
const NAMES_FILE: string = "names.csv";
const LINE_ENDING: string = "\r\n";

interface Position {
  x: number;
  y: number;
}

function calculatePosition(name: string, font: PDFFont, size: number, page: PDFPage): Position {
  const { width, height } = page.getSize();

  //calculate the total width of text
  const textWidth = font.widthOfTextAtSize(name, size);

  const x = (width - textWidth) / 2; //justify center
  const y = height - 230; //hardcoded

  return { x, y };
}

// Function to load the PDF document
async function loadPdfDocument(): Promise<PDFDocument> {
  const existingPdfBytes = fs.readFileSync(TEMPLATE_CERTIFICATE);
  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  return pdfDoc;
}

// Function to draw the text on the page
async function drawTextOnPage(pdfDoc: PDFDocument, name: string): Promise<Uint8Array> {
  const page = pdfDoc.getPages()[0]; //accessing first page
  const font = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
  const { x, y } = calculatePosition(name, font, FONT_SIZE, page);
  page.drawText(name, { x, y, size: FONT_SIZE, font, color: COLOR });
  return await pdfDoc.save();
}

// Function to write the modified PDF bytes to a file
function writeToFile(name: string, modifiedPdfBytes: Uint8Array): void {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR);
  }

  fs.writeFileSync(`${OUTPUT_DIR}/${name}.pdf`, modifiedPdfBytes);
  console.log(`PDF modified and saved successfully for ${name}`);
}

// Function to generate a certificate for a given name
async function generateCertificate(name: string): Promise<void> {
  const pdfDoc = await loadPdfDocument();
  const modifiedPdf = await drawTextOnPage(pdfDoc, name);
  writeToFile(name, modifiedPdf);
}

// Checking if template certificate exists or not
if (!fs.existsSync(TEMPLATE_CERTIFICATE)) {
  console.error(
    `File '${TEMPLATE_CERTIFICATE}' does not exist in the current directory.`
  );
  exit(0);
} else {
  const names: string[] = fs.readFileSync(NAMES_FILE, "utf-8").split(LINE_ENDING); //returns list of names
  for (const name of names) {
    console.log(`Generating certificate for ${name}`);
    generateCertificate(name);
  }
}