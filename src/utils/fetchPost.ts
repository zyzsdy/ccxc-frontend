import { hmacSha1 } from './crypt'
import { Message } from 'element-ui';

export async function fetchPost(url: string, data: object){
    let dataBody = JSON.stringify(data);
    try {
        let r = await fetch(url, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: dataBody
        });
        return r;
    }
    catch (error) {
        Message.error("服务器通信异常");
        throw error;
    }
}

export async function fetchPostWithSign(url: string, data: object) {
    let token = localStorage.getItem("token") || "";
    let ts = Date.now();
    let dataBody = JSON.stringify(data);

    let unsignedString = `token=${token}&ts=${ts}&bodyString=${dataBody}`;
    let sk = localStorage.getItem("sk") || "";
    let sign = hmacSha1(unsignedString, sk);

    try {
        let r = await fetch(url, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "User-Token" : token,
                "X-Auth-Token": `Ccxc-Auth ${ts} ${sign}`
            },
            body: dataBody
        });
        return r;
    } catch (error) {
        Message.error("服务器通信异常");
        throw error;
    }

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