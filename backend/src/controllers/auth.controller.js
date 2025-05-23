import { generateToken, validateSignup, generateOTP } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import cloudinary from "../lib/cloudinary.js";
import { sendOTP } from "../services/emailService.js";


export const signup = async (req, res) => {
    const { fullName, email, password } = req.body;
    try {

        const { valid, message } = validateSignup({ fullName, email, password })
        if (!valid) return res.status(400).json({ message });

        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const otp = generateOTP();
        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
            otp,
            otpExpires: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
            isVerified: false,
        });


        await sendOTP(email, otp)
        await newUser.save();

        res.status(201).json({
            message: "OTP sent to email",
        })
        // if (newUser) {
        //     // genertae JWT 
        //     generateToken(newUser.id, res)
        //     await newUser.save();
        //     res.status(201).json({
        //         _id: newUser._id,
        //         fullName: newUser.fullName,
        //         email: newUser.email,
        //         createdAt: newUser.createdAt,
        //     });
        // }
        // else {
        //     return res.status(400).json({ message: "Invalid user data" });
        // }

    } catch (error) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({ message: error.message });
    }
}

export const verifyOTP = async (req, res) => {
    const { email, otp } = req.body
    try {
        const user = await User.findOne({ email })
        if (!user) return res.status(400).json({ message: "User not found" })
        if (!user.otp || user.otp !== otp || user.otpExpires < new Date())
            return res.status(400).json({ message: "Invalid or expired OTP" })

        user.isVerified = true;
        user.otp = undefined;
        user.otpExpires = undefined;

        await user.save();
        generateToken(user.id, res)

        res.status(200).json({
            message: "OTP verified successfully",
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
        })

    }
    catch (error) {
        console.log("Error in verifyOTP controller:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" })
        }

        if (!user.isVerified) {
            return res.status(400).json({ message: "User is not verified" })
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid email or password" })
        }

        generateToken(user.id, res)
        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePicture: user.profilePicture,
            createdAt: user.createdAt,
        })
    } catch (err) {
        console.log("Error in login controller", err.message);
        res.status(500).json({ message: err.message })
    }
}

export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 })
        res.status(200).json({ message: "Logged out successfully" })
    } catch (err) {
        console.log("Error in logout controller", err.message);
        res.status(500).json({ message: err.message })
    }
}

export const updateProfile = async (req, res) => {
    try {
        const { profilePicture } = req.body;
        const userId = req.user._id;

        if (!profilePicture) {
            return res.status(400).json({ message: "Profile picture is required" });
        }

        const uploadedResponse = await cloudinary.uploader.upload(profilePicture, {
            folder: "profile-pictures",
            width: 500,
            height: 500,
            crop: "fill",
        })

        const user = await User.findByIdAndUpdate(userId, {
            profilePicture: uploadedResponse.secure_url,
        }, { new: true });

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePicture: user.profilePicture,
            createdAt: user.createdAt,
        })
    } catch (error) {
        console.log("Error in updateProfile controller", error.message);
        res.status(500).json({ message: error.message });
    }
}

export const checkAuth = (req, res) => {
    try {
        res.status(200).json({
            _id: req.user._id,
            fullName: req.user.fullName,
            email: req.user.email,
            profilePicture: req.user.profilePicture,
            createdAt: req.user.createdAt,
        })
    } catch (error) {
        console.log("Error in checkAuth controller", error.message);
        res.status(500).json({ message: error.message });
    }
}
