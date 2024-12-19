import type { Metadata } from "next";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Agendei?",
  description: "Sua agenda online",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-gray-100 text-gray-600 antialiased vsc-initialized">
        {children}
      </body>
    </html>
  );
}
