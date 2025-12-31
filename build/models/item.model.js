"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Item = void 0;
const mongoose_1 = require("mongoose");
const itemSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    type: {
        type: String,
        required: true,
        enum: ["Book", "Show", "Restaurant"],
    },
    description: {
        type: String,
        trim: true,
    },
    cover_image: {
        path: {
            type: String,
            required: [true, 'Cover Image is required']
        },
        public_id: {
            type: String,
            required: [true, 'Cover Image is required']
        }
    },
    images: [
        {
            path: {
                type: String,
            },
            public_id: {
                type: String,
            }
        },
    ],
    averageRating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
    },
    details: {
        author: String,
        genre: String,
        pages: Number,
        director: String,
        episodes: Number,
        location: String,
        cuisine: String,
        priceRange: String,
    },
}, { timestamps: true });
exports.Item = (0, mongoose_1.model)("Item", itemSchema);
