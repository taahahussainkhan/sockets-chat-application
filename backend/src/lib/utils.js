import jwt from "jsonwebtoken";


export const generateToken = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
        // secure: process.env.NODE_ENV === "development",
        secure: false,

    });
    return token;
};


export const validateSignup = ({ fullName, email, password }) => {
    const validations = [
        { valid: !!fullName, message: "Full name is required" },
        { valid: !!email, message: "Email is required" },
        { valid: !!password, message: "Password is required" },
        { valid: !password || password.length >= 8, message: "Password must be at least 8 characters long" },
    ];
    const failed = validations.find((v) => !v.valid);
    return failed ? { valid: false, message: failed.message } : { valid: true }
}

export const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };