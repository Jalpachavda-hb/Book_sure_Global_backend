import multer from "multer";
import fs from "fs";
import path from "path";

const resumeUploader = (folderName = "resumes", maxSizeMB = 5) => {
  const uploadPath = path.join("uploads", folderName);

  // Create folder if not exists
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: (_, __, cb) => cb(null, uploadPath),
    filename: (_, file, cb) => {
      const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, unique + path.extname(file.originalname));
    },
  });

  const fileFilter = (_, file, cb) => {
    const allowedExt = /pdf|doc|docx/;
    const ext = allowedExt.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mime =
      file.mimetype === "application/pdf" ||
      file.mimetype === "application/msword" ||
      file.mimetype ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

    if (ext && mime) {
      cb(null, true);
    } else {
      cb(
        new Error("Only PDF, DOC, and DOCX files are allowed")
      );
    }
  };

  return multer({
    storage,
    limits: { fileSize: maxSizeMB * 1024 * 1024 },
    fileFilter,
  });
};

export default resumeUploader;