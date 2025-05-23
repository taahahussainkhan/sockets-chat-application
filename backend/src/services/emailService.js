import nodemailer from "nodemailer";

export const sendOTP = async (email, otp) => {
    const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: `"Chat App Support" ${process.env.EMAIL_USER}`, // sender
        to: email,                                          // recipient
        subject: "Your OTP for Signup Verification",
        html: `
          <div style="font-family: sans-serif; font-size: 16px;">
            <p>Hello 👋,</p>
            <p>Your OTP code is: <strong>${otp}</strong></p>
            <p>This code will expire in 10 minutes.</p>
            <p>If you didn't request this, please ignore this email.</p>
            <br />
            <p>— Chat App Team</p>
          </div>
        `,
    };

    await transporter.sendMail(mailOptions);
}