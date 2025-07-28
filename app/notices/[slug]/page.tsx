import { client } from "@/lib/sanity";
import { notFound } from "next/navigation";
import { groq } from "next-sanity";
import { format } from "date-fns";
import Head from "next/head";
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

export default async function NoticeDetails({ params }: PageProps) {
  // Resolve the slug from params
  const { slug } = await params;

  // Query to fetch notice details with attachments
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

  // Query to fetch institution logo for fallback
  const logoQuery = groq`
    *[_type == "institutionInfo"] | order(_createdAt desc)[0]{
      logo
    }
  `;

  // Fetch notice and logo data from Sanity
  const notice = await client.fetch(noticeQuery, { slug });
  const institutionInfo = await client.fetch(logoQuery);

  // Return 404 if notice is not found
  if (!notice) return notFound();

  // Get primary media for preview (image or PDF)
  const primaryMedia =
    notice.attachments?.length > 0 ? getPrimaryMedia(notice.attachments) : null;
  // Construct page URL for sharing
  const pageUrl = `https://jibannagardegreecollege.com/notices/${slug}`; // Replace with your actual domain
  // Use primary media or fallback logo for social sharing
  const shareImage =
    primaryMedia?.file.asset.url || institutionInfo?.logo?.asset?.url || "";

  return (
    <>
      {/* Metadata for SEO and social sharing */}
      <Head>
        <title>{notice.title} | Notice</title>
        <meta name="description" content={notice.summary?.slice(0, 150)} />
        {/* Open Graph metadata for Facebook and others */}
        <meta property="og:title" content={notice.title} />
        <meta
          property="og:description"
          content={notice.summary?.slice(0, 150)}
        />
        <meta property="og:url" content={pageUrl} />
        {shareImage && <meta property="og:image" content={shareImage} />}
        <meta property="og:type" content="article" />
        {/* Twitter Card metadata */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={notice.title} />
        <meta
          name="twitter:description"
          content={notice.summary?.slice(0, 150)}
        />
        {shareImage && <meta name="twitter:image" content={shareImage} />}
      </Head>

      <main className="max-w-3xl mx-auto py-10 px-4">
        {/* Notice title */}
        <h1 className="text-2xl md:text-3xl font-bold text-indigo-800 mb-2">
          {notice.title}
        </h1>
        {/* Published date */}
        <p className="text-sm text-gray-500 mb-4">
          প্রকাশিত: {format(new Date(notice.publishedAt), "dd MMM yyyy")}
        </p>

        {/* Primary media preview */}
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
          // Fallback logo preview
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

        {/* Notice summary */}
        {notice.summary && (
          <p className="text-gray-800 mb-6 whitespace-pre-line">
            {notice.summary}
          </p>
        )}

        {/* Social sharing buttons */}
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

        {/* Attachments grid */}
        {notice.attachments?.length > 0 && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-4">📎 সংযুক্তি</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {notice.attachments.map((file: Attachment) => {
                // Determine file type for preview
                const fileType = getFileType(file.asset.originalFilename);

                return (
                  // Attachment card with preview and download button
                  <div
                    key={file.asset._id}
                    className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow"
                  >
                    {/* File preview based on type */}
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

                    {/* File name */}
                    <p className="text-sm text-gray-700 mb-3 truncate w-full">
                      {file.asset.originalFilename}
                    </p>

                    {/* Download button */}
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
    </>
  );
}
