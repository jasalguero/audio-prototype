import {
  MicrophoneIcon,
  PauseCircleIcon,
  StopCircleIcon,
} from "@heroicons/react/24/solid";
import { useState } from "react";
import { useMediaRecorder } from "~/hooks/useAdio";

export default function Recorder() {
  const [elapsedTime, setElapsedTime] = useState("00:00");
  const { startRecording, stopRecording, recorderState } = useMediaRecorder();
  const start = () => {
    startRecording();
  };

  const inactiveControls = () => {
    return (
      <MicrophoneIcon
        className="h-20 w-20 cursor-pointer text-gray-400 hover:text-gray-800"
        onClick={start}
      />
    );
  };

  const activeControls = () => {
    return (
      <div className="flex items-center justify-items-stretch rounded-lg bg-gray-300 px-40 py-5 text-xl">
        <StopCircleIcon
          className="h-10 w-10 cursor-pointer text-red-600 hover:text-red-800"
          onClick={stopRecording}
        />
        <div className="recording-elapsed-time cursor-pointer">
          <i className="red-recording-dot fa fa-circle" aria-hidden="true"></i>
          <p className="elapsed-time">{elapsedTime}</p>
        </div>
        <PauseCircleIcon className="h-10 w-10 text-green-500 hover:text-green-800" />
      </div>
    );
  };

  return (
    <div className="audio-recorder">
      <h2 className="my-5 text-3xl">Click to start recording</h2>
      <div className="flex justify-center">
        {recorderState !== "recording" ? inactiveControls() : activeControls()}
      </div>
    </div>
  );
}
