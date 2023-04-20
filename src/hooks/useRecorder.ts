import { useEffect, useState, useRef, useCallback } from "react";
import useLogStore from "./logStore";
import useAudioLocalStore from "./useAudioLocalStore";
import { RECORDING_SETTINGS } from "~/utils/consts";

export type RecorderState =
  | "not_initialized"
  | "recording"
  | "inactive"
  | "paused";

// format for the output audio
const AUDIO_FORMAT = {
  type: RECORDING_SETTINGS.AUDIO_FORMAT,
};

export type ReactMediaRecorderHookProps = {
  onStop?: (blobUrl: string, blob: Blob) => void;
  onStart?: () => void;
};

export default function useRecorder({
  onStop = () => null,
  onStart = () => null,
}: ReactMediaRecorderHookProps) {
  const { addLog } = useLogStore();
  const [isMediaSupported, setIsMediaSupported] = useState(false);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const [recorderState, setRecorderState] =
    useState<RecorderState>("not_initialized");
  const [mediaDevices, setMediaDevices] = useState<MediaDeviceInfo[]>([]);
  const mediaChunks = useRef<Blob[]>([]);
  const [mediaBlobUrl, setMediaBlobUrl] = useState<string | undefined>(
    undefined
  );
  const currentRecordingItemId = useRef<string | null>(null);

  const { storeNewAudioItem, updateAudioItem } = useAudioLocalStore();

  /**
   * Initialize the media recorder
   */
  const setupMediaStream = useCallback(async () => {
    try {
      const audioStream = await window.navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      mediaRecorder.current = new MediaRecorder(audioStream);
      setRecorderState("inactive");
    } catch (error: any) {
      console.log("error while initializing audio stream", error);
    }
  }, []);

  /**
   * Get the list of devices available
   */
  const getMediaDevices = useCallback(async () => {
    try {
      const mediaDevices =
        await window.navigator.mediaDevices.enumerateDevices();
      setMediaDevices(mediaDevices);
    } catch (error) {
      console.log("enumerating error", error);
    }
  }, []);

  useEffect(() => {
    //1. check that the media devices is supported in the browser
    const isSupported =
      typeof window !== "undefined" &&
      navigator.mediaDevices &&
      navigator.mediaDevices.getUserMedia !== null;

    setIsMediaSupported(isSupported);
    //2. if is supported initialize the audio recorder
    if (isSupported) {
      const setupMediaRecorder = async () => {
        await setupMediaStream();
        await getMediaDevices();
      };
      void setupMediaRecorder();

      //4. clean up the recorder on unmount
      return () => {
        console.log("cleaning up recorder");
        if (mediaRecorder.current && recorderState === "recording") {
          mediaRecorder.current.stop();
        }
      };
    }
  }, [setupMediaStream, getMediaDevices]);

  /**
   * Triggered when a new slice of audio is available
   * @param event
   */
  const onDataIsAvailable = ({ data }: BlobEvent) => {
    addLog(`processing new data slice`);
    mediaChunks.current.push(data);
    if (currentRecordingItemId.current) {
      updateAudioItem(currentRecordingItemId.current, data);
    } else {
      const result = storeNewAudioItem(data);
      currentRecordingItemId.current = result.id;
    }
  };

  /**
   * Triggered when the recorder stopped
   */
  const onRecordingStopped = () => {
    addLog("recording stopped");
    if (mediaChunks.current.length > 0 && currentRecordingItemId.current) {
      // if there are stored slices of audio create the blob
      const blob = new Blob(mediaChunks.current, AUDIO_FORMAT);
      const blobUrl = URL.createObjectURL(blob);
      mediaChunks.current = [];
      setMediaBlobUrl(blobUrl);
      onStop(blobUrl, blob);
      updateAudioItem(currentRecordingItemId.current, undefined, "completed");
      addLog("new audio file created");
    }
    setRecorderState("inactive");
  };

  /**
   * Called from the client to start recordering
   */
  const startRecording = () => {
    if (mediaRecorder.current && recorderState === "inactive") {
      mediaRecorder.current.start(RECORDING_SETTINGS.TIME_SLICES);
      setRecorderState("recording");
      addLog(
        `start recording with times slices of ${RECORDING_SETTINGS.TIME_SLICES} seconds`
      );

      mediaRecorder.current.ondataavailable = onDataIsAvailable;
      mediaRecorder.current.onstop = onRecordingStopped;
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
      mediaRecorder.current &&
      (recorderState === "recording" || recorderState === "paused")
    ) {
      mediaRecorder.current.stop();
      setRecorderState("inactive");
      currentRecordingItemId.current = null;
      addLog(`stopped recording`);
    }
  };

  /**
   * Called from the client to resume recording
   */
  const resumeRecording = () => {
    if (mediaRecorder.current && recorderState === "paused") {
      setRecorderState("recording");
      mediaRecorder.current.resume();
      addLog(`resumed recording`);
    }
  };

  /**
   * Called from the client to pause recording
   */
  const pauseRecording = () => {
    if (mediaRecorder.current && recorderState === "recording") {
      mediaRecorder.current.pause();
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
    mediaRecorder: mediaRecorder.current,
    mediaDevices,
    recorderState,
    startRecording,
    stopRecording,
    pauseRecording,
    clearStoredAudio,
    resumeRecording,
  };
}
