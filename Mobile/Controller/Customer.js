import { getAllOrdersDetails } from "../../Model/OrdersModel.js";
import { getUserById } from "../../Model/AdminModel.js";
import moment from "moment";


const GetCustomerBooking = async (req, res) => {
    try {
        let request = req.body;
        let customer = await getUserById({ email: request?.email })
        if (customer?.user_type !== 1) {    //user_type 1 for admin,subadmin,manager
            let CustomerBookings = await getAllOrdersDetails({ email: request?.email })
            if (CustomerBookings) {
                res.json({ status: 200, data: CustomerBookings })
            }
            else {
                res.json({ status: 200, data: [] })
            }
        }
        else {
            res.json({ status: 400, message: "Invalid User Type" })
        }
    } catch (error) {
        console.log(`Failed to get customer bookings: ${error.message}`);
        return res.json({ status: 500, message: "Failed to get customer bookings" });
    }
};

const GetDriverBookings = async (req, res) => {
    try {
        let request = req.body;
        let currentDate = moment().format("YY-MM-DD");
        let filter = { driver_id: request?.id };

        if (request?.booking_type === "Upcoming") {
            filter.pikup_date = { $gte: currentDate };
        } else if (request?.booking_type === "Done") {
            filter.pikup_date = { $lt: currentDate };
        }

        let DriverBookings = await getAllOrdersDetails(filter);
        if (DriverBookings) {
            res.json({ status: 200, data: DriverBookings });
        } else {
            res.json({ status: 400, data: [] });
        }
    } catch (error) {
        console.log(`Failed to get driver bookings: ${error.message}`);
        return res.json({ status: 500, message: "Failed to get driver bookings" });
    }
};


export default {
    GetCustomerBooking,
    GetDriverBookings
}