import { useEffect, useState, useCallback } from "react";

export type RecorderState =
  | "not_initialized"
  | "recording"
  | "inactive"
  | "paused";

const TIMESLICE = 2000;

export function useMediaRecorder() {
  const [isMediaSupported, setIsMediaSupported] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder>();
  const [recorderState, setRecorderState] =
    useState<RecorderState>("not_initialized");
  const [mediaDevices, setMediaDevices] = useState<MediaDeviceInfo[]>([]);

  useEffect(() => {
    const isSupported =
      typeof window !== "undefined" &&
      navigator.mediaDevices &&
      navigator.mediaDevices.getUserMedia !== null;

    setIsMediaSupported(isSupported);
    if (isSupported) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          setMediaRecorder(new MediaRecorder(stream));
          setRecorderState("inactive");
        })
        .catch((error) => console.log("error ->", error));

      navigator.mediaDevices
        .enumerateDevices()
        .then((items) =>
          setMediaDevices(items.filter((item) => item.kind === "audioinput"))
        )
        .catch((error) => console.log("enumerating error", error));
    }
    // cleaning up
    return () => {
      console.log("cleaning up recorder");
      if (mediaRecorder && recorderState === "recording") {
        mediaRecorder.stop();
      }
    };
  }, []);

  const dataAvailable = (e) => {
    console.log(e);
  };

  const startRecording = () => {
    if (mediaRecorder && recorderState === "inactive") {
      mediaRecorder.start(TIMESLICE);
      setRecorderState("recording");
      console.log("start recording");

      mediaRecorder.ondataavailable = dataAvailable;
    } else {
      console.error("media recorder is not available or inactive");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && recorderState === "recording") {
      mediaRecorder.stop();
      setRecorderState("inactive");
      console.log("status", mediaRecorder.state);
    }
  };

  return {
    isMediaSupported,
    mediaRecorder,
    mediaDevices,
    recorderState,
    startRecording,
    stopRecording,
  };
}
