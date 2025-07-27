"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { client } from "@/lib/sanity";
import urlFor from "@/lib/sanity";
import { groq } from "next-sanity";
import { Slide } from "@/app/types/Slide";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const query = groq`*[_type == "heroImage" && showInSlider == true] | order(_createdAt desc)[0...5] {
  _id, title, subtitle, image, buttonText, buttonLink
}`;

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
    scale: 0.8,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      x: { stiffness: 300, damping: 30 },
      opacity: { duration: 0.5 },
      scale: { duration: 0.5 },
    },
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
    scale: 0.8,
    transition: {
      x: { stiffness: 300, damping: 30 },
      opacity: { duration: 0.5 },
      scale: { duration: 0.5 },
    },
  }),
};

export default function HeroSlider() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    client.fetch(query).then(setSlides).catch(console.error);
  }, []);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setDirection(1);
      setIndex((prev) => (prev + 1) % slides.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [slides, isPlaying]);

  const goNext = () => {
    setDirection(1);
    setIndex((prev) => (prev + 1) % slides.length);
  };

  const goPrev = () => {
    setDirection(-1);
    setIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const togglePlay = () => setIsPlaying(!isPlaying);

  if (!slides.length) return null;

  return (
    <div className="relative w-full h-[300px] md:h-[500px] overflow-hidden rounded-xl">
      <AnimatePresence initial={false} custom={direction}>
        {slides.map((slide, i) =>
          i === index ? (
            <motion.div
              key={slide._id}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute inset-0"
            >
              <Image
                src={urlFor(slide.image).url()}
                alt={slide.title || "slide"}
                fill
                className="object-cover"
                priority={i === 0}
              />

              {/* Overlay with content */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end justify-end px-6 pb-10"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <div className="text-right text-white max-w-[80%]">
                  <motion.h2
                    className="text-2xl md:text-4xl font-bold mb-2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                  >
                    {slide.title}
                  </motion.h2>
                  {slide.subtitle && (
                    <motion.p
                      className="text-base md:text-lg mb-4"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                    >
                      {slide.subtitle}
                    </motion.p>
                  )}
                  {slide.buttonText && slide.buttonLink && (
                    <motion.a
                      href={slide.buttonLink}
                      target="_blank"
                      className="inline-block bg-white text-black px-6 py-3 rounded-md font-medium hover:bg-gray-200 transition-transform hover:scale-105"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6, duration: 0.5 }}
                    >
                      {slide.buttonText}
                    </motion.a>
                  )}
                </div>
              </motion.div>
            </motion.div>
          ) : null
        )}
      </AnimatePresence>

      {/* Enhanced Control Buttons */}
      <div className="absolute inset-y-0 left-0 flex items-center px-4">
        <motion.button
          onClick={goPrev}
          className="bg-black/50 p-3 rounded-full text-white hover:bg-black/80 transition-all duration-300"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronLeft size={28} />
        </motion.button>
      </div>
      <div className="absolute inset-y-0 right-0 flex items-center px-4">
        <motion.button
          onClick={goNext}
          className="bg-black/50 p-3 rounded-full text-white hover:bg-black/80 transition-all duration-300"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronRight size={28} />
        </motion.button>
      </div>

      {/* Play/Pause Button */}
      <div className="absolute top-4 right-4">
        <motion.button
          onClick={togglePlay}
          className="bg-black/50 p-3 rounded-full text-white hover:bg-black/80 transition-all duration-300"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          {isPlaying ? <Pause size={24} /> : <Play size={24} />}
        </motion.button>
      </div>

      {/* Enhanced Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <motion.button
            key={i}
            onClick={() => {
              setDirection(i > index ? 1 : -1);
              setIndex(i);
            }}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              i === index ? "bg-white scale-125" : "bg-white/40"
            }`}
            whileHover={{ scale: 1.3 }}
            whileTap={{ scale: 0.9 }}
          />
        ))}
      </div>
    </div>
  );
}
