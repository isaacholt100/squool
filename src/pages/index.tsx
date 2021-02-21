import { Button, Card, createMuiTheme, ThemeProvider, Typography, Theme } from "@material-ui/core";
import Link from "next/link";
import Title from "../components/Title";
import defaultTheme from "../json/defaultTheme.json";

export default function LandingPage() {
    /*const newTheme = (theme: Theme) => createMuiTheme({
        ...theme,
        palette: {
            ...theme.palette,
            primary: {
                main: defaultTheme.primary,
            },
            secondary: {
                main: defaultTheme.secondary,
            },
            type: defaultTheme.type as any,
        },
        typography: {
            ...theme.typography,
            fontFamily: `"${defaultTheme.fontFamily}", "Helvetica", "Arial", sans-serif`,
        },
    });*/
    return (
        //<ThemeProvider theme={newTheme}>
            <div>
                <Title title="Squool" />
                <Card>
                    <Typography variant="h3" gutterBottom>Landing Page</Typography>
                    <Link href="/home">
                        <Button variant="outlined" color="primary" component="a">
                            Open Squool
                        </Button>
                    </Link>
                    <Link href="/signup">
                        <Button color="primary" component="a">
                            Sign up
                        </Button>
                    </Link>
                </Card>
            </div>
        //</ThemeProvider>
    );
}