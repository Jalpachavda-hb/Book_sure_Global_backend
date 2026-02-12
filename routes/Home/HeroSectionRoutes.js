import express from "express";
import HeroSectionController from "../../controllers/Homepage/HeroSectionController.js";
import { validateHeroUpdate } from "../../Middleware/validateRequest.js";
import createUploader from "../../Middleware/Upload.js";
const { getHero, updateHero, getDashboardCardData } = HeroSectionController;

const router = express.Router();
const upload = createUploader("hero", 10 * 1024 * 1024); // 10 MB limit
router.get("/getHero", getHero);
router.post("/updateHero", upload.single("background_image"), updateHero);
router.get("/getDashboardCardData", getDashboardCardData);
export default router;
