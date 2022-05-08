import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { FromTemporaryCredentialsOptions } from "@aws-sdk/credential-providers/dist-types";
import { fromTemporaryCredentials } from "@aws-sdk/credential-providers";
import { AWSCredentials } from "./api";
import {
  LocationClient,
  SearchPlaceIndexForTextCommand,
} from "@aws-sdk/client-location";

function convertCredentials(
  c: AWSCredentials
): FromTemporaryCredentialsOptions["masterCredentials"] {
  return {
    accessKeyId: c.AccessKeyId,
    secretAccessKey: c.SecretAccessKey,
    sessionToken: c.SessionToken,
  };
}

// Uploads file to S3 bucket.
export async function uploadToS3(
  credentials: AWSCredentials,
  objectKey: string,
  file: File
) {
  const client = new S3Client({
    region: "us-west-2",
    credentials: fromTemporaryCredentials({
      clientConfig: {
        region: "us-west-2",
      },
      masterCredentials: convertCredentials(credentials),
      params: {
        RoleArn: "arn:aws:iam::907229944921:role/SFLPhotoUpload",
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

// The S3 bucket URL
export const s3Prefix = "https://streetfoodlove.s3.us-west-2.amazonaws.com/";

// Returns the coordinates of the best match for the given address.
export async function addressToCoordinates(
  credentials: AWSCredentials,
  text: string
) {
  const client = new LocationClient({
    region: "us-west-2",
    credentials: fromTemporaryCredentials({
      clientConfig: {
        region: "us-west-2",
      },
      masterCredentials: convertCredentials(credentials),
      params: {
        RoleArn: "arn:aws:iam::907229944921:role/SFLLocationRole",
      },
    }),
  });

  const command = new SearchPlaceIndexForTextCommand({
    IndexName: "sfl-place",
    Text: text,
    BiasPosition: [-122.14819, 47.584401],
    MaxResults: 1,
  });

  const output = await client.send(command);
  console.log(output);
}
