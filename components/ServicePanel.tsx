"use client";
import Link from "next/link";
import {
  BookOpen,
  Users,
  User,
  FileText,
  UserCog,
  BadgeDollarSign,
  CalendarCheck,
  ExternalLink,
  LucideIcon,
} from "lucide-react";

type ServiceItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  external?: boolean;
};

const services: ServiceItem[] = [
  {
    title: "Online Admission",
    href: "https://admission.jibannagardegreecollege.com",
    icon: BookOpen,
    external: true,
  },
  { title: "Internal Result", href: "/internal-result", icon: FileText },
  { title: "Public Result", href: "/public-result", icon: FileText },
  { title: "Students", href: "/students", icon: Users },
  {
    title: "Student Services",
    href: "https://app1.jibannagardegreecollege.com",
    icon: User,
    external: true,
  },
  { title: "Teacher/Staff Services", href: "/staff-services", icon: UserCog },
  { title: "Stipend", href: "/stipend", icon: BadgeDollarSign },
  { title: "Attendance", href: "/attendance", icon: CalendarCheck },
];

export default function ServicePanel() {
  return (
    <div className="bg-neutral-200 rounded-md shadow-md p-4">
      <h2 className="text-xl font-bold text-accent-600 mb-4">
        Quick Services (Students Services ছাড়া অন্যান্য সেবাগুলোর কাজ
        প্রক্রিয়াধীন, খুব দ্রুত উন্মুক্ত করা হবে)
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {services.map(({ title, href, icon: Icon, external }) =>
          external ? (
            <a
              key={title}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center bg-neutral-50 p-4 rounded-md shadow hover:shadow-md hover:bg-accent-50 transition"
            >
              <Icon className="h-6 w-6 text-accent-600 mb-2" />
              <span className="text-sm text-center font-medium text-gray-700">
                {title}
              </span>
              <ExternalLink className="h-4 w-4 text-gray-400 mt-1" />
            </a>
          ) : (
            <Link
              key={title}
              href={href}
              className="flex flex-col items-center justify-center bg-neutral-50 p-4 rounded-md shadow hover:shadow-md hover:bg-accent-50 transition"
            >
              <Icon className="h-6 w-6 text-accent-600 mb-2" />
              <span className="text-sm text-center font-medium text-gray-700">
                {title}
              </span>
            </Link>
          )
        )}
      </div>
    </div>
  );
}
