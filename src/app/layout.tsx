import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "D&D Character Backstory Generator",
  description: "Forge your legend with AI-powered backstories for Dungeons & Dragons.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
