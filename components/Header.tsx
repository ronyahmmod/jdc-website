"use client";
import { InstitutionInfo } from "@/app/types/InstitutionInfo";
import urlFor, { client } from "@/lib/sanity";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

// Define navigation items with optional target, subdomain, and logo properties
type NavItem = {
  label: string;
  href: string;
  target?: string;
  subdomain?: string;
  logo?: string; // Optional logo URL for subItems
  subItems?: NavItem[];
};

const navItems: NavItem[] = [
  { label: "হোম", href: "/" },
  {
    label: "কলেজ পরিচিতি",
    href: "/about",
    subItems: [
      { label: "সাবেক অধ্যক্ষগণ", href: "/formerprincipal" },
      { label: "এক নজরে কলেজ", href: "/eknojore" },
    ],
  },
  { label: "পরিচালনা পর্ষদ", href: "/gb" },
  { label: "শিক্ষকবৃন্দ", href: "/teachers" },
  { label: "কর্মচারীবৃন্দ", href: "/staff" },
  { label: "ক্লাস রুটিন", href: "/routine" },
  { label: "শিক্ষার্থী তথ্য", href: "/studentinfo" },
  { label: "বিজ্ঞপ্তি", href: "/notices" },
  {
    label: "সেবা",
    href: "/service",
    subItems: [
      {
        label: "Student Services",
        href: "/",
        subdomain: "app1",
        target: "_blank",
        // logo: "/path/to/student-services-logo.png", // Example logo
      },
      {
        label: "Result",
        href: "/",
        subdomain: "result",
        target: "_blank",
        // logo: "/path/to/result-logo.png",
      },
      {
        label: "প্রশিক্ষণ প্রোগ্রাম",
        href: "/",
        subdomain: "training",
        target: "_blank",
      },
      { label: "লাইব্রেরি সেবা", href: "/service/library" },
      { label: "ক্যারিয়ার কাউন্সেলিং", href: "/service/counseling" },
    ],
  },
  { label: "যোগাযোগ", href: "/contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [collegeInfo, setCollegeInfo] = useState<InstitutionInfo | null>(null);
  const [dropdownStates, setDropdownStates] = useState<Map<string, boolean>>(
    new Map()
  );
  const [dropdownTimeouts, setDropdownTimeouts] = useState<
    Map<string, NodeJS.Timeout | null>
  >(new Map());

  // Fetch institution info (logo and name) on component mount
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

  // Handle dropdown open for a specific menu item
  const handleMouseEnter = (key: string) => {
    const timeout = dropdownTimeouts.get(key);
    if (timeout) {
      clearTimeout(timeout); // Prevent premature close
    }
    setDropdownStates((prev) => new Map(prev).set(key, true));
  };

  // Handle dropdown close with 200ms delay for a specific menu item
  const handleMouseLeave = (key: string) => {
    const timeout = setTimeout(() => {
      setDropdownStates((prev) => new Map(prev).set(key, false));
    }, 200);
    setDropdownTimeouts((prev) => new Map(prev).set(key, timeout));
  };

  // Toggle mobile dropdown for a specific menu item
  const toggleMobileDropdown = (key: string) => {
    setDropdownStates((prev) => {
      const newMap = new Map(prev);
      newMap.set(key, !prev.get(key));
      return newMap;
    });
  };

  // Construct URL based on subdomain or regular href
  const getLinkUrl = (item: { href: string; subdomain?: string }) => {
    if (item.subdomain) {
      return `https://${item.subdomain}.jibannagardegreecollege.com${item.href}`;
    }
    return item.href;
  };

  return (
    <header className="sticky top-0 z-50 bg-neutral-50 text-neutral-50 shadow-md">
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
          <h1 className="text-xl md:text-2xl font-bold text-accent-600">
            {collegeInfo?.name || "জীবননগর ডিগ্রি কলেজ"}
          </h1>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => {
            const key = item.href; // Unique key for each menu item
            return (
              <div key={key} className="relative group">
                {item.subItems ? (
                  // Dropdown menu for items with subItems
                  <div
                    onMouseEnter={() => handleMouseEnter(key)}
                    onMouseLeave={() => handleMouseLeave(key)}
                  >
                    <button className="text-gray-700 hover:text-gray-600 font-medium flex items-center">
                      {item.label}
                      <svg
                        className="w-4 h-4 ml-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                    {dropdownStates.get(key) && (
                      <div
                        className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-md py-2 z-10"
                        onMouseEnter={() => handleMouseEnter(key)}
                        onMouseLeave={() => handleMouseLeave(key)}
                      >
                        {item.subItems.map((subItem) => (
                          <Link
                            key={subItem.href}
                            href={getLinkUrl(subItem)}
                            target={subItem.target || "_self"}
                            className="flex items-center px-4 py-2 text-primary-600 hover:bg-blue-50 hover:text-primary-700"
                          >
                            {subItem.logo && (
                              <Image
                                src={subItem.logo}
                                alt={`${subItem.label} logo`}
                                width={20}
                                height={20}
                                className="mr-2"
                              />
                            )}
                            {subItem.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  // Regular menu item without subItems
                  <Link
                    href={getLinkUrl(item)}
                    target={item.target || "_self"}
                    className="text-gray-700 hover:text-blue-800 font-medium"
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            );
          })}
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

        {/* Mobile Navigation with Scrollbar */}
        {open && (
          <div className="md:hidden bg-white shadow-lg absolute top-full left-0 w-full max-h-[70vh] overflow-y-auto transition-all duration-300 ease-in-out">
            {navItems.map((item) => {
              const key = item.href; // Unique key for each menu item
              return (
                <div key={key}>
                  {item.subItems ? (
                    // Mobile dropdown menu
                    <div className="border-b border-gray-200">
                      <button
                        className="w-full text-left py-3 px-4 text-gray-800 font-medium flex justify-between items-center"
                        onClick={() => toggleMobileDropdown(key)}
                      >
                        {item.label}
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d={
                              dropdownStates.get(key)
                                ? "M19 9l-7 7-7-7"
                                : "M9 5l7 7-7 7"
                            }
                          />
                        </svg>
                      </button>
                      {dropdownStates.get(key) && (
                        <div className="pl-6 bg-gray-50">
                          {item.subItems.map((subItem) => (
                            <Link
                              key={subItem.href}
                              href={getLinkUrl(subItem)}
                              target={subItem.target || "_self"}
                              className="flex items-center py-2 px-4 text-gray-700 hover:bg-blue-50 hover:text-blue-800"
                              onClick={() => setOpen(false)}
                            >
                              {subItem.logo && (
                                <Image
                                  src={subItem.logo}
                                  alt={`${subItem.label} logo`}
                                  width={20}
                                  height={20}
                                  className="mr-2"
                                />
                              )}
                              {subItem.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    // Regular mobile menu item
                    <Link
                      href={getLinkUrl(item)}
                      target={item.target || "_self"}
                      className="block py-3 px-4 text-gray-800 border-b border-gray-200 hover:bg-blue-50 hover:text-blue-800 font-medium"
                      onClick={() => setOpen(false)}
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
}
