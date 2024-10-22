const getOrderStatusSMS = (
    name: string,
    orderId: string,
    totalAmount: number,
    paymentMethod: string,
    paymentStatus: string
) => {
    let message = `Dear ${name},\n\n`;

    switch (paymentStatus) {
        case "Pending":
            if (paymentMethod === "COD") {
                message += `
        Your order (ID: ${orderId}) has been confirmed for COD.
        Amount: LKR ${totalAmount}
        
        Thank you for choosing NEVERBE! We will notify you once your order is shipped.\n\n`;
            }
            break;

        case "Failed":
            if (paymentMethod === "COD") {
                message += `
        Your COD order (ID: ${orderId}) has failed.
        Amount: LKR ${totalAmount}
        Please try placing your order again.\n\n`;
            } else if (paymentMethod === "PayHere") {
                message += `
        Your order (ID: ${orderId}) has failed to process via PayHere.
        Amount: LKR ${totalAmount}
        Please try again or contact support if the issue persists.\n\n`;
            }
            break;

        case "Paid":
            if (paymentMethod === "PayHere") {
                message += `
        Your order (ID: ${orderId}) has been successfully placed!
        Amount: LKR ${totalAmount}
        
        Thank you for shopping with us! We will notify you once your order is shipped.\n\n`;
            } else if (paymentMethod === "COD") {
                message += `
        Thank you for your payment for order (ID: ${orderId}).
        
        We appreciate your business!\n\n`;
            }
            break;

        case "Refunded":
            message += `
      Your order (ID: ${orderId}) has been refunded.
      Amount: LKR ${totalAmount}
      Payment Method: ${paymentMethod}
      
      If you paid by card, please allow 5-7 working days for the refund to reflect in your account.\n\n`;
            break;

        default:
            message += `Your order (ID: ${orderId}) status is currently ${paymentStatus}.\n\n`;
            break;
    }

    message += `Thank you for choosing NEVERBE!\n\nNEVERBE Team`;

    return message;
};


const adminNotifySMS = (
    orderId: string,
    paymentMethod: string,
    total: number
) => {
    return `
    *** New Order Received! ***

    - **Order ID:** ${orderId}
    - **Payment Method:** ${paymentMethod}
    - **Total Amount:** LKR ${total}

    Please review and process this order at your earliest convenience.

    Best regards,
    NEVERBE Team
    `;
};


const orderStatusUpdateSMS = (
    name: string,
    orderId: string,
    status: string,
    trackingNumber?: string,
    trackingUrl?: string
) => {
    let message = `Dear ${name},\n\n`;

    switch (status) {
        case "Shipped":
            message += `
            Your order (ID: ${orderId}) has been shipped!
            Tracking No: ${trackingNumber}.
            Track your order at ${trackingUrl}\n\n`;
            break;

        case "Delivered":
            message += `
            Your order (ID: ${orderId}) has been delivered!
            
            Thank you for shopping with us!\n\n`;
            break;

        case "Returned":
            message += `
            We have received your returned order (ID: ${orderId}).
            
            Thank you for shopping with us!\n\n`;
            break;

        case "Cancelled":
            message += `
            We're sorry to inform you that your order (ID: ${orderId}) has been cancelled.
            
            If you have any questions, please contact our support team.\n\n`;
            break;
        default:
            message += `Your order (ID: ${orderId}) status is currently ${status}.\n\n`;
            break;
    }

    message += `Thank you for choosing NEVERBE!\n\nNEVERBE Team`;

    return message;
};

export {adminNotifySMS, orderStatusUpdateSMS,getOrderStatusSMS};
