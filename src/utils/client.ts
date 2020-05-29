import 'clientjs'

export function GetUserId(){
    return new Promise<number>(res => {
        let clientjs = new globalThis.ClientJS();
        let userid = clientjs.getFingerprint();
        res(userid);
    });
}