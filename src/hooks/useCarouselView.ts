import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

export default function useCarouselView(): boolean {
    const carouselView = useSelector((s: RootState) => s.carouselView);
    return carouselView;
}