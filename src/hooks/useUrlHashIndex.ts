import { useRouter } from "next/router";

export default function useUrlHashIndex(pages: string[]): [number, (hash: string) => void] {
    const router = useRouter();
    function changeHash(hash: string) {
        router.replace({
            pathname: window.location.pathname,
            hash,
        }, undefined, {
            shallow: true,
        });
    }
    return [Math.max(0, pages.indexOf(router.asPath.split("#")[1])), changeHash];
}