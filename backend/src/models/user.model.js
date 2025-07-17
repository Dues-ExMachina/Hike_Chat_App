import mongoose from "mongoose"

//Creating user data schima
const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        fullName: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
            minlemgth: 6,
        },
        profilePic: {
            type: String,
            default: "",
        },
    },
    { timestamps: true }
);

//Naming the schema
const User = mongoose.model("User", userSchema);

export default User;