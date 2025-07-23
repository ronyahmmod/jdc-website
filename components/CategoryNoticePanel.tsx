// components/CategoryNoticePanel.tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { client } from "@/lib/sanity";
import { groq } from "next-sanity";

const categories = [
  { title: "📘 Exam Notices", slug: "exam" },
  { title: "🎓 Admission", slug: "admission" },
  { title: "📰 Latest News", slug: "general" },
  { title: "📰 Events", slug: "event" },
];

type Notice = {
  _id: string;
  title: string;
  publishedAt: string;
};

export default function CategoryNoticePanel() {
  const [data, setData] = useState<Record<string, Notice[]>>({});

  useEffect(() => {
    async function fetchNotices() {
      const fetchedData: Record<string, Notice[]> = {};

      for (const cat of categories) {
        const query = groq`
          *[_type == "notice" && category == $category && published == true && !archived] 
            | order(publishedAt desc)[0...5] {
              _id,
              title,
              publishedAt
            }
        `;
        const result = await client.fetch(query, { category: cat.slug });
        fetchedData[cat.slug] = result;
      }

      setData(fetchedData);
    }

    fetchNotices();
  }, []);

  return (
    <section className="bg-gray-100 py-12 border-t border-gray-200">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-center mb-8 text-indigo-800">
          🗂️ Category-wise Notices
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.slug}
              className="bg-white shadow rounded-lg p-5 border-t-4 border-indigo-400"
            >
              <h3 className="text-xl font-semibold text-indigo-700 mb-4">
                {cat.title}
              </h3>

              <ul className="space-y-2 text-sm text-gray-700 min-h-[180px]">
                {data[cat.slug]?.length > 0 ? (
                  data[cat.slug].map((notice) => (
                    <li key={notice._id} className="border-b pb-1">
                      <div className="flex justify-between items-center">
                        <Link
                          href={`/notices/${notice._id}`}
                          className="text-indigo-700 hover:underline"
                        >
                          {notice.title}
                        </Link>
                        <span className="text-xs text-gray-500">
                          {new Date(notice.publishedAt).toLocaleDateString(
                            "en-GB"
                          )}
                        </span>
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="text-gray-400 italic">লোড হচ্ছে...</li>
                )}
              </ul>

              <div className="mt-4 text-right">
                <Link
                  href={`/notices/category/${cat.slug}`}
                  className="text-indigo-600 text-sm hover:underline"
                >
                  🔗 View All →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
