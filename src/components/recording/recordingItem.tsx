import { Table } from "flowbite-react";
import { CloudArrowUpIcon, TrashIcon } from "@heroicons/react/20/solid";
import type { AudioItem } from "~/hooks/useAudioLocalStore";
import useAudioLocalStore from "~/hooks/useAudioLocalStore";
import { RECORDING_SETTINGS } from "~/utils/consts";
import { useState } from "react";
import { getSignedUrl, uploadToS3 } from "~/utils/aws/upload";

export default function RecordingItem({ item }: { item: AudioItem }) {
  const { removeAudioItem, updateAudioItem } = useAudioLocalStore();
  const [isUploading, setIsUploading] = useState(false);

  const deleteItem = (item: AudioItem) => {
    if (window.confirm("Do you want to delete this recording?")) {
      removeAudioItem(item.id);
    }
  };

  const uploadItem = async (item: AudioItem) => {
    setIsUploading(true);
    if (item.state !== "uploaded") {
      try {
        const signedUrl = await getSignedUrl(
          item.id,
          RECORDING_SETTINGS.AUDIO_FORMAT
        );

        if (signedUrl) {
          await uploadToS3(item, signedUrl);

          updateAudioItem(item.id, undefined, "uploaded");
        }
      } catch (e) {
        console.error("Error while uploading the recording to S3", e);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const actionItems = () => {
    return (
      <>
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
      </>
    );
  };

  return (
    <Table.Row key={item.id}>
      <Table.Cell>{item.id}</Table.Cell>
      <Table.Cell>{new Date(item.created).toLocaleString()}</Table.Cell>
      <Table.Cell>{item.data.length}</Table.Cell>
      <Table.Cell>{item.state}</Table.Cell>
      <Table.Cell>
        <div className="flex justify-around">
          {isUploading ? "uploading..." : actionItems()}
        </div>
      </Table.Cell>
    </Table.Row>
  );
}
