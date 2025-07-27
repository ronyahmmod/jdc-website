"use client";

import { useEffect, useState } from "react";
import { client } from "@/lib/sanity";
import { groq } from "next-sanity";

interface Headline {
  text: string;
  link?: string;
  newTab?: boolean;
  icon?: string;
}

export default function Marquee() {
  // State to store fetched notices
  const [headlines, setHeadlines] = useState<Headline[]>([]);

  // Fetch notices with important==true on component mount
  useEffect(() => {
    async function fetchImportantNotices() {
      const query = groq`
        *[_type == "notice" && important == true && published==true] | order(publishedAt desc) {
          title,
          slug
        }
      `;
      const notices = await client.fetch(query);
      // Map notices to Headline interface
      const mappedHeadlines: Headline[] = notices.map(
        (notice: { title: string; slug: { current: string } }) => ({
          text: notice.title,
          link: `/notices/${notice.slug.current}`,
          newTab: false,
          icon: "📢", // Default icon for notices
        })
      );
      setHeadlines(mappedHeadlines);
    }
    fetchImportantNotices();
  }, []);

  // Return null if no headlines are available
  if (!headlines?.length) return null;

  return (
    // Main container with fade-in animation, shadow, and responsive font size
    <div className="flex items-center bg-blue-50 border-b border-blue-200 text-sm md:text-base text-blue-900 py-3 px-4 overflow-hidden animate-fade-in">
      {/* Label for important news with icon, larger font on desktop */}
      <div className="min-w-[150px] font-semibold text-red-600 flex items-center gap-2 text-sm md:text-base">
        🔔 Important News:
      </div>

      {/* Marquee wrapper for scrolling content */}
      <div className="relative flex-1 overflow-hidden">
        <div className="marquee-wrapper group">
          <div className="marquee-content">
            {headlines.map((item, i) => {
              const content = (
                <>
                  {item.icon && <span className="mr-2">{item.icon}</span>}
                  <span className="font-medium">{item.text}</span>
                </>
              );

              return item.link ? (
                // Link with hover scale effect and new tab support
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
                // Non-link headline with consistent spacing and responsive font
                <span
                  key={i}
                  className="inline-block mx-6 font-medium text-sm md:text-base"
                >
                  {content}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tailwind-compatible CSS for marquee animation */}
      <style>{`
        .marquee-wrapper {
          overflow: hidden;
          position: relative;
        }
        .group:hover .marquee-content {
          animation-play-state: paused;
        }
        .marquee-content {
          display: inline-block;
          white-space: nowrap;
          animation: marquee 50s ease-in-out infinite;
        }
        @keyframes marquee {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-in;
        }
        @keyframes fadeIn {
          0% {
            opacity: 0;
            transform: translateY(-10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
