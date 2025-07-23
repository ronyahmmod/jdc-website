"use client";

interface Headline {
  text: string;
  link?: string;
  newTab?: boolean;
  icon?: string;
}

export default function Marquee({ headlines }: { headlines: Headline[] }) {
  if (!headlines?.length) return null;

  return (
    <div className="flex items-center bg-blue-50 border-b border-blue-200 text-sm text-blue-900 py-2 overflow-hidden">
      <div className="min-w-[150px] font-semibold px-4 text-red-600">
        🔔 Important News:
      </div>

      <div className="relative flex-1 overflow-hidden">
        <div className="marquee-wrapper hover:paused">
          <div className="marquee-content">
            {headlines.map((item, i) => {
              const content = (
                <>
                  {item.icon && <span className="mr-1">{item.icon}</span>}
                  {item.text}
                </>
              );

              return item.link ? (
                <a
                  key={i}
                  href={item.link}
                  target={item.newTab ? "_blank" : "_self"}
                  rel={item.newTab ? "noopener noreferrer" : undefined}
                  className="inline-block mx-8 hover:underline font-medium"
                >
                  {content}
                </a>
              ) : (
                <span key={i} className="inline-block mx-8 font-medium">
                  {content}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      <style jsx>{`
        .marquee-wrapper {
          overflow: hidden;
          position: relative;
        }
        .marquee-wrapper:hover .marquee-content {
          animation-play-state: paused;
        }
        .marquee-content {
          display: inline-block;
          white-space: nowrap;
          animation: marquee 20s linear infinite;
        }
        @keyframes marquee {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
      `}</style>
    </div>
  );
}
