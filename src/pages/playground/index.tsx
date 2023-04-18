import { Tabs } from "flowbite-react";
import { type NextPage } from "next";
import AudioRecorder from "~/components/audio/recorder";
import AudioStatus from "~/components/audio/status";
import ShowLogs from "~/components/showLogs";
import Recordings from "~/components/audio/recordings";

const Playground: NextPage = () => {
  return (
    <>
      <h1 className="mb-10 text-5xl text-red-700">Audio Playground</h1>
      <Tabs.Group>
        <Tabs.Item title="Status">
          <AudioStatus />
        </Tabs.Item>
        <Tabs.Item title="Recorder">
          <AudioRecorder />
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
