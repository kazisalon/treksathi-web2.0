import type { Metadata } from "next";
import { Inter, Noto_Sans_Devanagari } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const notoSansDevanagari = Noto_Sans_Devanagari({
  variable: "--font-nepali",
  subsets: ["devanagari"],
});

export const metadata: Metadata = {
  title: "TrekSathi - ट्रेकसाथी | Nepal Adventures & Himalayan Trekking",
  description: "Explore Nepal's breathtaking destinations and plan unforgettable Himalayan adventures. नेपालका सुन्दर गन्तव्यहरू अन्वेषण गर्नुहोस् र अविस्मरणीय हिमालयी साहसिक यात्राहरूको योजना बनाउनुहोस्।",
  keywords: "nepal travel, himalayan trekking, everest base camp, annapurna circuit, nepal tours, adventure travel, cultural tours, nepal tourism, नेपाल यात्रा, हिमालयी ट्रेकिङ, एभरेस्ट बेस क्याम्प",
  authors: [{ name: "TrekSathi Team" }],
  openGraph: {
    title: "TrekSathi - ट्रेकसाथी | Nepal Adventures",
    description: "Explore Nepal's stunning destinations and plan unforgettable Himalayan adventures | नेपालका सुन्दर गन्तव्यहरू अन्वेषण गर्नुहोस्",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${notoSansDevanagari.variable} antialiased app-bg`}
        suppressHydrationWarning={true}
      >
        <Providers>
          {children}
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
