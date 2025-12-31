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
exports.updateProfile = exports.getById = exports.remove = exports.getAllUser = void 0;
const user_models_1 = __importDefault(require("../models/user.models"));
const error_handler_middleware_1 = __importDefault(require("../middlewares/error-handler.middleware"));
const errorhandler_1 = require("../utils/errorhandler");
const cloudinary_utils_1 = require("../utils/cloudinary.utils");
const pagination_utils_1 = require("../utils/pagination.utils");
exports.getAllUser = (0, errorhandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { query, limit, page } = req.query;
    const filter = {};
    const per_page = Number(limit) || 15;
    const current_page = Number(page) || 1;
    const skip = (current_page - 1) * per_page;
    const users = yield user_models_1.default.find(filter).skip(skip).limit(per_page).sort({ createdAt: -1 });
    const total = yield user_models_1.default.countDocuments({});
    res.status(200).json({
        message: "All user fetched",
        status: "success",
        success: true,
        data: {
            data: users,
            pagination: (0, pagination_utils_1.getPagination)(total, per_page, current_page)
        }
    });
}));
exports.remove = (0, errorhandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const deletedUser = yield user_models_1.default.findByIdAndDelete(id);
    if (!deletedUser) {
        throw new error_handler_middleware_1.default("User not found", 404);
    }
    res.status(200).json({
        message: "User deleted successfully",
        success: true,
        status: "success",
        data: null,
    });
}));
exports.getById = (0, errorhandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const user = user_models_1.default.findOne({ _id: userId });
    if (!user) {
        throw new error_handler_middleware_1.default("User not found", 404);
    }
    res.status(200).json({
        message: "user fetched",
        status: "success",
        success: true,
        data: user,
    });
}));
exports.updateProfile = (0, errorhandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { firstName, lastName, phone, gender } = req.body;
    const profile_picture = req.file;
    const { id } = req.params;
    const user = yield user_models_1.default.findById(id);
    if (!user) {
        throw new error_handler_middleware_1.default("User not found", 404);
    }
    if (firstName)
        user.firstName = firstName;
    if (lastName)
        user.lastName = lastName;
    if (phone)
        user.phone = phone;
    if (gender)
        user.gender = gender;
    if (profile_picture) {
        if ((_a = user.profile_picture) === null || _a === void 0 ? void 0 : _a.public_id) {
            yield (0, cloudinary_utils_1.deleteFile)([(_b = user === null || user === void 0 ? void 0 : user.profile_picture) === null || _b === void 0 ? void 0 : _b.public_id]);
        }
        const uploadedImage = yield (0, cloudinary_utils_1.uploadFile)(profile_picture.path, "users/profile_pictures");
        user.profile_picture = uploadedImage;
    }
    yield user.save();
    res.status(200).json({
        message: "Profile updated successfully",
        success: true,
        status: "success",
        data: user,
    });
}));
