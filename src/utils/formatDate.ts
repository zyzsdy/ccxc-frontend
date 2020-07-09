export function formatTimestamp(timestamp: number){
    let date = new Date(timestamp);

    let Y = date.getFullYear().toString();

    let M = getTwoDigits(date.getMonth() + 1);

    let D = getTwoDigits(date.getDate());

    let h = getTwoDigits(date.getHours());

    let m = getTwoDigits(date.getMinutes());

    let s = getTwoDigits(date.getSeconds());

    return `${Y}-${M}-${D} ${h}:${m}:${s}`;
}

function getTwoDigits(d: number){
    if(d < 10) return '0' + d;
    else return d.toString();
}

export function formatCountdown(endTimestamp: number){
    let now = new Date().getTime();
    let t = endTimestamp - now;

    if(t < 0) return "请刷新页面";

    let s = getTwoDigits(Math.floor((t / 1000) % 60));
    let m = getTwoDigits(Math.floor((t / 60000) % 60));
    let h = getTwoDigits(Math.floor((t / 3600000) % 24));
    let d = Math.floor(t / 86400000);

    if(d <= 0) return `${h}:${m}:${s}`;

    return `${d}d ${h}:${m}:${s}`;
}