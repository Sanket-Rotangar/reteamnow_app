// controllers/announcement.controller.js
import Announcement from "../models/announcement-model.js";

// Helper to extract userId from body, header, or query (until JWT is added)
const getUserId = (req) =>
  req.user?.id ||
  req.body.userId ||
  req.headers["x-user-id"] ||
  req.query.userId ||
  null;

// Create (admin)
export const createAnnouncement = async (req, res) => {
  try {
    const { title, subtitle, message, mediaUrl, mediaType } = req.body;
    const createdBy = getUserId(req);

    const doc = await Announcement.create({
      title,
      subtitle,
      message,
      mediaUrl,
      mediaType,
      createdBy,
    });

    res.status(201).json(doc);
  } catch (err) {
    console.error("Create announcement error:", err);
    res.status(500).json({ error: "Failed to create announcement" });
  }
};

// GET /announcements?filter=all|unread  (&userId=...)
export const getAnnouncements = async (req, res) => {
  try {
    const userId = getUserId(req);
    const filter = (req.query.filter || "all").toString().toLowerCase();

    const query = {};
    if (filter === "unread" && userId) {
      // unread for this user = not in readBy
      query.readBy = { $nin: [userId] };
    }

    const list = await Announcement.find(query).sort({ createdAt: -1 }).lean();

    // Add view helpers for the client
    const withFlags = list.map((a) => ({
      ...a,
      likedByUser: userId ? a.likes?.some((id) => id?.toString() === userId.toString()) : false,
      readByUser: userId ? a.readBy?.some((id) => id?.toString() === userId.toString()) : false,
      likesCount: a.likes?.length || 0,
    }));

    res.json(withFlags);
  } catch (err) {
    console.error("Get announcements error:", err);
    res.status(500).json({ error: "Failed to fetch announcements" });
  }
};

// Toggle Like (like/unlike)
export const likeAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized: userId required" });

    const doc = await Announcement.findById(id);
    if (!doc) return res.status(404).json({ error: "Not found" });

    const already = doc.likes.some((u) => u.toString() === userId.toString());
    if (already) {
      doc.likes = doc.likes.filter((u) => u.toString() !== userId.toString());
    } else {
      doc.likes.push(userId);
    }
    await doc.save();

    res.json({
      message: already ? "Unliked 👎" : "Liked 👍",
      likes: doc.likes, // Return the full array for frontend
      likedByUser: !already,
      likesCount: doc.likes.length,
    });
  } catch (err) {
    console.error("Like announcement error:", err);
    res.status(500).json({ error: "Failed to toggle like" });
  }
};

// Mark as Read (idempotent)
export const markRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized: userId required" });

    const doc = await Announcement.findById(id);
    if (!doc) return res.status(404).json({ error: "Not found" });

    const hasRead = doc.readBy.some((u) => u.toString() === userId.toString());
    if (!hasRead) {
      doc.readBy.push(userId);
      await doc.save();
    }

    res.json({
      message: "Marked as Read",
      readBy: doc.readBy, // Return the full array for frontend
      readByCount: doc.readBy.length,
      readByUser: true,
    });
  } catch (err) {
    console.error("Mark read error:", err);
    res.status(500).json({ error: "Failed to mark as read" });
  }
};

// Check for unread required announcements (for attendance validation)
export const checkUnreadRequired = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized: userId required" });

    const unreadRequired = await Announcement.find({
      requiresAcknowledgment: true,
      readBy: { $ne: userId }
    }).select('title _id createdAt').sort({ createdAt: -1 }).lean();

    res.json({
      hasUnreadRequired: unreadRequired.length > 0,
      count: unreadRequired.length,
      announcements: unreadRequired.map(ann => ({
        id: ann._id,
        title: ann.title,
        createdAt: ann.createdAt
      }))
    });
  } catch (err) {
    console.error("Check unread required error:", err);
    res.status(500).json({ error: "Failed to check unread required announcements" });
  }
};
