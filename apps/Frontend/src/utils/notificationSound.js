let audio = null;

export const initNotificationSound = () => {
  audio = new Audio('/notification-sound.mp3');
  // Pre-load the audio
  audio.load();
};

export const playNotificationSound = async () => {
  try {
    if (!audio) {
      initNotificationSound();
    }
    
    // Check if we can play audio
    if (document.visibilityState === 'visible') {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.warn('Audio playback failed:', error);
        });
      }
    }
  } catch (error) {
    console.warn('Could not play notification sound:', error);
  }
};