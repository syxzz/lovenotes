"use client";

import { useState, useEffect, useCallback } from "react";
import { Photo, UserPhoto } from "@/types";
import { photos as staticPhotos } from "@/data/photos";
import {
  getUserPhotos,
  getDeletedPhotoIds,
  addUserPhoto,
  deletePhoto as deletePhotoFromStorage,
  isIndexedDBSupported,
} from "@/lib/storage";

interface UsePhotosReturn {
  photos: Photo[];
  isLoading: boolean;
  error: string | null;
  addPhoto: (photo: UserPhoto) => Promise<void>;
  deletePhoto: (photoId: string, isUserUploaded: boolean) => Promise<void>;
  refreshPhotos: () => Promise<void>;
}

export const usePhotos = (): UsePhotosReturn => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load all photos (static + user uploads - deleted)
  const loadPhotos = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Check if IndexedDB is supported
      if (!isIndexedDBSupported()) {
        setPhotos(staticPhotos);
        setIsLoading(false);
        return;
      }

      // Load user photos and deleted IDs in parallel
      const [userPhotos, deletedIds] = await Promise.all([
        getUserPhotos(),
        getDeletedPhotoIds(),
      ]);

      // Filter out deleted static photos
      const activeStaticPhotos = staticPhotos.filter(
        (photo) => !deletedIds.has(photo.id)
      );

      // Convert user photos to Photo format (url will be the base64 data)
      const userPhotosFormatted: Photo[] = userPhotos.map((userPhoto) => ({
        id: userPhoto.id,
        url: userPhoto.imageData, // base64 data URL
        caption: userPhoto.caption,
        date: userPhoto.date,
        category: userPhoto.category,
        orientation: userPhoto.orientation,
        isUserUploaded: true,
        uploadedAt: userPhoto.uploadedAt,
      }));

      // 静态图片在前，用户上传图片在后（按上传时间升序，新上传的排在最后）
      const userPhotosSorted = userPhotosFormatted.sort(
        (a, b) => (a.uploadedAt ?? 0) - (b.uploadedAt ?? 0)
      );
      let allPhotos = [...activeStaticPhotos, ...userPhotosSorted];

      // 当结果为空但存在静态图片时，使用全部静态图片（处理 IndexedDB 异常或首次加载）
      if (allPhotos.length === 0 && staticPhotos.length > 0) {
        allPhotos = [...staticPhotos, ...userPhotosSorted];
      }

      setPhotos(allPhotos);
    } catch (err) {
      console.error("Error loading photos:", err);
      setError("Failed to load photos. Please refresh the page.");
      // Fallback to static photos
      setPhotos(staticPhotos);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Add a new photo
  const addPhoto = useCallback(
    async (photo: UserPhoto) => {
      try {
        await addUserPhoto(photo);
        await loadPhotos(); // Reload to show new photo
      } catch (err) {
        console.error("Error adding photo:", err);
        throw new Error("Failed to add photo. Please try again.");
      }
    },
    [loadPhotos]
  );

  // Delete a photo
  const deletePhoto = useCallback(
    async (photoId: string, isUserUploaded: boolean) => {
      try {
        await deletePhotoFromStorage(photoId, isUserUploaded);
        await loadPhotos(); // Reload to reflect deletion
      } catch (err) {
        console.error("Error deleting photo:", err);
        throw new Error("Failed to delete photo. Please try again.");
      }
    },
    [loadPhotos]
  );

  // Refresh photos manually
  const refreshPhotos = useCallback(async () => {
    await loadPhotos();
  }, [loadPhotos]);

  // Load photos on mount
  useEffect(() => {
    loadPhotos();
  }, [loadPhotos]);

  return {
    photos,
    isLoading,
    error,
    addPhoto,
    deletePhoto,
    refreshPhotos,
  };
};
