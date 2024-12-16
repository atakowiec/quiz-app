class AudioManager {
  private static instance: AudioManager;
  private audio: HTMLAudioElement;
  private isPlaying: boolean = false;
  private currentSongIndex: number = 0;
  private songs: string[] = [
    "/assets/music/song1.mp3",
    "/assets/music/song2.mp3",
    "/assets/music/song3.mp3",
    "/assets/music/song4.mp3",
    "/assets/music/song5.mp3",
  ];

  private constructor() {
    this.audio = new Audio();
    this.audio.volume = 0.1;

    // Wczytanie zapisanego stanu z localStorage
    const savedIndex = localStorage.getItem("currentSongIndex");
    const savedIsPlaying = localStorage.getItem("isPlaying");

    if (savedIndex !== null) {
      const index = parseInt(savedIndex, 10);
      if (!isNaN(index) && index >= 0 && index < this.songs.length) {
        this.currentSongIndex = index;
      }
    } else {
      // Jeśli brak zapisanego indeksu, wybierz losową piosenkę
      this.currentSongIndex = Math.floor(Math.random() * this.songs.length);
    }

    this.audio.src = this.songs[this.currentSongIndex];

    if (savedIsPlaying === "true") {
      this.play();
    }

    this.audio.addEventListener("ended", this.handleSongEnd);
  }

  public static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  public play() {
    this.isPlaying = true;
    localStorage.setItem("isPlaying", "true");

    this.audio.play().catch(() => {
      this.isPlaying = false;
    });
  }

  public pause() {
    this.isPlaying = false;
    localStorage.setItem("isPlaying", "false");
    this.audio.pause();
  }

  public togglePlayPause() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  private handleSongEnd = () => {
    this.currentSongIndex = (this.currentSongIndex + 1) % this.songs.length;
    localStorage.setItem("currentSongIndex", this.currentSongIndex.toString());
    this.audio.src = this.songs[this.currentSongIndex];
    this.play();
  };
}

export default AudioManager;
