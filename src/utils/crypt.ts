import crypto from 'crypto'

export function hmacSha1(content: string, key: string) {
    return crypto.createHmac('sha1', key)
        .update(content)
        .digest()
        .toString('base64');
}

export function passHash(pass: string) {
    return hmacSha1(pass, "ccxcccxc-ccxcccxc");
}