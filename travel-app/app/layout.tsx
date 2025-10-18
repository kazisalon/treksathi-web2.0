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
  title: "TrekSathi - तपाईंको अर्को साहसिक यात्रा खोज्नुहोस्",
  description: "नेपालको सुन्दर गन्तव्यहरू अन्वेषण गर्नुहोस्, अविस्मरणीय यात्राहरूको योजना बनाउनुहोस्, र TrekSathi - तपाईंको अन्तिम यात्रा साथीसँग जीवनभरका सम्झनाहरू सिर्जना गर्नुहोस्।",
  keywords: "यात्रा, साहसिक, गन्तव्य, छुट्टी, पर्यटन, अन्वेषण, नेपाल, travel, adventure, nepal, tourism",
  authors: [{ name: "TrekSathi Team" }],
  openGraph: {
    title: "TrekSathi - तपाईंको अर्को साहसिक यात्रा खोज्नुहोस्",
    description: "नेपालको सुन्दर गन्तव्यहरू अन्वेषण गर्नुहोस् र अविस्मरणीय यात्राहरूको योजना बनाउनुहोस्",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ne">
      <body
        className={`${inter.variable} ${notoSansDevanagari.variable} antialiased`}
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
