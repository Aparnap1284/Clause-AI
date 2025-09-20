import pdf from "pdf-parse";

// Function to parse PDF text from a Buffer
export async function parsePDF(buffer) {
  const data = await pdf(buffer);
  return data.text.trim();
}
