import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "vietnamese"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin", "vietnamese"],
});

export const metadata: Metadata = {
  title: "Thiệp mời Lễ Tốt nghiệp - Đại học CNTT",
  description: "Trân trọng kính mời bạn đến dự Lễ Tốt nghiệp của mình tại Trường Đại học Công nghệ Thông tin - ĐHQG HCM.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="scroll-smooth">
      <body
        className={`${inter.variable} ${playfair.variable} antialiased bg-slate-50 text-slate-800 font-sans`}
      >
        {children}
      </body>
    </html>
  );
}
