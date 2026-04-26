import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VAAM Motors - Premium Cars Worldwide",
  description: "VAAM Motors - Licensed import-export company offering quality new and second-hand cars with worldwide delivery",
  icons: {
    icon: "https://res.cloudinary.com/dvoojvo7i/image/upload/v1777192196/uploads/sijqy34v6h0qlw9a5jbo.png",
    apple: "https://res.cloudinary.com/dvoojvo7i/image/upload/v1777192196/uploads/sijqy34v6h0qlw9a5jbo.png",
  },
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

