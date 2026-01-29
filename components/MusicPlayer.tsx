"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  IoMusicalNotes,
  IoPlay,
  IoPause,
  IoVolumeHigh,
  IoVolumeMute
} from "react-icons/io5";

interface MusicPlayerProps {
  audioSrc?: string;
}

export default function MusicPlayer({ audioSrc }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    return () => {
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
    };
  }, [audioSrc]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          // AbortError 表示 play 被 pause 中断，属于正常情况
          if (err.name !== "AbortError") {
            console.error("Audio play failed:", err);
          }
        });
      }
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (newVolume > 0) {
      setIsMuted(false);
    }
  };

  if (!audioSrc) {
    return null;
  }

  return (
    <>
      <audio ref={audioRef} loop>
        <source src={audioSrc} type="audio/mpeg" />
      </audio>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.5 }}
        className="fixed bottom-6 right-6 z-40"
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={togglePlay}
            className="w-14 h-14 rounded-full bg-gradient-to-r from-rose to-dark-rose text-white shadow-lg hover:shadow-xl flex items-center justify-center transition-shadow duration-300"
            aria-label={isPlaying ? "Pause music" : "Play music"}
          >
            {isPlaying ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <IoPause size={24} />
              </motion.div>
            ) : (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <IoPlay size={24} className="ml-1" />
              </motion.div>
            )}
          </motion.button>

          {isPlaying && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1"
            >
              <IoMusicalNotes
                size={20}
                className="text-gold animate-bounce"
              />
            </motion.div>
          )}

          <AnimatePresence>
            {showControls && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="absolute right-16 top-1/2 -translate-y-1/2 bg-white rounded-full shadow-lg px-4 py-3 flex items-center gap-3"
              >
                <button
                  onClick={toggleMute}
                  className="text-foreground hover:text-rose transition-colors"
                  aria-label={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted ? (
                    <IoVolumeMute size={20} />
                  ) : (
                    <IoVolumeHigh size={20} />
                  )}
                </button>

                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-24 h-1 bg-soft-gray rounded-lg appearance-none cursor-pointer accent-rose"
                  aria-label="Volume control"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </>
  );
}
