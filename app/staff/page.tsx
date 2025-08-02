"use client";

import { client } from "@/lib/sanity";
import { groq } from "next-sanity";
import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Staff {
  _id: string;
  name: string;
  designation: string;
  mobileNumber: string;
  email: string;
  joiningDate: string;
  photoUrl?: string;
}

export default function StaffsPage() {
  const [staffs, setStaffs] = useState<Staff[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const staffsPerPage = 15;

  useEffect(() => {
    const fetchData = async () => {
      const query = groq`
        *[_type == "staff"] | order(weight asc) {
          _id,
          name,
          designation,
          mobileNumber,
          email,
          joiningDate,
          "photoUrl": photo.asset->url
        }
      `;
      const data = await client.fetch(query);
      setStaffs(data);
    };

    fetchData();
  }, []);

  const indexOfLast = currentPage * staffsPerPage;
  const indexOfFirst = indexOfLast - staffsPerPage;
  const currentStaffs = staffs.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(staffs.length / staffsPerPage);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6 print:hidden">
        <h1 className="text-2xl font-bold text-accent-600">
          👷 Staff Information
        </h1>
        <button
          onClick={handlePrint}
          className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 transition cursor-pointer"
        >
          🖨 Print
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-primary-600 rounded shadow">
          <thead className="bg-accent-400 text-left text-accent-50">
            <tr>
              <th className="px-4 py-3 border border-accent-400">Image</th>
              <th className="px-4 py-3 border border-accent-400">
                Name & Email
              </th>
              <th className="px-4 py-3 border border-accent-400">
                Designation
              </th>
              <th className="px-4 py-3 border border-accent-400">
                Joining Date
              </th>
              <th className="px-4 py-3 border border-accent-400">Mobile</th>
              <th className="px-4 py-3 border border-accent-400 hidden print:table-cell">
                Signature
              </th>
              <th className="px-4 py-3 border border-accent-400 print:hidden">
                Details
              </th>
            </tr>
          </thead>
          <tbody>
            {currentStaffs.map((staff, index) => (
              <tr
                key={staff._id}
                className={`${index % 2 === 0 ? "bg-neutral-50" : "bg-accent-100"} text-gray-800`}
              >
                <td className="px-4 py-3 border border-accent-400">
                  {staff.photoUrl ? (
                    <div className="w-16 h-16 rounded-full overflow-hidden border border-accent-400">
                      <Image
                        src={staff.photoUrl}
                        alt={staff.name}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-500 border border-accent-400">
                      No Photo
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 border border-accent-400">
                  {staff.name} <br />
                  <span className="text-sm text-gray-600">{staff.email}</span>
                </td>
                <td className="px-4 py-3 border border-accent-400">
                  {staff.designation}
                </td>
                <td className="px-4 py-3 border border-accent-400">
                  {staff.joiningDate}
                </td>
                <td className="px-4 py-3 border border-accent-400">
                  {staff.mobileNumber}
                </td>
                <td className="px-4 py-3 border border-accent-400 hidden print:table-cell text-center">
                  ___________________
                </td>
                <td className="px-4 py-3 border border-accent-400 print:hidden">
                  <Link
                    href={`/profiles/${staff._id}`}
                    className="inline-block bg-accent-500 text-white px-3 py-1 rounded hover:bg-accent-600 transition"
                  >
                    View Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex justify-center space-x-2 print:hidden">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 cursor-pointer bg-accent-600 text-white rounded disabled:opacity-50"
        >
          Prev
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 rounded ${
              currentPage === i + 1
                ? "bg-accent-500 text-white"
                : "bg-accent-200 text-accent-600"
            }`}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 cursor-pointer bg-accent-600 text-white rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
