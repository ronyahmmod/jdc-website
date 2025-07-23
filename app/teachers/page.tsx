import { client } from "@/lib/sanity";

interface Teacher {
  _id: string;
  name: string;
  designation: string;
  subject: string;
  phone: string;
}

export default async function TeachersPage() {
  const teachers: Teacher[] = await client.fetch(`*[_type == "teacher"]`);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">শিক্ষকগণের তথ্য</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {teachers.map((teacher) => (
          <div key={teacher._id} className="p-4 border rounded shadow">
            <h2 className="font-semibold text-lg">{teacher.name}</h2>
            <p>{teacher.designation}</p>
            <p>{teacher.subject}</p>
            <p>{teacher.phone}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
