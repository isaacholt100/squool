import { useRef, useEffect } from "react"

export default function usePrevious<T>(val: T) {
    const ref = useRef(val);
    useEffect(() => {
        ref.current = val;
    });
    return ref.current;
}