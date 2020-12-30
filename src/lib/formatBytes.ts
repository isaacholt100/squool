export default function formatBytes(x: number, dp = 0) {
    if (x === 0) {
        return "0 B";
    }
    const d = Math.floor(Math.log2(x) / 10);
    return parseFloat((x / Math.pow(1024, d)).toFixed(dp)) + " " + ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"][d];
}