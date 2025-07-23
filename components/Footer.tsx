import {
  FaFacebookF,
  FaYoutube,
  FaMapMarkerAlt,
  FaExternalLinkAlt,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[#1a1a1a] text-gray-100 pt-12">
      {/* Top Links Panel */}
      <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-3 gap-8 pb-12 border-b border-gray-700">
        {/* Useful Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4">🔗 Useful Links</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a
                href="https://moedu.gov.bd"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-400 flex items-center gap-2"
              >
                Ministry of Education <FaExternalLinkAlt size={12} />
              </a>
            </li>
            <li>
              <a
                href="https://pmo.gov.bd"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-400 flex items-center gap-2"
              >
                Prime Minister’s Office <FaExternalLinkAlt size={12} />
              </a>
            </li>
            <li>
              <a
                href="https://ugc.gov.bd"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-400 flex items-center gap-2"
              >
                UGC Bangladesh <FaExternalLinkAlt size={12} />
              </a>
            </li>
          </ul>
        </div>

        {/* Address & Map */}
        <div>
          <h3 className="text-lg font-semibold mb-4">📍 Address</h3>
          <p className="text-sm mb-3">
            <FaMapMarkerAlt className="inline mr-1" />
            Jibannagar College, Jibannagar, Chuadanga, Bangladesh
          </p>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!..." // Replace with valid map link
            width="100%"
            height="150"
            className="rounded border-none"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>

        {/* Social & Info */}
        <div>
          <h3 className="text-lg font-semibold mb-4">🌐 Connect With Us</h3>
          <div className="flex gap-4 mb-4">
            <a
              href="https://facebook.com/jibannagarcollege"
              target="_blank"
              className="hover:text-blue-500"
            >
              <FaFacebookF size={20} />
            </a>
            <a
              href="https://youtube.com/@jibannagarcollege"
              target="_blank"
              className="hover:text-red-500"
            >
              <FaYoutube size={22} />
            </a>
          </div>
          <p className="text-sm text-gray-400">
            Follow us on social media for updates and announcements.
          </p>
        </div>
      </div>

      {/* Bottom Panel */}
      <div className="bg-[#121212] py-6 mt-6">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between text-sm text-gray-400 space-y-2 md:space-y-0">
          <p>
            © {new Date().getFullYear()} Jibannagar College. All rights
            reserved.
          </p>
          <p>
            Developed by{" "}
            <a
              href="https://yourportfolio.com"
              target="_blank"
              className="text-blue-400 hover:underline"
            >
              Your Name
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
