import { Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";

const DevicesTable = ({
  mediaDevices,
}: {
  mediaDevices: MediaDeviceInfo[];
}) => {
  return (
    <>
      <h2 className="my-5 text-3xl">Devices</h2>
      <Table striped={true}>
        <Table.Head>
          <Table.HeadCell>Name</Table.HeadCell>
          <Table.HeadCell>Type</Table.HeadCell>
        </Table.Head>
        <Table.Body>
          {mediaDevices.map((item) => (
            <Table.Row
              key={item.deviceId}
              className={item.deviceId === "default" ? "font-bold" : ""}
            >
              <Table.Cell>
                {item.label !== "" ? item.label : item.deviceId}
              </Table.Cell>
              <Table.Cell>{item.kind}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </>
  );
};

const StatusTable = ({
  isMediaSupported,
  userMedia,
}: {
  isMediaSupported: boolean;
  userMedia: MediaStream | null;
}) => {
  return (
    <>
      <h2 className="my-5 text-3xl">Status</h2>
      <Table striped={true}>
        <Table.Head />
        <Table.Body>
          <Table.Row>
            <Table.Cell>Is supported by the browser</Table.Cell>
            <Table.Cell className="w-10">
              {isMediaSupported ? (
                <CheckCircleIcon color="green" className="w-10" />
              ) : (
                <XCircleIcon color="red" className="w-10" />
              )}
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>Are permissions enabled?</Table.Cell>
            <Table.Cell className="w-10">
              {userMedia ? (
                <CheckCircleIcon color="green" className="w-10" />
              ) : (
                <XCircleIcon color="red" className="w-10" />
              )}
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    </>
  );
};

export default function AudioStatus() {
  const [isMediaSupported, setIsMediaSupported] = useState(false);
  const [userMedia, setUserMedia] = useState<MediaStream | null>(null);
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
        .then((stream) => setUserMedia(stream))
        .catch((error) => console.log("error ->", error));

      navigator.mediaDevices
        .enumerateDevices()
        .then((items) =>
          setMediaDevices(items.filter((item) => item.kind === "audioinput"))
        )
        .catch((error) => console.log("enumerating error", error));
    }
  }, []);

  return (
    <div className="audio-permissions">
      <StatusTable isMediaSupported={isMediaSupported} userMedia={userMedia} />
      <DevicesTable mediaDevices={mediaDevices} />
    </div>
  );
}
