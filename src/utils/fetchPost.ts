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

export function defaultApiErrorAction(context: Vue, data: any) {
    if(data['status'] == 2){
        context.$gConst.globalBus.$emit("show-error", data['message']);
    }
    else if(data['status'] == 3){
        context.$gConst.globalBus.$emit("redirect-location", {
            message: data['message'],
            location: data['location']
        });
    }
    else if(data['status'] == 4){
        context.$gConst.globalBus.$emit("log-out", {
            type: "error",
            message: data['message']
        });
    }
}