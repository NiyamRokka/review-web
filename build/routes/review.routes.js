"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const review_controller_1 = require("../controllers/review.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const global_types_1 = require("../types/global.types");
const router = (0, express_1.Router)();
// Create review
router.post("/", auth_middleware_1.authenticate, review_controller_1.createReview);
// Update review
router.put("/:id", (0, auth_middleware_1.authenticate)(global_types_1.OnlyUser), review_controller_1.updateReview);
// Delete review
router.delete("/:id", (0, auth_middleware_1.authenticate)(global_types_1.OnlyUser), review_controller_1.deleteReview);
// Get reviews for an item
router.get("/item/:itemId", review_controller_1.getById);
exports.default = router;
