import { useState } from "react";
import ContextMenu from "../components/ContextMenu";
import { ContextMenuItem } from "../types/contextMenu";

function getPosition(e: React.MouseEvent): [number, number] {
    if (e.pageX || e.pageY) {
        return [
            e.pageX,
            e.pageY
        ];
    } else if (e.clientX || e.clientY) {
        return [
            e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft,
            e.clientY + document.body.scrollTop + document.documentElement.scrollTop
        ];
    }
    return [0, 0];
}

export default function useContextMenu(): [JSX.Element, (items: ContextMenuItem[], isLongPress?: boolean) => (e: React.MouseEvent | React.TouchEvent) => void] {
    const [state, setState] = useState({
        mouse: null as [number, number],
        items: [],
        isMobile: false,
    });
    function openMenu(items: ContextMenuItem[], isLongPress = false) {
        return (e: React.MouseEvent | React.TouchEvent) => {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            setState({
                items,
                mouse: isLongPress ? [null, null] : getPosition(e as React.MouseEvent),
                isMobile: isLongPress,
            });
        }
    }
    function close() {
        setState({
            items: state.items,
            mouse: null,
            isMobile: state.isMobile,
        });
    }
    const Menu = <ContextMenu isMobile={state.isMobile} items={state.items} mouse={state.mouse} close={close} />;
    return [Menu, openMenu];
}