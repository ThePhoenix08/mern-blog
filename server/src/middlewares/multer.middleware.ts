import multer from "multer";
import path from "path";
import ENV_VARIABLES from "../constants";
import ApiError from "@utils/ApiError.util";

const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, "./public/temp");
  },
  filename: function (_req, file, cb) {
    const fileExtension = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const filename = file.originalname + "-" + uniqueSuffix + fileExtension;
    cb(null, filename);
  },
});

const upload = multer({
  storage,
  // 1 MB file size limit
  limits: { fileSize: ENV_VARIABLES.fileUploadSizeLimit },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(
        ApiError.unsupportedMediaType("Only image files are allowed!") as any,
        false
      );
    }
    cb(null, true);
  },
});

export default upload;
