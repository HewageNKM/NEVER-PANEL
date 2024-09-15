export const generateId = (type:string,name:string) => {
    switch (type) {
        case 'item':
            return `ITEM-${name.trim()}-${window.crypto.randomUUID().replace("-","").substring(0, 10)}`.toUpperCase();
        default:
            return ""
    }
}
