import { API_URLS, RECORDING_SETTINGS } from "~/utils/consts";
import type { SignedURLResponse } from "~/utils/types";
import type { AudioItem } from "~/hooks/useAudioLocalStore";

export const getSignedUrl = async (fileName: string, fileType: string) => {
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

export const uploadToS3 = async (item: AudioItem, signedUrl: string) => {
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