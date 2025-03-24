import Header from "@/components/Header";
import Providers from "@/components/Providers";
import "@rainbow-me/rainbowkit/styles.css";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kresus ARM",
  description: "Kresus Assets Recovery and Migration",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased min-h-screen bg-[#02031E]`}>
        <Providers>
          <Header />
          <main className="max-w-7xl mx-auto px-6">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
