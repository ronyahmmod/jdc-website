"use client";

import { useEffect, useState } from "react";
import { FaCalendarAlt } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import { client } from "@/lib/sanity";
import { Notice } from "@/app/types/Notice";

export default function LatestNewsPanel() {
  const [news, setNews] = useState<Notice[]>([]);
  const [page, setPage] = useState(0);
  const perPage = 3;

  useEffect(() => {
    const fetchNews = async () => {
      const query = `*[_type == "notice" && published == true && archived == false && category == "news"] | order(publishedAt desc)[0...9] {
        title,
        slug,
        publishedAt,
        attachments[0]{asset->{url, originalFilename, mimeType}},
      }`;

      const result = await client.fetch(query);
      setNews(result);
    };

    fetchNews();
  }, []);

  const paginatedNews = news.slice(page * perPage, (page + 1) * perPage);

  return (
    <section className="py-12 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-900">
          📌 Latest News
        </h2>

        <div className="flex justify-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {paginatedNews.map((item, i) => (
              <div
                key={i}
                className="bg-white shadow-md rounded-lg overflow-hidden border"
              >
                {item.attachments?.asset?.url &&
                item.attachments.asset.mimeType?.startsWith("image") ? (
                  <div className="w-full h-40 bg-gray-100 relative">
                    <Image
                      src={item.attachments.asset.url}
                      alt={item.title}
                      fill
                      className="object-cover rounded-t-md"
                    />
                  </div>
                ) : (
                  <div className="w-full h-40 bg-gray-100 flex items-center justify-center text-gray-500 italic">
                    No Preview
                  </div>
                )}

                <div className="p-4">
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <FaCalendarAlt className="mr-2 text-blue-600" />
                    {new Date(item.publishedAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </div>
                  <h3 className="font-semibold text-lg mb-2 text-gray-800">
                    {item.title}
                  </h3>
                  <Link
                    href={`/notices/${item.slug.current}`}
                    className="mt-2 inline-block text-sm text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded"
                  >
                    Read More
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
            disabled={page === 0}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            ⬅️ Prev
          </button>
          <button
            onClick={() =>
              setPage((prev) =>
                (prev + 1) * perPage < news.length ? prev + 1 : prev
              )
            }
            disabled={(page + 1) * perPage >= news.length}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Next ➡️
          </button>
        </div>
      </div>
    </section>
  );
}
