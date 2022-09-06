import Decimal from "decimal.js";

function isPrime(x: string): boolean | string {
    if (Number.isNaN(+x)) {
        return "Not a number";
    }
    if (x.startsWith("-")) {
        return "Number is not positive";
    }
    if (x.includes(".")) {
        return "Number is not whole";
    }
    if (x === "1" || x === "0") {
        return false;
    }
    if (x === "2" || x === "3") {
        return true;
    }
    const num = new Decimal(x);
    if (+num.mod(2) === 0 || +num.mod(3) === 0) {
        return false;
    }
    for (let i = new Decimal(5); i.mul(i) <= num; i = i.add(6)) {
        if (+num.mod(i) === 0 || +num.mod(i.add(2)) === 0) {
            return false;
        }
    }
    return true;
}

self.addEventListener("message", e => {
    self.postMessage(isPrime(e.data));
});