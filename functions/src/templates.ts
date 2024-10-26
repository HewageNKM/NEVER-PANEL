const getOrderStatusSMS = (
    name: string,
    orderId: string,
    totalAmount: number,
    paymentMethod: string,
    paymentStatus: string
) => {
    let message = '';

    switch (paymentStatus) {
        case "Pending":
            if (paymentMethod === "COD") {
                message = `Dear ${name},\n\n Your COD order (ID: ${orderId}) is confirmed.\nAmount: LKR ${totalAmount}\n\nNEVERBE Team`;
            }
            break;

        case "Failed":
            if (paymentMethod === "COD") {
                message = `Dear ${name},\n\n Your COD order (ID: ${orderId}) has failed.\nAmount: LKR ${totalAmount}\nPlease try again.\n\nNEVERBE Team`;
            }
            break;

        case "Paid":
            if (paymentMethod === "PayHere") {
                message =`Dear ${name},\n\nyour order (ID: ${orderId}) is confirmed.\nAmount: LKR ${totalAmount}\nWe appreciate your business!\n\nNEVERBE Team`;
            } else if (paymentMethod === "COD") {
                message = `Dear ${name},\n\n Order ID ${orderId}, We received your payment.\nThank You!\nWe appreciate your business!\n\nNEVERBE Team`;
            }
            break;

        case "Refunded":
            message = `Dear ${name},\n\n Your order (ID: ${orderId}) has been refunded.\nAmount: LKR ${totalAmount}\nWe apologize for any inconvenience.\n\nNEVERBE Team`;
            break;

        default:
            message = `Dear ${name},\n\n Your order (ID: ${orderId}) status is currently ${paymentStatus}.\n\nNEVERBE Team`;
            break;
    }

    return message;
};


const adminNotifySMS = (
    orderId: string,
    paymentMethod: string,
    total: number
) => {
    return `New order (ID: ${orderId}) has been placed.\nPayment Method: ${paymentMethod}\nTotal: LKR ${total}\n\nNEVERBE Team`;
};


const orderTrackingUpdateSMS = (
    name: string,
    orderId: string,
    status: string,
    trackingNumber?: string,
    trackingUrl?: string
) => {
    let message = '';
    switch (status) {
        case "Shipped":
            message =`Dear ${name},\n\n Your order (ID: ${orderId}) has been shipped.\nTracking Number: ${trackingNumber}\nTracking URL: ${trackingUrl}\n\nNEVERBE Team`;
            break;

        case "Delivered":
            message = `Dear ${name},\n\n Your order (ID: ${orderId}) has been delivered.\n\nNEVERBE Team`;
            break;

        case "Cancelled":
            message = `Dear ${name},\n\n Your order (ID: ${orderId}) has been cancelled.\n\nNEVERBE Team`;
            break;
        default:
            message =`Dear ${name},\n\n Your order (ID: ${orderId}) status has been updated to ${status}.\n\nNEVERBE Team`;
            break;
    }

    return message;
};

export {adminNotifySMS, orderTrackingUpdateSMS,getOrderStatusSMS};
