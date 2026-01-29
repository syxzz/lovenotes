"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Category, Photo } from "@/types";
import { photos, categories } from "@/data/photos";
import FilterBar from "@/components/FilterBar";
import MasonryGrid from "@/components/MasonryGrid";
import Lightbox from "@/components/Lightbox";
import MusicPlayer from "@/components/MusicPlayer";
import { MUSIC_CONFIG } from "@/data/config";

export default function AlbumPage() {
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const filteredPhotos = useMemo(() => {
    if (activeCategory === "All") {
      return photos;
    }
    return photos.filter((photo) => photo.category === activeCategory);
  }, [activeCategory]);

  const handlePhotoClick = (photo: Photo, index: number) => {
    setSelectedPhoto(photo);
    setSelectedIndex(index);
  };

  const handleCloseLightbox = () => {
    setSelectedPhoto(null);
  };

  const handleNavigate = (direction: "prev" | "next") => {
    const newIndex =
      direction === "prev"
        ? Math.max(0, selectedIndex - 1)
        : Math.min(filteredPhotos.length - 1, selectedIndex + 1);

    setSelectedIndex(newIndex);
    setSelectedPhoto(filteredPhotos[newIndex]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-background to-blush/30">
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-foreground mb-4">
            Our Love Story
          </h1>
          <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
            A collection of moments that define us, captured in time and
            treasured forever
          </p>
        </motion.div>

        <FilterBar
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        <motion.div
          key={activeCategory}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {filteredPhotos.length > 0 ? (
            <MasonryGrid
              photos={filteredPhotos}
              onPhotoClick={handlePhotoClick}
            />
          ) : (
            <div className="text-center py-20">
              <p className="text-2xl text-foreground/50">
                No photos in this category yet
              </p>
            </div>
          )}
        </motion.div>
      </div>

      {selectedPhoto && (
        <Lightbox
          photo={selectedPhoto}
          photos={filteredPhotos}
          currentIndex={selectedIndex}
          onClose={handleCloseLightbox}
          onNavigate={handleNavigate}
        />
      )}

      <MusicPlayer audioSrc={MUSIC_CONFIG.audioSrc} />
    </div>
  );
}
