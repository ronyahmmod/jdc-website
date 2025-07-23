"use client";
import urlFor, { client } from "@/lib/sanity";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const navItems = [
  { label: "হোম", href: "/" },
  { label: "কলেজ পরিচিতি", href: "about" },
  { label: "রুটিন", href: "routine" },
  { label: "শিক্ষকবৃন্দ", href: "teacher" },
  { label: "কর্মচারীবৃন্দ", href: "stuff" },
  { label: "বিজ্ঞপ্তি", href: "notice" },
  { label: "সেবা", href: "service" },
  { label: "যোগাযোগ", href: "contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [collegeInfo, setCollegeInfo] = useState<{
    name: string;
    logo?: unknown;
  } | null>(null);

  useEffect(() => {
    async function fetchCollegeInfo() {
      const query = `*[_type == "institutionInfo"] | order(_createdAt desc)[0] {
      name,
      logo
    }`;
      const data = await client.fetch(query);
      setCollegeInfo(data);
    }
    fetchCollegeInfo();
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="container mx-auto flex items-center justify-between p-4">
        {/* Logo and Title */}

        <div className="flex items-center gap-3">
          {collegeInfo?.logo && (
            <Image
              src={urlFor(collegeInfo.logo).url()}
              alt={collegeInfo.name || "College Logo"}
              width={50}
              height={50}
            />
          )}
          <h1 className="text-xl md:text-2xl font-bold text-blue-900">
            {collegeInfo?.name || "জীবননগর কলেজ"}
          </h1>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-gray-700 hover:text-blue-800 font-medium"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Toggle Menu"
        >
          <svg
            className="w-6 h-6 text-gray-800"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={open ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>

        {/* Mobile Nav */}
        {open && (
          <div className="md:hidden bg-white shadow-sm px-4 pb-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block py-2 text-gray-800 border-b"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
