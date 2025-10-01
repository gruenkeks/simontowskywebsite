import type { Metadata } from "next";
import { Bebas_Neue } from "next/font/google";
import "./globals.css";

const bebas = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
});

export const metadata: Metadata = {
  title: "Welcome to my personal site",
  description: "You'll find my contact information & travel plans here.",
  icons: {
    icon: [
      { url: "/d.svg", type: "image/svg+xml" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" }
    ],
    shortcut: "/d.svg",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Welcome to my personal site",
    description: "You'll find my contact information & travel plans here.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "Welcome to my personal site",
    description: "You'll find my contact information & travel plans here.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${bebas.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
