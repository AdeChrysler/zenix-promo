import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Zenix.id — Platform AI Sales & Marketing #1 di Indonesia",
  description:
    "Kelola leads WhatsApp, AI chatbot, landing page builder, dan payment gateway dalam satu platform.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="dark scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        style={{ fontFamily: "'Inter', sans-serif" }}
        className="bg-[#0a0a0f] text-white antialiased"
      >
        {children}
      </body>
    </html>
  );
}
