"use client";
import { useEffect, useState } from "react";
import { groq } from "next-sanity";
import { Notice } from "@/app/types/Notice";
import { client } from "@/lib/sanity";
import Link from "next/link";

const query = groq`*[_type=="notice" && published==true && !archived] | order(publishedAt desc)[0...20] {
    _id,
    title,
    slug
}`;

export default function NoticePanel() {
  const [notices, setNotices] = useState<Notice[]>([]);

  const fetchNotice = async () => {
    try {
      const result = await client.fetch(query);
      setNotices(result);
    } catch (error) {
      console.error("Error fetching notices:", error);
    }
  };

  useEffect(() => {
    fetchNotice();
  }, []);

  return (
    <div className="flex flex-col h-full p-4 bg-neutral-100 rounded-md shadow-md">
      <h2 className="text-xl font-bold text-accent-600 mb-3">Latest Notices</h2>

      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
        <ul className="flex flex-col space-y-3">
          {notices.length > 0 ? (
            notices.map((notice) => (
              <li
                key={notice._id}
                className="bg-white rounded-md shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <Link
                  href={`/notices/${notice.slug.current}`}
                  className="flex items-center p-3 text-primary-700 hover:text-blue-600 transition-colors duration-200"
                >
                  <span className="mr-2">•</span>
                  <span className="text-sm font-medium">{notice.title}</span>
                </Link>
              </li>
            ))
          ) : (
            <li className="text-gray-500 text-sm">No notices available</li>
          )}
        </ul>
      </div>

      <div className="mt-3">
        <Link
          href="/notices"
          className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-accent-500 rounded-md hover:bg-accent-600 transition-colors duration-200"
        >
          View All Notices
        </Link>
      </div>
    </div>
  );
}
