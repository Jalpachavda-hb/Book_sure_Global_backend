// import express from "express";
// import HomeSoftwareController from "../../controllers/Homepage/HomeSoftwareController.js";
// import { validateAddSoftware } from "../../Middleware/validateRequest.js";

// const {
//   getSoftware,
//   getSoftwareById,
//   addSoftware,
//   getSoftwareActive,
//   getSoftwareInactive,
//   deleteSoftwareById,
// } = HomeSoftwareController;

// const router = express.Router();

// router.get("/getSoftware", getSoftware);
// router.get("/getSoftwareById/:id", getSoftwareById);
// router.post("/addSoftware", validateAddSoftware, addSoftware);
// // router.post("/updateSoftware",  updateSoftware);
// router.get("/getSoftwareActive", getSoftwareActive);
// router.get("/getSoftwareInactive", getSoftwareInactive);
// router.delete("/deleteSoftwareById/:id", deleteSoftwareById);
// export default router;

import express from "express";
import SoftwareSectionController from "../../controllers/Homepage/HomeSoftwareController.js";
import createUploader from "../../Middleware/Upload.js";

const {
  getSoftware,
  addSoftware,
  updateSoftware,
  getSoftwareById,
  getSoftwareActive,
  getSoftwareInactive,
  deleteSoftwareById,
  updateSoftwareSectionMaster,
  getSoftwareSectionMaster,
  updateSoftwareImageStatus,
} = SoftwareSectionController;

const router = express.Router();
const upload = createUploader("software", 5 * 1024 * 1024);

// master + images
router.get("/getSoftware", getSoftware);

// image CRUD
router.get("/getSoftwareActive", getSoftwareActive);
router.get("/getSoftwareSectionMaster", getSoftwareSectionMaster);
router.get("/getSoftwareById/:id", getSoftwareById);
router.get("/getSoftwareInactive", getSoftwareInactive);
router.post(
  "/addSoftware",
  upload.array("image", 5), // max 10 images at once
  addSoftware,
);
router.post("/updateSoftware/:id", upload.single("images"), updateSoftware);
router.delete("/deleteSoftwareById/:id", deleteSoftwareById);
router.post("/updateSoftwareSection", updateSoftwareSectionMaster);

router.put("/update-status/:id", updateSoftwareImageStatus);
export default router;
