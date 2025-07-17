import jwt from "jsonwebtoken"



//Creating Token
export const generateToken = (userId, res) => {

    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "7d"
    })
    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, //7days in miliseconds
        httpOnly: true, // Prevents XSS attacks (cross-site scripting attacks)
        sameSite: "strict", // Prevents CSRF attacks (cross-site request forgery)
        secure: process.env.NODE_ENV !== "development"
    })
    return token
}
