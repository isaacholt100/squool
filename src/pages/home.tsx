import { useDelete } from "../hooks/useRequest";
import { Button } from "@material-ui/core";
import useLogout from "../hooks/useLogout";
import useRedirect from "../hooks/useRedirect";
import { defaultRedirect } from "../lib/serverRedirect";
import Title from "../components/Title";

export default function Dashboard() {
    const [del, loading] = useDelete();
    const logout = useLogout();
    const handleLogout = () => {
        del("/login", {
            //setLoading: true,
            done: logout,
        });
    }
    const isLoggedIn = useRedirect();
    return (
        <>
            <Title title="Home" />
            {!isLoggedIn ? null : (
                <div>Dashboard<Button onClick={handleLogout}>Logout</Button></div>
            )}
        </>
    );
}
export const getServerSideProps = defaultRedirect;