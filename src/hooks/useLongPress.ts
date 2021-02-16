import { useEffect, useRef } from "react";

export default function useLongPress(time = 500) {
    const timeout = useRef<NodeJS.Timeout>(null);
    const shouldShortPress = useRef(true);
    const moved = useRef(false);
    function startTimeout(onLongPress: (e?: React.TouchEvent) => void, e: React.TouchEvent) {
        timeout.current = setTimeout(() => {
            shouldShortPress.current = false;
            !moved.current && onLongPress(e);
        }, time);
    }
    function cancelTimeout() {
        clearTimeout(timeout.current);
    }
    function onTouchStart(onLongPress: (e?: React.TouchEvent) => void, e: React.TouchEvent) {
        shouldShortPress.current = true;
        moved.current = false;
        startTimeout(onLongPress, e);
    }
    function onTouchMove() {
        moved.current = true;
    }
    useEffect(() => {
        return cancelTimeout;
    }, []);
    return (onLongPress: (e?: React.TouchEvent) => void) => {
        return {
            onContextMenu: e => e.preventDefault(),
            onTouchEnd: cancelTimeout,
            onTouchMove,
            onTouchCancel: cancelTimeout,
            onTouchStart: (e: React.TouchEvent) => onTouchStart(onLongPress, e),
        };
    };
}