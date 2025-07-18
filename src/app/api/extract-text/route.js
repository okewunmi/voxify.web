import formidable from "formidable";
import fs from "fs";
import pdf from "pdf-parse";

export const config = {
  api: {
    bodyParser: false, // Disable body parsing for file upload
  },
};

export async function POST(req) {
  try {
    const form = formidable({ multiples: false });

    const data = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve({ fields, files });
      });
    });

    const filePath = data.files.file.filepath;
    const pdfBuffer = fs.readFileSync(filePath);
    const parsed = await pdf(pdfBuffer);

    return new Response(JSON.stringify({ text: parsed.text }), { status: 200 });
  } catch (error) {
    console.error("PDF extraction error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
