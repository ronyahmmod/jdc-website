import Header from "@/components/Header";
import "./globals.css";
import type { Metadata } from "next";
import Footer from "@/components/Footer";
import MarqueeComponent from "@/components/MarqueeComponent";
import BackToTopButton from "@/components/BackToTopButton";
export const metadata: Metadata = {
  title: "Jibannagar College",
  description: "Official website of Jibannagar College",
  icons: {
    icon: "/favicon.ico",
  },
  other: {
    monetag: "c391c1b391e4ab506a4227e5a0316496",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn">
      <body className="bg-gray-50 text-gray-900">
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1390370690959792"
          crossOrigin="anonymous"
        ></script>
        <Header />
        <MarqueeComponent />
        <main className="max-w-5xl mx-auto p-4">{children}</main>
        <Footer />
        <BackToTopButton />
      </body>
    </html>
  );
}
