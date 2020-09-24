import { useRouter } from "next/router";
import { useEffect } from "react";
import useIsLoggedIn from "./useIsLoggedIn"
import useSnackbar from "./useSnackbar";

export default () => {
    const isLoggedIn = useIsLoggedIn(), snackbar = useSnackbar(), router = useRouter();
    useEffect(() => {
        if (!isLoggedIn) {
            router.replace("/login?to=" + router.pathname);
            snackbar.error("Please login first");
        }
    });
    return isLoggedIn;
}