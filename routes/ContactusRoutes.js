import express from "express";
import ContactusController from "../controllers/ContactusController.js";

const {
  getContactPageInfo,
  updateContactPageInfo,
  submitContactForm,
  getContactMessages,
  deleteContactMessage,
  getContactEmails,
  addContactEmail,
  updateContactEmailStatus,
  deleteContactEmail,
  getContactFaqSection,
  updateContactFaqSection,
  addContactFaq,
  getActiveContactFaqs,
  getInactiveContactFaqs,
  updateContactFaqStatus,
  deleteContactFaq,
} = ContactusController;
const router = express.Router();

router.get("/getContactPageInfo", getContactPageInfo);
router.put("/contact-page/:id", updateContactPageInfo);

router.post("/contact", submitContactForm);
router.get("/contact-messages", getContactMessages);
router.delete("/contact-message/:id", deleteContactMessage);

router.post("/contact-email", addContactEmail);
router.get("/contact-emails", getContactEmails);

router.patch("/contact-email/status/:id", updateContactEmailStatus);
router.delete("/contact-email/:id", deleteContactEmail);

router.get("/getcontact-faq-section", getContactFaqSection);
router.put("/contact-faq-section", updateContactFaqSection);

router.post("/contact-faq", addContactFaq);
router.get("/contact-faqs/active", getActiveContactFaqs);
router.get("/contact-faqs/inactive", getInactiveContactFaqs);
router.patch("/contact-faq/:id/status", updateContactFaqStatus);
router.delete("/contact-faq/:id", deleteContactFaq);

export default router;
