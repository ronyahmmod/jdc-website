const videos = [
  {
    id: "XxVg_s8xAms",
    title: "College Introductory Video",
  },
  {
    id: "L_jWHffIx5E",
    title: "Annual Cultural Program 2025",
  },
  {
    id: "dQw4w9WgXcQ",
    title: "Science Fair Highlights",
  },
];

export default function VideoGalleryPanel() {
  return (
    <section className="bg-gradient-to-r from-indigo-50 to-purple-100 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-center mb-10 text-indigo-800">
          🎥 Latest Videos
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {videos.map((video) => (
            <div
              key={video.id}
              className="bg-white rounded-lg shadow overflow-hidden"
            >
              <div className="aspect-w-16 aspect-h-9">
                <iframe
                  src={`https://www.youtube.com/embed/${video.id}`}
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
