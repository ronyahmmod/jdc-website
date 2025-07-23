import Header from "@/components/Header";
import "./globals.css";
import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Marquee from "@/components/Marquee";
import BackToTopButton from "@/components/BackToTopButton";
export const metadata: Metadata = {
  title: "Jibannagar College",
  description: "Official website of Jibannagar College",
};
import { client } from "@/lib/sanity";
import { groq } from "next-sanity";

const importantQuery = groq`
  *[_type == "notice" && published == true && important == true && archived != true]
  | order(publishedAt desc)[0...5] {
    _id, title, slug, publishedAt, category
  }
`;

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const notices = await client.fetch(importantQuery);

  const headlines = notices.map((item: unknown) => ({
    text: item.title,
    link: `/notice/${item.slug.current}`,
    newTab: false,
    icon: "📢",
  }));
  return (
    <html lang="bn">
      <body className="bg-gray-50 text-gray-900">
        <Header />
        <Marquee headlines={headlines} />
        <main className="max-w-5xl mx-auto p-4">{children}</main>
        <Footer />
        <BackToTopButton />
      </body>
    </html>
  );
}
