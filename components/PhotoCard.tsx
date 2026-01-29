"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Photo } from "@/types";
import { useState } from "react";
import { IoTrash } from "react-icons/io5";

interface PhotoCardProps {
  photo: Photo;
  onClick: () => void;
  onDelete?: () => void;
  index: number;
}

export default function PhotoCard({ photo, onClick, onDelete, index }: PhotoCardProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="group relative cursor-pointer overflow-hidden rounded-lg shadow-md hover:shadow-2xl transition-shadow duration-300"
      onClick={onClick}
    >
      <div className="relative aspect-[4/3] bg-soft-gray">
        {!isLoaded && (
          <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-soft-gray via-blush/20 to-soft-gray" />
        )}
        <Image
          src={photo.url}
          alt={photo.caption}
          fill
          unoptimized
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className={`object-cover transition-all duration-500 ${
            isLoaded ? "opacity-100" : "opacity-0"
          } group-hover:scale-110`}
          onLoad={() => setIsLoaded(true)}
        />

        {/* Delete Button - only show when onDelete is provided */}
        {onDelete && (
          <button
            onClick={handleDeleteClick}
            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-red-600 z-10"
            aria-label="Delete photo"
          >
            <IoTrash className="w-4 h-4" />
          </button>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            <p className="font-semibold text-lg mb-1">{photo.caption}</p>
            <p className="text-sm text-white/80">{new Date(photo.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
