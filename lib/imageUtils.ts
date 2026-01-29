// Supported image formats
const SUPPORTED_FORMATS = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_WIDTH = 1920;
const COMPRESSION_QUALITY = 0.8;

export interface ProcessedImage {
  base64: string;
  orientation: "landscape" | "portrait";
  width: number;
  height: number;
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

// Validate image file
export const validateImage = (file: File): ValidationResult => {
  // Check file type
  if (!SUPPORTED_FORMATS.includes(file.type)) {
    return {
      valid: false,
      error: `Unsupported format. Please use JPG, PNG, or WebP images.`,
    };
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
    return {
      valid: false,
      error: `File too large (${sizeMB}MB). Maximum size is 5MB.`,
    };
  }

  return { valid: true };
};

// Load image from file
const loadImage = (file: File): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = e.target?.result as string;
    };

    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
};

// Calculate new dimensions while maintaining aspect ratio
const calculateDimensions = (
  originalWidth: number,
  originalHeight: number,
  maxWidth: number
): { width: number; height: number } => {
  if (originalWidth <= maxWidth) {
    return { width: originalWidth, height: originalHeight };
  }

  const ratio = originalHeight / originalWidth;
  const width = maxWidth;
  const height = Math.round(maxWidth * ratio);

  return { width, height };
};

// Determine orientation
const getOrientation = (
  width: number,
  height: number
): "landscape" | "portrait" => {
  return width >= height ? "landscape" : "portrait";
};

// Process and compress image
export const processImage = async (
  file: File
): Promise<ProcessedImage> => {
  // Validate first
  const validation = validateImage(file);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  // Load image
  const img = await loadImage(file);

  // Calculate new dimensions
  const { width, height } = calculateDimensions(
    img.width,
    img.height,
    MAX_WIDTH
  );

  // Create canvas and resize
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Failed to get canvas context");
  }

  // Draw and compress
  ctx.drawImage(img, 0, 0, width, height);

  // Convert to base64
  const base64 = canvas.toDataURL("image/jpeg", COMPRESSION_QUALITY);

  return {
    base64,
    orientation: getOrientation(width, height),
    width,
    height,
  };
};

// Create a thumbnail (for previews)
export const createThumbnail = async (
  file: File,
  maxSize: number = 300
): Promise<string> => {
  const img = await loadImage(file);

  const { width, height } = calculateDimensions(
    img.width,
    img.height,
    maxSize
  );

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Failed to get canvas context");
  }

  ctx.drawImage(img, 0, 0, width, height);

  return canvas.toDataURL("image/jpeg", 0.7);
};

// Get file extension from filename
export const getFileExtension = (filename: string): string => {
  const parts = filename.split(".");
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : "";
};

// Format file size for display
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
};

// Check if file is an image
export const isImageFile = (file: File): boolean => {
  return file.type.startsWith("image/");
};

// Generate a unique ID for photos
export const generatePhotoId = (): string => {
  return `photo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};
