import express from "express";
import servicesController from "../../controllers/Services/ServicesController.js";
// import {
//   addService,
//   getActiveServices,
//   getInactiveServices,
//   updateService,
//   updateServiceStatus,
//   deleteService,
// } from "../controllers/servicesController.js";

const {
  addService,
  getActiveServices,
  getInactiveServices,
  updateService,
  updateServiceStatus,
  deleteService,getServiceById
} = servicesController;

const router = express.Router();

/* ✅ Add */
router.post("/services", addService);

/* ✅ Get */
router.get("/services/active", getActiveServices);
router.get("/services/inactive", getInactiveServices);
router.get("/services/getbyid/:id", getServiceById);
/* ✅ Update */
router.put("/updateservices/:id", updateService);
router.put("/services/status/:id", updateServiceStatus);

/* ✅ Delete */
router.delete("/services/:id", deleteService);

export default router;
