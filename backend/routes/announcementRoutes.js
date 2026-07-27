// routes/announcementRoutes.js
import express from "express";
import {
  createAnnouncement,
  getAnnouncements,
  likeAnnouncement,
  markRead,
  checkUnreadRequired,
} from "../controllers/announcementController.js";
// import { authMiddleware, isAdmin } from "../middleware/auth.js";

const router = express.Router();

// Admin create
router.post("/", /*authMiddleware, isAdmin,*/ createAnnouncement);

// List (supports ?filter=all|unread and userId from header/body/query)
router.get("/", getAnnouncements);

// Check for unread required announcements (for attendance validation)
router.get("/check-unread-required", checkUnreadRequired);

// Like/Unlike
router.patch("/:id/like", likeAnnouncement);

// Mark as read
router.patch("/:id/mark-read", markRead);

export default router;
