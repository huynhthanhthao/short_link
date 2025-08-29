import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "IIT Short Link",
  description: "Rút gọn link - dễ chia sẻ",
  icons: [
    {
      rel: 'icon',
      url: `/favicon/favicon.ico`,
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '16x16',
      url: `/favicon/favicon-16x16.png`,
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '32x32',
      url: `/favicon/favicon-32x32.png`,
    },
    {
      rel: 'apple-touch-icon',
      sizes: '180x180',
      url: '/favicon/apple-touch-icon.png',
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
