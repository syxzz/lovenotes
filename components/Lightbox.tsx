"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Photo } from "@/types";
import { IoClose, IoChevronBack, IoChevronForward } from "react-icons/io5";

interface LightboxProps {
  photo: Photo | null;
  photos: Photo[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (direction: "prev" | "next") => void;
}

export default function Lightbox({
  photo,
  photos,
  currentIndex,
  onClose,
  onNavigate
}: LightboxProps) {
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  useEffect(() => {
    if (!photo) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onNavigate("prev");
      if (e.key === "ArrowRight") onNavigate("next");
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [photo, onClose, onNavigate]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) {
      onNavigate("next");
    }
    if (touchStart - touchEnd < -75) {
      onNavigate("prev");
    }
  };

  if (!photo) return null;

  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < photos.length - 1;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
        onClick={onClose}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors duration-200"
          aria-label="Close lightbox"
        >
          <IoClose size={32} />
        </button>

        {hasPrev && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNavigate("prev");
            }}
            className="absolute left-4 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors duration-200 hidden md:block"
            aria-label="Previous photo"
          >
            <IoChevronBack size={32} />
          </button>
        )}

        {hasNext && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNavigate("next");
            }}
            className="absolute right-4 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors duration-200 hidden md:block"
            aria-label="Next photo"
          >
            <IoChevronForward size={32} />
          </button>
        )}

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="relative max-w-7xl max-h-[90vh] w-full mx-4"
          onClick={(e) => e.stopPropagation()}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="relative w-full h-full flex items-center justify-center">
            <Image
              src={photo.url}
              alt={photo.caption}
              width={1200}
              height={800}
              unoptimized
              className="max-h-[80vh] w-auto h-auto object-contain rounded-lg"
              priority
            />
          </div>

          <div className="mt-6 text-center text-white px-4">
            <h3 className="text-2xl font-semibold mb-2">{photo.caption}</h3>
            <p className="text-white/70 text-lg">
              {new Date(photo.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric"
              })}
            </p>
            <p className="text-white/50 text-sm mt-2">
              {currentIndex + 1} / {photos.length}
            </p>
          </div>
        </motion.div>

        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4 md:hidden">
          {hasPrev && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onNavigate("prev");
              }}
              className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors duration-200"
              aria-label="Previous photo"
            >
              <IoChevronBack size={24} />
            </button>
          )}
          {hasNext && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onNavigate("next");
              }}
              className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors duration-200"
              aria-label="Next photo"
            >
              <IoChevronForward size={24} />
            </button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
