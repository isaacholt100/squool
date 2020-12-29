import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import ITimetable from "../types/ITimetable";

export default function useTimetable(): ITimetable {
    const timetable = useSelector((s: RootState) => s.timetable);
    return timetable;
}