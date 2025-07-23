"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { client } from "@/lib/sanity";
import urlFor from "@/lib/sanity";
import { groq } from "next-sanity";

const query = groq`*[_type == "heroImage" && showInSlider == true] | order(_createdAt desc)[0...5] {
  _id, title, subtitle, image, buttonText, buttonLink
}`;

export default function HeroSlider() {
  const [slides, setSlides] = useState<any[]>([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    client.fetch(query).then(setSlides).catch(console.error);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides]);

  if (!slides.length) return null;

  return (
    <div className="relative w-full h-[300px] md:h-[450px] overflow-hidden rounded-xl">
      {slides.map((slide, i) => (
        <div
          key={slide._id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            i === index ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <Image
            src={urlFor(slide.image).url()}
            alt={slide.title || "slide"}
            fill
            className="object-cover"
            priority={i === 0}
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/50 flex items-end justify-end px-6 pb-10">
            <div
              className={`text-right text-white max-w-[80%] animate-slide-up`}
              key={index} // force animation re-render
            >
              <h2 className="text-2xl md:text-4xl font-bold mb-2 animate-fade-in">
                {slide.title}
              </h2>
              {slide.subtitle && (
                <p className="text-base md:text-lg mb-4 animate-fade-in delay-200">
                  {slide.subtitle}
                </p>
              )}
              {slide.buttonText && slide.buttonLink && (
                <a
                  href={slide.buttonLink}
                  className="inline-block bg-white text-black px-5 py-2 rounded-md font-medium hover:bg-gray-200 transition animate-fade-in delay-300"
                >
                  {slide.buttonText}
                </a>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
