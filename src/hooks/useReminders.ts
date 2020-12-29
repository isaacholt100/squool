import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import IReminder from "../types/IReminder";

export default function useReminders(): IReminder[] {
    const reminders = useSelector((s: RootState) => s.reminders);
    return reminders;
}