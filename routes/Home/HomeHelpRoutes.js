import express from "express";
import HomeHelpsectioncontroller from "../../controllers/Homepage/HomeHelpsectioncontroller.js";
import createUploader from "../../Middleware/Upload.js";

const { getHomeHelp, updateHomeHelp } = HomeHelpsectioncontroller;

const router = express.Router();
const upload = createUploader("homehelp", 50 * 1024 * 1024);

router.get("/getHelp", getHomeHelp);

router.post(
  "/updateHomeHelp",
  upload.fields([
    { name: "mainimage", maxCount: 1 },
  ]),
  updateHomeHelp
);

export default router;