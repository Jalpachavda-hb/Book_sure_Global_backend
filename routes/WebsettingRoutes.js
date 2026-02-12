// import express from "express";
// const router = express.Router();
// import Websettingcontroller from "../controllers/Websettingcontroller.js";
// const { getSettings, updateSettings } = Websettingcontroller;
// import createUploader from "../Middleware/upload.js";

// const Upload = createUploader("websettings", 2);

// router.get("/getwebdetail", getSettings);

// router.post(
//   "/edit",
//   Upload.fields([
//     { name: "Logo", maxCount: 1 },
//     { name: "Favicon", maxCount: 1 },
//   ]),
//   updateSettings
// );

// export default router;

import express from "express";
import Websettingcontroller from "../controllers/Websettingcontroller.js";
import createUploader from "../Middleware/Upload.js";

const router = express.Router();
const upload = createUploader("websettings", 2);

const { getSettings, updateSettings } = Websettingcontroller;

router.get("/getwebdetail", getSettings);

router.post(
  "/editwebsetting",
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "favicon", maxCount: 1 },
  ]),
  updateSettings
);


export default router;
