import {promisify} from "util";
import {createCipheriv, createDecipheriv} from "crypto";

const scrypt = promisify(require('crypto').scrypt);
const randomBytes = promisify(require('crypto').randomBytes);


export async function encryptText(text: string, password: string, salt: string) {
    const algorithm = 'aes-192-cbc';
    const key = await scrypt(password, salt, 24);
    const iv = await randomBytes(16);
    const cipher = createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return {
        encrypted,
        iv: iv.toString('hex') as string,
    };
}

export async function decryptText(text: string, password: string, salt: string, ivHex: string) {
    const algorithm = 'aes-192-cbc';
    const key = await scrypt(password, salt, 24);
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(text, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}