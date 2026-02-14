"use client";

import { useState, useEffect, useRef } from "react";
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
  const [showHint, setShowHint] = useState(false);
  const router = useRouter();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Show hint after 2 seconds
  useEffect(() => {
    const hintTimeout = setTimeout(() => {
      if (!isComplete) {
        setShowHint(true);
      }
    }, 2000);

    return () => clearTimeout(hintTimeout);
  }, [isComplete]);

  useEffect(() => {
    if (currentParagraph >= text.length) {
      timeoutRef.current = setTimeout(() => {
        setIsComplete(true);
      }, 500);
      return;
    }

    const currentText = text[currentParagraph];

    if (currentChar < currentText.length) {
      timeoutRef.current = setTimeout(() => {
        setDisplayedText(prev => prev + currentText[currentChar]);
        setCurrentChar(prev => prev + 1);
      }, typingSpeed);

      return () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      };
    } else if (currentParagraph < text.length - 1) {
      timeoutRef.current = setTimeout(() => {
        setDisplayedText(prev => prev + "\n\n");
        setCurrentParagraph(prev => prev + 1);
        setCurrentChar(0);
      }, 500);

      return () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      };
    } else {
      timeoutRef.current = setTimeout(() => {
        setIsComplete(true);
      }, 500);
    }
  }, [currentChar, currentParagraph, text, typingSpeed]);

  const handleSkip = () => {
    if (isComplete) return;

    // Clear any pending timeouts
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Show all text immediately
    setDisplayedText(text.join("\n\n"));
    setIsComplete(true);
  };

  const handleEnterAlbum = () => {
    router.push("/album");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-cream via-background to-blush"
      onClick={handleSkip}
      style={{ cursor: isComplete ? "default" : "pointer" }}
    >
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
              {!isComplete && (
                <span className="inline-block w-0.5 h-6 bg-rose ml-1 animate-pulse" />
              )}
            </div>
          </div>

          {!isComplete && showHint && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ duration: 0.5 }}
              className="text-center mt-6 text-foreground/50 text-sm"
            >
              Click anywhere to skip
            </motion.p>
          )}

          {isComplete && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-8 flex justify-center"
            >
              <button
                onClick={handleEnterAlbum}
                className="px-8 py-4 bg-linear-to-r from-rose to-dark-rose text-white rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 hover:from-dark-rose hover:to-rose cursor-pointer!"
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
