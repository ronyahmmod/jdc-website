"use client";

import type {
  Stats,
  StatsPanel as StatsPanelType,
} from "@/app/types/StatsPanel";
import {
  FaUniversity,
  FaBookOpen,
  FaUsers,
  FaCalendarAlt,
} from "react-icons/fa";

const icons = [FaCalendarAlt, FaUsers, FaUniversity, FaBookOpen];

export default function StatsPanel({ data }: { data: StatsPanelType }) {
  const bgUrl = data?.background?.image?.asset?.url;

  return (
    <section
      className="relative py-12 px-4 bg-center bg-cover min-h-[200px] rounded-2xl overflow-hidden"
      style={{
        backgroundImage: bgUrl ? `url(${bgUrl})` : "none",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70 z-0" />

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-white text-center justify-center">
        {data?.stats?.map((item: Stats, i: number) => {
          const Icon = icons[i] || FaBookOpen;
          return (
            <div key={i} className="flex flex-col items-center justify-center">
              {/* Icon */}
              <div className="w-24 h-24 flex items-center justify-center border-2 border-white rounded-full bg-accent-600/40 backdrop-blur-md mb-2 shadow-md">
                <Icon size={28} />
              </div>
              {/* Text */}
              <div>
                <h3 className="text-lg font-semibold">{item.label}</h3>
                <p className="text-sm">{item.value}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
