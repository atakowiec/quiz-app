import { IoIosPlay, IoIosPause } from "react-icons/io";
import styles from "../../styles/AudioPlayer.module.scss";
import { useAudio } from "./AudioContext";
import { FC } from "react";

const AudioPlayer: FC = () => {
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
      <span className={styles.audioText}>
        {isPlaying ? "Pauza" : "Odtwórz"}
      </span>
    </button>
  );
};

export default AudioPlayer;
