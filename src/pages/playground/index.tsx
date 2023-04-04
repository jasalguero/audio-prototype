import { Tabs } from "flowbite-react";
import { type NextPage } from "next";
import AudioRecorder from "~/components/audio/recorder";
import AudioStatus from "~/components/audio/status";

const Playground: NextPage = () => {
  return (
    <>
      <h1 className="text-5xl mb-10">Audio Playground</h1>
      <Tabs.Group>
        <Tabs.Item title="Status">
          <AudioStatus />
        </Tabs.Item>
        <Tabs.Item title="Recorder">
          <AudioRecorder />
        </Tabs.Item>
      </Tabs.Group>
    </>
  );
};

export default Playground;
