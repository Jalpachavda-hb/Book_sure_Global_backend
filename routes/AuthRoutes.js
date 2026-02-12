import express from "express";
import adminLogin from "../controllers/adminAuthController.js";

const {
  getAllAdmins,
  addAdmin,
  updateAdminProfile,
  loginAdmin,
  updateAdminStatus,
  deleteUser,getAdminById
} = adminLogin;

const router = express.Router();

router.post("/login", loginAdmin);
router.post("/addadmin", addAdmin);
router.post("/update-profile/:id", updateAdminProfile);
router.patch("/updatestatus/:id", updateAdminStatus);
router.delete("/user/:id", deleteUser);
router.get("/getalladmin", getAllAdmins);
router.get("/getadminbyid/:admin_id", getAdminById);
export default router;
