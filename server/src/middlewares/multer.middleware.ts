import multer from "multer";
import path from "path";
import ENV_VARIABLES from "../constants";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
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
      return cb(new Error("Only image files are allowed!") as any, false);
    }
    cb(null, true);
  },
});

export default upload;
