"use client";

import { client } from "@/lib/sanity";
import { groq } from "next-sanity";
import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Teacher {
  _id: string;
  name: string;
  designation: string;
  subject: string;
  mobileNumber: string;
  photoUrl?: string;
  joiningDate: string;
  email: string;
}

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const teachersPerPage = 15;

  useEffect(() => {
    const fetchData = async () => {
      const query = groq`
        *[_type == "teacher"] | order(weight asc) {
          _id,
          name,
          designation,
          subject,
          joiningDate,
          mobileNumber,
          email,
          "photoUrl": photo.asset->url
        }
      `;
      const data = await client.fetch(query);
      setTeachers(data);
    };

    fetchData();
  }, []);

  const indexOfLastTeacher = currentPage * teachersPerPage;
  const indexOfFirstTeacher = indexOfLastTeacher - teachersPerPage;
  const currentTeachers = teachers.slice(
    indexOfFirstTeacher,
    indexOfLastTeacher
  );
  const totalPages = Math.ceil(teachers.length / teachersPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6 print:hidden">
        <h1 className="text-2xl font-bold text-green-800">
          👨‍🏫 Teacher Information
        </h1>
        <button
          onClick={handlePrint}
          className="px-4 py-2 bg-green-700 text-white rounded shadow hover:bg-green-800 transition"
        >
          🖨 Print
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border text-sm border-green-600 rounded shadow overflow-hidden">
          <thead className="bg-green-200 text-left text-green-900">
            <tr>
              <th className="px-4 py-3 border text-center border-green-600">
                Image
              </th>
              <th className="px-4 py-3 text-center border border-green-600">
                Name and Email
              </th>
              <th className="px-4 text-center py-3 border border-green-600">
                Designation & Subject
              </th>
              <th className="px-4 text-center text-sm py-3 border border-green-600">
                Joining Date (YYYY-MM-DD)
              </th>
              <th className="px-4 py-3 border border-green-600">Mobile</th>
              <th className="px-4 py-3 border border-green-600 hidden print:table-cell">
                Signature
              </th>
              <th className="px-4 py-3 border border-green-600 print:hidden">
                Details
              </th>
            </tr>
          </thead>
          <tbody>
            {currentTeachers.map((teacher, index) => (
              <tr
                key={teacher._id}
                className={`${index % 2 === 0 ? "bg-white" : "bg-green-50"} text-gray-800`}
              >
                <td className="px-4 py-3 border border-green-600">
                  {teacher.photoUrl ? (
                    <div className="w-16 h-16 rounded-full overflow-hidden border border-green-600">
                      <Image
                        src={teacher.photoUrl}
                        alt={teacher.name}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-500 border border-green-600">
                      No Photo
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 border border-green-600">
                  {teacher.name}, <strong>{teacher.email}</strong>
                </td>
                <td className="px-4 py-3 border border-green-600">
                  {teacher.designation}, {teacher.subject}
                </td>

                <td className="px-4 py-3 text-sm border border-green-600">
                  {teacher.joiningDate}
                </td>
                <td className="px-4 py-3 border border-green-600">
                  {teacher.mobileNumber}
                </td>
                <td className="px-4 py-3 border border-green-600 hidden print:table-cell text-center">
                  ___________________
                </td>
                <td className="px-4 py-3 border border-green-600 print:hidden">
                  <Link
                    href={`/profiles/${teacher._id}`}
                    className="inline-block bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
                  >
                    View Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex justify-center items-center space-x-2 print:hidden">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-green-600 text-white rounded disabled:opacity-50"
        >
          Prev
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => handlePageChange(i + 1)}
            className={`px-3 py-1 rounded ${
              currentPage === i + 1
                ? "bg-green-800 text-white"
                : "bg-green-200 text-green-900"
            }`}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-green-600 text-white rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
