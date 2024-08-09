import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import '@juji/preflight'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GiPiDi",
  description: "A GPT app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <head>
        <script type="module" src="/pdfjs/build/pdf.mjs"></script>
        <script dangerouslySetInnerHTML={{__html: `
          const int = setInterval(() => {
            if(pdfjsLib) {
              clearInterval(int)
              pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdfjs/build/pdf.worker.js'
            }
          },500)
        `}} />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
