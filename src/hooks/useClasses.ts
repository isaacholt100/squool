import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import IClass from "../types/IClass";

export default function useClasses(): IClass[] {
    const classes = useSelector((s: RootState) => s.classes);
    return classes;
}