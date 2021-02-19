import { useSelector } from "react-redux";
import useSWR from "swr";
import { RootState } from "../redux/store";
import IUser from "../types/IUser";
import useUserInfo from "./useUserInfo";

export default function useMembers(): [IUser[], boolean] {
    const { data } = useSWR("/api/school/members", {
        //initialData: async () => [],
    });
    //const members = useSelector((s: RootState) => s.users);
    return [data || [], data === undefined];
}
export function useMember(_id: string): IUser {
    const [members] = useMembers();
    //const user = useUserInfo();
    return members.find(m => m._id === _id);
}