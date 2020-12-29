import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import IBook from "../types/IBook";

export default function useBooks(): IBook[] {
    const books = useSelector((s: RootState) => s.books);
    return books;
}