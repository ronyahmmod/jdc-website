import { client } from "@/lib/sanity";
import { groq } from "next-sanity";
import Image from "next/image";

interface Teacher {
  _id: string;
  name: string;
  designation: string;
  subject: string;
  mobileNumber: string;
  photoUrl?: string;
}

export default async function TeachersPage() {
  const query = groq`
    *[_type == "teacher"] | order(weight asc) {
      _id,
      name,
      designation,
      subject,
      mobileNumber,
      "photoUrl": photo.asset->url
    }
  `;
  const teachers: Teacher[] = await client.fetch(query);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-center text-green-800">
        👨‍🏫 Teacher Information
      </h1>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-green-600 rounded shadow overflow-hidden">
          <thead className="bg-green-200 text-left text-green-900">
            <tr>
              <th className="px-4 py-3 border border-green-600">Image</th>
              <th className="px-4 py-3 border border-green-600">Name</th>
              <th className="px-4 py-3 border border-green-600">Designation</th>
              <th className="px-4 py-3 border border-green-600">Subject</th>
              <th className="px-4 py-3 border border-green-600">
                Mobile Number
              </th>
            </tr>
          </thead>
          <tbody>
            {teachers.map((teacher, index) => (
              <tr
                key={teacher._id}
                className={`${
                  index % 2 === 0 ? "bg-white" : "bg-green-50"
                } text-gray-800`}
              >
                <td className="px-4 py-3 border border-green-600">
                  {teacher.photoUrl ? (
                    <div className="w-16 h-16 rounded-full overflow-hidden border border-green-600">
                      <Image
                        src={teacher.photoUrl}
                        alt={teacher.name}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-500 border border-green-600">
                      No Photo
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 border border-green-600">
                  {teacher.name}
                </td>
                <td className="px-4 py-3 border border-green-600">
                  {teacher.designation}
                </td>
                <td className="px-4 py-3 border border-green-600">
                  {teacher.subject}
                </td>
                <td className="px-4 py-3 border border-green-600">
                  {teacher.mobileNumber}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
