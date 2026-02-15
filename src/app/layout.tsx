import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { RegulatoryDisclaimer } from "@/components/layout/Disclaimers";
import PageTransition from "@/components/layout/PageTransition";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "ANTIGRAVITY | AI Investment Intelligence",
  description: "Institutional-grade AI investment analysis and portfolio management.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${outfit.variable} font-sans antialiased min-h-screen flex flex-col`}>
        <Header />
        <main className="flex-1 pt-16 flex flex-col">
          <PageTransition>
            {children}
          </PageTransition>
        </main>
        <RegulatoryDisclaimer />
      </body>
    </html>
  );
}
