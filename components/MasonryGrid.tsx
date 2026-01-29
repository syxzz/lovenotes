"use client";

import { Photo } from "@/types";
import PhotoCard from "./PhotoCard";

interface MasonryGridProps {
  photos: Photo[];
  onPhotoClick: (photo: Photo, index: number) => void;
}

export default function MasonryGrid({ photos, onPhotoClick }: MasonryGridProps) {
  return (
    <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
      {photos.map((photo, index) => (
        <div key={photo.id} className="break-inside-avoid">
          <PhotoCard
            photo={photo}
            onClick={() => onPhotoClick(photo, index)}
            index={index}
          />
        </div>
      ))}
    </div>
  );
}
