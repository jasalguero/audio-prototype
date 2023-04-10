import { useEffect, useState, useRef } from "react";
import useLogStore from "./logStore";

export type RecorderState =
  | "not_initialized"
  | "recording"
  | "inactive"
  | "paused";

// slices to get audio data
const TIMESLICE = 2000;
// format for the output audio
const AUDIO_FORMAT = {
  type: "audio/ogg; codecs=opus",
};

export type ReactMediaRecorderHookProps = {
  onStop?: (blobUrl: string, blob: Blob) => void;
  onStart?: () => void;
};

export default function useMediaRecorder({
  onStop = () => null,
  onStart = () => null,
}: ReactMediaRecorderHookProps) {
  const { addLog } = useLogStore();
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
    //1. check that the media devices is supported in the browser
    const isSupported =
      typeof window !== "undefined" &&
      navigator.mediaDevices &&
      navigator.mediaDevices.getUserMedia !== null;

    setIsMediaSupported(isSupported);
    //2. if is supported initialize the audio recorder
    if (isSupported) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          setMediaRecorder(new MediaRecorder(stream));
          setRecorderState("inactive");
        })
        .catch((error) => console.log("error ->", error));

      //3. get the list of devices available
      navigator.mediaDevices
        .enumerateDevices()
        .then((items) =>
          setMediaDevices(items.filter((item) => item.kind === "audioinput"))
        )
        .catch((error) => console.log("enumerating error", error));
    }
    //4. clean up the recorder on unmount
    return () => {
      console.log("cleaning up recorder");
      if (mediaRecorder && recorderState === "recording") {
        mediaRecorder.stop();
      }
    };
  }, []);

  /**
   * Triggered when a new slice of audio is available
   * @param event
   */
  const onDataIsAvailable = ({ data }: BlobEvent) => {
    addLog(`processing new data slice`);
    mediaChunks.current.push(data);
  };

  /**
   * Triggered when the recorder stopped
   */
  const onRecordingStopped = () => {
    addLog("recording stopped");
    if (mediaChunks.current.length > 0) {
      // if there are stored slices of audio create the blob
      const blob = new Blob(mediaChunks.current, AUDIO_FORMAT);
      const blobUrl = URL.createObjectURL(blob);
      mediaChunks.current = [];
      setMediaBlobUrl(blobUrl);
      onStop(blobUrl, blob);
      addLog("new audio file created");
    }
    setRecorderState("inactive");
  };

  /**
   * Called from the client to start recordering
   */
  const startRecording = () => {
    if (mediaRecorder && recorderState === "inactive") {
      mediaRecorder.start(TIMESLICE);
      setRecorderState("recording");
      addLog(`start recording with times slices of ${TIMESLICE} seconds`);

      mediaRecorder.ondataavailable = onDataIsAvailable;
      mediaRecorder.onstop = onRecordingStopped;
      onStart();
    } else {
      console.error("media recorder is not available or inactive");
    }
  };

  /**
   * Called from the client to stop recording
   */
  const stopRecording = () => {
    if (
      mediaRecorder &&
      (recorderState === "recording" || recorderState === "paused")
    ) {
      mediaRecorder.stop();
      setRecorderState("inactive");
      addLog(`stopped recording`);
    }
  };

  /**
   * Called from the client to resume recording
   */
  const resumeRecording = () => {
    if (mediaRecorder && recorderState === "paused") {
      setRecorderState("recording");
      mediaRecorder.resume();
      addLog(`resumed recording`);
    }
  };

  /**
   * Called from the client to pause recording
   */
  const pauseRecording = () => {
    if (mediaRecorder && recorderState === "recording") {
      mediaRecorder.pause();
      setRecorderState("paused");
      addLog(`paused recording`);
    }
  };

  /**
   * Clean recorded audio
   */
  const clearStoredAudio = () => {
    if (mediaBlobUrl) {
      URL.revokeObjectURL(mediaBlobUrl);
    }
    setMediaBlobUrl(undefined);
    setRecorderState("inactive");
    addLog("clearing stored audio");
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
    resumeRecording,
  };
}
