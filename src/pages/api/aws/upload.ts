import type { NextApiRequest, NextApiResponse } from "next";
import { getPresignedURL } from "~/utils/aws";

type UploadResponse = {
  signed_url: string;
};

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse<UploadResponse>
) {
  const clientUrl = await getPresignedURL({
    fileName: "myfile",
    fileType: "type",
  });

  res.status(200).json({ signed_url: clientUrl });
}
