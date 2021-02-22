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
import Cookies from "js-cookie";
import useLogout from "../hooks/useLogout";
import useThemeType from "../hooks/useThemeType";
import usePathname from "../hooks/usePathname";
import useIsMobile from "../hooks/useIsMobile";
import sendRequest from "../lib/sendRequest";
import useIsInApp from "../hooks/useIsInApp";


function ThemeWrapper({ children }: { children: ReactChild }) {
    const
        //router = useRouter(),
        [theme] = useTheme(),
        themeType = useThemeType(),
        paperBg = themeType === "light" ? "#f1f3f4" : "#424242",
        defaultBg = themeType === "light" ? "#fff" : "#121212",
        level1Bg = themeType === "light" ? "#ddd" : "#333",
        isMobile = useIsMobile(),
        isInApp = useIsInApp(),
        fontFamily = `https://fonts.googleapis.com/css?family=${theme.fontFamily.toLowerCase().split(" ").map((s: string) => s.charAt(0).toUpperCase() + s.substring(1)).join("+")}:300,400,500&display=swap`,
        muiTheme = createMuiTheme({
            palette: {
                primary: {
                    main: theme.primary,
                },
                secondary: {
                    main: theme.secondary,
                },
                type: themeType as any,
                background: {
                    default: defaultBg,
                    paper: paperBg,
                    level1: level1Bg,
                } as any,
            },
            spacing: 6,
            typography: {
                fontFamily: `"${theme.fontFamily}", "Helvetica", "Arial", sans-serif`,
            },
            props: {
                MuiButtonBase: {
                    disableTouchRipple: true,
                },
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
                MuiMenuList: {
                    dense: true,
                },
                MuiTooltip: {
                    arrow: true,
                },
                MuiInputBase: {
                    onFocus(e) {
                        (e.target as HTMLElement).classList?.add("allow_select");
                    },
                    onBlur(e) {
                        (e.target as HTMLElement).classList?.remove("allow_select");
                    },
                },
                MuiBackdrop: {
                    //onEnter: () => document.documentElement.classList.add("disable_scroll"),
                    //onExit: () => document.documentElement.classList.remove("disable_scroll"),
                }
            },
        });
    muiTheme.overrides = {
        MuiCssBaseline: {
            "@global": {
                "html": {
                    overflow: "hidden",
                },
                "html, body > #__next": {
                    width: "100%",
                    height: "100%",
                    fontFamily: `"${theme.fontFamily}", "Helvetica", "Arial", sans-serif`,
                },
                "body": {
                    fontFamily: `"${theme.fontFamily}", "Helvetica", "Arial", sans-serif`,
                    width: "100%",
                    height: isInApp ? "calc(100% - 64px)" : "100%",
                    marginTop: isInApp ? 64 : 0,
                    overflow: "auto",
                },
                "*": {
                    caretColor: theme.primary,
                },
                ".primary_bg": {
                    backgroundColor: muiTheme.palette.primary.main + " !important",
                },
                ".primary_contrast_text": {
                    color: muiTheme.palette.primary.contrastText + " !important",
                },
                ".error_color_btn:not(.Mui-disabled)": {
                    backgroundColor: muiTheme.palette.error.main + " !important",
                    color: muiTheme.palette.error.contrastText + " !important",
                    "&:hover": {
                        backgroundColor: muiTheme.palette.error.dark + " !important",
                    },
                },
                "::selection": {
                    WebkitTextFillColor: muiTheme.palette.secondary.contrastText,
                    color: muiTheme.palette.secondary.contrastText,
                    backgroundColor: muiTheme.palette.secondary.main,
                },
                "::moz-selection": {
                    WebkitTextFillColor: muiTheme.palette.secondary.contrastText,
                    color: muiTheme.palette.secondary.contrastText,
                    backgroundColor: muiTheme.palette.secondary.main,
                },
                ...(isMobile ? {
                    "*": {
                        WebkitTouchCallout: "none !important",
                        WebkitUserSelect: "none !important",
                        KhtmlUserSelect: "none !important",
                        MozUserSelect: "none !important",
                        MsUserSelect: "none !important",
                        userSelect: "none !important",
                    },
                } : {}),
            }
        },
        MuiTouchRipple: {
            ripplePulsate: {
                width: "100% !important",
                borderRadius: 0,
                left: "0 !important",
                right: "0 !important",
                animation: "none !important",
                //position: "static",
                "& *": {
                    borderRadius: "0 !important",
                    animation: "none !important",
                }
            },
        },
        MuiMenu: {
            list: {
                padding: muiTheme.spacing(0.5) + "px !important",
            },
            paper: {
                borderRadius: muiTheme.spacing(1.5) + "px !important"
            }
        },
        MuiMenuItem: {
            root: {
                marginBottom: muiTheme.spacing(0.5),
                "&:last-child": {
                    marginBottom: 0,
                },
                minHeight: 36,
            }
        },
        MuiPopover: {
            paper: {
                border: `2px solid gray`,
                overflowX: "hidden !important" as any,
            },
        },
        MuiTypography: {
            root: {
                WebkitTouchCallout: "initial",
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
        MuiInputBase: {
            input: {
                caretColor: theme.primary,
            }
        },
        MuiList: {
            root: {
                padding: "0 !important",
            }
        },
        MuiListItem: {
            gutters: {
                paddingLeft: 6,
                paddingRight: 6,
            },
            selected: {
                backgroundColor: theme.primary + " !important",
                color: muiTheme.palette.primary.contrastText + " !important",
            },
            root: {
                borderRadius: muiTheme.spacing(1),
                marginBottom: muiTheme.spacing(1),
            },
            dense: {
                paddingTop: 0,
                paddingBottom: 0,
                //"&:not(:last-child)": {
                    marginBottom: muiTheme.spacing(0.5),
                //}
            }
        },
        MuiButton: {
            root: {
                borderRadius: 6,
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
                borderRadius: 6,
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
                borderRadius: 6,
            },
            notchedOutline: {
                borderWidth: 2,
            },
        },
        MuiCardActionArea: {
            root: {
                borderRadius: 12,
                overflow: "hidden",
            },
            focusHighlight: {
                borderRadius: 12,
            },
        },
        MuiToolbar: {
            regular: {
                minHeight: "60px !important"
            },
        },
        MuiPaper: {
            root: {
                boxShadow: "none !important",
                borderRadius: 12,
            },
            rounded: {
                borderRadius: 12,
            },
        },
        MuiCard: {
            root: {
                padding: 12,
            },
        },
        MuiDialog: {
            paper: {
                borderRadius: 12,
                margin: 12,
                width: "100%",
            },
        },
        MuiSelect: {
            root: {
                borderRadius: "6px !important",
            },
        },
        MuiDialogContent: {
            root: {
                padding: "6px 12px",
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
                padding: 12,
            },
        },
        MuiTab: {
            root: {
                textTransform: "capitalize",
                borderRadius: 6,
                marginRight: 6,
                minHeight: 36,
            },
        },
        MuiTabs: {
            root: {
                borderRadius: 12,
                padding: 6,
            },
            indicator: {
                display: "none",
            },
            scroller: {
                borderRadius: 6,
            }
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
                padding: "12px 16px",
            },
        },
        MuiIconButton: {
            sizeSmall: {
                padding: 6,
            }
        },
        MuiLink: {
            root: {
                "&:focus": {
                    textDecoration: "underline",
                },
                outline: "none !important",
            }
        },
        MuiTooltip: {
            tooltip: {
                backgroundColor: muiTheme.palette.text.primary,
                color: defaultBg,
                fontSize: 14,
            },
            arrow: {
                color: muiTheme.palette.text.primary,
            }
        },
        MuiPickersModal: {
            dialogRoot: {
                width: "auto",
                minWidth: "auto",
            },
        },
        MuiPaginationItem: {
            rounded: {
                borderRadius: 6,
            },
        },
        MuiPagination: {
            ul: {
                overflow: "scroll",
                flexWrap: "nowrap",
                scrollbarWidth: "none !important",
                MsOverflowStyle: "none !important",
                "&::-webkit-scrollbar": {
                    display: "none",
                },
            },
        },
        MuiListItemText: {
            secondary: {
                overflow: "hidden",
                textOverflow: "ellipsis",
            },
            primary: {
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
            },
        },
    } as any;
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
        isInApp = useIsInApp(),
        dispatch = useDispatch(),
        [get] = useGet(),
        [dataLoaded, setDataLoaded] = useState(false),
        classes = useContainerStyles(isLoggedIn && isInApp),
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
        <>
            {false && (
                <LoadPreview status={dataLoaded === undefined ? "error" : "loading"} getData={getData} opacity={dataLoaded ? 0 : 1} />
            )}
            <Navigation />
            <CssBaseline />
            <div className={classes.appContainer}>
                {children}
            </div>
        </>
    );
}
const useContainerStyles = makeStyles(({ breakpoints }) => ({
    appContainer: {
        width: "100%",
        height: "100%",
        //marginTop: props => (props as any) ? 60 : 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        [breakpoints.up("md")]: {
            marginLeft: props => (props as any) ? 60 : 0,
            width: props => (props as any) ? "calc(100% - 60px)" : "100%",
        },
        "& > *": {
            width: "100%",
            //maxWidth: 2048,
            margin: "0 auto",
            //overflowY: "auto",
            overflowX: "hidden",
            flex: 1,
            //height: "100%",
            [breakpoints.up("lg")]: {
                padding: 12,
            },
            padding: 6,
        },
        flex: 1,
        minHeight: 0,
    },
}));
const useStyles = makeStyles(({ palette }) => ({
    snackbarRoot: {
        maxWidth: 512,
        "& > div": {
            borderRadius: 6,
            //width: "100%",
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
    const logout = useLogout();
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
                    refreshInterval: 1000,
                    onError: (err, _key, _config) => {
                        console.error(err);
                        snack.current.enqueueSnackbar("There was an error loading a request", {
                            variant: "error",
                        });
                    },
                    fetcher: async (url, options) => {
                        const res = await fetch(url, {
                            ...options,
                            credentials: "include",
                            headers: {
                                "authorization": "Bearer " + Cookies.get("accessToken"),
                                "authorization-refresh": "Bearer " + Cookies.get("refreshToken"),
                                "Access-Control-Expose-Headers": "authorization",
                                "Access-Control-Allow-Headers": "authorization",
                            },
                        });
                        const header = res?.headers?.get("authorization");
                        if (res?.status === 401) {
                            logout();
                        } else if (header) {
                            Cookies.set("accessToken", header, { expires: 1 });
                        }
                        return res.json();
                    }
                }}
            >
                <Head>
                    <title>Squool</title>
                    <meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=5" />
                </Head>
                <Theme /*initialTheme={pageProps.initialTheme}*/>
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
                                autoHideDuration={6000}
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