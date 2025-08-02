import { client } from "@/lib/sanity";
import { groq } from "next-sanity";
import { format } from "date-fns";

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
      <h1 className="text-2xl font-bold text-accent-600 mb-6 text-center">
        🗓️ All Published Class Routines
      </h1>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-accent-400 rounded shadow">
          <thead className="bg-accent-400 text-left text-accent-50">
            <tr>
              <th className="px-4 py-3 border border-accent-400 text-center">
                Class
              </th>
              <th className="px-4 py-3 border border-accent-400">
                Published Date
              </th>
              <th className="px-4 py-3 border border-accent-400">Type</th>
              <th className="px-4 py-3 border border-accent-400">Preview</th>
              <th className="px-4 py-3 border border-accent-400">Download</th>
            </tr>
          </thead>
          <tbody>
            {routines.map((routine, idx) => {
              const isPDF = routine.file.asset.mimeType === "application/pdf";
              return (
                <tr
                  key={routine._id}
                  className={idx % 2 === 0 ? "bg-neutral-50" : "bg-accent-100"}
                >
                  <td className="px-4 py-3 border border-accent-400">
                    {routine.className}
                  </td>
                  <td className="px-4 py-3 border border-accent-400">
                    {format(new Date(routine.publishedDate), "dd MMM yyyy")}
                  </td>
                  <td className="px-4 py-3 border border-accent-400">
                    {isPDF ? "PDF" : "Image"}
                  </td>
                  <td className="px-4 py-3 border border-accent-400">
                    <a
                      href={routine.file.asset.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent-500 underline hover:text-accent-600"
                    >
                      View
                    </a>
                  </td>
                  <td className="px-4 py-3 border border-accent-400">
                    <a
                      href={routine.file.asset.url}
                      download
                      className="text-accent-500 underline hover:text-accent-600"
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
