import express from "express";
import { getUserNotifications, updateNotificationRead } from "../controllers/notification.js";
import authMiddleware from "../middleware/auth-middleware.js";


const router = express.Router();

router.get("/", authMiddleware, getUserNotifications);
router.put("/:notifyId/read", authMiddleware, updateNotificationRead);

export default router;
