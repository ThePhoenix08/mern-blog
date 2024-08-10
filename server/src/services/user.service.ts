import type { IBlogger } from "@models/blogger.model";
import type { IUser } from "@models/user.model";
import type AuthRequest from "types/express";
import type { IFile } from "./common.service";
import { uploadFiles } from "./common.service";
import ApiError from "@utils/ApiError.util";

export interface FileRequest extends AuthRequest {
  files?: { [key: string]: Express.Multer.File[] };
  file?: Express.Multer.File;
}

export type UserWithOptionalBloggerFields = IUser & Partial<IBlogger>;
type TUploadedFileUrls = {
  avatar?: string;
  coverImage?: string;
};

export async function handleRequestFilesUpload(
  req: FileRequest,
  user: UserWithOptionalBloggerFields,
  isBlogger: boolean
): Promise<TUploadedFileUrls | null> {
  let files: IFile[] = [];
  if (isBlogger && req.files) {
    if (!req.files.avatar?.[0] || !req.files.coverImage?.[0])
      throw ApiError.badRequest("Missing required files", {
        slug: "REQUEST_ERROR",
      });

    files.push({
      identifier: "avatars",
      path: req.files.avatar[0].path,
      old_url: user.avatar || null,
    });
    files.push({
      identifier: "covers",
      path: req.files.coverImage[0].path,
      old_url: user.coverImage || null,
    });
  } else if (!isBlogger && req.file) {
    files.push({
      identifier: "avatars",
      path: req.file.path,
      old_url: user.avatar || null,
    });
  } else {
    return null;
  }

  const uploadedFileUrls: TUploadedFileUrls = {};

  const uploadedFiles = await uploadFiles(files);
  uploadedFiles.forEach((file) => {
    switch (file.identifier) {
      case "avatars":
        uploadedFileUrls.avatar = file.url;
        break;

      case "covers":
        uploadedFileUrls.coverImage = file.url;
        break;

      default:
        throw ApiError.internal("Unknown file identifier", {
          slug: "UPLOAD_ERROR",
        });
    }
  });

  return uploadedFileUrls;
}

export async function handleSingleFileUpload(
  req: FileRequest,
  identifier: "avatars" | "covers"
): Promise<string | null> {
  let file: IFile | null = null;
  const propName = identifier === "avatars" ? "avatar" : "coverImage";

  if (!req.user)
    throw ApiError.badRequest("Request undefined", {
      slug: "REQUEST_ERROR",
    });

  const old_url = (req.user as UserWithOptionalBloggerFields)[propName] || null;

  if (req.file) {
    file = {
      identifier: identifier,
      path: req.file.path,
      old_url,
    };
  } else {
    return null;
  }

  const uploadedFile = await uploadFiles([file]);
  if (!uploadedFile || !uploadedFile[0] || !uploadedFile[0].url)
    throw ApiError.internal(
      "Error while uploading file, recieved null, url missing",
      {
        slug: "UPLOAD_ERROR",
      }
    );

  return uploadedFile[0].url;
}
