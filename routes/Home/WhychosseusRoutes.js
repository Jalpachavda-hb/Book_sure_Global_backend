import express from "express";
import whychosseuscontroller from "../../controllers/Homepage/whychosseuscontroller.js";
import createUploader from "../../Middleware/Upload.js";

const router = express.Router();
const { getWhyChooseUs, updateWhyChooseUs } = whychosseuscontroller;
// ✅ Upload Folder
const upload = createUploader("whychosseus");

/* ✅ GET */
router.get("/getwhychooseus", getWhyChooseUs);

/* ✅ UPDATE */
router.put(
  "/updatewhychooseus/:id",
  upload.single("whychosseus_image"),
  updateWhyChooseUs,
);

export default router;
