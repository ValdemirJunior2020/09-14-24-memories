// routes/user.js
import express from "express";
const router = express.Router();
import { signup, signin } from "../controllers/user.js"; // Correctly import both functions

router.post("/signup", signup); // POST request for signup
router.post("/signin", signin); // POST request for signin

export default router;
