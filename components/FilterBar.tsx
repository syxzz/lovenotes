"use client";

import { motion } from "framer-motion";
import { Category } from "@/types";

interface FilterBarProps {
  categories: { label: string; value: Category }[];
  activeCategory: Category;
  onCategoryChange: (category: Category) => void;
}

export default function FilterBar({
  categories,
  activeCategory,
  onCategoryChange
}: FilterBarProps) {
  return (
    <div className="flex flex-wrap justify-center gap-3 mb-8">
      {categories.map((category, index) => (
        <motion.button
          key={category.value}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          onClick={() => onCategoryChange(category.value)}
          className={`
            px-6 py-2.5 rounded-full font-medium text-sm transition-all duration-300
            ${
              activeCategory === category.value
                ? "bg-gradient-to-r from-rose to-dark-rose text-white shadow-lg scale-105"
                : "bg-white text-foreground hover:bg-soft-gray hover:scale-105 shadow-md"
            }
          `}
        >
          {category.label}
        </motion.button>
      ))}
    </div>
  );
}
