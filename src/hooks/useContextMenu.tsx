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

export default function useContextMenu(): [JSX.Element, (items: ContextMenuItem[]) => (e: React.MouseEvent) => void] {
    const [state, setState] = useState({
        mouse: [null, null] as [number, number],
        items: [],
    });
    function openMenu(items: ContextMenuItem[]) {
        return (e: React.MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            setState({
                items,
                mouse: getPosition(e),
            });
        }
    }
    function close() {
        setState({
            items: state.items,
            mouse: [null, null],
        });
    }
    const Menu = <ContextMenu items={state.items} mouse={state.mouse} close={close} />;
    return [Menu, openMenu];
}