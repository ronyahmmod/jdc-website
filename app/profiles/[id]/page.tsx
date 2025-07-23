import { client } from "@/lib/sanity";
import { groq } from "next-sanity";
import Image from "next/image";
import { PortableText } from "@portabletext/react";

type Props = {
  params: {
    id: string;
  };
};

export async function generateStaticParams() {
  const teachers = await client.fetch(groq`*[_type == "teacher"]{ _id }`);
  return teachers.map(({ _id }: { _id: string }) => ({ id: _id }));
}

export default async function TeacherProfile({ params }: Props) {
  const query = groq`
    *[_type == "teacher" && _id == $id][0]{
      name,
      designation,
      subject,
      mobileNumber,
      joiningDate,
      photo{
        asset->{
          url
        }
      },
      bio
    }
  `;

  const data = await client.fetch(query, { id: params.id });

  if (!data) return <div>Not Found</div>;

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <div className="flex flex-col md:flex-row gap-6 items-start">
        <div className="w-full md:w-1/3">
          <Image
            src={data.photo?.asset?.url || "/placeholder.jpg"}
            alt={data.name}
            width={300}
            height={300}
            className="rounded-xl object-cover w-full h-auto"
          />
        </div>
        <div className="w-full md:w-2/3 space-y-2">
          <h1 className="text-2xl font-bold">{data.name}</h1>
          <p className="text-gray-600">{data.designation}</p>
          <p className="text-gray-500">{data.subject}</p>
          <p className="text-gray-500">যোগদানের তারিখ: {data.joiningDate}</p>
          <p className="text-gray-500">মোবাইল: {data.mobileNumber}</p>
        </div>
      </div>
      <div className="mt-8 prose max-w-none">
        <PortableText value={data.bio} />
      </div>
    </div>
  );
}
