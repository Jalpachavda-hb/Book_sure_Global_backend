import express from "express";
import createUploader from "../Middleware/Upload.js";
import BlogController from "../controllers/BlogController.js";

const {
  createBlog,
  getActiveBlogs,
  getBlogBySlug,
  getBlogById,
  updateBlog,
  updateBlogStatus,
  deleteBlog,
} = BlogController;
const router = express.Router();

const upload = createUploader("Blog");
router.post("/addblog", upload.single("thumbnail_image"), createBlog);

router.get("/getblogs", getActiveBlogs);
// router.get("/blogs/admin", getAllBlogs);
router.get("/blog/:slug", getBlogBySlug);
router.get("/:id", getBlogById);
router.put("/blog/:id", upload.single("thumbnail_image"), updateBlog);
router.patch("/blog/status/:id", updateBlogStatus);
router.delete("/blog/:id", deleteBlog);

export default router;
