import { useEffect } from "react";
import { Tabs } from "flowbite-react";
import { type NextPage } from "next";
import AudioRecorder from "~/components/audio/recorder";
import AudioStatus from "~/components/audio/status";
import ShowLogs from "~/components/showLogs";

const Playground: NextPage = () => {
  useEffect(() => {
    console.log("useEffect");
  }, []);
  return (
    <>
      <h1 className="mb-10 text-5xl">Audio Playground</h1>
      <Tabs.Group>
        <Tabs.Item title="Status">
          <AudioStatus />
        </Tabs.Item>
        <Tabs.Item title="Recorder">
          <AudioRecorder />
        </Tabs.Item>
      </Tabs.Group>
      <ShowLogs />
    </>
  );
};

export default Playground;
