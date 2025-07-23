"use client";

import { useState } from "react";
import { FaCalendarAlt } from "react-icons/fa";

// ✅ Fake data for now
const news = [
  {
    id: 1,
    title: "Admission Notice 2025",
    date: "15 July 2025",
    image: "/news1.jpg",
  },
  {
    id: 2,
    title: "College Week Cultural Program",
    date: "12 July 2025",
    image: "/news2.jpg",
  },
  {
    id: 3,
    title: "Library Renovation Completed",
    date: "10 July 2025",
    image: "/news3.jpg",
  },
  {
    id: 4,
    title: "New Courses Introduced",
    date: "08 July 2025",
    image: "/news4.jpg",
  },
  {
    id: 5,
    title: "Annual Sports Event",
    date: "05 July 2025",
    image: "/news5.jpg",
  },
  {
    id: 6,
    title: "Results Published (2025)",
    date: "01 July 2025",
    image: "/news6.jpg",
  },
  {
    id: 7,
    title: "Tree Plantation Program",
    date: "28 June 2025",
    image: "/news7.jpg",
  },
  {
    id: 8,
    title: "Seminar on Career Planning",
    date: "25 June 2025",
    image: "/news8.jpg",
  },
  {
    id: 9,
    title: "Students' Blood Donation Camp",
    date: "22 June 2025",
    image: "/news9.jpg",
  },
];

export default function LatestNewsPanel() {
  const [page, setPage] = useState(0);
  const perPage = 3;

  const handleNext = () => {
    if ((page + 1) * perPage < news.length) setPage(page + 1);
  };
  const handlePrev = () => {
    if (page > 0) setPage(page - 1);
  };

  const paginatedNews = news.slice(page * perPage, (page + 1) * perPage);

  return (
    <section className="py-12 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-900">
          📌 Latest News
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {paginatedNews.map((item) => (
            <div
              key={item.id}
              className="bg-white shadow-md rounded-lg overflow-hidden border"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <FaCalendarAlt className="mr-2 text-blue-600" />
                  {item.date}
                </div>
                <h3 className="font-semibold text-lg mb-2 text-gray-800">
                  {item.title}
                </h3>
                <button className="mt-2 inline-block text-sm text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded">
                  Read More
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Button */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={handlePrev}
            disabled={page === 0}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            ⬅️ Prev
          </button>
          <button
            onClick={handleNext}
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
