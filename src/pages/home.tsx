import useRedirect from "../hooks/useRedirect";
import { defaultRedirect } from "../lib/serverRedirect";
import Title from "../components/Title";

export default function Dashboard() {
    const isLoggedIn = useRedirect();
    return (
        <>
            <Title title="Home" />
            {!isLoggedIn ? null : (
                <div>Dashboard</div>
            )}
        </>
    );
}
//export const getServerSideProps = defaultRedirect;