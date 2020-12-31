import { useState, useEffect, ReactChild, useRef, MutableRefObject } from "react";
import Head from "next/head";
import { createMuiTheme, makeStyles, ThemeProvider as MuiTheme } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import { Provider as Redux, useDispatch } from "react-redux";
import { MuiPickersUtilsProvider as Pickers } from "@material-ui/pickers";
import DateUtils from "@date-io/date-fns";
import "date-fns";
import { ProviderContext, SnackbarProvider as Snackbar } from "notistack";
import { Grow, IconButton } from "@material-ui/core";
import Icon from "../components/Icon";
import { mdiClose } from "@mdi/js";
import store from "../redux/store";
import Theme, { useTheme } from "../context/Theme";
import { SWRConfig } from "swr";
import Navigation from "../components/Navigation";
import useIsLoggedIn from "../hooks/useIsLoggedIn";
import LoadPreview from "../components/LoadPreview";
import { useGet } from "../hooks/useRequest";
import "../css/global.css";
import IsOnline from "../context/IsOnline";
import { AppProps } from "next/app";

function ThemeWrapper({ children }: { children: ReactChild }) {
    const
        //router = useRouter(),
        [theme] = useTheme(),
        paperBg = theme.type === "light" ? "#f1f3f4" : "#424242",
        defaultBg = theme.type === "light" ? "#fff" : "#121212",
        level1Bg = theme.type === "light" ? "#ddd" : "#333",
        fontFamily = `https://fonts.googleapis.com/css?family=${theme.fontFamily.toLowerCase().split(" ").map((s: string) => s.charAt(0).toUpperCase() + s.substring(1)).join("+")}:300,400,500&display=swap`,
        muiTheme = createMuiTheme({
            palette: {
                primary: {
                    main: theme.primary,
                },
                secondary: {
                    main: theme.secondary,
                },
                type: theme.type as any,
                background: {
                    default: defaultBg,
                    paper: paperBg,
                    level1: level1Bg,
                } as any,
            },
            typography: {
                fontFamily: `"${theme.fontFamily}", "Helvetica", "Arial", sans-serif`,
            },
            overrides: {
                MuiCssBaseline: {
                    "@global": {
                        "html, body, body > #__next": {
                            width: "100vw",
                            height: "100vh",
                            fontFamily: theme.fontFamily,
                        },
                    }
                },
                MuiMenu: {
                    list: {
                        padding: 0,
                    },
                },
                MuiPopover: {
                    paper: {
                        border: `2px solid gray`,
                        "& li:first-child .MuiTouchRipple-root": {
                            borderRadius: "14px 14px 0 0",
                        },
                        "& li:last-child .MuiTouchRipple-root": {
                            borderRadius: "0 0 14px 14px",
                        },
                        "& li:only-child .MuiTouchRipple-root": {
                            borderRadius: 14,
                        },
                        overflowX: "hidden !important" as any,
                    },
                },
                MuiTypography: {
                    root: {
                        WebkitTouchCallout: "text",
                        WebkitUserSelect: "text",
                        KhtmlUserSelect: "text",
                        MozUserSelect: "text",
                        MsUserSelect: "text",
                        userSelect: "text",
                    },
                },
                MuiDivider: {
                    root: {
                        height: 2,
                    },
                },
                MuiTab: {
                    root: {
                        textTransform: "capitalize",
                    },
                },
                MuiListItem: {
                    gutters: {
                        paddingLeft: 8,
                        paddingRight: 8,
                    },
                    dense: {
                        paddingTop: 0,
                        paddingBottom: 0,
                    },
                },
                MuiButton: {
                    root: {
                        borderRadius: 8,
                        textTransform: "capitalize",
                    },
                    outlined: {
                        borderWidth: "2px !important",
                        "& .MuiTouchRipple-root": {
                            borderRadius: 6,
                        }
                    },
                },
                MuiButtonBase: {
                    root: {
                        "& *": {
                            WebkitTouchCallout: "none !important",
                            WebkitUserSelect: "none !important",
                            KhtmlUserSelect: "none !important",
                            MozUserSelect: "none !important",
                            MsUserSelect: "none !important",
                            userSelect: "none !important",
                        }
                    },
                },
                MuiAutocomplete: {
                    paper: {
                        border: `2px solid gray`,
                        borderRadius: 8,
                    },
                    listbox: {
                        padding: 0,
                        maxHeight: 256,
                    },
                    option: {
                        minHeight: 36,
                    },
                },
                MuiOutlinedInput: {
                    root: {
                        borderRadius: 8,
                    },
                    notchedOutline: {
                        borderWidth: 2,
                    },
                },
                MuiCardActionArea: {
                    root: {
                        borderRadius: 16,
                        overflow: "hidden",
                    },
                    focusHighlight: {
                        borderRadius: 16,
                    },
                },
                MuiMenuItem: {
                    root: {
                        minHeight: 36,
                    },
                },
                MuiToolbar: {
                    regular: {
                        minHeight: "56px !important"
                    },
                },
                MuiPaper: {
                    root: {
                        boxShadow: "none !important",
                        borderRadius: 16,
                    },
                    rounded: {
                        borderRadius: 16,
                    },
                },
                MuiCard: {
                    root: {
                        padding: 16,
                    },
                },
                MuiDialog: {
                    paper: {
                        borderRadius: 16,
                        margin: 16,
                        width: "100%",
                    },
                },
                MuiSelect: {
                    root: {
                        borderRadius: "8px !important",
                    },
                },
                MuiDialogContent: {
                    root: {
                        padding: "8px 16px",
                    },
                },
                MuiAlert: {
                    root: {
                        borderRadius: "16px !important",
                        width: "100%",
                    },
                },
                MuiDialogActions: {
                    root: {
                        padding: 16,
                    },
                },
                MuiTabs: {
                    root: {
                        borderRadius: 16,
                    },
                },
                MuiAppBar: {
                    root: {
                        overflow: "hidden",
                    },
                    colorDefault: {
                        backgroundColor: level1Bg,
                    },
                },
                MuiDialogTitle: {
                    root: {
                        textTransform: "capitalize",
                        borderBottom: `4px solid ${theme.primary}`,
                    },
                },
            } as any,
            props: {
                MuiButton: {
                    variant: "contained",
                    disableElevation: true,
                },
                MuiTextField: {
                    size: "small",
                    variant: "outlined",
                },
                MuiFormControl: {
                    size: "small",
                },
            },
        });
    return (
        <>
            <Head>
                <link rel="stylesheet" href={fontFamily} />
            </Head>
            <MuiTheme theme={muiTheme}>
                {children}
            </MuiTheme>
        </>
    );
}
function Frame({ children }: { children: ReactChild }) {
    const
        isLoggedIn = useIsLoggedIn(),
        dispatch = useDispatch(),
        [get] = useGet(),
        [dataLoaded, setDataLoaded] = useState(false),
        classes = useContainerStyles(isLoggedIn),
        [, setTheme] = useTheme(),
        getData = () => {
            if (!dataLoaded && isLoggedIn) {
                if (dataLoaded === undefined) {
                    setDataLoaded(false);
                }
                get("/user", {
                    setLoading: false,
                    fetchOptions: {
                        cache: "no-cache",
                    },
                    failed: () => setDataLoaded(undefined),
                    done: (data: any) => {
                        setTimeout(() => {
                            setDataLoaded(true);
                            console.log("User data:");
                            console.log(data);
                            setTheme(data.theme);
                            dispatch({
                                type: "UPLOAD_DATA",
                                payload: data,
                            });
                        }, 500);
                    }
                });
            } else {
                setDataLoaded(true);
            }
        };
    useEffect(getData, []);
    return (
        <div className={"flex flex_col full_screen"}>
            {true && (
                <LoadPreview status={dataLoaded === undefined ? "error" : "loading"} getData={getData} opacity={dataLoaded ? 0 : 1} />
            )}
            <Navigation />
            <CssBaseline />
            <div className={classes.appContainer}>
                {children}
            </div>
        </div>
    );
}
const useContainerStyles = makeStyles(({ breakpoints, palette }) => ({
    appContainer: {
        width: "100vw",
        //marginTop: props => (props as any) ? 60 : 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        [breakpoints.up("md")]: {
            marginLeft: props => (props as any) ? 65 : 0,
            width: props => (props as any) ? "calc(100vw - 65px)" : "100vw",
        },
        "& > *": {
            width: "100%",
            //maxWidth: 2048,
            margin: "0 auto",
            overflowY: "auto",
            overflowX: "hidden",
            flex: 1,
            //height: "100%",
            [breakpoints.up("lg")]: {
                padding: 16,
            },
            padding: 8,
        },
        flex: 1,
        minHeight: 0,
        "& ::selection": {
            WebkitTextFillColor: palette.secondary.contrastText,
            color: palette.secondary.contrastText,
            backgroundColor: palette.secondary.main,
        },
        "& ::moz-selection": {
            WebkitTextFillColor: palette.secondary.contrastText,
            color: palette.secondary.contrastText,
            backgroundColor: palette.secondary.main,
        },
        "& *": {
            caretColor: palette.primary.main,
        },
    },
}));
const useStyles = makeStyles(({ palette }) => ({
    snackbarRoot: {
        maxWidth: 512,
        "& > div": {
            borderRadius: 8,
            width: "100%",
            paddingLeft: 12,
            flexWrap: "initial !important",
        },
        "& .MuiIconButton-root": {
            color: "inherit",
            "&:hover": {
               // backgroundColor: "rgba(255, 255, 255, 0.08)",
            },
        },
    },
    error: {
        backgroundColor: palette.error.main + " !important",
        color: palette.error.contrastText + " !important",
    },
    success: {
        backgroundColor: palette.success.main + " !important",
        color: palette.success.contrastText + " !important",
        "& .MuiIconButton-root:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.08)",
        },
    },
    warning: {
        backgroundColor: palette.warning.main + " !important",
        color: palette.warning.contrastText + " !important",
        "& .MuiIconButton-root:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.08)",
        },
    },
    info: {
        backgroundColor: palette.info.main + " !important",
        color: palette.info.contrastText + " !important",
    },
    bottom: {
        bottom: 4,
        right: 8,
    },
}));
export default function App({ Component, pageProps }: AppProps) {
    const snack: MutableRefObject<ProviderContext> = useRef();
    const classes = useStyles();
    useEffect(() => {
        const jssStyles = document.querySelector("#jss-server-side");
        if (jssStyles) {
            jssStyles.parentElement.removeChild(jssStyles);
        }
    }, []);
    return (
        <Redux store={store}>
            <SWRConfig
                value={{
                    onError: (err, key, config) => {
                        console.error(err);
                        snack.current.enqueueSnackbar("There was an error loading a request", {
                            variant: "error",
                        });
                    }
                }}
            >
                <Head>
                    <title>Squool</title>
                    <meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=5" />
                </Head>
                <Theme>
                    <Pickers utils={DateUtils}>
                        <ThemeWrapper>
                            <Snackbar
                                ref={snack as any}
                                action={key => (
                                    <IconButton size="small" onClick={() => snack.current.closeSnackbar(key)}>
                                        <Icon path={mdiClose} />
                                    </IconButton>
                                )}
                                anchorOrigin={{
                                    vertical: "bottom",
                                    horizontal: "right",
                                }}
                                preventDuplicate
                                autoHideDuration={8192}
                                TransitionComponent={Grow as any}
                                classes={{
                                    variantError: classes.error,
                                    variantSuccess: classes.success,
                                    variantInfo: classes.info,
                                    variantWarning: classes.warning,
                                    root: classes.snackbarRoot,
                                    containerAnchorOriginBottomRight: classes.bottom,
                                }}
                                maxSnack={4}
                            >
                                <IsOnline>
                                    <Frame>
                                        <Component {...pageProps} />
                                    </Frame>
                                </IsOnline>
                            </Snackbar>
                        </ThemeWrapper>
                    </Pickers>
                </Theme>
            </SWRConfig>
        </Redux>
    );
}