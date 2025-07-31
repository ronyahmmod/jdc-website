"use client";

import { useEffect, useState } from "react";
import { client } from "@/lib/sanity";
import { groq } from "next-sanity";
import Marquee from "react-fast-marquee"; // Use the default import

interface Headline {
  text: string;
  link?: string;
  newTab?: boolean;
  icon?: string;
}

export default function MarqueeComponent() {
  const [headlines, setHeadlines] = useState<Headline[]>([]);

  useEffect(() => {
    async function fetchImportantNotices() {
      const query = groq`
        *[_type == "notice" && important == true && published==true] | order(publishedAt desc) {
          title,
          slug
        }
      `;
      const notices = await client.fetch(query);
      const mappedHeadlines: Headline[] = notices.map(
        (notice: { title: string; slug: { current: string } }) => ({
          text: notice.title,
          link: `/notices/${notice.slug.current}`,
          newTab: false,
          icon: "📢",
        })
      );
      setHeadlines(mappedHeadlines);
    }
    fetchImportantNotices();
  }, []);

  if (!headlines?.length) return null;

  return (
    <div className="flex items-center bg-blue-50 border-b border-blue-200 text-sm md:text-base text-blue-900 py-3 px-4 overflow-hidden animate-fade-in">
      <div className="min-w-[150px] font-semibold text-primary-600 flex items-center gap-2 text-sm md:text-base">
        <span role="img" aria-label="Important">
          🔔
        </span>{" "}
        Important News:
      </div>
      <div className="flex-1">
        <Marquee pauseOnHover gradient={false} speed={70}>
          {headlines.map((item, i) => {
            const content = (
              <>
                {item.icon && <span className="mr-2">{item.icon}</span>}
                <span className="font-medium">{item.text}</span>
              </>
            );
            return item.link ? (
              <a
                key={i}
                href={item.link}
                target={item.newTab ? "_blank" : "_self"}
                rel={item.newTab ? "noopener noreferrer" : undefined}
                className="inline-block mx-6 hover:underline hover:scale-105 transition-transform duration-200 text-sm md:text-base"
              >
                {content}
              </a>
            ) : (
              <span
                key={i}
                className="inline-block mx-6 font-medium text-sm md:text-base"
              >
                {content}
              </span>
            );
          })}
        </Marquee>
      </div>
    </div>
  );
}
