import express from "express";
import { verifyToken } from "../middleware/jwt.js";
import {
  getOrders,
  intent,
  confirm,
  getSalesCount,
} from "../controllers/order.controller.js";

const router = express.Router();

router.get("/", verifyToken, getOrders);
router.post("/create-payment-intent/:id", verifyToken, intent);
router.put("/", verifyToken, confirm);
router.get("/sales/:gigId", getSalesCount);

export default router;
