import express from "express";
import Blog from "../controller/blog";
const router = express.Router();
const Blogs = new Blog();

router.route("/add").post(Blogs.createBlog);
router.route("/update").put(Blogs.updateBlog);
router.route("/delete").delete(Blogs.deleteBlog);
router.route("/get").get(Blogs.getAllBlog);
router.route("/get/:id").get(Blogs.getBlogById);

export default router;
