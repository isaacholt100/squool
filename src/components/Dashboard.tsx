import { useDelete } from "../hooks/useRequest";
import { Button } from "@material-ui/core";
import useLogout from "../hooks/useLogout";

export default function Dashboard() {
    const [del, loading] = useDelete();
    const logout = useLogout();
    const handleLogout = () => {
        del("/login", {
            //setLoading: true,
            done: logout,
        });
    }
    return (
        <div>Dashboard<Button onClick={handleLogout}>Logout</Button></div>
    );
}