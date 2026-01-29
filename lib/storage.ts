import { UserPhoto } from "@/types";

const DB_NAME = "LoveNotesDB";
const DB_VERSION = 1;
const USER_PHOTOS_STORE = "userPhotos";
const DELETED_PHOTOS_STORE = "deletedPhotos";

// Initialize IndexedDB
export const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      reject(new Error("IndexedDB is not supported in this browser"));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      reject(new Error("Failed to open database"));
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // Create userPhotos store
      if (!db.objectStoreNames.contains(USER_PHOTOS_STORE)) {
        const userPhotosStore = db.createObjectStore(USER_PHOTOS_STORE, {
          keyPath: "id",
        });
        userPhotosStore.createIndex("category", "category", { unique: false });
        userPhotosStore.createIndex("date", "date", { unique: false });
        userPhotosStore.createIndex("uploadedAt", "uploadedAt", {
          unique: false,
        });
      }

      // Create deletedPhotos store
      if (!db.objectStoreNames.contains(DELETED_PHOTOS_STORE)) {
        db.createObjectStore(DELETED_PHOTOS_STORE, { keyPath: "id" });
      }
    };
  });
};

// Add a user-uploaded photo
export const addUserPhoto = async (photo: UserPhoto): Promise<void> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([USER_PHOTOS_STORE], "readwrite");
    const store = transaction.objectStore(USER_PHOTOS_STORE);
    const request = store.add(photo);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = () => {
      reject(new Error("Failed to add photo"));
    };

    transaction.oncomplete = () => {
      db.close();
    };
  });
};

// Get all user-uploaded photos
export const getUserPhotos = async (): Promise<UserPhoto[]> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([USER_PHOTOS_STORE], "readonly");
    const store = transaction.objectStore(USER_PHOTOS_STORE);
    const request = store.getAll();

    request.onsuccess = () => {
      resolve(request.result || []);
    };

    request.onerror = () => {
      reject(new Error("Failed to get photos"));
    };

    transaction.oncomplete = () => {
      db.close();
    };
  });
};

// Delete a user-uploaded photo
export const deleteUserPhoto = async (photoId: string): Promise<void> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([USER_PHOTOS_STORE], "readwrite");
    const store = transaction.objectStore(USER_PHOTOS_STORE);
    const request = store.delete(photoId);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = () => {
      reject(new Error("Failed to delete photo"));
    };

    transaction.oncomplete = () => {
      db.close();
    };
  });
};

// Mark a photo as deleted (for static photos)
export const markPhotoAsDeleted = async (photoId: string): Promise<void> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([DELETED_PHOTOS_STORE], "readwrite");
    const store = transaction.objectStore(DELETED_PHOTOS_STORE);
    const request = store.add({ id: photoId });

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = () => {
      // If already exists, that's fine
      if (request.error?.name === "ConstraintError") {
        resolve();
      } else {
        reject(new Error("Failed to mark photo as deleted"));
      }
    };

    transaction.oncomplete = () => {
      db.close();
    };
  });
};

// Get all deleted photo IDs
export const getDeletedPhotoIds = async (): Promise<Set<string>> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([DELETED_PHOTOS_STORE], "readonly");
    const store = transaction.objectStore(DELETED_PHOTOS_STORE);
    const request = store.getAll();

    request.onsuccess = () => {
      const deletedIds = new Set(
        (request.result || []).map((item: { id: string }) => item.id)
      );
      resolve(deletedIds);
    };

    request.onerror = () => {
      reject(new Error("Failed to get deleted photo IDs"));
    };

    transaction.oncomplete = () => {
      db.close();
    };
  });
};

// Delete a photo (handles both user-uploaded and static photos)
export const deletePhoto = async (
  photoId: string,
  isUserUploaded: boolean
): Promise<void> => {
  if (isUserUploaded) {
    await deleteUserPhoto(photoId);
  } else {
    await markPhotoAsDeleted(photoId);
  }
};

// Clear all data (for testing or reset)
export const clearAllData = async (): Promise<void> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(
      [USER_PHOTOS_STORE, DELETED_PHOTOS_STORE],
      "readwrite"
    );

    const userPhotosStore = transaction.objectStore(USER_PHOTOS_STORE);
    const deletedPhotosStore = transaction.objectStore(DELETED_PHOTOS_STORE);

    userPhotosStore.clear();
    deletedPhotosStore.clear();

    transaction.oncomplete = () => {
      db.close();
      resolve();
    };

    transaction.onerror = () => {
      reject(new Error("Failed to clear data"));
    };
  });
};

// Export data for backup
export const exportData = async (): Promise<{
  userPhotos: UserPhoto[];
  deletedPhotoIds: string[];
}> => {
  const userPhotos = await getUserPhotos();
  const deletedIds = await getDeletedPhotoIds();
  return {
    userPhotos,
    deletedPhotoIds: Array.from(deletedIds),
  };
};

// Import data from backup
export const importData = async (data: {
  userPhotos: UserPhoto[];
  deletedPhotoIds: string[];
}): Promise<void> => {
  await clearAllData();

  // Import user photos
  for (const photo of data.userPhotos) {
    await addUserPhoto(photo);
  }

  // Import deleted photo IDs
  for (const photoId of data.deletedPhotoIds) {
    await markPhotoAsDeleted(photoId);
  }
};

// Check if IndexedDB is supported
export const isIndexedDBSupported = (): boolean => {
  return typeof window !== "undefined" && !!window.indexedDB;
};
