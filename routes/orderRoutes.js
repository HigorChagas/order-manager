import express from "express";
import {
  createOrder,
  getOrder,
  listOrders,
  updateOrder,
  deleteOrder,
  addItem,
} from "../controllers/orderController.js";

const router = express.Router();

router.post("/order", createOrder);
router.get("/order/:id", getOrder);
router.get("/orders", listOrders);
router.put("/order/:id", updateOrder);
router.delete("/order/:id", deleteOrder);

router.post("/order/:id/items", addItem);

export default router;
