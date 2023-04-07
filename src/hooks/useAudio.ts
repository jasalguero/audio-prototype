import { useEffect, useState, useRef } from "react";

export type RecorderState =
  | "not_initialized"
  | "recording"
  | "inactive"
  | "paused";

const TIMESLICE = 2000;
const AUDIO_FORMAT = {
  type: "audio/ogg; codecs=opus",
};

export type ReactMediaRecorderHookProps = {
  onStop?: (blobUrl: string, blob: Blob) => void;
  onStart?: () => void;
  // add it to delegate options to the parent components?
  // mediaRecorderOptions?: MediaRecorderOptions | undefined;
};

export default function useMediaRecorder({
  onStop = () => null,
  onStart = () => null,
}: ReactMediaRecorderHookProps) {
  const [isMediaSupported, setIsMediaSupported] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder>();
  const [recorderState, setRecorderState] =
    useState<RecorderState>("not_initialized");
  const [mediaDevices, setMediaDevices] = useState<MediaDeviceInfo[]>([]);
  const mediaChunks = useRef<Blob[]>([]);
  const [mediaBlobUrl, setMediaBlobUrl] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    console.log("initializing the media recorder");
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

  const onDataIsAvailable = ({ data }: BlobEvent) => {
    console.log("new audio slice available", data);
    mediaChunks.current.push(data);
  };

  const onRecordingStopped = () => {
    console.log("recording stopped");
    if (mediaChunks.current.length > 0) {
      const blob = new Blob(mediaChunks.current, AUDIO_FORMAT);
      const blobUrl = URL.createObjectURL(blob);
      mediaChunks.current = [];
      setMediaBlobUrl(blobUrl);
      onStop(blobUrl, blob);
    }
    setRecorderState("inactive");
  };

  const startRecording = () => {
    if (mediaRecorder && recorderState === "inactive") {
      mediaRecorder.start(TIMESLICE);
      setRecorderState("recording");
      console.log("start recording");

      mediaRecorder.ondataavailable = onDataIsAvailable;
      mediaRecorder.onstop = onRecordingStopped;
      onStart();
    } else {
      console.error("media recorder is not available or inactive");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && recorderState === "recording") {
      mediaRecorder.stop();
      setRecorderState("inactive");
      console.log("stopping...", mediaRecorder.state);
    }
  };

  const resumeRecording = () => {
    if (mediaRecorder && recorderState === "paused") {
      setRecorderState("recording");
      mediaRecorder.resume();
    }
  };

  const pauseRecording = () => {
    if (mediaRecorder && recorderState === "recording") {
      mediaRecorder.pause();
      setRecorderState("paused");
      console.log("pausing...", mediaRecorder.state);
    }
  };

  const clearStoredAudio = () => {
    if (mediaBlobUrl) {
      URL.revokeObjectURL(mediaBlobUrl);
    }
    setMediaBlobUrl(undefined);
    setRecorderState("inactive");
  };

  return {
    isMediaSupported,
    mediaRecorder,
    mediaDevices,
    recorderState,
    startRecording,
    stopRecording,
    pauseRecording,
    clearStoredAudio,
    resumeRecording
  };
}
