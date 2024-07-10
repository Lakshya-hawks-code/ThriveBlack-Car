import express from "express";
const router = express.Router();
import Auth from "../Mobile/Controller/Login.js";
import LocationController from "../Mobile/Controller/Location.js";
import ProfileController from "../Mobile/Controller/Profile.js";
import CustomerController from "../Mobile/Controller/Customer.js";

router.post('/email-verification', Auth.EmailVerification);
router.post('/login', Auth.OtpVerification);

router.post("/profile", ProfileController.Showprofile);
router.post("/edit_profile", ProfileController.EditProfile);

router.post("/getcustomerbookings", CustomerController.GetCustomerBooking);

router.post('/get_driver_location', LocationController.UpdateDriverLocation);
router.post("/getdriverbookings", CustomerController.GetDriverBookings);



export default router;
