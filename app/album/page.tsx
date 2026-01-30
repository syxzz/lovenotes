"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Category, Photo, UserPhoto } from "@/types";
import { categories } from "@/data/photos";
import FilterBar from "@/components/FilterBar";
import MasonryGrid from "@/components/MasonryGrid";
import Lightbox from "@/components/Lightbox";
import MusicPlayer from "@/components/MusicPlayer";
import UploadButton from "@/components/UploadButton";
import UploadModal from "@/components/UploadModal";
import DeleteConfirmDialog from "@/components/DeleteConfirmDialog";
import { usePhotos } from "@/hooks/usePhotos";
import { useToast } from "@/components/Toast";
import { MUSIC_CONFIG } from "@/data/config";

export default function AlbumPage() {
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [photoToDelete, setPhotoToDelete] = useState<Photo | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { photos, isLoading, error, addPhoto, deletePhoto } = usePhotos();
  const { showToast } = useToast();

  const filteredPhotos = useMemo(() => {
    if (activeCategory === "All") {
      return photos;
    }
    return photos.filter((photo) => photo.category === activeCategory);
  }, [activeCategory, photos]);

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

  const handleUpload = async (photo: UserPhoto) => {
    try {
      await addPhoto(photo);
      showToast("Photo uploaded successfully!", "success");
      setIsUploadModalOpen(false);
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : "Failed to upload photo",
        "error"
      );
    }
  };

  const handleDeleteClick = (photo: Photo) => {
    setPhotoToDelete(photo);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!photoToDelete) return;

    setIsDeleting(true);
    try {
      await deletePhoto(photoToDelete.id, photoToDelete.isUserUploaded || false);
      showToast("Photo deleted successfully", "success");
      setIsDeleteDialogOpen(false);
      setPhotoToDelete(null);

      // Close lightbox if the deleted photo was being viewed
      if (selectedPhoto?.id === photoToDelete.id) {
        setSelectedPhoto(null);
      }
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : "Failed to delete photo",
        "error"
      );
    } finally {
      setIsDeleting(false);
    }
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
            🐟 Story
          </h1>
          <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
            A collection of moments that define us, captured in time and
            treasured forever
          </p>
        </motion.div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-center">
            {error}
          </div>
        )}

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
          {isLoading ? (
            <div className="text-center py-20">
              <div className="inline-block w-12 h-12 border-4 border-rose border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-foreground/60">Loading photos...</p>
            </div>
          ) : filteredPhotos.length > 0 ? (
            <MasonryGrid
              photos={filteredPhotos}
              onPhotoClick={handlePhotoClick}
              onPhotoDelete={handleDeleteClick}
            />
          ) : (
            <div className="text-center py-20">
              <p className="text-2xl text-foreground/50 mb-4">
                No photos in this category yet
              </p>
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="px-6 py-3 bg-gradient-to-r from-rose to-dark-rose text-white rounded-full font-semibold hover:from-dark-rose hover:to-rose transition-all"
              >
                Upload Your First Photo
              </button>
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

      <UploadButton onClick={() => setIsUploadModalOpen(true)} />

      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={handleUpload}
      />

      <DeleteConfirmDialog
        isOpen={isDeleteDialogOpen}
        photo={photoToDelete}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setPhotoToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
      />

      <MusicPlayer audioSrc={MUSIC_CONFIG.audioSrc} autoPlay />
    </div>
  );
}
