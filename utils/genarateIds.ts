export const generateId = (type:string,name:string) => {
    switch (type) {
        case 'item':
            return `${name.trim()}-${window.crypto.randomUUID().replace("-","").substring(0, 5)}`.toUpperCase();
         case 'variant':
             return `VA-${window.crypto.randomUUID().replace("-","").substring(0, 5)}`
        default:
            return ""
    }
}
