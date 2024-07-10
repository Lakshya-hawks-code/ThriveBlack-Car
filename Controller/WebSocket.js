import { Init } from "../Model/OrdersModel.js"

// Function to handle incoming messages
export const handleMessage = (data) => {
    console.log('Message received:', data);
};

// Function to handle disconnection
export const handleDisconnect = (socket) => {
    console.log('A user disconnected');
};

export const WatchOrdersCollection = (socket) => {
    Init().watch().on("change", (change) => {
        if (change.operationType === "update" && change.updateDescription.updatedFields.currentloc) {

            Init().findOne({ _id: change.documentKey._id.toString() }).then(order => {
                if (order) {
                    const { currentloc, to_location, form_location, book_status } = order;
                    if (book_status === 3) {
                        socket.emit('orderUpdate', { currentloc, to_location: form_location });
                    } else if (book_status === 4) {
                        socket.emit('orderUpdate', { currentloc, to_location });
                    } else {
                        socket.disconnect();
                    }
                }
            }).catch(err => {
                console.error('Error fetching order:', err);
            });
        }
    });
};

