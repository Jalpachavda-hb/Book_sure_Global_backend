import express from "express";
import DatasequrityController from "../controllers/DatasequrityController.js";
import createUploader from "../Middleware/Upload.js";

const router = express.Router();

/* ✅ Multer Upload Folder */
const upload = createUploader("data_security");

/* ✅ Controller Functions */
const {
  updateDataSecuritySection,
  getDataSecuritySection,
} = DatasequrityController;

/* =============================== */
/* ✅ GET Data Security Section */
/* =============================== */
router.get("/data-security", getDataSecuritySection);

/* =============================== */
/* ✅ UPDATE Data Security Section */
/* =============================== */
router.put(
  "/update-data-security",
  upload.fields([
    { name: "main_image", maxCount: 1 },
   
  ]),
  updateDataSecuritySection
);

export default router;









