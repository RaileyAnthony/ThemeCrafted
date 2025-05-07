import express from "express";
import {
  createGig,
  deleteGig,
  getGig,
  getGigs,
  updateGig, // ADD THIS IMPORT
} from "../controllers/gig.controller.js";
import { verifyToken } from "../middleware/jwt.js";

const router = express.Router();

router.post("/", verifyToken, createGig);
router.delete("/:id", verifyToken, deleteGig);
router.get("/single/:id", getGig);
router.get("/", getGigs);

// ADD THIS NEW ROUTE
router.put("/:id", verifyToken, updateGig);

export default router;
