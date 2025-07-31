// app/about/page.tsx

import { client } from "@/lib/sanity";
import { groq } from "next-sanity";
import React from "react";
import { PortableText } from "next-sanity";
import { Section, History } from "../types/About";

export const revalidate = 60; // ISR: Revalidate every 60 seconds

const query = groq`
  *[_type == "about"][0]{
    title,
    overview,
    history,
    quickFacts,
    contact,
    sections,
  }
`;

export default async function AboutPage() {
  const data = await client.fetch(query);

  if (!data) return <div className="text-center py-20">No data found.</div>;

  const { title, overview, history, quickFacts, contact } = data;

  return (
    <main className="max-w-5xl mx-auto py-12 px-4 space-y-12">
      <section>
        <h1 className="text-4xl font-bold text-indigo-800 mb-4 text-center">
          {title}
        </h1>
        <p className="text-gray-700 leading-relaxed">{overview}</p>
      </section>

      {/* Sectioned Paragraphs */}
      {data.sections?.map((sec: Section, i: number) => (
        <div key={i} className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-700">{sec.heading}</h2>
          <div className="prose">
            <PortableText value={sec.body} />
          </div>
        </div>
      ))}

      {/* Timeline */}
      {data.history?.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-700 mt-8">
            📜 History Timeline
          </h2>
          <ul className="border-l-2 border-indigo-500 mt-4 space-y-4 pl-6">
            {history.map((item: History, i: number) => (
              <li key={i} className="relative">
                <div className="absolute -left-4 top-1.5 w-2 h-2 bg-indigo-500 rounded-full" />
                <p className="text-sm font-semibold">{item.year}</p>
                <p className="text-gray-600">{item.event}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {quickFacts && (
        <section>
          <h2 className="text-2xl font-semibold text-indigo-700 mb-4">
            📌 Quick Facts
          </h2>
          <ul className="list-disc list-inside text-gray-800 space-y-2">
            <li>
              <strong>Founded:</strong> {quickFacts.founded}
            </li>
            <li>
              <strong>Campus Area:</strong> {quickFacts.campusArea}
            </li>
            <li>
              <strong>Affiliation:</strong> {quickFacts.affiliation}
            </li>
            <li>
              <strong>EIIN:</strong> {quickFacts.eiin}
            </li>
            <li>
              <strong>College Code:</strong> {quickFacts.code}
            </li>
            <li>
              <strong>MPO Status:</strong>{" "}
              {quickFacts.mpo ? "Approved" : "Not Approved"}
            </li>
          </ul>
        </section>
      )}

      {contact?.mapUrl && (
        <section>
          <h2 className="text-2xl font-semibold text-indigo-700 mb-4">
            📍 Location Map
          </h2>
          <div className="rounded-lg overflow-hidden">
            <iframe
              src={contact.mapUrl}
              width="100%"
              height="400"
              loading="lazy"
              style={{ border: 0 }}
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
          <p className="mt-2 text-sm text-gray-600">
            Address: {contact.address}
          </p>
        </section>
      )}
    </main>
  );
}
