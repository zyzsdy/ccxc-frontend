import { hmacSha1 } from './crypt'

export function fetchPost(url: string, data: object){
    let dataBody = JSON.stringify(data);
    return fetch(url, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: dataBody
    });
}

export function fetchPostWithSign(url: string, data: any) {
    data['ts'] = Date.now();
    let unsignedString = Object.keys(data).sort().reduce((unsigned, i) => unsigned += i + data[i], "");
    let sk = localStorage.getItem("sk") || "";
    let sign = hmacSha1(unsignedString, sk);
    data['sign'] = sign;

    let dataBody = JSON.stringify(data);
    return fetch(url, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: dataBody
    });
}