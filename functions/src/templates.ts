const getOrderStatusSMS = (
    name: string,
    orderId: string,
    paymentMethod: string,
    paymentStatus: string,
) => {
    let message = '';

    switch (paymentStatus) {
        case "Pending":
            if (paymentMethod === "COD") {
                message = `Hi, ${name}.Thank you for shopping at NEVERBE.your order #${orderId.toUpperCase()}) is confirmed. We will process your order soon as possible.`;
            }
            break;
        case "Paid":
            if (paymentMethod === "PAYHERE") {
                message = `Hi, ${name}.Thank you for shopping at NEVERBE.your order #${orderId.toUpperCase()}) is confirmed. We will process your order soon as possible.`;
            }
            break;
        default:
            message = `Dear ${name},\n\n Your order  #${orderId} status is currently ${paymentStatus}.`;
            break;
    }

    return message;
};


const adminNotifySMS = (
    orderId: string,
) => {
    return `New order  #${orderId.toUpperCase()} has been placed.\nVisit https://admin.neverbe.lk/dashboard/orders to process order `;
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
            message = `Dear ${name},\n\n Your order #${orderId} has been shipped.\nTracking Number: ${trackingNumber}\nTracking URL: ${trackingUrl}`;
            break;
        case "Cancelled":
            message = `Dear ${name},\n\n Your order #${orderId} has been cancelled.`;
            break;
        default:
            message = `Dear ${name},\n\n Your order #${orderId} status has been updated to ${status}.`;
            break;
    }

    return message;
};

export {adminNotifySMS, orderTrackingUpdateSMS, getOrderStatusSMS};
