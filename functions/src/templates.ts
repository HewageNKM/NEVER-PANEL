const getOrderSuccess = (
  orderId: string,
  totalAmount: number,
  shippingAddress: string,
  paymentMethod: string
) => {
  return `
  Dear Customer,
  
  Order ID: ${orderId}
  Amount: LKR ${totalAmount}
  Address: ${shippingAddress}
  Payment Method: ${paymentMethod}
  
  Your order has been 
  successfully placed! 
  
  We will notify you once 
  your order has been shipped.
  
  Thank you for shopping
  with us!
  
 
  NEVERBE Team
  `;
};

const getOrderFailed = (
  orderId: string,
  totalAmount: number,
  paymentMethod: string
) => {
  return `
  Dear Customer,
  
  Order ID: ${orderId}
  Amount: LKR ${totalAmount}
  Payment Method: ${paymentMethod}
  
  Your order has been
  failed to place! 
  Please try again.
  
  Thank you for shopping 
  with us!
  
  NEVERBE Team
  `;
};

const orderStatusUpdate = (
  name: string,
  orderId: string,
  status: string,
  trackingNumber: string,
  trackingUrl: string
) => {
  return `
    Dear ${name},
  
    Your order (ID: ${orderId}) is now ${status}.
    Tracking No: ${trackingNumber}.
    Track your order at ${trackingUrl}
    
    Thank you for shopping
    with us!
    
    NEVERBE Team
  `;
};


const adminNotify = (
  orderId: string,
  paymentMethod: string,
  total: number) => {
  return `
  New Order Received!
  
  Order ID: ${orderId}
  Payment Method: ${paymentMethod}
  Total Amount: LKR ${total}
  
  NEVERBE Team
  `;
};

const getOrderRefunded = (orderId:string, total:number, paymentMethod:string)=>{
    return `
    Dear Customer,
    
    Order ID: ${orderId}
    Amount: LKR ${total}
    Payment Method: ${paymentMethod}
    
    Your order has been refunded.
    
    if you paid by card, 
    it will take 5-7 working days 
    to reflect in your account.
    
    Thank you for shopping 
    with us!
    
    NEVERBE Team
    `;
}

export {getOrderSuccess, getOrderFailed, adminNotify, orderStatusUpdate,getOrderRefunded};
