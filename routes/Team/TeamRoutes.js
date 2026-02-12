import express from "express";
const router = express.Router();
import createUploader from "../../Middleware/Upload.js";
import TeamController from "../../controllers/Team/TeamController.js";
const {
  addTeamMember,

  deleteTeamMember,
  getTeamMembers,
  updateTeamSection,
  getTeamSection,
  getActiveTeamMembers,
  getInactiveTeamMembers,
  updateTeamMemberStatus,
  updateTeamMemberById,
  getTeamMemberById,
} = TeamController;
const uploadTeam = createUploader("team");
router.post("/addmember",
  //  uploadTeam.single("image"),
   
   
   addTeamMember);
router.get("/getmembers", getTeamMembers);

router.get("/getmemberbyid/:id", getTeamMemberById);
router.delete("/member/:id", deleteTeamMember);

router.put("/editmember/:id",
  //  uploadTeam.single("image"),
 updateTeamMemberById);
router.get("/members/active", getActiveTeamMembers);
router.get("/members/inactive", getInactiveTeamMembers);

router.put("/member/status/:id", updateTeamMemberStatus);

router.put("/edittile", updateTeamSection);
router.get("/gettitle", getTeamSection);

export default router;
