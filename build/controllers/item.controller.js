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
exports.deleteItem = exports.updateItem = exports.getItemById = exports.getAllItem = exports.createItem = void 0;
const errorhandler_1 = require("../utils/errorhandler");
const error_handler_middleware_1 = __importDefault(require("../middlewares/error-handler.middleware"));
const cloudinary_utils_1 = require("../utils/cloudinary.utils");
const pagination_utils_1 = require("../utils/pagination.utils");
const item_model_1 = require("../models/item.model");
const item_folder = "/item_uploads";
//create item
exports.createItem = (0, errorhandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { cover_image, images } = req.files;
    const { name, type, description, details } = req.body;
    if (!cover_image) {
        throw new error_handler_middleware_1.default("Cover Image Required", 400);
    }
    const item = new item_model_1.Item({
        name,
        type,
        description,
        details: details ? JSON.parse(details !== null && details !== void 0 ? details : "") : null,
    });
    if (!item) {
        throw new error_handler_middleware_1.default("Something went wrong. Try again later.", 500);
    }
    // Upload cover image
    item.cover_image = yield (0, cloudinary_utils_1.uploadFile)(cover_image[0].path, item_folder);
    if (images && images.length > 0) {
        const imagePaths = yield Promise.all(images.map((img) => __awaiter(void 0, void 0, void 0, function* () { return yield (0, cloudinary_utils_1.uploadFile)(img.path, item_folder); })));
        item.set("images", imagePaths);
    }
    yield item.save();
    res.status(201).json({
        message: "Item added successfully.",
        success: true,
        status: "success",
        data: item,
    });
}));
exports.getAllItem = (0, errorhandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { query, type, min_rating, max_rating, limit, page } = req.query;
    const page_limit = Number(limit) || 15;
    const current_page = Number(page) || 1;
    const skip = (current_page - 1) * page_limit;
    let filter = {};
    if (query) {
        filter.$or = [
            {
                name: {
                    $regex: query,
                    $options: "i",
                },
            },
            {
                description: {
                    $regex: query,
                    $options: "i",
                },
            },
        ];
    }
    if (type) {
        filter.type = type;
    }
    //Filter by rating range
    if (min_rating || max_rating) {
        filter.averageRating = {};
        if (min_rating)
            filter.averageRating.$gte = Number(min_rating);
        if (max_rating)
            filter.averageRating.$lte = Number(max_rating);
    }
    const items = yield item_model_1.Item.find(filter)
        .limit(page_limit)
        .skip(skip)
        .sort({ createdAt: -1 });
    const total = yield item_model_1.Item.countDocuments(filter);
    res.status(200).json({
        message: "Items fetched successfully.",
        success: true,
        status: "success",
        data: {
            data: items,
            pagination: (0, pagination_utils_1.getPagination)(total, page_limit, current_page),
        },
    });
}));
//getitem by id
exports.getItemById = (0, errorhandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const item = yield item_model_1.Item.findOne({ _id: id });
    if (!item) {
        throw new error_handler_middleware_1.default("Item not found", 404);
    }
    res.status(200).json({
        message: "Item fetched successfully.",
        success: true,
        status: "success",
        data: item,
    });
}));
//update item
exports.updateItem = (0, errorhandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { cover_image, images } = req.files;
    const { name, type, description, details, deletedImage } = req.body;
    const item = yield item_model_1.Item.findByIdAndUpdate(id, { name, type, description, details }, { new: true, runValidators: true });
    if (!item) {
        throw new error_handler_middleware_1.default("Item not found", 404);
    }
    if (cover_image) {
        if (item.cover_image) {
            yield (0, cloudinary_utils_1.deleteFile)([item.cover_image.public_id]);
        }
        item.cover_image = yield (0, cloudinary_utils_1.uploadFile)(cover_image[0].path, item_folder);
    }
    if (deletedImage && deletedImage.length > 0 && item.images.length > 0) {
        yield (0, cloudinary_utils_1.deleteFile)(deletedImage);
        const oldImages = item.images.filter((img) => !deletedImage.includes(img.public_id));
        item.set("images", oldImages);
    }
    if (images && images.length > 0) {
        const uploadedImages = yield Promise.all(images.map((img) => __awaiter(void 0, void 0, void 0, function* () { return yield (0, cloudinary_utils_1.uploadFile)(img.path, item_folder); })));
        item.set("images", [...item.images, ...uploadedImages]);
    }
    yield item.save();
    res.status(200).json({
        message: "Item updated successfully.",
        success: true,
        status: "success",
        data: item,
    });
}));
//delete
exports.deleteItem = (0, errorhandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const item = yield item_model_1.Item.findById(id);
    if (!item) {
        throw new error_handler_middleware_1.default("Item not found", 404);
    }
    if (item.cover_image) {
        yield (0, cloudinary_utils_1.deleteFile)([item.cover_image.public_id]);
    }
    if (item.images && item.images.length > 0) {
        yield (0, cloudinary_utils_1.deleteFile)(item.images.map((img) => img.public_id));
    }
    yield item.deleteOne();
    res.status(200).json({
        message: "Item deleted successfully.",
        success: true,
        status: "success",
        data: item,
    });
}));
