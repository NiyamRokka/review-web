"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteReview = exports.updateReview = exports.getById = exports.getAll = exports.createReview = void 0;
const errorhandler_1 = require("../utils/errorhandler");
const error_handler_middleware_1 = __importDefault(require("../middlewares/error-handler.middleware"));
const pagination_utils_1 = require("../utils/pagination.utils");
const review_model_1 = require("../models/review.model");
const item_model_1 = require("../models/item.model");
// import { Types } from "mongoose";
const nodemailer_utils_1 = require("../utils/nodemailer.utils");
//create review
exports.createReview = (0, errorhandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { item, rating, comment } = req.body;
    const user = req.user._id;
    //Validate input
    if (!item) {
        throw new error_handler_middleware_1.default("Item is required", 400);
    }
    if (!rating || rating < 1 || rating > 5) {
        throw new error_handler_middleware_1.default("Rating must be between 1 and 5", 400);
    }
    //Check if item exists
    const reviewItem = yield item_model_1.Item.findById(item);
    if (!reviewItem) {
        throw new error_handler_middleware_1.default("Item not found", 404);
    }
    //Prevent duplicate review
    const existingReview = yield review_model_1.Review.findOne({
        user,
        item,
    });
    if (existingReview) {
        throw new error_handler_middleware_1.default("You have already reviewed this item", 400);
    }
    //Create review
    const review = yield review_model_1.Review.create({
        user,
        item,
        rating,
        comment,
    });
    //Review success email
    const html = `
      <div style="padding: 30px; font-family: Arial;">
        <h2 style="color: #4CAF50;">✅ Review Added Successfully</h2>

        <p><strong>Item:</strong> ${reviewItem.title}</p>
        <p><strong>Rating:</strong> ⭐ ${rating}/5</p>
        ${comment
        ? `<p><strong>Your Comment:</strong> ${comment}</p>`
        : ""}

        <p><strong>Reviewed On:</strong> ${new Date(review.createdAt).toDateString()}</p>

        <hr style="margin: 20px 0;">

        <p>Thank you for sharing your experience. Your review helps others make better decisions.</p>
        <p>We appreciate your time and feedback ❤️</p>
      </div>

      <div style="background-color: #f1f1f1; text-align: center; padding: 15px;">
        <p style="margin: 0;">&copy; ${new Date().getFullYear()} Review Platform. All rights reserved.</p>
      </div>
    `;
    yield (0, nodemailer_utils_1.sendMail)({
        to: req.user.email,
        subject: "Review Submitted Successfully",
        html,
    });
    res.status(201).json({
        message: "Review added successfully",
        success: true,
        data: review,
    });
}));
//getall
exports.getAll = (0, errorhandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { item, rating, limit, page } = req.query;
    const page_limit = Number(limit) || 10;
    const current_page = Number(page) || 1;
    const skip = (current_page - 1) * page_limit;
    let filter = {};
    if (item) {
        filter.item = item;
    }
    if (rating) {
        filter.rating = rating;
    }
    const reviews = yield review_model_1.Review.find(filter)
        .populate("user", "name email")
        .limit(page_limit)
        .skip(skip)
        .sort({ createdAt: -1 });
    const total = yield review_model_1.Review.countDocuments(filter);
    res.status(200).json({
        message: "Reviews fetched successfully",
        success: true,
        status: "success",
        data: {
            data: reviews,
            pagination: (0, pagination_utils_1.getPagination)(total, page_limit, current_page),
        },
    });
}));
//get by id
exports.getById = (0, errorhandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const review = yield review_model_1.Review.findById(id).populate("user", "name email");
    if (!review) {
        throw new error_handler_middleware_1.default("Review not found", 404);
    }
    res.status(200).json({
        message: "Review fetched successfully",
        success: true,
        status: "success",
        data: review,
    });
}));
//update existing review 
exports.updateReview = (0, errorhandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        throw new error_handler_middleware_1.default("Unauthorized", 401);
    }
    const { id } = req.params;
    const { rating, comment } = req.body;
    const review = yield review_model_1.Review.findById(id);
    const reviewUserId = review.user;
    if (!review) {
        throw new error_handler_middleware_1.default("Review not found", 404);
    }
    if (!reviewUserId.equals(req.user._id)) {
        throw new error_handler_middleware_1.default("Not authorized to update this review", 403);
    }
    if (typeof rating === "number") {
        review.rating = rating;
    }
    if (typeof comment === "string") {
        review.comment = comment;
    }
    yield review.save();
    res.status(200).json({
        message: "Review updated successfully",
        success: true,
        status: "success",
        data: review,
    });
}));
//delete existing review
exports.deleteReview = (0, errorhandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const review = yield review_model_1.Review.findById(id);
    if (!review) {
        throw new error_handler_middleware_1.default("Review not found", 404);
    }
    // Authorization: only review owner can delete
    if (review.user.toString() !== req.user._id.toString()) {
        throw new error_handler_middleware_1.default("Not authorized to delete this review", 403);
    }
    yield review.deleteOne();
    res.status(200).json({
        message: "Review deleted successfully",
        success: true,
        status: "success",
    });
}));
