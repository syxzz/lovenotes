export type Category = "Travel" | "Daily Life" | "Special Moments" | "Celebrations" | "All";

export interface Photo {
  id: string;
  url: string;
  caption: string;
  date: string;
  category: Exclude<Category, "All">;
  orientation?: "landscape" | "portrait";
}

export interface FilterOption {
  label: string;
  value: Category;
}
