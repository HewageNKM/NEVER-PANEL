export interface Profile {
    email: string,
    role: string,
    username: string
    imageUrl: string
}

export interface Item {
    itemId: string,
    type: string,
    brand: string,
    manufacturer: string,
    name: string,
    buyingPrice: number,
    sellingPrice: number,
    discount: number,
}
export interface Size{
    size: string,
    stock: number,
}
export interface Variant {
    variantId: string,
    colorCode: string,
    images: string[],
    sizes: Size[],
}
