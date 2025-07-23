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
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3661.1707305143696!2d88.82226567476832!3d23.418199001449793!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39fed507158b05dd%3A0x6af5085bac375594!2sJibonnagor%20Degree%20College!5e0!3m2!1sen!2sbd!4v1753256886019!5m2!1sen!2sbd" // Replace with valid map link
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
              href="https://facebook.com/jdcjc2016"
              target="_blank"
              className="hover:text-blue-500"
            >
              <FaFacebookF size={20} />
            </a>
            <a
              href="https://www.youtube.com/@jdconlineclassroom5434"
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
              href="https://www.facebook.com/rony.ahmmod.9"
              target="_blank"
              className="text-blue-400 hover:underline"
            >
              Engr MD. Rony Ahmmod B.Sc(CSE)
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
