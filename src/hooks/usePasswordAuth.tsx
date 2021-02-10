import PasswordDialog from "../components/PasswordDialog";
import useRefState from "./useRefState";

export default function usePasswordAuth(loading: boolean): [JSX.Element, (fn: (password: string, setError: () => void) => void) => void, () => void] {
    const [func, setFn] = useRefState<(password: string, setError: () => void) => void>(null);
    const close = () => setFn(null);
    const Dialog = <PasswordDialog loading={loading} fn={func.current} close={close} />;
    const confirm = (f: (password: string, setError: () => void) => void) => {
        setFn(f);
    }
    return [Dialog, confirm, close];
}