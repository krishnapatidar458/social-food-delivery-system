import express from "express";
import {
  editProfile,
  followOrUnfollow,
  getFollowings,
  getProfile,
  getSuggestedUsers,
  getUserStats,
  login,
  logout,
  register,
} from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import upload from "../middlewares/multer.js";
const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/:id/profile").get(isAuthenticated, getProfile);
router
  .route("/profile/edit")
  .post(isAuthenticated, upload.single("profilePhoto"), editProfile);
router.route("/suggested").get(isAuthenticated, getSuggestedUsers);
router.route("/followorunfollow/:id").post(isAuthenticated, followOrUnfollow);
router.route("/followings").get(isAuthenticated, getFollowings);
router.route("/stats/:id").get(isAuthenticated, getUserStats);

export default router;
