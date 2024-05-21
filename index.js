import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import fs from "fs";
import { exit } from "process";
import csv from "csv-parser";

const TEMPLATE_CERTIFICATE = "template.pdf";
const OUTPUT_DIR = "./certificates";
const FONT_SIZE = 50;
const COLOR = rgb(61 / 256, 90 / 256, 128 / 256);
const NAMES_FILE = "git_and_github.tsv";

async function getUniqueFullNamesFromCSV(file) {
  return new Promise((resolve, reject) => {
    const names = new Set();
    fs.createReadStream(file, { encoding: "utf-16le" })
      .pipe(csv({ separator: "\t" }))
      .on("data", (row) => {
        const [firstPair] = Object.entries(row);
        const personName = firstPair[1].replace(/(\r\n|\n|\r)/gm, "");
        const cleanedName = personName.replace(/ ?\(.*?\)/g, "");
        names.add(cleanedName);
      })
      .on("end", () => {
        resolve(Array.from(names));
      })
      .on("error", reject);
  });
}

function calculatePosition(name, font, size, page) {
  const { width, height } = page.getSize();

  //calculate the total width of text
  const textWidth = font.widthOfTextAtSize(name, size);

  const x = (width - textWidth) / 2; //justify center
  const y = height - 247; //hardcoded

  return { x, y };
}

// Function to load the PDF document
async function loadPdfDocument() {
  const existingPdfBytes = fs.readFileSync(TEMPLATE_CERTIFICATE);
  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  return pdfDoc;
}

// Function to draw the text on the page
async function drawTextOnPage(pdfDoc, name) {
  const page = pdfDoc.getPages()[0]; //accessing first page
  const font = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
  const { x, y } = calculatePosition(name, font, FONT_SIZE, page);
  page.drawText(name, { x, y, size: FONT_SIZE, font, color: COLOR });
  return await pdfDoc.save();
}

// Function to write the modified PDF bytes to a file
function writeToFile(name, modifiedPdfBytes) {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR);
  }

  fs.writeFileSync(`${OUTPUT_DIR}/${name}.pdf`, modifiedPdfBytes);
  console.log(`PDF modified and saved successfully for ${name}`);
}

// Function to generate a certificate for a given name
async function generateCertificate(name) {
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
  getUniqueFullNamesFromCSV(NAMES_FILE)
    .then((names) => {
      console.log(`Generating certificates for ${names.length} names`);
      for (const name of names) {
        console.log(`Generating certificate for ${name}`);
        generateCertificate(name);
      }
    })
    .catch((err) => console.error(err));
}
