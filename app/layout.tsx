import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/contexts/AppContext";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "DownGigs | Academic Excellence Meets Expert Development",
  description: "Connect students with skilled developers for academic projects.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true} className={`${inter.variable} ${playfair.variable} font-sans antialiased min-h-screen flex flex-col`}>
        <AppProvider>
          <div className="flex-1 flex flex-col min-h-screen">
            <div className="flex-1">
              {children}
            </div>
            <Footer />
          </div>
        </AppProvider>
      </body>
    </html>
  );
}
