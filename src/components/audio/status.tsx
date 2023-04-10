import { Table } from "flowbite-react";
import useMediaRecorder from "~/hooks/useAudioRecorder";
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
  mediaRecorder,
}: {
  isMediaSupported: boolean;
  mediaRecorder: MediaRecorder | null;
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
              {mediaRecorder ? (
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
  const { isMediaSupported, mediaRecorder, mediaDevices } = useMediaRecorder({});

  return (
    <div className="audio-permissions">
      <StatusTable
        isMediaSupported={isMediaSupported}
        mediaRecorder={mediaRecorder}
      />
      <DevicesTable mediaDevices={mediaDevices} />
    </div>
  );
}
