import express from "express";
import createUploader from "../../Middleware/Upload.js";
import subServicesController from "../../controllers/Services/SubServiceController.js";

const {
  addSubService,
  getSubServicesBySlug,
  updateSubService,
  updateSubServiceStatus,
  deleteSubService,
  getSubServiceById,
  getInActiveSubServicesBySlug,
} = subServicesController;
const upload = createUploader("sub_services");
const router = express.Router();

router.post("/sub-services", upload.single("image"), addSubService);
router.get("/sub-services/by-slug/:slug", getSubServicesBySlug);
router.put("/sub-services/:id", upload.single("image"), updateSubService);
router.put("/sub-services/status/:id", updateSubServiceStatus);
router.delete("/sub-services/delete/:id", deleteSubService);
router.get("/sub-services/:id", getSubServiceById);
router.get("/sub-services/inactive/:slug", getInActiveSubServicesBySlug);
export default router;
