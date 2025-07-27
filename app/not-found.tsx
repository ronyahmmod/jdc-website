import { client } from "@/lib/sanity";
import { groq } from "next-sanity";
import Image from "next/image";
import Link from "next/link";

export default async function NotFound() {
  const query = groq`
    *[_type == "institutionInfo"][0] {
      name,
      "logoUrl": logo.asset->url
    }
  `;

  const institute = await client.fetch(query);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 px-4">
      {institute?.logoUrl && (
        <Image
          src={institute.logoUrl}
          alt={`${institute?.name || "Institute"} Logo`}
          width={120}
          height={120}
          className="mb-6"
        />
      )}

      <h1 className="text-4xl font-bold text-gray-800 mb-2">
        404 - পৃষ্ঠা পাওয়া যায়নি
      </h1>
      <p className="text-gray-600 mb-6 text-center max-w-md">
        আপনি যে পৃষ্ঠাটি খুঁজছেন সেটি খুঁজে পাওয়া যায়নি বা হয়তো মুছে ফেলা
        হয়েছে।
      </p>

      <Link
        href="/"
        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
      >
        হোমপেইজে ফিরে যান
      </Link>
    </div>
  );
}
