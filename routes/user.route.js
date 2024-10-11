import express from "express";
import { createUser, forgotPassword, getUser, login, logout, resetPassword,  } from "../controllers/user.controller.js";

const router = express.Router();

router.post("/signup", createUser);
router.post("/login", login);
router.post("/logout",logout)
router.get("/get",getUser)
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);



export default router;