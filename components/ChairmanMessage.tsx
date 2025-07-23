"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { client } from "@/lib/sanity";
import { groq } from "next-sanity";
import { motion } from "framer-motion";

const query = groq`*[_type == "chairmanMessage" && showOnHome == true][0] {
  name,
  designation,
  "photoUrl": photo.asset->url,
  shortMessage,
  fullMessage
}`;

export default function ChairmanMessage() {
  const [data, setData] = useState<unknown>(null);
  const [showFull, setShowFull] = useState(false);

  useEffect(() => {
    client.fetch(query).then(setData).catch(console.error);
  }, []);

  if (!data) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-5xl mx-auto bg-white shadow-lg rounded-xl p-6 my-10 flex flex-col md:flex-row items-center gap-6"
    >
      {/* Image Section */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="w-full md:w-1/3"
      >
        <Image
          src={data.photoUrl}
          alt={data.name}
          width={300}
          height={300}
          className="rounded-xl shadow-md object-cover w-full h-auto"
        />
        <div className="mt-4 text-center">
          <h3 className="text-lg font-semibold">{data.name}</h3>
          <p className="text-gray-500 text-sm">{data.designation}</p>
        </div>
      </motion.div>

      {/* Message Section */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        className="w-full md:w-2/3 space-y-4"
      >
        <h2 className="text-2xl font-bold text-gray-800">সভাপতির বাণী</h2>
        <p className="text-gray-700">
          {showFull ? data.fullMessage : data.shortMessage + "…"}
        </p>
        {data.fullMessage && (
          <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => setShowFull(!showFull)}
            className="text-blue-600 font-semibold hover:underline"
          >
            {showFull ? "কম দেখান" : "বিস্তারিত পড়ুন"}
          </motion.button>
        )}
      </motion.div>
    </motion.div>
  );
}
