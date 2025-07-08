import express from "express";
import {
    getUsers,
    userLogin,
    userSignup,
    updateUser,
    logout,
} from "../controllers/user.js";

import { authenticate } from "../middlewares/auth.js";
const router = express.Router();

router.post("/update-user", authenticate, updateUser);
router.get("/users", authenticate, getUsers);

router.post("/signup", userSignup);
router.post("/login", userLogin);
router.post("/logout", logout);

export default router;