import { Table } from "flowbite-react";
import useAudioLocalStore from "~/hooks/useAudioLocalStore";
import type { AudioItem } from "~/hooks/useAudioLocalStore";
import { CloudArrowUpIcon, TrashIcon } from "@heroicons/react/20/solid";

export default function Recordings() {
  const { items, removeAudioItem } = useAudioLocalStore();
  const deleteItem = (item: AudioItem) => {
    if (window.confirm("Do you want to delete this recording?")) {
      removeAudioItem(item.id);
    }
  };

  return (
    <>
      <h2 className="my-5 text-3xl">Current Recordings</h2>
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
            <Table.Row key={item.id}>
              <Table.Cell>{item.id}</Table.Cell>
              <Table.Cell>{item.created.toDateString()}</Table.Cell>
              <Table.Cell>{item.data.length}</Table.Cell>
              <Table.Cell>{item.state}</Table.Cell>
              <Table.Cell>
                <div className="flex justify-around">
                  <CloudArrowUpIcon
                    className="h-6 cursor-pointer text-blue-400 hover:text-blue-800"
                    aria-label="Upload"
                  />
                  <TrashIcon
                    className="h-6 cursor-pointer text-red-600 hover:text-red-800"
                    onClick={() => deleteItem(item)}
                  />
                </div>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </>
  );
}
