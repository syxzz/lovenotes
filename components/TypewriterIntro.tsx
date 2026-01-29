"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

interface TypewriterIntroProps {
  text: string[];
  typingSpeed?: number;
}

export default function TypewriterIntro({
  text,
  typingSpeed = 60
}: TypewriterIntroProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [currentParagraph, setCurrentParagraph] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (currentParagraph >= text.length) {
      setTimeout(() => {
        setIsComplete(true);
      }, 500);
      return;
    }

    const currentText = text[currentParagraph];

    if (currentChar < currentText.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + currentText[currentChar]);
        setCurrentChar(prev => prev + 1);
      }, typingSpeed);

      return () => clearTimeout(timeout);
    } else if (currentParagraph < text.length - 1) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + "\n\n");
        setCurrentParagraph(prev => prev + 1);
        setCurrentChar(0);
      }, 500);

      return () => clearTimeout(timeout);
    } else {
      setTimeout(() => {
        setIsComplete(true);
      }, 500);
    }
  }, [currentChar, currentParagraph, text, typingSpeed]);

  const handleEnterAlbum = () => {
    router.push("/album");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-cream via-background to-blush">
      <div className="max-w-3xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 md:p-12"
        >
          <div className="prose prose-lg max-w-none">
            <div className="text-foreground leading-relaxed whitespace-pre-wrap font-serif text-lg md:text-xl">
              {displayedText}
              <span className="inline-block w-0.5 h-6 bg-rose ml-1 animate-pulse" />
            </div>
          </div>

          {isComplete && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-8 flex justify-center"
            >
              <button
                onClick={handleEnterAlbum}
                className="px-8 py-4 bg-gradient-to-r from-rose to-dark-rose text-white rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 hover:from-dark-rose hover:to-rose"
              >
                Enter Our Album
              </button>
            </motion.div>
          )}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ duration: 1, delay: 1 }}
          className="text-center mt-6 text-foreground/60 text-sm"
        >
          A collection of our most cherished moments
        </motion.p>
      </div>
    </div>
  );
}
