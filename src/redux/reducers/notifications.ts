import IAction from "../../types/action";
import INotification from "../../types/INotification";

export default function notifications(state: INotification[] = [], action: IAction): INotification[] {
    if (!action.notify) {
        return state;
    }
    switch (action.type) {
        default:
            return state;
    }
};