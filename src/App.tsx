import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import NameList from "@/components/webview/NamesList";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { saveAs } from "file-saver";

async function generatePDF(
  names: string[],
  file: File,
  fontSize: number,
  namePos: number
) {
  const pdfBytes = await file.arrayBuffer();

  for (const name of names) {
    if (name.length === 0 || name.trim().length === 0) {
      continue;
    }
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    const font = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

    const { width, height } = firstPage.getSize();

    //calculate the total width of text
    const textWidth = font.widthOfTextAtSize(name, fontSize);

    const x = (width - textWidth) / 2; //justify center
    const y = height - namePos; //hardcoded

    firstPage.drawText(name, {
      x: x,
      y: y,
      size: fontSize,
      font: font,
      color: rgb(0, 0, 0),
    });

    const pdfBytesModified = await pdfDoc.save();
    const blob = new Blob([pdfBytesModified], { type: "application/pdf" });
    saveAs(blob, `${name}.pdf`);
  }
}

export default function App() {
  const [names, setNames] = useState<string[]>([]);
  const [file, setFile] = useState<File>();
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const formData: FormData = new FormData(e.currentTarget);
    const fontSize: number = Number(formData.get("font-size"));
    const namePos: number = Number(formData.get("name-pos"));

    if (file) {
      generatePDF(names, file, fontSize, namePos).then(() => {
        setIsLoading(false);
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col items-center justify-center h-screen w-screen">
        <h2 className="text-4xl font-bold mb-6">Certificate Generator</h2>
        <div className="bg-white dark:bg-gray-900 shadow-md rounded-xl w-full max-w-2xl p-6">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <Label htmlFor="font-size">Font Size</Label>
              <Input
                id="font-size"
                name="font-size"
                type="number"
                placeholder="Enter font size"
                className="w-full"
                defaultValue="50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name-pos">Name Position</Label>
              <Input
                id="name-pos"
                name="name-pos"
                type="number"
                placeholder="Enter name position"
                className="w-full"
                defaultValue="247"
              />
            </div>
          </div>
          <Textarea
            className="w-full h-40 p-4 text-lg resize-none focus:outline-none"
            placeholder="Enter names separated by commas (e.g. John Doe, Jane Doe)"
            onChange={(e) => {
              const temporaryNameList = e.target.value;
              const temporaryName = temporaryNameList.split(",");
              setNames(temporaryName.map((name) => name.trim()));
            }}
          />
          {names.length > 0 && names[0].length > 0 && (
            <NameList names={names} />
          )}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2">
              <Label className="cursor-pointer" htmlFor="file-upload">
                <FileIcon className="h-5 w-5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300" />
                <input
                  accept=".pdf"
                  className="hidden"
                  id="file-upload"
                  type="file"
                  onChange={handleFileUpload}
                />
              </Label>
              <span className="text-gray-500 dark:text-gray-400 text-sm">
                {file?.name || "Upload a Template Certificate"}
              </span>
            </div>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-gray-900 text-white hover:bg-gray-800 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-200 px-4 py-2 rounded-md text-sm"
            >
              {isLoading ? "Generating..." : "Generate"}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}

interface FileIconProps {
  className?: string;
  h?: number;
  w?: number;
  text?: string;
}

function FileIcon(props: FileIconProps): JSX.Element {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width={props.w || 24}
      height={props.h || 24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    </svg>
  );
}
