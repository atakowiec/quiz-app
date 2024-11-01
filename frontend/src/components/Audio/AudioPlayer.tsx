// AudioPlayer.tsx
import React from "react";
import { IoIosPlay, IoIosPause } from "react-icons/io";
import styles from "../../styles/AudioPlayer.module.scss";
import { useAudio } from "./AudioContext";

const AudioPlayer: React.FC = () => {
  const { isPlaying, togglePlayPause } = useAudio();

  return (
    <button
      onClick={togglePlayPause}
      className={styles.audioButton}
      aria-label={isPlaying ? "Pause audio" : "Play audio"}
    >
      {isPlaying ? (
        <IoIosPause className={styles.audioIcon} />
      ) : (
        <IoIosPlay className={styles.audioIcon} />
      )}
      <span className={styles.audioText}>{isPlaying ? "Pause" : "Play"}</span>
    </button>
  );
};

export default AudioPlayer;
