"use client";

import { motion } from "framer-motion";
import { IoAdd } from "react-icons/io5";

interface UploadButtonProps {
  onClick: () => void;
}

export default function UploadButton({ onClick }: UploadButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.1, rotate: 90 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-24 right-6 z-30 w-16 h-16 rounded-full bg-gradient-to-br from-gold to-dark-rose text-white shadow-xl hover:shadow-2xl flex items-center justify-center transition-shadow duration-300"
      aria-label="Upload photo"
    >
      <IoAdd className="w-8 h-8" />
    </motion.button>
  );
}
