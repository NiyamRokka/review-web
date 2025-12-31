"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Review = void 0;
const mongoose_1 = require("mongoose");
const reviewSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    content: {
        type: String,
        required: true,
        trim: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    author: {
        type: mongoose_1.Types.ObjectId,
        ref: "User",
        required: true,
    },
    item: {
        type: mongoose_1.Types.ObjectId,
        ref: "Item",
        required: true,
    },
    likes: [
        {
            type: mongoose_1.Types.ObjectId,
            ref: "User",
        },
    ],
    comment: {
        type: String,
        trim: true,
    },
}, { timestamps: true });
exports.Review = (0, mongoose_1.model)("Review", reviewSchema);
