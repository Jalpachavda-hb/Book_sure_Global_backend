import express from "express";
const router = express.Router();
import galleryController from "../../controllers/Team/GalleryController.js";
const {
  addGallery,
  getAllGallery,
  getActiveGallery,
  getInactiveGallery,
  updateGalleryStatus,
  deleteGalleryById,
} = galleryController;

import createUploader from "../../Middleware/Upload.js";


// uploader config (folder: uploads/gallery , max size: 10MB)
const upload = createUploader("gallery", 10);



router.post(
  "/add",
  upload.array("images", 5), 
  addGallery
);

/**
 * GET ALL GALLERY
 */
router.get("/all", getAllGallery);

/**
 * GET ACTIVE GALLERY
 */
router.get("/active", getActiveGallery);

/**
 * GET INACTIVE GALLERY
 */
router.get("/inactive", getInactiveGallery);

/**
 * UPDATE ACTIVE STATUS (JSON)
 * body: { isActive: 0 | 1, updated_by?: string }
 */
router.post("/status/:id", updateGalleryStatus);

/**
 * DELETE GALLERY BY ID
 */
router.delete("/delete/:id", deleteGalleryById);

export default router;
