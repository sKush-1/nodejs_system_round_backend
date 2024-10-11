import express from "express";
import { createUser, forgotPassword, getUser, login, logout, resetPassword,  } from "../controllers/user.controller.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", createUser);
router.post("/login", login);
router.post("/logout", isAuthenticated, logout)
router.get("/get",getUser)
router.post("/forgot-password",isAuthenticated, forgotPassword);
router.post("/reset-password",isAuthenticated, resetPassword);



export default router;