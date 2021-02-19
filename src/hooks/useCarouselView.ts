import Cookies from "js-cookie";
import { useSelector } from "react-redux";
import useSWR from "swr";
import { RootState } from "../redux/store";

export default function useCarouselView(): boolean {
    const { data } = useSWR("/api/user/settings/carouselView", {
        onError() {},
        initialData: process.browser ? Cookies.get("carouselView") === "true" : false,
    });
    //const carouselView = useSelector((s: RootState) => s.carouselView);
    return data;
}