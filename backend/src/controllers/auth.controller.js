import cloudinary from "../lib/cloudinary.js"
import { generateToken } from "../lib/utils.js"
import User from "../models/user.model.js"
import bcrypt from "bcryptjs"


//For SignUP
export const signup = async (req, res) => {
    const { email, fullName, password } = req.body
    try {
        //Giving warning if all the fields are !filled
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "Please fill all the details 😁" })
        }
        //Checks if password is long enough
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 charecters 😊" })
        }
        //Checking if email is exisits
        const user = await User.findOne({ email })
        if (user) return res.status(400).json({ message: "Email allready exists, You can contactus 😢" })
        //hash password using bcryptjs
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        //now creating new user
        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
        })

        if (newUser) {
            //generate JWT Token
            generateToken(newUser._id, res)
            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
            });
        } else { res.status(400).json({ message: "Invalid User Data 😥" }) }

    } catch (error) {
        console.log("Error in signup controller : ", error.message)
        res.status(500).json({ message: "Internal Server Error!" })
    }
}


//For login
export const login = async (req, res) => {
    //destructuring body and taking email and password
    const { email, password } = req.body;
    try {
        //cheking if the user email is exists in the db
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(404).json({ message: "Invalid Credentials ⁉️" })
        }
        //Comapare the hashed passowrd with the given password
        const isPasswordCorrect = await bcrypt.compare(password, user.password)
        //cheking if the user Password is correct with the db
        if (!isPasswordCorrect) {
            return res.status(404).json({ message: "Invalid Credentials ⁉️" })
        }

        generateToken(user._id, res)

        // res.status(201).json({ message: "User Logging in ✌️" })

        res.status(201).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,
        });

    } catch (error) {
        console.log("Error in login controller :", error.message)
        res.status(500).json({ message: "Internal Error" })
    }
}


//For logout
export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 })
        res.status(201).json({ message: "LogedOut successfully 👋" })
    } catch (error) {
        console.log("Error in logout controller :", error.message)
        res.status(500).json({ message: "Internal Error" })
    }
}


//For updateProfile
export const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body
        //previousl we access the userid cause it was protected, thats why we parsed the user in protected function
        const userId = req.user._id;
        //needs profile pic
        if (!profilePic) {
            res.status(400).json({ message: "Profile pic required" })
        }
        //if provided upload to cloudinary
        const uploadResponse = await cloudinary.uploader.upload(profilePic)
        //update the database with a url provided by cludinary
        //& By default, findOneAndUpdate() returns the document as it was before update was applied. If you set new: true, findOneAndUpdate() will instead give you the object after update was applied.
        const updatedUser = await User.findByIdAndUpdate(userId, { profilePic: uploadResponse.secure_url }, { new: true })

        res.status(200).json({ updatedUser, message: "Updated Profile Pic" })

    } catch (error) {
        console.log("Error in updateProfile controller :", error.message)
        res.status(500).json({ message: "Internal Error" })
    }
}


//For Checking Authentication
export const checkAuth = async (req, res) => {
    try {

        //To work with zustand you need to provide all the details in checkauth
        res.status(200).json({
            _id: req.user._id,
            fullName: req.user.fullName,
            email: req.user.email,
            profilePic: req.user.profilePic,
            createdAt: req.user.createdAt,
        });
    } catch (error) {
        console.log("Error in checkAuth controller :", error.message);
        res.status(500).json({ message: "Internal server Error" });
    }
};


