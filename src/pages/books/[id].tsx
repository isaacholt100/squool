import dynamic from "next/dynamic";
import useRedirect from "../../hooks/useRedirect";
import { defaultRedirect } from "../../lib/serverRedirect";

const BookEditor = dynamic(() => import("../../components/book/test"), { ssr: false });
export default function Book() {
    const isLoggedIn = useRedirect();
    return isLoggedIn && process.browser ? <BookEditor /> : null;
}
export const getServerSideProps = defaultRedirect;