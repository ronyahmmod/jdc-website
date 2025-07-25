"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FaCalendarAlt } from "react-icons/fa";
import { client } from "@/lib/sanity";
import { Notice } from "@/app/types/Notice";
import { groq } from "next-sanity";

export default function UpcomingEventsPanel() {
  const [events, setEvents] = useState<Notice[]>([]);
  const [page, setPage] = useState(0);
  const perPage = 3;
  const router = useRouter();
  console.log("Upcomming events");

  useEffect(() => {
    const fetchEvents = async () => {
      const query = groq`
        *[_type == "notice" && published == true && archived==false && category=='event' && defined(eventDate) && eventDate >= now()] | order(eventDate asc)[0...9] {
          _id,
          title,
          slug,
          category,
          publishedAt,
          eventDate,
          attachments[] {
            _key,
            "url": asset->url,
            "originalFilename": asset->originalFilename
          }
        }
      `;

      const result = await client.fetch(query);
      console.log(result);
      setEvents(result);
    };

    fetchEvents();
  }, []);
  console.log(events);
  const paginatedEvents = events.slice(page * perPage, (page + 1) * perPage);
  console.log(events);
  const handleNext = () => {
    if ((page + 1) * perPage < events.length) setPage(page + 1);
  };
  const handlePrev = () => {
    if (page > 0) setPage(page - 1);
  };

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6 text-center text-green-800">
          🎉 Upcoming Events
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {paginatedEvents.map((event: Notice, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-lg overflow-hidden border"
            >
              {event.attachment?.asset?.url &&
              event.attachment.asset.mimeType?.startsWith("image") ? (
                <Image
                  height={500}
                  width={800}
                  src={event.attachment.asset.url}
                  alt={event.title}
                  className="w-full h-40 object-cover"
                />
              ) : (
                <div className="w-full h-40 bg-gray-100 flex items-center justify-center text-gray-500 italic">
                  No Preview
                </div>
              )}

              <div className="p-4">
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <FaCalendarAlt className="mr-2 text-green-600" />
                  {new Date(event.eventDate).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </div>
                <h3 className="font-semibold text-lg mb-2 text-gray-800">
                  {event.title}
                </h3>
                <button
                  onClick={() => router.push(`/notices/${event.slug.current}`)}
                  className="mt-2 inline-block text-sm text-white bg-green-600 hover:bg-green-700 px-3 py-1 rounded"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
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
