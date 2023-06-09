import {
  VideoCameraIcon,
  PauseCircleIcon,
  StopCircleIcon,
  PlayCircleIcon,
} from "@heroicons/react/24/solid";
import { useState } from "react";
import useMediaRecorder from "~/hooks/useRecorder";
import useElapsedTime from "~/hooks/useElapsedTime";
import VideoPreview from "./videoPreview";

export default function VideoRecorder() {
  const [blobURL, setBlobURL] = useState<string>();

  const inactiveControls = () => {
    return (
      <VideoCameraIcon
        className="h-20 w-20 cursor-pointer text-gray-400 hover:text-gray-800"
        onClick={startRecording}
      />
    );
  };

  const recordingFinished = (blobUrl: string) => {
    setBlobURL(blobUrl);
    resetElapsedTime();
  };

  const {
    recorderState,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    mediaRecorder,
  } = useMediaRecorder({ onStop: recordingFinished });

  const { formattedTime, reset: resetElapsedTime } = useElapsedTime({
    isPlaying: recorderState === "recording",
  });

  const activeControls = () => {
    return (
      <>
        <div className="px-30 flex items-center justify-items-stretch rounded-lg bg-gray-300 py-5 text-xl">
          <StopCircleIcon
            className="mx-10 h-10 w-10 cursor-pointer text-red-600 hover:text-red-800"
            onClick={stopRecording}
          />
          <div className="recording-elapsed-time cursor-pointer">
            <i
              className="red-recording-dot fa fa-circle"
              aria-hidden="true"
            ></i>
            <p className="elapsed-time w-20 text-center">{formattedTime}</p>
          </div>
          {recorderState === "recording" ? (
            <PauseCircleIcon
              className="mx-10 h-10 w-10 text-green-500 hover:text-green-800"
              onClick={pauseRecording}
            />
          ) : (
            <PlayCircleIcon
              className="mx-10 h-10 w-10 text-green-500 hover:text-green-800"
              onClick={resumeRecording}
            />
          )}
        </div>
        <div className="px-30 flex items-center justify-items-stretch">
          <VideoPreview videoStream={mediaRecorder} />
        </div>
      </>
    );
  };
  return (
    <div className="audio-recorder">
      <h2 className="my-5 text-3xl">Click to start recording</h2>
      <div className="flex flex-col items-center">
        {recorderState === "recording" || recorderState === "paused"
          ? activeControls()
          : inactiveControls()}
        {blobURL ? (
          <video src={blobURL} controls autoPlay className="mt-10" />
        ) : null}
      </div>
    </div>
  );
}
