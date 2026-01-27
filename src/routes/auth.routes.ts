import express from 'express'
import { login, register, logOut,profile } from '../controllers/auth.controller'
import { AllUserAndAdmins } from "../types/global.types";
import { authenticate } from "../middlewares/auth.middleware";

const router = express.Router();

router.post('/register',register);
router.post('/login',login);
router.post("/logout", logOut);
router.get("/me", authenticate(AllUserAndAdmins), profile);



export default router;