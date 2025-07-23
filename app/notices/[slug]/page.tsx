// app/notices/[slug]/page.tsx
import { client } from "@/lib/sanity";
import { notFound } from "next/navigation";
import { groq } from "next-sanity";
import { format } from "date-fns";
import Head from "next/head";
import { Attachment } from "@/app/types/Notice";

export default async function NoticeDetails({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;

  const query = groq`
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

  const notice = await client.fetch(query, { slug });

  if (!notice) return notFound();

  return (
    <>
      <Head>
        <title>{notice.title} | Notice</title>
        <meta name="description" content={notice.summary?.slice(0, 150)} />
      </Head>

      <main className="max-w-3xl mx-auto py-10 px-4">
        <h1 className="text-2xl font-bold text-indigo-800 mb-2">
          {notice.title}
        </h1>
        <p className="text-sm text-gray-500 mb-4">
          প্রকাশিত: {format(new Date(notice.publishedAt), "dd MMM yyyy")}
        </p>

        {notice.summary && (
          <p className="text-gray-800 mb-6 whitespace-pre-line">
            {notice.summary}
          </p>
        )}

        {notice.attachments?.length > 0 && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2">📎 সংযুক্তি</h2>
            <ul className="space-y-2">
              {notice.attachments.map((file: Attachment) => (
                <li
                  key={file.asset._id}
                  className="flex items-center space-x-2"
                >
                  <a
                    href={file.asset.url}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:underline"
                  >
                    ⬇️ {file.asset.originalFilename}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </>
  );
}
