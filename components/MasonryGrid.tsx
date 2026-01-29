"use client";

import { Photo } from "@/types";
import PhotoCard from "./PhotoCard";

interface MasonryGridProps {
  photos: Photo[];
  onPhotoClick: (photo: Photo, index: number) => void;
  onPhotoDelete?: (photo: Photo) => void;
}

export default function MasonryGrid({ photos, onPhotoClick, onPhotoDelete }: MasonryGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {photos.map((photo, index) => (
        <div key={photo.id}>
          <PhotoCard
            photo={photo}
            onClick={() => onPhotoClick(photo, index)}
            onDelete={onPhotoDelete ? () => onPhotoDelete(photo) : undefined}
            index={index}
          />
        </div>
      ))}
    </div>
  );
}
