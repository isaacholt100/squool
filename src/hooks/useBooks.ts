import { useSelector } from "react-redux";
import useSWR from "swr";
import { RootState } from "../redux/store";
import IBook from "../types/IBook";

export default function useBooks(): [IBook[], boolean] {
    const { data } = useSWR("/api/books", {
        onError() {}
    });
    //const books = useSelector((s: RootState) => s.books);
    return [data || [], data === undefined];
}