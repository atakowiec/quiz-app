import React, { createContext, useContext, useEffect, useState } from "react";
import AudioManager from "./AudioManager";

interface AudioContextProps {
  isPlaying: boolean;
  togglePlayPause: () => void;
}

const AudioContext = createContext<AudioContextProps | undefined>(undefined);

export const useAudio = (): AudioContextProps => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useAudio musi być używane wewnątrz AudioProvider");
  }
  return context;
};

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const audioManager = AudioManager.getInstance();
  const [isPlaying, setIsPlaying] = useState<boolean>(
    audioManager.getIsPlaying()
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setIsPlaying(audioManager.getIsPlaying());
    }, 500);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const togglePlayPause = () => {
    audioManager.togglePlayPause();
    setIsPlaying(audioManager.getIsPlaying());
  };

  return (
    <AudioContext.Provider value={{ isPlaying, togglePlayPause }}>
      {children}
    </AudioContext.Provider>
  );
};
