// app/notices/[slug]/page.tsx
import { client } from "@/lib/sanity";
import { notFound } from "next/navigation";
import { groq } from "next-sanity";
import { format } from "date-fns";
import Image from "next/image";
import { Attachment } from "@/app/types/Notice";

type PageProps = {
  params: Promise<{ slug: string }>;
};

// Function to determine file type from filename extension
const getFileType = (filename: string): "image" | "pdf" | "other" => {
  const extension = filename.split(".").pop()?.toLowerCase();
  const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "webp"];
  if (extension === "pdf") return "pdf";
  if (imageExtensions.includes(extension || "")) return "image";
  return "other";
};

// Function to get the first media file (image or PDF) for preview
const getPrimaryMedia = (attachments: Attachment[]) => {
  const image = attachments.find(
    (file) => getFileType(file.asset.originalFilename) === "image"
  );
  if (image) return { type: "image", file: image };
  const pdf = attachments.find(
    (file) => getFileType(file.asset.originalFilename) === "pdf"
  );
  if (pdf) return { type: "pdf", file: pdf };
  return null;
};

// Generate dynamic metadata for SEO and social sharing
export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;

  const noticeQuery = groq`
    *[_type == "notice" && slug.current == $slug][0]{
      title,
      summary,
      attachments[]{
        asset->{
          url,
          originalFilename
        }
      }
    }
  `;

  const logoQuery = groq`
    *[_type == "institutionInfo"] | order(_createdAt desc)[0]{
      logo
    }
  `;

  const [notice, institutionInfo] = await Promise.all([
    client.fetch(noticeQuery, { slug }),
    client.fetch(logoQuery),
  ]);

  if (!notice) return {};

  const primaryMedia =
    notice.attachments?.length > 0 ? getPrimaryMedia(notice.attachments) : null;
  const pageUrl = `https://jibannagardegreecollege.com/notices/${slug}`;
  const shareImage =
    primaryMedia?.file.asset.url ||
    institutionInfo?.logo?.asset?.url ||
    "https://jibannagardegreecollege.com/default-share-image.jpg"; // Fallback image

  // Log metadata for debugging
  console.log({
    title: notice.title,
    description: notice.summary?.slice(0, 150),
    pageUrl,
    shareImage,
  });

  return {
    title: `${notice.title} | Notice`,
    description: notice.summary?.slice(0, 150),
    openGraph: {
      title: notice.title,
      description: notice.summary?.slice(0, 150),
      url: pageUrl,
      siteName: "Jibannagar Degree College",
      images: shareImage
        ? [
            {
              url: shareImage,
              width: 1200,
              height: 630,
            },
          ]
        : [],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: notice.title,
      description: notice.summary?.slice(0, 150),
      images: shareImage ? [shareImage] : [],
    },
  };
}

// Generate static params for dynamic routes
export async function generateStaticParams() {
  const slugs = await client.fetch(groq`*[_type == "notice"]{slug}`);
  return slugs.map((item: { slug: { current: string } }) => ({
    slug: item.slug.current,
  }));
}

export default async function NoticeDetails({ params }: PageProps) {
  const { slug } = await params;

  const noticeQuery = groq`
    *[_type == "notice" && slug.current == $slug][0]{
      _id,
      title,
      slug,
      summary,
      publishedAt,
      attachments[]{
        asset->{
          _id,
          url,
          originalFilename
        }
      }
    }
  `;

  const logoQuery = groq`
    *[_type == "institutionInfo"] | order(_createdAt desc)[0]{
      logo
    }
  `;

  const [notice, institutionInfo] = await Promise.all([
    client.fetch(noticeQuery, { slug }),
    client.fetch(logoQuery),
  ]);

  if (!notice) return notFound();

  const primaryMedia =
    notice.attachments?.length > 0 ? getPrimaryMedia(notice.attachments) : null;
  const pageUrl = `https://jibannagardegreecollege.com/notices/${slug}`;

  return (
    <main className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-2xl md:text-3xl font-bold text-indigo-800 mb-2">
        {notice.title}
      </h1>
      <p className="text-sm text-gray-500 mb-4">
        প্রকাশিত: {format(new Date(notice.publishedAt), "dd MMM yyyy")}
      </p>

      {primaryMedia ? (
        <div className="mb-6">
          {primaryMedia.type === "image" ? (
            <div className="relative w-full h-64">
              <Image
                src={primaryMedia.file.asset.url}
                alt={primaryMedia.file.asset.originalFilename}
                fill
                className="object-contain rounded-md"
                sizes="(max-width: 768px) 100vw, 768px"
              />
            </div>
          ) : (
            <div className="w-full h-64">
              <iframe
                src={`${primaryMedia.file.asset.url}#toolbar=0`}
                className="w-full h-full rounded-md"
                title={primaryMedia.file.asset.originalFilename}
              />
            </div>
          )}
        </div>
      ) : (
        institutionInfo?.logo && (
          <div className="mb-6 relative w-32 h-32 mx-auto">
            <Image
              src={institutionInfo.logo.asset.url}
              alt="Institution Logo"
              fill
              className="object-contain rounded-md"
              sizes="128px"
            />
          </div>
        )
      )}

      {notice.summary && (
        <p className="text-gray-800 mb-6 whitespace-pre-line">
          {notice.summary}
        </p>
      )}

      <div className="mb-6 flex gap-4">
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Facebook
        </a>
        <a
          href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(notice.title)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-sky-500 text-white px-4 py-2 rounded-md hover:bg-sky-600 transition-colors"
        >
          Twitter
        </a>
        <a
          href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`${notice.title} ${pageUrl}`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
        >
          WhatsApp
        </a>
      </div>

      {notice.attachments?.length > 0 && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-4">📎 সংযুক্তি</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {notice.attachments.map((file: Attachment) => {
              const fileType = getFileType(file.asset.originalFilename);
              return (
                <div
                  key={file.asset._id}
                  className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow"
                >
                  {fileType === "image" ? (
                    <div className="relative w-full h-32 mb-2">
                      <Image
                        src={file.asset.url}
                        alt={file.asset.originalFilename}
                        fill
                        className="object-contain rounded-md"
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                      />
                    </div>
                  ) : fileType === "pdf" ? (
                    <div className="w-full h-32 mb-2">
                      <iframe
                        src={`${file.asset.url}#toolbar=0`}
                        className="w-full h-full rounded-md"
                        title={file.asset.originalFilename}
                      />
                    </div>
                  ) : (
                    <span className="text-2xl mb-2">📄</span>
                  )}
                  <p className="text-sm text-gray-700 mb-3 truncate w-full">
                    {file.asset.originalFilename}
                  </p>
                  <a
                    href={file.asset.url}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                  >
                    ⬇️ ডাউনলোড
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </main>
  );
}
