import { useSelector } from "react-redux";
import useSWR from "swr";
import { RootState } from "../redux/store";
import IReminder from "../types/IReminder";

export default function useReminders(): [IReminder[], boolean] {
    const { data } = useSWR("/api/reminders", {
        onError(err) {
            console.error(err);
        }
    });
    console.log(data);
    
    //const reminders = useSelector((s: RootState) => s.reminders);
    return [data || [], data === undefined];
}