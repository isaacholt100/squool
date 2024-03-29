import IAction from "../../types/action";
import IChat from "../../types/IChat";

export default function chats(state: IChat[] = [], action: IAction): IChat[] {
    switch (action.type) {
        case "UPLOAD_DATA":
            return action.payload.chats;
        case "/chats/upload":
            return action.payload;
        case "/chats/create":
            return [action.payload, ...state];
        case "/chats/delete":
            return state.filter(c => c._id !== action.payload);
        case "/classes/member/join":
            return state.map(c => c._id === action.payload._id ? {
                ...c,
                member_ids: [...state[c._id].member_ids, action.payload.user_id]
            } : c);
        default:
            if (action.type === "/classes/member/leave" || action.type === "/classes/member/remove") {
                return state.map(c => c._id === action.payload._id ? {
                    ...c,
                    member_ids: /*state[c._id]*/c.member_ids.filter(i => i !== action.payload.user_id)
                } : c);
            }
            return state;
    }
}