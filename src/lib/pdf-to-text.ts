
declare var pdfjsLib: any;

export async function pdfToText( pdfUrl: string ) {

  const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
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