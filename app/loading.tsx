"use client";

import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <motion.div
        className="relative w-16 h-16"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      >
        <div className="absolute inset-0 border-4 border-t-4 border-t-accent-500 border-gray-200 rounded-full"></div>
      </motion.div>
      <motion.p
        className="mt-4 text-lg font-medium text-accent-700"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        অপেক্ষা করুন, ডেটা লোড হচ্ছে...
      </motion.p>
    </div>
  );
}
