import { useSelector } from "react-redux";
import useSWR from "swr";
import { RootState } from "../redux/store";
import IClass from "../types/IClass";

export default function useClasses(): [IClass[], boolean] {
    const { data } = useSWR("/api/classes", {
        onError() {},
    });
    //const classes = useSelector((s: RootState) => s.classes);
    return [data || [], data === undefined];
}