import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import ENV_VARIABLES from "../constants";
import ApiError from "./ApiError.util";
import { logger } from "@middlewares/logger.middleware";

// Configuration
cloudinary.config({
  cloud_name: ENV_VARIABLES.cloudinaryName,
  api_key: ENV_VARIABLES.cloudinaryKey,
  api_secret: ENV_VARIABLES.cloudinarySecret,
});

const uploadOnCloud = async (localFilePath: string, identifier: string) => {
  try {
    if (!localFilePath)
      throw new Error("Unable to find the file at local file path");

    // upload
    const uploadResult = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "image",
      folder: identifier,
    });
    fs.unlinkSync(localFilePath); // remove the local file
    return uploadResult;
  } catch (error: any) {
    fs.unlinkSync(localFilePath); // remove the local file
    logger.error(
      `⚠️ Error while uploading ${identifier} on Cloudinary: ${error.message}`
    );
    throw ApiError.internal("Error while uploading on Cloudinary", {
      slug: "UPLOAD_ERROR",
      stack: error.stack,
    });
  }
};

const getCloudinaryPublicId = (url: string): string => {
  const parts = url.split("/");
  const folder = parts[parts.length - 2];
  const filename = parts[parts.length - 1];
  if (!filename) {
    throw ApiError.internal("Unable to find the file at local file path", {
      slug: "UPLOAD_ERROR",
    });
  }
  const [publicId] = filename.split(".");
  const fullId = `${folder}/${publicId}`;
  return fullId;
};

export const handleFileUpload = async (
  localPath: string,
  identifier: string
): Promise<string> => {
  const uploadResult = await uploadOnCloud(localPath, identifier);
  if (!uploadResult?.url)
    throw new Error(`Error while uploading ${identifier} on Cloudinary.`);
  return uploadResult.url;
};

export const deleteOldUpload = async (oldUploadUrl: string): Promise<void> => {
  const publicId: string = getCloudinaryPublicId(oldUploadUrl);
  const res: { result: string } = await cloudinary.uploader.destroy(publicId, {
    resource_type: "image",
  });
  if (res.result != "ok")
    throw ApiError.internal("Cloudinary delete operation failed!", {
      slug: "DELETE_ERROR",
    });
};

/* (async function() {
    
    // Optimize delivery by resizing and applying auto-format and auto-quality
    const optimizeUrl = cloudinary.url('shoes', {
        fetch_format: 'auto',
        quality: 'auto'
    });
    
    console.log(optimizeUrl);
    
    // Transform the image: auto-crop to square aspect_ratio
    const autoCropUrl = cloudinary.url('shoes', {
        crop: 'auto',
        gravity: 'auto',
        width: 500,
        height: 500,
    });
    
    console.log(autoCropUrl);
})(); */
