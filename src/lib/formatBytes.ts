export default function formatBytes(a: number,b=0) {
    if (a === 0) {
        return "0 B";
    }
    const c = b < 0 ? 0: b, d = Math.floor(Math.log2(a));
    return parseFloat((a / Math.pow(1024,d)).toFixed(c)) + " " + ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"][d];
}