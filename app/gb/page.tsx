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

  const renderRow = (person: GBMember, position: number) => (
    <tr
      className={`border-b ${position % 2 === 0 ? "bg-neutral-50" : "bg-accent-100"}`}
      key={position}
    >
      <td className="p-2 text-sm text-center border border-accent-400">
        {person.photo?.asset?.url ? (
          <div className="w-16 h-16 rounded-full overflow-hidden border border-accent-400">
            <Image
              src={person.photo.asset.url}
              alt={person.name}
              width={60}
              height={60}
              className="w-full h-full object-cover object-top"
            />
          </div>
        ) : (
          <div className="w-[60px] h-[60px] border border-neutral-900 bg-gray-200 rounded-full mx-auto flex items-center justify-center text-gray-500">
            N/A
          </div>
        )}
      </td>
      <td className="p-2 text-sm border border-accent-400 text-center uppercase">
        <strong>{person.name}</strong>
      </td>
      <td className="p-2 text-sm border border-accent-400 uppercase">
        {person.role}
      </td>
      <td className="p-2 text-sm border border-accent-400 uppercase">
        {person.occupation}
      </td>
      <td className="p-2 text-sm border border-accent-400 uppercase">
        {person.mobile}
      </td>
      <td className="p-2 text-sm border border-accent-400 uppercase">
        {person.address}
      </td>
    </tr>
  );

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-center text-accent-600 mb-6">
          🏛️ Governing Body
        </h2>
        <p className="text-center bg-primary-600 text-neutral-50 px-3 py-3 rounded-2xl">
          (Approved on: {new Date(committee.approvalDate).toDateString()}) Valid
          Till: ({new Date(committee.termStart).toDateString()} --{" "}
          {new Date(committee.termEnd).toDateString()})
        </p>

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
          className="overflow-x-auto rounded shadow bg-white p-4"
          style={{ color: "black", backgroundColor: "white" }}
        >
          <table className="min-w-full table-auto border-collapse">
            <thead className="bg-accent-400 text-neutral-50 text-sm">
              <tr>
                <th className="p-2 border border-accent-400 py-4">Photo</th>
                <th className="p-2 border border-accent-400">Name</th>
                <th className="p-2 border border-accent-400">Role</th>
                <th className="p-2 border border-accent-400 ">Occupation</th>
                <th className="p-2 border border-accent-400">Phone</th>
                <th className="p-2 border border-accent-400">Address</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {committee.members?.map((member, idx) => renderRow(member, idx))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
