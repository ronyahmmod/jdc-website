import { client } from "@/lib/sanity";
import { groq } from "next-sanity";
import { format } from "date-fns";
import Image from "next/image";

interface Routine {
  _id: string;
  className: string;
  publishedDate: string;
  file: {
    asset: {
      url: string;
      mimeType: string;
    };
  };
}

const query = groq`
  *[_type == "simpleRoutine" && isPublishable == true] | order(publishedDate desc) {
    _id,
    className,
    publishedDate,
    file {
      asset-> {
        url,
        mimeType
      }
    }
  }
`;

export default async function RoutineListPage() {
  const routines: Routine[] = await client.fetch(query);

  if (!routines.length) {
    return (
      <div className="text-center py-10 text-red-500">No routines found.</div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-green-800 mb-6 text-center">
        🗓️ All Published Class Routines
      </h1>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-green-600 rounded shadow">
          <thead className="bg-green-100 text-left text-green-900">
            <tr>
              <th className="px-4 py-3 border border-green-600">Class</th>
              <th className="px-4 py-3 border border-green-600">
                Published Date
              </th>
              <th className="px-4 py-3 border border-green-600">Type</th>
              <th className="px-4 py-3 border border-green-600">Preview</th>
              <th className="px-4 py-3 border border-green-600">Download</th>
            </tr>
          </thead>
          <tbody>
            {routines.map((routine, idx) => {
              const isPDF = routine.file.asset.mimeType === "application/pdf";
              return (
                <tr
                  key={routine._id}
                  className={idx % 2 === 0 ? "bg-white" : "bg-green-50"}
                >
                  <td className="px-4 py-3 border border-green-600">
                    {routine.className}
                  </td>
                  <td className="px-4 py-3 border border-green-600">
                    {format(new Date(routine.publishedDate), "dd MMM yyyy")}
                  </td>
                  <td className="px-4 py-3 border border-green-600">
                    {isPDF ? "PDF" : "Image"}
                  </td>
                  <td className="px-4 py-3 border border-green-600">
                    <a
                      href={routine.file.asset.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline hover:text-blue-800"
                    >
                      View
                    </a>
                  </td>
                  <td className="px-4 py-3 border border-green-600">
                    <a
                      href={routine.file.asset.url}
                      download
                      className="text-green-600 underline hover:text-green-800"
                    >
                      Download
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
