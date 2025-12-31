import { Router } from "express";
import {createReview,updateReview,deleteReview,getById} from "../controllers/review.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { OnlyUser } from "../types/global.types";

const router = Router();

// Create review
router.post("/", authenticate, createReview);

// Update review
router.put("/:id", authenticate(OnlyUser), updateReview);

// Delete review
router.delete("/:id", authenticate(OnlyUser), deleteReview);

// Get reviews for an item
router.get("/item/:itemId", getById);

export default router;
