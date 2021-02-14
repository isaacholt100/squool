import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import IUser from "../types/IUser";
import useUserInfo from "./useUserInfo";

export default function useMembers(): IUser[] {
    const members = useSelector((s: RootState) => s.users);
    return members;
}
export function useMember(_id: string): IUser {
    const members = useMembers();
    //const user = useUserInfo();
    return members.find(m => m._id === _id);
}