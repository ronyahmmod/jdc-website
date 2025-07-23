"use client";

import {
  FaUniversity,
  FaBookOpen,
  FaUsers,
  FaCalendarAlt,
} from "react-icons/fa";

const items = [
  { icon: <FaCalendarAlt size={28} />, label: "Founded", value: "1984" },
  { icon: <FaUniversity size={28} />, label: "Departments", value: "08" },
  { icon: <FaUsers size={28} />, label: "Regular Students", value: "1500+" },
  { icon: <FaBookOpen size={28} />, label: "Subjects", value: "25+" },
];

export default function StatsPanel() {
  return (
    <section
      className="bg-cover bg-center relative py-12 px-4"
      style={{ backgroundImage: "url('/campus.jpg')" }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>

      <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 text-white text-center">
        {items.map((item, i) => (
          <div key={i} className="flex flex-col items-center">
            {/* Circle with Icon */}
            <div className="w-24 h-24 flex items-center justify-center border-2 border-white rounded-full bg-white/10 backdrop-blur-md mb-2 shadow-md">
              {item.icon}
            </div>
            {/* Label and Value */}
            <div>
              <h3 className="text-lg font-semibold">{item.label}</h3>
              <p className="text-sm">{item.value}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
