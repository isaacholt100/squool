/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, memo, useEffect, Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
    SwipeableDrawer,
    Drawer,
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Hidden,
    Tooltip,
    ListItemText,
    ListItem,
    Divider,
} from "@material-ui/core";
import { Box } from "@material-ui/core";
import clsx from "clsx";
import Icon from "./Icon";
import { mdiAccountGroup, mdiBell, mdiBook, mdiCalendar, mdiChat, mdiCog, mdiFormatListChecks, mdiHome, mdiMenu, mdiSchool, mdiTimetable, mdiWrench } from "@mdi/js";
import Link from "next/link";
import useIsLoggedIn from "../hooks/useIsLoggedIn";
import NProgress from "nprogress";
import NProgressBar from "./NProgressBar";
import { useRouter } from "next/router";
import MoreActions from "./MoreActions";
import useUserInfo from "../hooks/useUserInfo";
import usePathname from "../hooks/usePathname";

NProgress.configure({
    parent: "#nprogress-parent",
});

const
    useStyles = makeStyles(theme => ({
        appBar: {
            [theme.breakpoints.up("md")]: {
                width: `calc(100% - ${61}px)`,
                marginLeft: 61,
            },
            backgroundColor: theme.palette.background.default,
            padding: 0,
            borderRadius: 0,
            zIndex: 1200,
            height: 65,
        },
        navIconHide: {
            [theme.breakpoints.up("md")]: {
                display: "none",
            },
            marginLeft: 6,
            marginRight: 6,
        },
        drawerPaper: {
            position: "fixed",
            width: 240,
            transition: theme.transitions.create("width", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen
            }),
            padding: 0,
            borderRadius: 0,
        },
        drawerLarge: {
            width: 61,
        },
        navItem: {
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            overflow: "hidden",
            height: "48px !important",
            paddingLeft: "12px !important",
            paddingRight: "12px !important",
        },
        progressContainer: {
            position: "relative",
            zIndex: 1000000,
            height: 4,
        },
        homeDivider: {
            marginBottom: 6,
        },
        logo: {
            userSelect: "none",
            msUserSelect: "none",
            MozUserSelect: "none",
            WebkitUserSelect: "none",
        },
        imgLink: {
            "& div:first-child": {
                margin: -6,
            }
        },
        linksContainer: {
            padding: 6,
            paddingBottom: 0,
            overflow: "scroll",
            WebkitOverflowScrolling: "touch",
        }
    }));
const Nav = memo(() => {
    const
        router = useRouter(),
        [mobileOpen, setMobileOpen] = useState(false),
        [notificationOpen, setNotificationOpen] = useState(false),
        classes = useStyles(),
        { role } = useUserInfo(),
        iOS = process.browser && /iPad|iPhone|iPod/.test(navigator.userAgent),
        icons = {
            "Books": mdiBook,
            "Classes": mdiAccountGroup,
            "Chats": mdiChat,
            "Timetable": mdiTimetable,
            "Calendar": mdiCalendar,
            "Tools": mdiWrench,
            "Reminders": mdiFormatListChecks,
            "Settings": mdiCog,
            "School": mdiSchool,
            "Home": mdiHome,//<Image src="/icons/android-icon-48x48.png" layout="fixed" height={36} width={36} draggable="false" priority loading="eager" />
        },
        links = () => {
            switch (role) {
                case "student":
                    return ["Home", "School", "Books", "Classes", "Chats", "Timetable", "Calendar", "Tools", "Reminders", "Settings"];
                case "teacher":
                    return ["Home", "School", "Classes", "Chats", "Timetable", "Calendar", "Tools", "Reminders", "Settings"];
                default:
                    return ["Home", "School", "Chats", "Calendar", "Tools", "Reminders", "Settings"];
            }
        },
        DrawerItems = (small: boolean) => (
            <div className={clsx(classes.linksContainer, "no_scrollbar")}>
                {links().map(link => (
                    <Fragment key={link}>
                        <Link href={"/" + link.toLowerCase()}>
                            <div>
                                <Tooltip placement="left" title={link} {...(small ? {open: false} : {})}>
                                    <ListItem
                                        button
                                        href={"/" + link.toLowerCase()}
                                        selected={link.toLowerCase() === router.pathname.slice(1) || (link === "Home" && router.pathname === "/")}
                                        className={clsx(classes.navItem, link === "Home" && classes.imgLink)}
                                        onClick={(e) => {
                                            setMobileOpen(false);
                                            e.stopPropagation();
                                            router.push("/" + link.toLowerCase());
                                        }}
                                    >
                                        {typeof(icons[link]) !== "string" ? icons[link] : <Icon path={icons[link]} />}
                                        {small && (
                                            <ListItemText primary={link} className={"ml_12"} />
                                        )}
                                    </ListItem>
                                </Tooltip>
                            </div>
                        </Link>
                        {link === "Home" && (
                            <Divider className={classes.homeDivider} />
                        )}
                    </Fragment>
                ))}
            </div>
        );
    useEffect(() => {
        router.events.on("routeChangeStart", NProgress.start);
        router.events.on("routeChangeComplete", NProgress.done);
        router.events.on("routeChangeError", NProgress.done);
        return () => {
            router.events.off("routeChangeStart", NProgress.start);
            router.events.off("routeChangeComplete", NProgress.done);
            router.events.off("routeChangeError", NProgress.done);
        }
    }, []);
    return (
        <>
            <AppBar className={classes.appBar} color="default" position="relative">
                <Toolbar disableGutters={true}>
                    <Tooltip title="Menu">
                        <IconButton
                            aria-label="Open drawer"
                            color="inherit"
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className={classes.navIconHide}
                        >
                            <Icon path={mdiMenu} />
                        </IconButton>
                    </Tooltip>
                    <div className={"ml_auto"}>
                        <Tooltip title="Notifications">
                            <IconButton
                                className={"mr_6 ml_auto"}
                                onClick={() => setNotificationOpen(true)}
                                color="inherit"
                            >
                                <Icon path={mdiBell} />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="More Options">
                            <MoreActions className={"mr_6"} />
                        </Tooltip>
                    </div>
                </Toolbar>
                <div id="nprogress-parent" className={classes.progressContainer}>
                    <Box position="absolute" bgcolor="primary.main" height={"4px"} width={1} />
                    <NProgressBar />
                </div>
            </AppBar>
            <SwipeableDrawer
                variant="temporary"
                anchor="right"
                open={notificationOpen}
                onClose={() => setNotificationOpen(false)}
                onOpen={() => setNotificationOpen(true)}
                classes={{
                    paper: classes.drawerPaper,
                }}
                ModalProps={{
                    keepMounted: true,
                }}
                disableDiscovery
                hysteresis={0.25}
                minFlingVelocity={256}
                disableBackdropTransition={!iOS}
            >
                <div className={"flex flex_col p_6"}>
                    <Typography variant="h5">Notifications</Typography>
                </div>
            </SwipeableDrawer>
            <Hidden mdUp>
                <SwipeableDrawer
                    variant="temporary"
                    anchor="left"
                    open={mobileOpen}
                    onClose={() => setMobileOpen(false)}
                    onOpen={() => setMobileOpen(true)}
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                    ModalProps={{
                        keepMounted: true,
                    }}
                    disableBackdropTransition={!iOS}
                    disableDiscovery={iOS}
                    hysteresis={0.25}
                    minFlingVelocity={256}
                >
                    {DrawerItems(true)}
                </SwipeableDrawer>
            </Hidden>
            <Hidden smDown>
                <Drawer
                    variant="permanent"
                    open
                    classes={{
                        paper: clsx(classes.drawerPaper, classes.drawerLarge),
                    }}
                >
                    {DrawerItems(false)}
                </Drawer>
            </Hidden>
        </>
    );
});
export default function Navigation() {
    const isLoggedIn = useIsLoggedIn();
    const pathname = usePathname();
    return isLoggedIn && pathname !== "/" ? <Nav /> : null;
}