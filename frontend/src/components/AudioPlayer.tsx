import React, { useRef, useState, useEffect } from "react";
import H5AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import styles from "../styles/AudioPlayer.module.scss";

const AudioPlayer = () => {
  const audioPlayerRef = useRef<H5AudioPlayer>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [songSrc, setSongSrc] = useState("");

  useEffect(() => {
    const randomSongNumber = Math.floor(Math.random() * 5) + 1;
    setSongSrc(`/assets/music/song${randomSongNumber}.mp3`);
  }, []);

  const togglePlayPause = () => {
    if (audioPlayerRef.current?.audio.current) {
      if (audioPlayerRef.current.audio.current.paused) {
        audioPlayerRef.current.audio.current.play();
        setIsPlaying(true);
      } else {
        audioPlayerRef.current.audio.current.pause();
        setIsPlaying(false);
      }
    }
  };

  return (
    <div>
      <button
        onClick={togglePlayPause}
        style={{
          backgroundColor: isPlaying ? "green" : "red",
          position: "absolute",
          bottom: 0,
          right: 0,
          zIndex: 1000,
        }}
        className={styles.audioButton}
      >
        <span className={styles.audioText}>
          {isPlaying ? "Pause" : "Play"} Music
        </span>
      </button>
      <H5AudioPlayer
        ref={audioPlayerRef}
        src={songSrc}
        autoPlay={false}
        loop
        volume={0.1}
        style={{ display: "none" }}
      />
    </div>
  );
};

export default AudioPlayer;
