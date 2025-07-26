"use client";

import { useEffect, useState } from "react";
import { GBMember, GoverningBody } from "../types/GoverningBody";
import { client } from "@/lib/sanity";
import { groq } from "next-sanity";
import Image from "next/image";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function GoverningBodyPanel() {
  const [committee, setCommittee] = useState<GoverningBody | null>(null);

  useEffect(() => {
    const query = groq`*[_type == "governingBody"] | order(approvalDate desc)[0] {
      approvalDate,
      termStart,
      termEnd,
      members[]{
        name,
        role,
        mobile,
        address,
        occupation,
        currentDuties,
        photo{asset->{url}}
      }
    }`;

    client.fetch(query).then((data) => {
      setCommittee(data);
    });
  }, []);

  const handleExportPDF = () => {
    const input = document.getElementById("gb-table");

    if (!input) return;

    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("landscape", "mm", "a4");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("governing-body.pdf");
    });
  };

  if (!committee)
    return (
      <p className="text-center py-10 text-gray-500">
        Loading committee data...
      </p>
    );

  const renderRow = (person: GBMember, position: string) => (
    <tr className="border-b" key={position}>
      <td className="p-2 text-sm text-center">
        {person.photo?.asset?.url ? (
          <Image
            src={person.photo.asset.url}
            alt={person.name}
            width={60}
            height={60}
            className="rounded-full mx-auto object-contain"
          />
        ) : (
          <div className="w-[60px] h-[60px] bg-gray-200 rounded-full mx-auto flex items-center justify-center text-gray-500">
            N/A
          </div>
        )}
      </td>
      <td className="p-2 text-sm">{person.name}</td>
      <td className="p-2 text-sm">{person.role}</td>
      <td className="p-2 text-sm">{person.occupation}</td>
      <td className="p-2 text-sm">{person.mobile}</td>
      <td className="p-2 text-sm">{person.address}</td>
    </tr>
  );

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-center text-green-800 mb-6">
          🏛️ Governing Body ({new Date(committee.approvalDate).getFullYear()} -{" "}
          {new Date(committee.termEnd).getFullYear()})
        </h2>

        <div className="flex justify-end mb-4">
          <button
            onClick={handleExportPDF}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 shadow-sm hidden"
          >
            ⬇️ Export as PDF
          </button>
        </div>

        <div
          id="gb-table"
          className="overflow-x-auto border rounded shadow bg-white p-4"
          style={{ color: "black", backgroundColor: "white" }}
        >
          <table className="min-w-full table-auto border-collapse">
            <thead className="bg-green-100 text-gray-800 text-sm">
              <tr>
                <th className="p-2 border">Photo</th>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Role</th>
                <th className="p-2 border">Occupation</th>
                <th className="p-2 border">Phone</th>
                <th className="p-2 border">Address</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {committee.members?.map((member, idx) =>
                renderRow(member, `Member ${idx + 1}`)
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
