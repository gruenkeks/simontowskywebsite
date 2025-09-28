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
    icon: "/d.svg",
    shortcut: "/d.svg",
    apple: "/d.svg",
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
