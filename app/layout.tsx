import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display, Noto_Sans } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin", "cyrillic"],
  variable: "--font-playfair",
  display: "swap",
});

const noto = Noto_Sans({
  subsets: ["latin", "cyrillic"],
  variable: "--font-noto",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Сұлтанмахмұт Торайғыров — Виртуалды энциклопедия",
    template: "%s — С. Торайғыров",
  },
  description:
    "Виртуальная энциклопедия, посвящённая казахскому поэту и общественному деятелю Султанмахмуту Торайгырову (1893–1920). Павлодарская областная научная библиотека.",
  keywords: ["Торайғыров", "Торайгыров", "Sultanmakhmut", "Павлодар", "энциклопедия", "ақын", "поэт"],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="kz" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${playfair.variable} ${noto.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
