import { MutableRefObject, useRef, useState } from "react";

export default function useRefState<T>(initial: T): [MutableRefObject<T>, (value: T) => void] {
    const [, forceUpdate] = useState(false);
    const ref = useRef(initial);
    function setState(value: T) {
        if (value !== ref.current) {
            ref.current = value;
            forceUpdate(s => !s);
        }
    }
    return [ref, setState];
}