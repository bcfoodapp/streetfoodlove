import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { FromTemporaryCredentialsOptions } from "@aws-sdk/credential-providers/dist-types";
import { fromTemporaryCredentials } from "@aws-sdk/credential-providers";

// Uploads file to S3 bucket.
export async function uploadToS3(
  credentials: FromTemporaryCredentialsOptions["masterCredentials"],
  objectKey: string,
  file: File
) {
  const client = new S3Client({
    region: "us-west-2",
    credentials: fromTemporaryCredentials({
      clientConfig: {
        region: "us-west-2",
      },
      masterCredentials: credentials,
      params: {
        RoleArn: "arn:aws:iam::082691565476:role/SFLPhotoUpload",
      },
    }),
  });

  const command = new PutObjectCommand({
    Bucket: "streetfoodlove",
    Key: objectKey,
    Body: file,
  });

  await client.send(command);
}
