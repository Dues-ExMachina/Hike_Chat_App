import express from "express"
import { checkAuth, login, logout, signup, updateProfile } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();


//Setting up router using express_ signup,login,logout is in auth.controller.js
router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);

//protectroute is the middleware that will check if the user is logged in so that they can change details or update info
router.put("/update-profile", protectRoute, updateProfile);


router.get("/check", protectRoute, checkAuth)

export default router;