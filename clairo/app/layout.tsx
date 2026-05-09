import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Clairo — Clarity without complexity",
  description: "AI that works for your whole family. No complicated setup, no confusing steps. Built for everyone.",
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
