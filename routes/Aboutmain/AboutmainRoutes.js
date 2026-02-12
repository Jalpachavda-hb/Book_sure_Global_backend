import express from "express";
import Aboutcontroller from "../../controllers/Aboutsection/Aboutcontroller.js";
import createUploader from "../../Middleware/Upload.js";
const {
  getAboutSection,
  updateAboutSection,
  getCompanyHighlights,
  updateCompanyHighlights,
  getHeroAssociate,
  updateHeroAssociate,
} = Aboutcontroller;

const router = express.Router();

const Upload = createUploader("Aboutmain");

router.get("/about", getAboutSection);
router.put(
  "/about/:id",
  Upload.fields([
    { name: "main_image", maxCount: 1 },
    { name: "ceo_image", maxCount: 1 },
  ]),
  updateAboutSection,
);

router.get("/highlights", getCompanyHighlights);
router.put(
  "/highlights/:id",
  Upload.fields([
    { name: "mission_image", maxCount: 1 },
    { name: "vision_image", maxCount: 1 },
  ]),
  updateCompanyHighlights,
);
router.get("/hero-associate", getHeroAssociate);

router.put(
  "/hero-associate/:id",
  Upload.single("bg_image"),
  updateHeroAssociate,
);

export default router;
