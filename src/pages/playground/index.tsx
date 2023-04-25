import { Tabs } from "flowbite-react";
import { type NextPage } from "next";
import AudioRecorder from "~/components/recording/audio-recorder";
import AudioStatus from "~/components/recording/status";
import ShowLogs from "~/components/showLogs";
import Recordings from "~/components/recording/recordings";
import VideoRecorder from "~/components/recording/videoRecorder";

const Playground: NextPage = () => {
  return (
    <>
      <h1 className="mb-10 text-5xl">Audio Playground</h1>
      <Tabs.Group>
        <Tabs.Item title="Status">
          <AudioStatus />
        </Tabs.Item>
        <Tabs.Item title="Audio Recorder">
          <AudioRecorder />
        </Tabs.Item>
        <Tabs.Item title="Video Recorder">
          <VideoRecorder />
        </Tabs.Item>
        <Tabs.Item title="Recordings">
          <Recordings />
        </Tabs.Item>
      </Tabs.Group>
      <ShowLogs />
    </>
  );
};

export default Playground;
