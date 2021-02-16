import { useEffect, useRef } from "react";

export default function useLongPress(time = 500) {
    const timeout = useRef<NodeJS.Timeout>(null);
    const shouldShortPress = useRef(true);
    const moved = useRef(false);
    function startTimeout(onLongPress: () => void) {
        alert("timer starting");
        timeout.current = setTimeout(() => {
            shouldShortPress.current = false;
            !moved.current && onLongPress();
            !moved.current && alert("long press");
            alert("timer done");
        }, time);
    }
    function cancelTimeout() {
        clearTimeout(timeout.current);
        alert("timeout cancelled");
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
        alert("longpress listener");
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