import { getOrdersById, UpdateOrdesDetails } from "../../Model/OrdersModel.js"

const UpdateDriverLocation = async (req, res) => {
    try {
        let request = req.body;

        let DriverOrder = await getOrdersById({ order_id: request?.order_id })
        if (DriverOrder) {
            let updatefields = {
                currentloc: request?.currentloc
            }
            await UpdateOrdesDetails({ order_id: request?.order_id }, updatefields);
            res.json({ status: 200, message: "Driver location updated successfully" });
        }
        else {
            res.json({ status: 400, message: "Failed to update" });
        }

    } catch (error) {
        console.log(`Failed to login: ${error.message}`);
        res.json({ status: 500, message: "Failed to login" });
    }
};






export default {
    UpdateDriverLocation,
}