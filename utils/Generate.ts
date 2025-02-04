import crypto from 'crypto';

export const generateId = (type: string, name: string) => {
    switch (type) {
        case 'item':
            return `${name.trim().substring(0, 3)}-${window.crypto.randomUUID().replace("-", "").substring(0, 5)}`.toLowerCase();
        case 'variant':
            return `VA-${window.crypto.randomUUID().replace("-", "").substring(0, 5)}`.toLowerCase();
        default:
            return ""
    }
}

export const generateRandomPassword = (length = 12) => {
    return crypto.randomBytes(length).toString("base64").slice(0, length);
}

