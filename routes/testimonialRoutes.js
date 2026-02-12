import express from "express";
const router = express.Router();

import testimonialController from "../controllers/TestimonialController.js";
const {
  getTestimonials,
  deleteTestimonial,
  updateTestimonialStatus,
  addTestimonial,                     
  getTestimonialById,
  getActiveTestimonials,
  editTestimonial,
  getInActiveTestimonials,
} = testimonialController;

// GET All testimonials
router.get("/getTestimonials", getTestimonials);
// add testimonial
router.post("/addTestimonial", addTestimonial);
// DELETE testimonial
router.delete("/deleteTestimonial/:id", deleteTestimonial);
// UPDATE testimonial status
router.put("/updateTestimonialStatus/:id", updateTestimonialStatus);

// GET testimonial by ID
router.get("getTestimonialById", getTestimonialById);
// GET active testimonials
router.get("/getActiveTestimonials", getActiveTestimonials);
router.get("/getInActiveTestimonials", getInActiveTestimonials);
router.put("/editTestimonialById/:id", editTestimonial);

export default router;
