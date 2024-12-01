export const brands = [
    {
        id: 1,
        name: "Adidas",
        value: "adidas"
    },
    {
        id: 2,
        name: "Nike",
        value: "nike"
    },
    {
        id: 4,
        name: "New Balance",
        value: "new balance"
    },
    {
        id: 5,
        name: "Cross",
        value: "cross"
    },
    {
        id: 6,
        name: "Luvion Vuitton",
        value: "luvion vuitton"
    },
    {
        id: 7,
        name: "China",
        value: "china"
    },
    {
        id: 8,
        name: "Polo",
        value: "polo"
    },
    {
        id:8,
        name:"LK",
        value:"lk"
    }

]
export const shoeSizesList = [
    "36",
    "37",
    "38",
    "39",
    "40",
    "41",
    "42",
    "43",
    "44",
    "45",
    "46",
]
export const types = [
    {
        id: 1,
        name:"Shoes",
        value: "shoes"
    },
    {
        id: 3,
        name:"Sandals",
        value: "sandals"
    },
    {
        id: 2,
        name:"Accessories",
        value: "accessories"
    },
]
export const accessoriesSizesList = [
    {
        id: 1,
        name: "200ml",
        value: "200ml"
    },
    {
        id: 5,
        name: "S",
        value: "s",
    },
    {
        id: 6,
        name: "M",
        value: "m"
    },
    {
        id: 7,
        name: "X",
        value: "x",
    },
    {
        id: 8,
        name: "XL",
        value: "xl",
    },
    {
        id: 9,
        name: "Free Size",
        value: "free size",
    }
]
export enum orderStatus {
    DELIVERED = "Delivered",
    PROCESSING = "Processing",
    CANCELLED = "Cancelled",
    SHIPPED = "Shipped",
}

export enum paymentStatus {
    PAID = "Paid",
    PENDING = "Pending",
    REFUNDED = "Refunded",
    FAILED = "Failed",
}

export enum paymentMethods {
    CASH = "Cash",
    CARD = "Card",
    PAYHERE = "PayHere",
    COD = "COD",
}
export const orderStatusList = [
    {
        id: 1,
        name: "Delivered",
        value: orderStatus.DELIVERED
    },
    {
        id: 2,
        name: "Processing",
        value:orderStatus.PROCESSING
    },
    {
        id: 3,
        name: "Cancelled",
        value:orderStatus.CANCELLED
    },
    {
        id: 4,
        name: "Shipped",
        value: orderStatus.SHIPPED
    }
]

export const paymentStatusList = [
    {
        id: 1,
        name: "Success",
        value: paymentStatus.PAID
    },
    {
        id: 2,
        name: "Pending",
        value: paymentStatus.PENDING
    },
    {
        id: 3,
        name: "Refunded",
        value: paymentStatus.REFUNDED
    }
]
export const sortInventoryOptions = [
    {
        id: 1,
        name: "A-Z",
        value: "ab"
    },
    {
        id: 2,
        name: "Z-A",
        value: "za"
    },
    {
        id: 3,
        name: "Price: Low-High",
        value: "lh"
    },
    {
        id: 4,
        name: "Price: High-Low",
        value: "hl"
    },
    {
        id: 5,
        name: "None",
        value: "none"
    },
]

export const filterInventoryOptions = [
    {
        id: 1,
        name: "All",
        value: "all"
    },
    {
        id: 2,
        name: "Low Stock",
        value: "low"
    },
    {
        id: 3,
        name: "Out of Stock",
        value: "out"
    },
]