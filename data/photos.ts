import { Photo } from "@/types";

export const photos: Photo[] = [
  {
    id: "1",
    url: "https://images.unsplash.com/photo-1502301103665-0b95cc738daf?w=800",
    caption: "Our first adventure together in the mountains",
    date: "2024-03-15",
    category: "Travel",
    orientation: "landscape"
  },
  {
    id: "2",
    url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600",
    caption: "Morning coffee and your beautiful smile",
    date: "2024-04-02",
    category: "Daily Life",
    orientation: "portrait"
  },
  {
    id: "3",
    url: "https://images.unsplash.com/photo-1464047736614-af63643285bf?w=800",
    caption: "Sunset at the beach, holding hands",
    date: "2024-05-20",
    category: "Special Moments",
    orientation: "landscape"
  },
  {
    id: "4",
    url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600",
    caption: "Your birthday celebration with all our friends",
    date: "2024-06-10",
    category: "Celebrations",
    orientation: "portrait"
  },
  {
    id: "5",
    url: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800",
    caption: "Exploring the city streets together",
    date: "2024-07-08",
    category: "Travel",
    orientation: "landscape"
  },
  {
    id: "6",
    url: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600",
    caption: "Lazy Sunday morning in bed",
    date: "2024-07-22",
    category: "Daily Life",
    orientation: "portrait"
  },
  {
    id: "7",
    url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800",
    caption: "The moment you said yes",
    date: "2024-08-14",
    category: "Special Moments",
    orientation: "landscape"
  },
  {
    id: "8",
    url: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600",
    caption: "Our anniversary dinner under the stars",
    date: "2024-09-05",
    category: "Celebrations",
    orientation: "portrait"
  },
  {
    id: "9",
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    caption: "Hiking through the forest trails",
    date: "2024-09-18",
    category: "Travel",
    orientation: "landscape"
  },
  {
    id: "10",
    url: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600",
    caption: "Cooking dinner together in our kitchen",
    date: "2024-10-03",
    category: "Daily Life",
    orientation: "portrait"
  },
  {
    id: "11",
    url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800",
    caption: "Dancing in the rain, just us two",
    date: "2024-10-20",
    category: "Special Moments",
    orientation: "landscape"
  },
  {
    id: "12",
    url: "https://images.unsplash.com/photo-1481653125770-b78c206c59d4?w=600",
    caption: "New Year's Eve countdown kiss",
    date: "2024-12-31",
    category: "Celebrations",
    orientation: "portrait"
  },
  {
    id: "13",
    url: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800",
    caption: "Road trip to the countryside",
    date: "2025-01-10",
    category: "Travel",
    orientation: "landscape"
  },
  {
    id: "14",
    url: "https://images.unsplash.com/photo-1495364141860-b0d03eccd065?w=600",
    caption: "Reading books together on the couch",
    date: "2025-01-25",
    category: "Daily Life",
    orientation: "portrait"
  },
  {
    id: "15",
    url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800",
    caption: "The first time you told me you loved me",
    date: "2024-02-14",
    category: "Special Moments",
    orientation: "landscape"
  }
];

export const categories = [
  { label: "All", value: "All" as const },
  { label: "Travel", value: "Travel" as const },
  { label: "Daily Life", value: "Daily Life" as const },
  { label: "Special Moments", value: "Special Moments" as const },
  { label: "Celebrations", value: "Celebrations" as const }
];
