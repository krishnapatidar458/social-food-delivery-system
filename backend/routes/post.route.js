import express from "express";
import {
  addComment,
  addNewPost,
  bookMarkPost,
  deletePost,
  dislikePost,
 
  getAllPost,
  getCommentsOfPost,
  getUserPost,
  likePost,
} from "../controllers/post.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import upload from "../middlewares/multer.js";
const router = express.Router();

router
  .route("/addpost")
  .post(isAuthenticated, upload.single("media"), addNewPost);
router.route("/all").get(isAuthenticated, getAllPost);
router.route("/userpost/all").get(isAuthenticated, getUserPost);
router.route("/:id/like").get(isAuthenticated, likePost);
router.route("/:id/dislike").get(isAuthenticated, dislikePost);
router.route("/:id/comment").post(isAuthenticated, addComment);
router.route("/:id/comment/all").post(isAuthenticated, getCommentsOfPost);
router.route("/:id/bookmark").get(isAuthenticated, bookMarkPost);
router.route("/delete/:id").delete(isAuthenticated, deletePost);


export default router;
