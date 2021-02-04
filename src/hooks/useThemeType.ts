import { useMediaQuery } from "@material-ui/core";
import { useTheme } from "../context/Theme";

export default function useThemeType() {
    const [theme] = useTheme();
    const systemDark = useMediaQuery("(prefers-color-scheme: dark)");
    return theme.type === "system"
        ? systemDark ? "dark" : "light"
        : theme.type;
}