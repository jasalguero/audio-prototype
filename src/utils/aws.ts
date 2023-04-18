import type { S3ClientConfig } from "@aws-sdk/client-s3";
import { env } from "~/env.mjs";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const AWS_S3_REGION = "eu-north-1";

const getPresignedURL = async ({
  fileName,
  fileType,
}: {
  fileName: string;
  fileType: string;
}) => {
  const s3Configuration: S3ClientConfig = {
    credentials: {
      accessKeyId: env.AWS_ACCESS_KEY_ID,
      secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
    },
    region: AWS_S3_REGION,
  };

  const s3 = new S3Client(s3Configuration);
  const command = new PutObjectCommand({
    Bucket: env.AWS_S3_BUCKET,
    Key: fileName,
    ContentType: fileType,
  });
  const url = await getSignedUrl(s3, command, { expiresIn: 15 * 60 }); // expires in seconds
  return url;
};

export { getPresignedURL };
