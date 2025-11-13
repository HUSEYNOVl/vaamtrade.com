import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VAAM Motors - Premium Cars Worldwide",
  description: "VAAM Motors - Licensed import-export company offering quality new and second-hand cars with worldwide delivery",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}

