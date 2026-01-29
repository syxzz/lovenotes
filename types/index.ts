export type Category = "Travel" | "Daily Life" | "Special Moments" | "Celebrations" | "All";

export interface Photo {
  id: string;
  url: string;
  caption: string;
  date: string;
  category: Exclude<Category, "All">;
  orientation?: "landscape" | "portrait";
  isUserUploaded?: boolean;
  uploadedAt?: number;
}

export interface FilterOption {
  label: string;
  value: Category;
}

export interface UserPhoto extends Photo {
  imageData: string;
  isUserUploaded: true;
  uploadedAt: number;
}

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "info";
  message: string;
}
