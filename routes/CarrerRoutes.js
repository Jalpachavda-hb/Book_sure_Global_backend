import express from "express";
import CarrerController from "../controllers/Carrercontroller.js";
import resumeUploader  from "../Middleware/ResumeUpload.js";
const {
  submitCareerApplication,
  getCareerApplications,
  deleteCareerApplication,
  addCareerEmail,
  getCareerEmails,
  updateCareerEmailStatus,
  deleteCareerEmail,
} = CarrerController;
const upload = resumeUploader("resume");
const router = express.Router();
router.post(
  "/addcareer-applications",
  upload.single("resume"),
  submitCareerApplication
);

router.get("/career-applications", getCareerApplications);
router.delete("/career-application/:id", deleteCareerApplication);
router.post("/addcareer-applications", submitCareerApplication);
// Career email management
router.post("/career-email", addCareerEmail);
router.get("/career-emails", getCareerEmails);
router.patch("/career-email/:id/status", updateCareerEmailStatus);
router.delete("/career-email/:id", deleteCareerEmail);

export default router;
