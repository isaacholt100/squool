import { useEffect, useRef } from "react";

export default function useLongPress(time = 500) {
    const timeout = useRef<NodeJS.Timeout>(null);
    const shouldShortPress = useRef(true);
    const moved = useRef(false);
    function startTimeout(onLongPress: () => void) {
        timeout.current = setTimeout(() => {
            shouldShortPress.current = false;
            !moved.current && onLongPress();
            !moved.current && alert("long press");
        }, time);
    }
    function cancelTimeout() {
        clearTimeout(timeout.current);
    }
    function onTouchStart(onLongPress: () => void) {
        shouldShortPress.current = true;
        moved.current = false;
        startTimeout(onLongPress);
    }
    function onTouchMove() {
        moved.current = true;
    }
    useEffect(() => {
        return cancelTimeout;
    }, []);
    return (onLongPress: (e?) => void) => {
        return {
            onContextMenu: e => e.preventDefault(),
            onTouchStart: () => onTouchStart(onLongPress),
            onTouchEnd: cancelTimeout,
            onTouchMove,
            onTouchCancel: cancelTimeout,
        };
    };
}