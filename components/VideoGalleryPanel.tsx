"use client";

import { useEffect, useState } from "react";
import { client } from "@/lib/sanity";
import { Video } from "@/app/types/Video";

export default function VideoGalleryPanel() {
  const [videos, setVideos] = useState<Video[]>([]);

  useEffect(() => {
    const fetchVideos = async () => {
      const query = `*[_type == "video"] | order(publishedAt desc)[0...3] {
        _id,
        title,
        youtubeId,
        publishedAt
      }`;
      const result = await client.fetch(query);
      setVideos(result);
    };

    fetchVideos();
  }, []);

  return (
    <section className="bg-gradient-to-r from-indigo-50 to-purple-100 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-center mb-10 text-indigo-800">
          🎥 Latest Videos
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {videos.map((video) => (
            <div
              key={video._id}
              className="bg-white rounded-lg shadow overflow-hidden"
            >
              <div className="aspect-w-16 aspect-h-9">
                <iframe
                  src={`https://www.youtube.com/embed/${video.youtubeId}`}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </div>
              <div className="p-4 text-center font-medium text-gray-700">
                {video.title}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
