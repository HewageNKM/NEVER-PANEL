const getOrderStatusSMS = (
    name: string,
    orderId: string,
    totalAmount: number,
    paymentMethod: string,
    paymentStatus: string,
    date:string
) => {
    let message = '';

    switch (paymentStatus) {
        case "pending":
            if (paymentMethod === "cod") {
                message = `Dear ${name},\n\n Your COD order (ID: ${orderId}) is confirmed.\nAmount: LKR ${totalAmount}\n\n${date}\n\nNEVERBE Team`;
            }
            break;

        case "failed":
            if (paymentMethod === "cod") {
                message = `Dear ${name},\n\n Your COD order (ID: ${orderId}) has failed.\nAmount: LKR ${totalAmount}\nPlease try again.\n\n${date}\n\nNEVERBE Team`;
            }
            break;

        case "paid":
            if (paymentMethod === "ipg") {
                message =`Dear ${name},\n\nyour order (ID: ${orderId}) is confirmed.\nAmount: LKR ${totalAmount}\nWe appreciate your business!\n\n${date}\n\nNEVERBE Team`;
            } else if (paymentMethod === "cod") {
                message = `Dear ${name},\n\n Order ID ${orderId}, We received your payment.\nThank You!\nWe appreciate your business!\n\n${date}\n\nNEVERBE Team`;
            }
            break;

        default:
            message = `Dear ${name},\n\n Your order (ID: ${orderId}) status is currently ${paymentStatus}.\n\n${date}\n\nNEVERBE Team`;
            break;
    }

    return message;
};


const adminNotifySMS = (
    orderId: string,
    paymentMethod: string,
    total: number,
    date:string
) => {
    return `New order (ID: ${orderId}) has been placed.\nPayment Method: ${paymentMethod}\nTotal: LKR ${total}\n\n${date}\n\nNEVERBE Team`;
};


const orderTrackingUpdateSMS = (
    name: string,
    orderId: string,
    status: string,
    trackingNumber?: string,
    trackingUrl?: string,
) => {
    let message = '';
    switch (status) {
        case "shipped":
            message =`Dear ${name},\n\n Your order (ID: ${orderId}) has been shipped.\nTracking Number: ${trackingNumber}\nTracking URL: ${trackingUrl}\n\nNEVERBE Team`;
            break;

        case "delivered":
            message = `Dear ${name},\n\n Your order (ID: ${orderId}) has been delivered.\n\nNEVERBE Team`;
            break;

        case "cancelled":
            message = `Dear ${name},\n\n Your order (ID: ${orderId}) has been cancelled.\n\nNEVERBE Team`;
            break;
        default:
            message =`Dear ${name},\n\n Your order (ID: ${orderId}) status has been updated to ${status}.\n\nNEVERBE Team`;
            break;
    }

    return message;
};

export {adminNotifySMS, orderTrackingUpdateSMS,getOrderStatusSMS};
