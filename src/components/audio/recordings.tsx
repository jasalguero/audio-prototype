import { Table } from "flowbite-react";
import useStore from "~/hooks/useStore";
import useAudioLocalStore from "~/hooks/useAudioLocalStore";
import type { AudioItem } from "~/hooks/useAudioLocalStore";
import { CloudArrowUpIcon, TrashIcon } from "@heroicons/react/20/solid";
import { API_URLS, RECORDING_SETTINGS } from "~/utils/consts";
import type { SignedURLResponse } from "~/utils/types";

export default function Recordings() {
  const audioStore = useStore(useAudioLocalStore, (state) => state);
  if (!audioStore) {
    return <p>Loading...</p>;
  }
  const { items, removeAudioItem } = audioStore;

  const deleteItem = (item: AudioItem) => {
    if (window.confirm("Do you want to delete this recording?")) {
      removeAudioItem(item.id);
    }
  };

  const uploadItem = async (item: AudioItem) => {
    if (item.state !== "uploaded") {
      try {
        const signedUrl = await getSignedUrl(
          item.id,
          RECORDING_SETTINGS.AUDIO_FORMAT
        );

        if (signedUrl) {
          await uploadToS3(item, signedUrl);
          item.state = "uploaded";
        }
      } catch (e) {
        console.error("Error while uploading the recording to S3", e);
      }
    }
  };

  const getSignedUrl = async (fileName: string, fileType: string) => {
    try {
      const payload = {
        file_name: fileName,
        file_type: fileType,
      };

      const res = await fetch(API_URLS.GENERATE_SIGNED_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = (await res.json()) as SignedURLResponse;
      return data.signed_url;
    } catch (e) {
      console.error("Error while trying to get a signed url for S3 ", e);
    }
  };

  const uploadToS3 = async (item: AudioItem, signedUrl: string) => {
    const recording = new Blob(item.data, {
      type: RECORDING_SETTINGS.AUDIO_FORMAT,
    });

    const response = await fetch(signedUrl, {
      method: "PUT",
      headers: {
        "Content-Type": RECORDING_SETTINGS.AUDIO_FORMAT,
      },
      body: recording,
    });

    console.log(response);
    return response;
  };

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
            <Table.Row key={item.id}>
              <Table.Cell>{item.id}</Table.Cell>
              <Table.Cell>{new Date(item.created).toLocaleString()}</Table.Cell>
              <Table.Cell>{item.data.length}</Table.Cell>
              <Table.Cell>{item.state}</Table.Cell>
              <Table.Cell>
                <div className="flex justify-around">
                  {item.state !== "uploaded" ? (
                    <CloudArrowUpIcon
                      className="h-6 cursor-pointer text-blue-400 hover:text-blue-800"
                      onClick={() => void uploadItem(item)}
                      aria-label="Upload"
                    />
                  ) : null}

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
    );
  };

  return (
    <>
      <h2 className="my-5 text-3xl">Current Recordings</h2>
      {recordingTable()}
    </>
  );
}
