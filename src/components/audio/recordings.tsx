import { Table } from "flowbite-react";
import useStore from "~/hooks/useStore";
import useAudioLocalStore from "~/hooks/useAudioLocalStore";
import RecordingItem from "./recordingItem";

export default function Recordings() {
  const audioStore = useStore(useAudioLocalStore, (state) => state);
  if (!audioStore) {
    return <p>Loading...</p>;
  }
  const { items } = audioStore;

  const recordingTable = () => {
    return (
      <Table striped={true}>
        <Table.Head>
          <Table.HeadCell>Id</Table.HeadCell>
          <Table.HeadCell>Date created</Table.HeadCell>
          <Table.HeadCell>Size</Table.HeadCell>
          <Table.HeadCell>Status</Table.HeadCell>
          <Table.HeadCell>Actions</Table.HeadCell>
        </Table.Head>
        <Table.Body>
          {items.map((item) => (
            <RecordingItem key={item.id} item={item} />
          ))}
        </Table.Body>
      </Table>
    );
  };

  return (
    <>
      <h2 className="my-5 text-3xl">Current Recordings</h2>
      {recordingTable()}
    </>
  );
}
