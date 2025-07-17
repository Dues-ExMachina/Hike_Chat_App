import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
    try {
        //colsol logging the cookies
        // console.log("Cookies received:", req.cookies);
        //checking if the token is available
        const token = req.cookies?.jwt//changed from cookie
        if (!token) {
            return res.status(500).json({ message: "Unauthorised Access - No Token" })
        }

        //Decrypting the token with JWT secrect from env
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        if (!decoded) {
            return res.status(500).json({ message: "Unauthorised Access - Invalid Token" })
        }

        //checking if the user id present in the token is matching with the db user, without taking the password
        const user = await User.findById(decoded.userId).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User NOT FOUND" })
        }

        //stores the current authenticated user on the request object.
        req.user = user;
        //This will allow you to run the next program in authRoute
        next()
    } catch (error) {
        console.log("Error in ProtectRoute middleware :", error.message)
        res.status(500).json({ message: "Internal Error" })
    }
}


