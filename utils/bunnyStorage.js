import axios from "axios";
import mime from "mime-types";

const STORAGE_ZONE = process.env.BUNNY_STORAGE_ZONE;
const ACCESS_KEY = process.env.BUNNY_STORAGE_PASSWORD;
const REGION = process.env.BUNNY_STORAGE_REGION || "sg";
const CDN_URL = process.env.BUNNY_CDN_URL;

export const uploadToBunny = async (file, folder = "general") => {
  try {
    if (!file) {
      throw new Error("File is required");
    }

    const fileExtension = mime.extension(file.mimetype);

    const fileName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}.${fileExtension}`;

    const filePath = `${folder}/${fileName}`;

    const uploadUrl = `https://${REGION}.storage.bunnycdn.com/${STORAGE_ZONE}/${filePath}`;

    await axios.put(uploadUrl, file.buffer, {
      headers: {
        AccessKey: ACCESS_KEY,
        "Content-Type": file.mimetype,
      },
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
    });

    return {
      fileName,
      filePath,
      url: `${CDN_URL}/${filePath}`,
    };
  } catch (error) {
    console.error("Bunny Upload Error:", error?.response?.data || error.message);

    throw new Error("File upload failed");
  }
};