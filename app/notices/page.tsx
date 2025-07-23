"use client";

import { useEffect, useState, useMemo } from "react";
import { client } from "@/lib/sanity";
import { groq } from "next-sanity";
import { format } from "date-fns";
import Link from "next/link";

const categories = [
  { title: "📋 All", slug: "all" },
  { title: "📘 Exam", slug: "exam" },
  { title: "🎓 Admission", slug: "admission" },
  { title: "📰 News", slug: "general" },
  { title: "🎉 Events", slug: "event" },
];

export default function NoticeMainPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [notices, setNotices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 10;

  useEffect(() => {
    async function fetchNotices() {
      const query = groq`
        *[_type == "notice" && published == true && !archived]
        | order(publishedAt desc) {
          _id,
          title,
          slug,
          category,
          publishedAt,
          attachments[] {
            _key,
            "url": asset->url,
            "originalFilename": asset->originalFilename
          }
        }
      `;
      const result = await client.fetch(query);
      setNotices(result);
      setPage(1);
    }

    fetchNotices();
  }, []);

  const filtered = useMemo(() => {
    return notices
      .filter((n) =>
        selectedCategory === "all" ? true : n.category === selectedCategory
      )
      .filter((n) => n.title.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [searchTerm, notices, selectedCategory]);

  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(filtered.length / perPage);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6 text-center text-indigo-700">
        📢 All Notices
      </h1>

      {/* Tabs */}
      <div className="flex flex-wrap justify-center gap-3 mb-6">
        {categories.map((cat) => (
          <button
            key={cat.slug}
            onClick={() => setSelectedCategory(cat.slug)}
            className={`px-4 py-2 rounded-full border ${
              selectedCategory === cat.slug
                ? "bg-indigo-600 text-white"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
            } transition`}
          >
            {cat.title}
          </button>
        ))}
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="🔍 Search title..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setPage(1);
        }}
        className="w-full border px-3 py-2 rounded mb-4"
      />

      {/* Table */}
      <div className="bg-white shadow rounded-lg overflow-x-auto">
        <table className="w-full table-auto text-sm text-left">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="py-2 px-4">Title</th>
              <th className="py-2 px-4">Published</th>
              <th className="py-2 px-4">Files</th>
              <th className="py-2 px-4">View</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((notice) => (
              <tr key={notice._id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{notice.title}</td>
                <td className="px-4 py-2">
                  {format(new Date(notice.publishedAt), "dd MMM yyyy")}
                </td>
                <td className="px-4 py-2">
                  {notice.attachments?.length > 0 ? (
                    <ul>
                      {notice.attachments.map((file) => (
                        <li key={file._key}>
                          <a
                            href={file.url}
                            download
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-600 hover:underline"
                          >
                            ⬇ {file.originalFilename}
                          </a>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="px-4 py-2">
                  <Link
                    href={`/notices/${notice._id}--${notice.slug?.current || "notice"}`}
                    className="text-indigo-600 hover:underline"
                  >
                    🔗 View
                  </Link>
                </td>
              </tr>
            ))}

            {paginated.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center text-gray-500 py-4">
                  No notices found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <p className="text-sm text-gray-500">
          Showing {(page - 1) * perPage + 1} -{" "}
          {Math.min(page * perPage, filtered.length)} of {filtered.length}
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            ⬅️ Prev
          </button>
          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Next ➡️
          </button>
        </div>
      </div>
    </div>
  );
}
