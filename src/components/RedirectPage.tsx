import useAuthRedirect from "../hooks/useAuthRedirect";

export default function RedirectPage({Page, ...other}: {Page: (props?: any) => JSX.Element, [key: string]: any}) {
    const isLoggedIn = useAuthRedirect();
    return isLoggedIn ? <Page {...other} /> : null;
}