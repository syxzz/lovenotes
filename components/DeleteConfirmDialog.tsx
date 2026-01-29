"use client";

import { motion, AnimatePresence } from "framer-motion";
import { IoClose, IoWarning } from "react-icons/io5";
import { Photo } from "@/types";
import Image from "next/image";

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  photo: Photo | null;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting?: boolean;
}

export default function DeleteConfirmDialog({
  isOpen,
  photo,
  onClose,
  onConfirm,
  isDeleting = false,
}: DeleteConfirmDialogProps) {
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && !isDeleting) {
      onClose();
    }
  };

  if (!photo) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={handleBackdropClick}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-soft-gray">
              <div className="flex items-center gap-3">
                <IoWarning className="w-6 h-6 text-red-500" />
                <h2 className="text-xl font-serif font-bold text-foreground">
                  Delete Photo
                </h2>
              </div>
              <button
                onClick={onClose}
                disabled={isDeleting}
                className="text-foreground/40 hover:text-foreground/70 transition-colors disabled:opacity-50"
                aria-label="Close"
              >
                <IoClose className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              {/* Photo Preview */}
              <div className="relative w-full h-48 rounded-lg overflow-hidden bg-soft-gray">
                <Image
                  src={photo.url}
                  alt={photo.caption}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>

              {/* Photo Info */}
              <div className="space-y-2">
                <p className="font-semibold text-foreground">{photo.caption}</p>
                <p className="text-sm text-foreground/60">
                  {new Date(photo.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>

              {/* Warning Message */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-700">
                  Are you sure you want to delete this photo? This action cannot be undone.
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={onClose}
                  disabled={isDeleting}
                  className="flex-1 px-6 py-3 border border-soft-gray text-foreground rounded-lg font-semibold hover:bg-soft-gray transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={onConfirm}
                  disabled={isDeleting}
                  className="flex-1 px-6 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
