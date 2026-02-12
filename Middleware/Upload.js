import multer from "multer";
import fs from "fs";
import path from "path";

const createUploader = (
  folderName
  //  maxSizeMB = 10
) => {
  const uploadPath = path.join("uploads", folderName);

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
    const allowed = /jpeg|jpg|png|webp|ico|svg/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);

    if (ext && mime) cb(null, true);
    else cb(new Error("Only image files allowed"));
  };

  return multer({
    storage,
    // limits: { fileSize: maxSizeMB * 1024 * 1024 },
    fileFilter,
  });
};

export default createUploader;
