export const brands = [
    { id: 1, name: "Adidas", value: "adidas" },
    { id: 2, name: "Nike", value: "nike" },
    { id: 3, name: "Puma", value: "puma" },
    { id: 4, name: "New Balance", value: "new balance" },
    { id: 5, name: "Crocs", value: "crocs" },
    { id: 6, name: "Louis Vuitton", value: "louis vuitton" },
    { id: 7, name: "Gucci", value: "gucci" },
    { id: 8, name: "Tommy Hilfiger", value: "tommy hilfiger" },
    { id: 9, name: "Ralph Lauren", value: "ralph lauren" },
    { id: 10, name: "Prada", value: "prada" },
    { id: 11, name: "Hermès", value: "hermes" },
    { id: 12, name: "Chanel", value: "chanel" },
    { id: 13, name: "Balenciaga", value: "balenciaga" },
    { id: 14, name: "Versace", value: "versace" },
    { id: 15, name: "Armani", value: "armani" },
    { id: 16, name: "Michael Kors", value: "michael kors" },
    { id: 17, name: "Burberry", value: "burberry" },
    { id: 18, name: "Hugo Boss", value: "hugo boss" },
    { id: 19, name: "Dior", value: "dior" },
    { id: 20, name: "Coach", value: "coach" },
    { id: 21, name: "Fendi", value: "fendi" },
    { id: 22, name: "Salvatore Ferragamo", value: "salvatore ferragamo" },
    { id: 23, name: "Reebok", value: "reebok" },
    { id: 24, name: "Under Armour", value: "under armour" },
    { id: 25, name: "Fila", value: "fila" },
    { id: 26, name: "Clarks", value: "clarks" },
    { id: 27, name: "Dr. Martens", value: "dr martens" },
    { id: 28, name: "Skechers", value: "skechers" },
    { id: 29, name: "Ugg", value: "ugg" },
    { id: 30, name: "Aldo", value: "aldo" },
    { id: 31, name: "Vans", value: "vans" },
    { id: 32, name: "Toms", value: "toms" },
    { id: 33, name: "MLB", value: "mlb" },
    { id: 33, name: "LK", value: "lanka" },
    { id: 34, name: "China", value: "china" },
    { id: 35, name: "Other", value: "other" }
];
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
        name: "Paid",
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