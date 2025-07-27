import { client } from "@/lib/sanity";
import { groq } from "next-sanity";
import Image from "next/image";
import { Contact } from "@/app/types/Contact";

export const dynamic = "force-dynamic"; // SSR always

const query = groq`
  *[_type == "contact" && isActive == true][0...3]{
    _id,
    name,
    designation,
    phone,
    email,
    "image": image.asset->url
  }
`;

export default async function ContactPage() {
  const contacts: Contact[] = await client.fetch(query);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6 text-center text-blue-700">
        যোগাযোগ করুন
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {contacts.map((person) => (
          <div
            key={person._id}
            className="bg-white shadow rounded-lg p-4 flex flex-col items-center text-center hover:shadow-md transition"
          >
            <div className="w-32 h-32 rounded-full overflow-hidden border mb-4">
              <Image
                src={person.image}
                alt={person.name}
                width={128}
                height={128}
                className="object-cover w-full h-full object-top"
              />
            </div>
            <h2 className="text-lg font-semibold">{person.name}</h2>
            <p className="text-sm text-gray-500">{person.designation}</p>
            <p className="mt-2 text-sm text-gray-700">📞 {person.phone}</p>
            <p className="text-sm text-gray-700">✉️ {person.email}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
