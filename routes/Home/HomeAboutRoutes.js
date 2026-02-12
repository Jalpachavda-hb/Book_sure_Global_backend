import express from "express";
import HomeAboutcontroller from "../../controllers/Homepage/HomeAboutcontroller.js";
import { validateHomeAboutUpdate } from "../../Middleware/validateRequest.js";
import createUploader from "../../Middleware/Upload.js";
const { getHomeAbout, updateHomeAboutSection } = HomeAboutcontroller;

const router = express.Router();
const upload = createUploader("homeabout", 50 * 1024 * 1024);
router.get("/getAbout", getHomeAbout);
router.post(
  "/updateHomeAbout",
  upload.fields([
    { name: "mainimage", maxCount: 1 },
    { name: "secondimage", maxCount: 1 },
  ]),
  updateHomeAboutSection,
);
export default router;
