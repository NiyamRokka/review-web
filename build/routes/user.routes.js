"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
const global_types_1 = require("../types/global.types");
const file_uploader_middleware_1 = require("../middlewares/file-uploader.middleware");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const uploader = (0, file_uploader_middleware_1.upload)();
const router = express_1.default.Router();
router.get('/', user_controller_1.getAllUser);
router.get('/:id', user_controller_1.getById);
router.put('/:id', (0, auth_middleware_1.authenticate)(global_types_1.OnlyUser), uploader.single('profile_picture'), user_controller_1.updateProfile);
router.delete('/:id', user_controller_1.remove);
exports.default = router;
