import express from "express";
import {
  createBlog,
  getBlogs,
  getBlogById,
  updateBlog,
  deleteBlog
} from "../controllers/blogController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/multer.js";

const router = express.Router();


router.post("/", authMiddleware, upload.single("image"), createBlog);

// Récupérer tous les blogs (user)
router.get("/", getBlogs);

// Récupérer un blog par ID
router.get("/:id", getBlogById);

router.put("/:id", authMiddleware, upload.single("image"), updateBlog); // modification

router.route("/:id")
  .get(getBlogById)
  .delete(authMiddleware, deleteBlog); // suppression

export default router;
