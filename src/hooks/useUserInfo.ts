import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import IUser from "../types/IUser";

export default function useUserInfo(): IUser & { school_id: string } {
    return useSelector((s: RootState) => s.userInfo);
}