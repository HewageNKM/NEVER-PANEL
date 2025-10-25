import { paymentMethods, paymentStatus } from "@/constant";
import { adminFirestore } from "@/firebase/firebaseAdmin";
import { Order } from "@/model";

export const getOrders = async (pageNumber: number = 1, size: number = 20) => {
    try {
        const offset = (pageNumber - 1) * size;
        // Fetch orders with pagination and sorting by createdAt
        const ordersSnapshot = await adminFirestore.collection('orders')
            .limit(size)
            .offset(offset)
            .orderBy('createdAt', 'desc')
            .get();

        const orders: Order[] = [];
        ordersSnapshot.forEach(doc => {
            let order: Order = doc.data() as Order;
            order = {
                ...order,
                customer: order.customer ? {
                    ...order.customer,
                    createdAt: order.customer.createdAt.toDate().toLocaleString(),
                    updatedAt: order.customer.updatedAt.toDate().toLocaleString(),
                } : null,
                createdAt: order?.createdAt?.toDate().toLocaleString(),
                updatedAt: order?.updatedAt?.toDate().toLocaleString(),
                tracking: undefined
            }
            orders.push(order);
        });

        console.log(`Fetched ${orders.length} orders on page ${pageNumber}`);
        return orders;

    } catch (error: any) {
        console.error(error);
        throw error
    }
};


export const getOrder = async (orderId: string): Promise<Order | null> => {
  try {
    const snapshot = await adminFirestore
      .collection("orders")
      .where("orderId", "==", orderId)
      .limit(1)
      .get();

    // Check if no document found
    if (snapshot.empty) {
      console.warn(`Order with ID ${orderId} not found`);
      return null;
    }

    // Extract the first document
    const doc = snapshot.docs[0];
    const data = doc.data();

    // Convert timestamps to readable strings
    return {
      ...data,
      customer: data.customer
        ? {
            ...data.customer,
            createdAt: data.customer.createdAt?.toDate().toLocaleString() ?? "",
            updatedAt: data.customer.updatedAt?.toDate().toLocaleString() ?? "",
          }
        : null,
      createdAt: data.createdAt?.toDate().toLocaleString() ?? "",
      updatedAt: data.updatedAt?.toDate().toLocaleString() ?? "",
    } as Order;
  } catch (error) {
    console.error("Error fetching order:", error);
    throw error;
  }
};
export const updateOrder = async (order: Order) => {
    try {
        await adminFirestore.collection('orders').doc(order.orderId).set({
            paymentStatus: order.paymentStatus,
            paymentMethod: order.paymentMethod,
            paymentMethodId: order.paymentMethodId,
            status: order.status,
            updatedAt: new Date()
        }, {merge: true});

        console.log(`Order with ID ${order.orderId} updated successfully`);
    } catch (error: any) {
        console.error(error);
        throw error
    }
};