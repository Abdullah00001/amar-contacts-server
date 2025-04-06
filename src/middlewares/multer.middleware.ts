import { Request } from "express";
import multer, { FileFilterCallback } from "multer";

const storage = multer.diskStorage({
  destination: (req: Request, file, cb) => {
    cb(null, "./public/temp");
  },
  filename: (req: Request, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(new Error("Only .jpeg and .png files are allowed!") as any, false);
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: fileFilter,
});

export default upload;
