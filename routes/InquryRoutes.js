import express from "express";
const router = express.Router();
import InquryController from "../controllers/InquryController.js";

const {
  submitPricingInquiry,
  getPricingInquiries,
  addInquiryEmail,
  getInquiryEmails,
  updateInquiryEmail,
  deleteInquiryEmail,
  updateInquiryEmailStatus,
} = InquryController;

router.post("/addinquiries", submitPricingInquiry);

router.get("/getpricinginquiries", getPricingInquiries);
router.get("/pricing-inquiry-emails", getInquiryEmails);
router.post("/pricing-inquiry-email", addInquiryEmail);
router.put("/pricing-inquiry-email/:id", updateInquiryEmail);
router.delete("/pricing-inquiry-email/:id", deleteInquiryEmail);
router.put("/inquiry-email/status/:id", updateInquiryEmailStatus);
export default router;
