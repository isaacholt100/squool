import { useRouter } from "next/router";

const NON_APP_ROUTES = ["/", "/login", "/signup"];

export default function useIsInApp() {
    const { route } = useRouter();
    return !NON_APP_ROUTES.includes(route);
}