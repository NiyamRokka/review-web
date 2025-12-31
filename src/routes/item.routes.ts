import { Router } from "express";
import {createItem,getAllItem,getItemById,updateItem,deleteItem,} from "../controllers/item.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { OnlyUser } from "../types/global.types";

const router = Router();

router.post("/",authenticate,createItem);
router.get("/", getAllItem);
router.get("/:id", getItemById);
router.put("/:id",authenticate(OnlyUser),updateItem);
router.delete("/:id", authenticate(OnlyUser), deleteItem);

export default router;
