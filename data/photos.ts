import { Photo } from "@/types";

const IMAGE_FILES = [
  "v2-1bd3131262a032f05ccd15a06cffeb10_1440w.jpg",
  "v2-1d60df22fbc3d4e60f90d4d8dd8748ca~resize_1440_q75.jpg",
  "v2-2f41addf23ab7036346ed25d336bf522~resize_1440_q75.jpg",
  "v2-3a8909a995aac2983374c0e4dfe9f50b~resize_1440_q75.jpg",
  "v2-40124c5e0c4f08c1efb185a3b2d1117c~resize_1440_q75.jpg",
  "v2-53635f22e61cd927a37d4fb2a0c1c3e1~resize_1440_q75.jpg",
  "v2-82f92cddd96fffe7a6ea337880ab521d~resize_1440_q75.jpg",
  "v2-8d27fb142c6fa96483522922f398b871~resize_1440_q75.jpg",
  "v2-95ef520c889268816f9a95981d5b18fb_1440w.jpeg",
  "v2-a6b2a03dc9b59382b18d9732fa288f50~resize_1440_q75.jpg",
  "v2-c62681fd66ab5c32a1d325d3c9b801c0~resize_1440_q75.jpg",
  "v2-dee58aa215c75bd163c8b4939f0a716a~resize_1440_q75.jpg"
];

const CAPTIONS = [
  "A quiet moment worth remembering",
  "Every day with you feels special",
  "Simple joys of everyday life",
  "Little moments, big memories",
  "Finding beauty in the ordinary",
  "Together in our cozy corner",
  "Another day, another blessing",
  "Life's small pleasures",
  "Our daily rhythm",
  "Warmth and comfort at home",
  "Cherishing the present",
  "Grateful for today"
];

export const photos: Photo[] = IMAGE_FILES.map((filename, index) => ({
  id: String(index + 1),
  url: `/images/${filename}`,
  caption: CAPTIONS[index % CAPTIONS.length],
  date: "2025-01-29",
  category: "Daily Life" as const,
  orientation: index % 3 === 0 ? "portrait" : "landscape"
}));

export const categories = [
  { label: "All", value: "All" as const },
  { label: "Travel", value: "Travel" as const },
  { label: "Daily Life", value: "Daily Life" as const },
  { label: "Special Moments", value: "Special Moments" as const },
  { label: "Celebrations", value: "Celebrations" as const }
];
