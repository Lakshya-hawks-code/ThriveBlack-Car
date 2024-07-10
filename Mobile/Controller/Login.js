import { getUserById, CreateAndUpdate, UpdateUserDetails } from "../../Model/AdminModel.js";
import { getOrdersById } from "../../Model/OrdersModel.js"
import { Get_API_KEY } from "../../helper/GetApiKey.js";
import sgMail from "@sendgrid/mail";
import crypto from "crypto";


const generateOtp = () => {
    const min = 10000;
    const max = 99999;
    return Math.floor(Math.random() * (max - min + 1) + min);
};

const getOrdersByEmail = async (email) => {
    const orders = await getOrdersById({ email: email });
    return orders;
};

const EmailVerification = async (req, res) => {
    try {
        let request = req.body;
        let user = await getUserById({ email: request?.email })
        const otp = generateOtp();
        if (user) {
            if (user?.user_type == 3 || user?.user_type === "3") {
                let updatefields = {
                    otp: otp,
                }
                sendOtpEmail(user?.email, otp);
                await UpdateUserDetails({ _id: user?.id }, updatefields)
                res.json({ status: 200, message: "Otp is sent to mail", user_type: user?.user_type });
            }
            else if (user?.user_type == 2 || user?.user_type === "2") {
                res.json({ status: 200, user_type: user?.user_type })
            }
        }
        else {
            let checkUserOrder = await getOrdersById({ email: request?.email })
            if (checkUserOrder) {
                // Extracting first and last name from the email
                let emailParts = request?.email.split('@')[0].split('.');
                let firstName = emailParts[0];
                let lastName = emailParts.slice(1).join(' '); // Joining remaining parts with space
                request.name = `${firstName} ${lastName}`;
                request.user_type = 3;
                request.otp = "";
                request.profile_img = "";
                let customerCreate = await CreateAndUpdate(request);
                if (customerCreate) {
                    sendOtpEmail(checkUserOrder?.email, otp);
                    let updatefields = {
                        otp: otp,
                    }
                    await UpdateUserDetails({ email: request?.email }, updatefields)
                    res.json({ status: 200, message: "Otp is sent to mail", user_type: user?.user_type });
                }
            }
            else {
                // Extracting first and last name from the email
                let emailParts = request?.email.split('@')[0].split('.');
                let firstName = emailParts[0];
                let lastName = emailParts.slice(1).join(' '); // Joining remaining parts with space
                request.name = `${firstName} ${lastName}`;
                request.user_type = 3;
                request.otp = otp;
                request.profile_img = "";
                sendOtpEmail(request?.email, otp);
                await CreateAndUpdate(request);
                res.json({ status: 200, message: "Successfuly Added", user_type: 3 })
            }
        }

    } catch (error) {
        console.log(`Failed to login: ${error.message}`);
        res.json({ status: 500, message: "Failed to login" });
    }
};



const sendOtpEmail = async (toEmail, otp, user_type) => {
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleString();

    const htmlContent = `<p>Welcome to ThriveBlackCar,</p>
              <p>Your Two-Factor Authentication (2FA) One-Time Password (OTP) is: <b>${otp}</b></p>
              <p>Best regards,</p>
              <p>The ThriveBlackCar Team</p>`

    const msg = {
        to: toEmail,
        from: 'ThriveBlack Car <admin@thriveblackcar.com>',
        subject: `Your 2FA code for login in ThriveBlackCar - ${formattedDate}`,
        html: htmlContent,
    };
    try {
        await Get_API_KEY();
        sgMail.setApiKey(global.SendGridApiKey);
        await sgMail.send(msg);
        console.log('Email sent successfully');
    } catch (error) {
        console.log(`Failed to send email: ${error.message}`);
        throw new Error('Failed to send email');
    }
};

const OtpVerification = async (req, res) => {
    try {
        let request = req.body;

        // Check if password is provided
        if (request?.password) {
            let driver = await getUserById({ email: request?.email });
            if (driver) {
                let salt = driver?.salt;
                let hashedPassword = crypto.pbkdf2Sync(request?.password, salt, 10000, 64, "sha512").toString("hex");
                if (driver?.password === hashedPassword) {
                    return res.json({ status: 200, message: "Successfully logged in", userId: driver?.id });
                } else {
                    return res.json({ status: 400, message: "Wrong Credentials" });
                }
            }
        }

        // Check if OTP is provided
        let otpVerified = await getUserById({ otp: request?.otp });
        if (otpVerified) {
            await UpdateUserDetails({ _id: otpVerified?.id }, { otp: "" });
            return res.json({ status: 200, message: "Successfully Logged in Customer", userId: otpVerified?.id });
        } else {
            return res.json({ status: 400, message: "Otp does not matched" });
        }

    } catch (error) {
        console.log(`Failed to login: ${error.message}`);
        return res.json({ status: 500, message: "Failed to login" });
    }
};



export default {
    EmailVerification,
    OtpVerification,
}