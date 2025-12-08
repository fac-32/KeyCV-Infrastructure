import { type Request } from "express";
import multer, { type FileFilterCallback } from "multer";

const allowedMimes = new Set<string>([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
    files: 1,
  },
  fileFilter: (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    if (allowedMimes.has(file.mimetype)) {
      cb(null, true);
      return;
    }
    cb(new Error("Only PDF, DOC, or DOCX files are allowed"));
  },
});
