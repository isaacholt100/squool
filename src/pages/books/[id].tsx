import dynamic from "next/dynamic";

const BookEditor = dynamic(() => import("../../components/book/test"), { ssr: false });
export default function Book() {
    return process.browser ? <BookEditor /> : null;
}