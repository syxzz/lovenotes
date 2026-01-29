"use client";

import { useState, useRef, ChangeEvent, DragEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoClose, IoCloudUpload, IoImage } from "react-icons/io5";
import { Category, UserPhoto } from "@/types";
import { processImage, validateImage, formatFileSize, generatePhotoId } from "@/lib/imageUtils";
import { categories } from "@/data/photos";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (photo: UserPhoto) => Promise<void>;
}

export default function UploadModal({ isOpen, onClose, onUpload }: UploadModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [category, setCategory] = useState<Exclude<Category, "All">>("Daily Life");
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    setError(null);

    // Validate file
    const validation = validateImage(file);
    if (!validation.valid) {
      setError(validation.error || "Invalid file");
      return;
    }

    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !caption.trim()) {
      setError("Please select an image and provide a caption");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      // Process image
      const processed = await processImage(selectedFile);

      // Create photo object
      const photo: UserPhoto = {
        id: generatePhotoId(),
        url: "", // Not used for user photos
        imageData: processed.base64,
        caption: caption.trim(),
        date,
        category,
        orientation: processed.orientation,
        isUserUploaded: true,
        uploadedAt: Date.now(),
      };

      // Upload
      await onUpload(photo);

      // Reset and close
      handleClose();
    } catch (err) {
      console.error("Upload error:", err);
      setError(err instanceof Error ? err.message : "Failed to upload photo");
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    if (isUploading) return;

    setSelectedFile(null);
    setPreview(null);
    setCaption("");
    setDate(new Date().toISOString().split("T")[0]);
    setCategory("Daily Life");
    setError(null);
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

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
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-soft-gray">
              <h2 className="text-2xl font-serif font-bold text-foreground">
                Upload Photo
              </h2>
              <button
                onClick={handleClose}
                disabled={isUploading}
                className="text-foreground/40 hover:text-foreground/70 transition-colors disabled:opacity-50"
                aria-label="Close"
              >
                <IoClose className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Drag and Drop Zone */}
              {!preview ? (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all ${
                    isDragging
                      ? "border-rose bg-blush/20"
                      : "border-soft-gray hover:border-rose/50 hover:bg-blush/10"
                  }`}
                >
                  <IoCloudUpload className="w-16 h-16 mx-auto mb-4 text-rose" />
                  <p className="text-lg font-semibold text-foreground mb-2">
                    Drop your photo here or click to browse
                  </p>
                  <p className="text-sm text-foreground/60">
                    Supports JPG, PNG, WebP (max 5MB)
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleFileInputChange}
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Preview */}
                  <div className="relative rounded-xl overflow-hidden bg-soft-gray">
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full h-64 object-contain"
                    />
                    <button
                      onClick={() => {
                        setSelectedFile(null);
                        setPreview(null);
                      }}
                      disabled={isUploading}
                      className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors disabled:opacity-50"
                      aria-label="Remove image"
                    >
                      <IoClose className="w-5 h-5" />
                    </button>
                  </div>

                  {/* File Info */}
                  {selectedFile && (
                    <div className="flex items-center gap-2 text-sm text-foreground/60">
                      <IoImage className="w-4 h-4" />
                      <span>{selectedFile.name}</span>
                      <span>•</span>
                      <span>{formatFileSize(selectedFile.size)}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">
                  {error}
                </div>
              )}

              {/* Form Fields */}
              <div className="space-y-4">
                {/* Caption */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Caption *
                  </label>
                  <input
                    type="text"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="Describe this moment..."
                    disabled={isUploading}
                    className="w-full px-4 py-3 border border-soft-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-rose focus:border-transparent disabled:opacity-50 disabled:bg-soft-gray"
                  />
                </div>

                {/* Date */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Date *
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    disabled={isUploading}
                    className="w-full px-4 py-3 border border-soft-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-rose focus:border-transparent disabled:opacity-50 disabled:bg-soft-gray"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Exclude<Category, "All">)}
                    disabled={isUploading}
                    className="w-full px-4 py-3 border border-soft-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-rose focus:border-transparent disabled:opacity-50 disabled:bg-soft-gray"
                  >
                    {categories
                      .filter((cat) => cat.value !== "All")
                      .map((cat) => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleClose}
                  disabled={isUploading}
                  className="flex-1 px-6 py-3 border border-soft-gray text-foreground rounded-lg font-semibold hover:bg-soft-gray transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpload}
                  disabled={!selectedFile || !caption.trim() || isUploading}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-rose to-dark-rose text-white rounded-lg font-semibold hover:from-dark-rose hover:to-rose transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUploading ? "Uploading..." : "Upload Photo"}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
