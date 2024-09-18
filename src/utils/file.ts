import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

const base_img = import.meta.env.VITE_BASE_IMAGE_LINK;
const S3_BUCKET = import.meta.env.VITE_DEV_S3_BUCKET; // Replace with your bucket name
const REGION = import.meta.env.VITE_REGION; // Replace with your region
const ACCESS_KEY = import.meta.env.VITE_ACCESS_KEY;
const S_ACCESS_KEY = import.meta.env.VITE_S_ACCESS_KEY;

const client = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: ACCESS_KEY,
    secretAccessKey: S_ACCESS_KEY,
  },
});

export const uploadFile = async (file: File) => {
  if (!file) return;

  const putCommand = new PutObjectCommand({
    Bucket: S3_BUCKET,
    Key: `image/${file.name}`,
    Body: file,
  });

  try {
    await client.send(putCommand);

    return `${base_img}${`image/${file.name}`}`;
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      alert("Error uploading file: " + error.message); // Inform user about the error
    }
  }
};

export const deleteFile = async (fileName: string) => {
  if (!fileName) return;

  const deleteCommand = new DeleteObjectCommand({
    Bucket: S3_BUCKET,
    Key: `image/${fileName}`,
  });

  try {
    await client.send(deleteCommand);
  } catch (error) {
    console.error(error);
  }
};
