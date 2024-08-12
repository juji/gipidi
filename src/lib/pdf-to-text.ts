import { ConvoAttachment } from "./idb/types";

declare var pdfjsLib: any;

export async function pdfToText( attachment: ConvoAttachment ) {

  const pdf = await pdfjsLib.getDocument(`data:${attachment.mime};base64,${attachment.data}`).promise;
  const totalPageCount = pdf.numPages;
  const texts = await Promise.all(
    new Array(totalPageCount).fill(0).map(async (_,i) => {
      const page = await pdf.getPage(i+1);
      const textContent = await page.getTextContent();
      return textContent.items.map((s: any) => s.str).join('');
    })
  )

  return texts.join('');
}