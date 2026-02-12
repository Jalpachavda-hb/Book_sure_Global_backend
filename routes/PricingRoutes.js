import express from "express";
const router = express.Router();
import PricingController from "../controllers/PricingController.js";

const {
  updatePricingSection,
  getPricingSection,
  updatePricingModelStatus,
  getInactivePricingModels,
  getActivePricingModels,
  deletePricingModel,
  addPricingModel,
  getPricingModelById,
  updatePricingModelById,
  getPricingModelTitles,
} = PricingController;

router.put("/update", updatePricingSection);
router.get("/getpricingsection", getPricingSection);

router.post("/pricing-model/add", addPricingModel);
router.get("/pricing-model/:id", getPricingModelById);
router.put("/pricing-model/:id", updatePricingModelById);
router.put("/pricing-model/status/:id", updatePricingModelStatus);
router.delete("/pricing-model/:id", deletePricingModel);
router.get("/gettitles", getPricingModelTitles);
router.get("/active", getActivePricingModels);
router.get("/inactive", getInactivePricingModels);

export default router;
