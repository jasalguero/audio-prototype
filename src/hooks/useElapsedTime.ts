import { useState, useRef, useEffect, useCallback } from "react";

const UPDATE_INTERVAL = 1; // update every second

export default function useElapsedTime({ isPlaying }: { isPlaying: boolean }) {
  const [displayTime, setDisplayTime] = useState(0);
  const [formattedTime, setFormattedTime] = useState("00:00");
  const requestRef = useRef<number | null>(null);
  const previousTimeRef = useRef<number | null>(null);
  const elapsedTimeRef = useRef<number>(0);

  const loop = (time: number) => {
    const timeSec = time / 1000;

    if (previousTimeRef.current === null) {
      previousTimeRef.current = timeSec;
      requestRef.current = requestAnimationFrame(loop);
      return;
    }

    // get current elapsed time
    const deltaTime = timeSec - previousTimeRef.current;
    const currentElapsedTime = elapsedTimeRef.current + deltaTime;

    // update refs with the current elapsed time
    previousTimeRef.current = timeSec;
    elapsedTimeRef.current = currentElapsedTime;
    const currentDisplayTime =
      ((currentElapsedTime / UPDATE_INTERVAL) | 0) * UPDATE_INTERVAL;
    setDisplayTime(currentDisplayTime);
    setFormattedTime(formatTime(currentDisplayTime));

    requestRef.current = requestAnimationFrame(loop);
  };

  const formatTime = (time: number) => {
    const seconds = Math.floor(time % 60);
    const minutes = Math.floor(time / 60) % 60;
    return `${minutes < 10 ? "0" + minutes.toString() : minutes}:${
      seconds < 10 ? "0" + seconds.toString() : seconds
    }`;
  };

  const reset = useCallback(() => {
    cleanup();

    elapsedTimeRef.current = 0;
    setDisplayTime(0);

    if (isPlaying) {
      requestRef.current = requestAnimationFrame(loop);
    }
  }, [isPlaying]);

  const cleanup = () => {
    requestRef.current && cancelAnimationFrame(requestRef.current);
    previousTimeRef.current = null;
  };

  useEffect(() => {
    if (isPlaying) {
      requestRef.current = requestAnimationFrame(loop);
    }

    return cleanup;
    // start animation over when duration or updateInterval change
  }, [isPlaying]);

  return { elapsedTime: displayTime, formattedTime, reset };
}
