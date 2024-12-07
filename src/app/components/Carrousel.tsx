"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const images = [
  {
    src: "/img/cards/magic.png?height=400&width=300",
    alt: "Magician",
    description:
      "The Magician is a powerful creature that can cast spells and enchantments on the battlefield. It is a versatile ally that can be used to control the flow of the game and turn the tide of battle in your favor.",
  },
  {
    src: "/img/cards/guard.png?height=400&width=300",
    alt: "Guard",
    description:
      "The Guard is a powerful creature that can protect your other cards from damage. It is a versatile ally that can be used to control the flow of the game and turn the tide of battle in your favor.",
  },
  {
    src: "/img/cards/as.png?height=400&width=300",
    alt: "Assassin",
    description:
      "The Assassin is a powerful creature that can deal damage to your opponent's cards. It is a versatile ally that can be used to control the flow of the game and turn the tide of battle in your favor.",
  },
];

export default function AnimatedFocusedImageCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const nextImage = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  }, []);

  const prevImage = useCallback(() => {
    setDirection(-1);
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        prevImage();
      } else if (event.key === "ArrowRight") {
        nextImage();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextImage, prevImage]);

  const getImageIndex = (offset: number) => {
    return (currentIndex + offset + images.length) % images.length;
  };

  const variants = {
    center: {
      x: "0%",
      scale: 1,
      zIndex: 3,
      filter: "blur(0px) brightness(100%)",
    },
    left: {
      x: "-50%",
      scale: 0.8,
      zIndex: 2,
      filter: "blur(2px) brightness(75%)",
    },
    right: {
      x: "50%",
      scale: 0.8,
      zIndex: 2,
      filter: "blur(2px) brightness(75%)",
    },
    hidden: {
      x: direction > 0 ? "100%" : "-100%",
      scale: 0.8,
      zIndex: 1,
      filter: "blur(2px) brightness(75%)",
    },
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-bold text-center mb-8 font-medieval">
        Iconic NFT Cards
      </h2>
      <div className="flex justify-center items-center space-x-4 mb-8">
        <button
          className="z-10 p-2 rounded-full bg-white border border-gray-300 shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          onClick={prevImage}
          aria-label="Previous image"
        >
          <ChevronLeft className="h-6 w-6 text-gray-600" />
        </button>

        <div className="relative flex items-center justify-center w-full h-[400px]">
          <AnimatePresence initial={false} custom={direction}>
            {[-1, 0, 1].map((offset) => {
              const index = getImageIndex(offset);
              return (
                <motion.div
                  key={images[index].src}
                  custom={direction}
                  variants={variants}
                  initial={
                    offset === 0 ? "center" : offset === -1 ? "left" : "right"
                  }
                  animate={
                    offset === 0 ? "center" : offset === -1 ? "left" : "right"
                  }
                  exit="hidden"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    scale: { type: "spring", stiffness: 300, damping: 30 },
                    filter: { type: "tween", duration: 0.2 },
                  }}
                  className="absolute top-0 w-[300px] h-[400px] flex items-center justify-center"
                >
                  <Image
                    src={images[index].src}
                    alt={images[index].alt}
                    fill
                    className="object-cover rounded-lg shadow-lg"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        <button
          className="z-10 p-2 rounded-full bg-white border border-gray-300 shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          onClick={nextImage}
          aria-label="Next image"
        >
          <ChevronRight className="h-6 w-6 text-gray-600" />
        </button>
      </div>
      <div className="text-center max-w-md mx-auto">
        <p className="text-lg font-medieval">
          {images[currentIndex].description}
        </p>
      </div>
    </div>
  );
}
