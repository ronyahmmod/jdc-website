"use client";

import { useState } from "react";
import Image from "next/image";
import { FaCalendarAlt } from "react-icons/fa";

// ✅ Dummy event data (you can replace later with Sanity or API)
const events = [
  {
    id: 1,
    title: "Freshers’ Reception Ceremony",
    date: "20 August 2025",
    image: "/event1.jpg",
  },
  {
    id: 2,
    title: "National Mourning Day Program",
    date: "15 August 2025",
    image: "/event2.jpg",
  },
  {
    id: 3,
    title: "Career Counseling Workshop",
    date: "5 August 2025",
    image: "/event3.jpg",
  },
  {
    id: 4,
    title: "Independence Day Parade",
    date: "26 March 2025",
    image: "/event4.jpg",
  },
  {
    id: 5,
    title: "Annual Science Fair",
    date: "10 September 2025",
    image: "/event5.jpg",
  },
  {
    id: 6,
    title: "Inter-College Debate Competition",
    date: "1 October 2025",
    image: "/event6.jpg",
  },
];

export default function UpcomingEventsPanel() {
  const [page, setPage] = useState(0);
  const perPage = 3;

  const handleNext = () => {
    if ((page + 1) * perPage < events.length) setPage(page + 1);
  };
  const handlePrev = () => {
    if (page > 0) setPage(page - 1);
  };

  const paginatedEvents = events.slice(page * perPage, (page + 1) * perPage);

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6 text-center text-green-800">
          🎉 Upcoming Events
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {paginatedEvents.map((event) => (
            <div
              key={event.id}
              className="bg-white shadow-md rounded-lg overflow-hidden border"
            >
              <Image
                height={40}
                width={40}
                src={event.image}
                alt={event.title}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <FaCalendarAlt className="mr-2 text-green-600" />
                  {event.date}
                </div>
                <h3 className="font-semibold text-lg mb-2 text-gray-800">
                  {event.title}
                </h3>
                <button className="mt-2 inline-block text-sm text-white bg-green-600 hover:bg-green-700 px-3 py-1 rounded">
                  View Details
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
            disabled={(page + 1) * perPage >= events.length}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Next ➡️
          </button>
        </div>
      </div>
    </section>
  );
}
