export const generateId = (type:string,name:string) => {
    switch (type) {
        case 'item':
            return `${name.trim()}-${window.crypto.randomUUID().replace("-","").substring(0, 10)}`.toUpperCase();
         case 'variant':
             return `VA-${window.crypto.randomUUID().replace("-","").substring(0, 10)}`
        default:
            return ""
    }
}
