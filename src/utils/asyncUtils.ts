export function sleep(time: number){
    return new Promise((res) => setTimeout(res, time));
}

export function setIcon(){
    (function() {
        let link: HTMLLinkElement = document.querySelector("link[rel*='icon']") || document.createElement('link');
        link.type = 'image/x-icon';
        link.rel = 'shortcut icon';
        link.href = '/real_icon.ico';
        document.getElementsByTagName('head')[0].appendChild(link);
    })();
}