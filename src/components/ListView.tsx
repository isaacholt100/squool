/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, memo } from "react";
import { makeStyles, Theme } from "@material-ui/core/styles";
import SwipeableViews from "react-swipeable-views";
import {
    Typography,
    AppBar,
    Tabs,
    useMediaQuery,
    Grid,
    CardActionArea,
    Tooltip,
    IconButton,
    Tab,
    MobileStepper,
    Dialog,
    DialogTitle,
    CircularProgress,
    IconButtonProps,
    Paper,
} from "@material-ui/core";
import { Box } from "@material-ui/core";
import isEqual from "react-fast-compare";
//import useContextMenu from "../hooks/useContextMenu";
import isHotkey from "is-hotkey";
import { mdiChevronLeft, mdiChevronRight, mdiPlus } from "@mdi/js";
import Icon from "./Icon";
import styles from "../css/listView.module.css";
import clsx from "clsx";
import useCarouselView from "../hooks/useCarouselView";
import useContextMenu from "../hooks/useContextMenu.tsx";

const useStyles = makeStyles(theme => ({
    animated: {
        opacity: 1,
        animation: "none",
    },
    animate: {
        opacity: 0,
        animation: "fadein 0.5s forwards 0.25s",
    },
    createBtn: {
        "& *": {
            textAlign: "center",
        },
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: theme.palette.primary.contrastText,
        backgroundColor: theme.palette.primary.main,
        flexDirection: "column"
    },
    bounceUp: {
        animation: "fadein 0.5s forwards 0.5s",
        opacity: 0,
        height: "initial !important",
    },
    swiper: {
        marginRight: -8,
    },
    cardSwipe: {
        marginRight: 8,
    },
    actionArea: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
    },
    errorColor: {
        color: theme.palette.error.main,
    }
}));

interface ITabProps {
    tabs: string[];
    filter?: number;
    setFilter?: (x: number) => void;
}

const TabList = memo((props: ITabProps) => props.tabs.length > 0 && (
    <Box clone mb={{ xs: "8px !important", lg: "16px !important" }}>
        <AppBar position="static" color="default">
            <Tabs
                value={props.filter}
                onChange={(e, newFilter) => props.setFilter(newFilter)}
                indicatorColor="primary"
                textColor="primary"
                variant="scrollable"
                scrollButtons="auto"
                aria-label="scrollable tabs"
            >
                {props.tabs.map((tab, i) => (
                    <Tab
                        key={i}
                        id={`scrollable-auto-tab-${i}`}
                        aria-controls={`scrollable-auto-tabpanel-${i}`}
                        label={tab}
                    />
                ))}
            </Tabs>
        </AppBar>
    </Box>
), (prev, next) => !(prev.filter !== next.filter || prev.tabs.length !== next.tabs.length));

const CreateBtn = memo((props: { createFn?: () => void, name: string }) => {
    const classes = useStyles();
    return (
        <CardActionArea
            className={classes.actionArea + " flex p_0 flex_col justify_content_center align_items_center full_height"}
            onClick={props.createFn}
        >
            <div>
                <Typography variant="h6" color="inherit" align="center" style={{marginTop: -4}}>
                    New {props.name}
                </Typography>
                <Box
                    bgcolor="primary.contrastText"
                    borderRadius="50%"
                    //size="small"
                    height={36}
                    width={36}
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    color="primary.main"
                    margin="auto"
                >
                    <Box clone color="primary.main">
                        <Icon path={mdiPlus} />
                    </Box>
                </Box>
            </div>
        </CardActionArea>
    );
}, (prev, next) => true);

const Stepper = memo((props: { length: number, activeStep: number, setActiveStep: (x: number) => void, }) => (
    <MobileStepper
        variant="dots"
        steps={props.length}
        position="static"
        activeStep={props.activeStep}
        nextButton={
            <Tooltip title="Next">
                <IconButton
                    size="small"
                    onClick={() => props.setActiveStep(props.activeStep + 1)}
                    disabled={props.activeStep === props.length - 1}
                >
                    <Icon path={mdiChevronRight} />
                </IconButton>
            </Tooltip>
        }
        backButton={
            <Tooltip title="Previous">
                <IconButton
                    size="small"
                    onClick={() => props.setActiveStep(props.activeStep - 1)}
                    disabled={props.activeStep === 0}
                >
                    <Icon path={mdiChevronLeft} />
                </IconButton>
            </Tooltip>
        }
    />
), (prev, next) => !(prev.length !== next.length || prev.activeStep !== next.activeStep));

export type IAction = {
    label: string;
    fn: () => void;
    icon: JSX.Element;
} & Partial<IconButtonProps>;

interface IListProps<T> {
    noCreate?: boolean;
    height: number;
    animate: boolean;
    createFn?: () => void;
    name: string;
    filtered: any[];
    Item: (item: T) => JSX.Element;
    color?: IconButtonProps["color"];
    Actions?: (item: T) => IAction[];
    activeStep: number;
    setActiveStep: (x: number) => void;
    rerender?: any;
}

const List = memo(function<T>(props: IListProps<T>) {
    const
        [ContextMenu, openContextMenu] = useContextMenu(),
        classes = useStyles(),
        carouselView = useCarouselView(),
        isLarge = useMediaQuery("(min-width: 600px)"),
        isSmall = useMediaQuery((theme: Theme) => theme.breakpoints.down("md")),
        swipeable = !isLarge && carouselView,
        Container: any = (isLarge || !carouselView) ? Grid : SwipeableViews,
        containerProps = () => (isLarge || !carouselView) ? {
            container: true,
            spacing: isSmall ? 1 : 2,
        } : {
            index: props.activeStep,
            onChangeIndex: (step: number) => props.setActiveStep(step),
            enableMouseEvents: true,
            className: classes.swiper
        };
    return (
        <>
            {ContextMenu}
            {swipeable && !props.noCreate && (
                <Box height={props.height} mb={1}>
                    <Paper
                        className={(props.animate ? classes.animate : classes.animated) + " full_height"}
                    >
                        <CreateBtn createFn={props.createFn} name={props.name} />
                    </Paper>
                </Box>
            )}
            <div className={(swipeable && props.animate) ? classes.bounceUp : null}>
                <Container {...containerProps()}>
                    {(swipeable || props.noCreate ? props.filtered : ["create", ...props.filtered]).map((item, i) => (
                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={4}
                            lg={3}
                            xl={2}
                            key={i}
                            style={{
                                height: props.height,
                            }}
                        >
                            <Paper
                                classes={{
                                    root: clsx(swipeable ? classes.cardSwipe : null, styles.card)
                                }}
                                style={{
                                    animation: (!swipeable && props.animate) ? `fadein 0.5s forwards ${(i + 1) / (props.filtered.length + 1) / 2}s` : "none",
                                    opacity: (!swipeable && props.animate) ? 0 : 1,
                                }}
                                onContextMenu={item !== "create" && props.Actions ? openContextMenu(props.Actions(item)) : undefined}
                            >
                                {item === "create" ? <CreateBtn createFn={props.createFn} name={props.name} /> : (
                                    <>
                                        {props.Item(item)}
                                        <Box display="flex" position="absolute" bottom={4} right={4}>
                                            {props.Actions && props.Actions(item).map(({ label, fn, icon, ...a }) => (
                                                <Tooltip title={label} key={label}>
                                                    <IconButton
                                                        component={IconButton}
                                                        aria-label={label}
                                                        onClick={fn}
                                                        color={props.color || (label === "Delete" ? undefined : "secondary")}
                                                        {...a}
                                                        className={label === "Delete" ? clsx(classes.errorColor, "ml_8") : "ml_8"}
                                                    >
                                                        {icon}
                                                    </IconButton>
                                                </Tooltip>
                                            ))}
                                        </Box>
                                    </>
                                )}
                            </Paper>
                        </Grid>
                    ))}
                </Container>
            </div>
        </>
    );
}, (prev, next) => !(!isEqual(prev.filtered, next.filtered) || prev.animate !== next.animate || prev.activeStep !== next.activeStep || prev.rerender !== next.rerender));

interface IFormProps {
    createOpen: boolean;
    setCreateOpen: (o: boolean) => void;
    name: string;
    createForm: JSX.Element;
}

const Form = (props: IFormProps) => (
    <Dialog
        open={props.createOpen || false}
        onClose={() => props.setCreateOpen(false)}
        aria-labelledby={`new-${props.name}-title`}
        keepMounted
    >
        <DialogTitle id={`new-${props.name}-title`}>New {props.name}</DialogTitle>
        {props.createForm}
    </Dialog>
    //<div style={{backgroundColor: "green", height: 300, width: 300, display: props.createOpen ? "block" : "none"}} onClick={() => props.setCreateOpen(false)}>Hello</div>
);
export default function ListView<T>(props: ITabProps & Omit<IListProps<T>, "animate" | "setAnimate" | "activeStep" | "setActiveStep"> & Partial<IFormProps>) {
    const
        [activeStep, setActiveStep] = useState(0),
        carouselView = useCarouselView(),
        [animate, setAnimate] = useState(true),
        isLarge = useMediaQuery("(min-width: 600px)"),
        swipeable = !isLarge && carouselView;
    useEffect(() => {
        props.filtered && setTimeout(() => setAnimate(false), 1000);
    }, [props.filtered]);
    useEffect(() => {
        const keyDown = e => {
            if (isHotkey("shift+n", e) && props.createFn) {
                e.preventDefault();
                props.createFn();
            }
        }
        document.addEventListener("keydown", keyDown);
        return () => {
            document.removeEventListener("keydown", keyDown);
        }
    }, []);
    return (
        props.filtered ? (
            <Box display="flex" flexDirection="column" mx="auto">
                {<Form name={props.name} createOpen={props.createOpen} setCreateOpen={props.setCreateOpen} createForm={props.createForm} />}
                <TabList filter={props.filter} setFilter={props.setFilter} tabs={props.tabs} />
                <List
                    noCreate={props.noCreate}
                    animate={animate}
                    createFn={props.createFn}
                    filtered={props.filtered}
                    Item={props.Item}
                    Actions={props.Actions}
                    name={props.name}
                    height={props.height}
                    activeStep={activeStep}
                    setActiveStep={setActiveStep}
                    rerender={props.rerender}
                />
                {swipeable && props.filtered.length > 0 && <Stepper activeStep={activeStep} setActiveStep={setActiveStep} length={props.filtered.length} />}
            </Box>
        ) : <CircularProgress disableShrink />
    );
}