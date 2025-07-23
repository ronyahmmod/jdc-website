"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { client } from "@/lib/sanity"; // 🔁 Make sure this is your sanity client
import { groq } from "next-sanity";

const query = groq`
  *[_type == "teacher" && (designation == "Principal" || designation == "Vice Principal")]
  | order(weight asc) {
    _id,
    name,
    designation,
    "image": photo.asset->url,
    joiningDate,
    weight
  }
`;

export default function PrincipalPanel() {
  const [principals, setPrincipals] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    client.fetch(query).then(setPrincipals).catch(console.error);
  }, []);

  return (
    <div className="max-w-6xl mx-auto py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {principals.map((person) => (
          <div
            key={person._id}
            onClick={() => router.push(`/profiles/${person._id}`)}
            className="cursor-pointer bg-white shadow-md rounded-xl p-4 hover:shadow-xl transition duration-300 flex flex-col items-center text-center"
          >
            <div className="w-[200px] h-[200px] mx-auto overflow-hidden rounded-xl">
              <Image
                src={person.image}
                alt={person.name}
                width={200}
                height={200}
                className="object-cover w-full h-full"
              />
            </div>

            <h3 className="mt-4 text-lg font-semibold">{person.name}</h3>
            <p className="text-sm text-gray-500">{person.designation}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
