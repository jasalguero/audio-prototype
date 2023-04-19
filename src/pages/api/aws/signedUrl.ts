import type { NextApiResponse } from "next";
import { getPresignedURL } from "~/utils/aws";
import type { SignedURLResponse, SignedURLRequest } from "~/utils/types";

export default async function handler(
  _req: SignedURLRequest,
  res: NextApiResponse<SignedURLResponse>
) {
  const body = _req.body;
  const clientUrl = await getPresignedURL({
    fileName: body.file_name,
    fileType: body.file_type,
  });

  res.status(200).json({ signed_url: clientUrl });
}
