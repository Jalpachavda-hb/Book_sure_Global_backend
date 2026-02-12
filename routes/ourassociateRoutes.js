import express from "express";
import {
  addFounder,
  getAllFounders,
  getActiveFounders,
  getInactiveFounders,
  getFounderById,
  updateFounder,
  deleteFounder,
  updateFounderStatus,
} from "../controllers/OurAssocate/ourassociate.js";

import createUploader from "../Middleware/Upload.js";

const router = express.Router();

/* ✅ Upload Middleware */
const upload = createUploader("Ourassociate");

/* ✅ Add */
router.post("/add", upload.single("image"), addFounder);

/* ✅ Get */
router.get("/all", getAllFounders);
router.get("/active", getActiveFounders);
router.get("/inactive", getInactiveFounders);''

/* ✅ Get By ID */
router.get("/getbyid/:id", getFounderById);

/* ✅ Update */
router.put("/update/:id", upload.single("image"), updateFounder);

/* ✅ Status Update */
router.put("/status/:id", updateFounderStatus);

/* ✅ Delete */
router.delete("/delete/:id", deleteFounder);

export default router;