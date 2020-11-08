/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, memo } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { startCase } from "lodash";
import { Paper, Typography, TextField, IconButton, Tooltip, Box } from "@material-ui/core";
import Icon from "./Icon";
import { mdiBook, mdiClockTimeFour, mdiDelete, mdiFace, mdiMapMarker, mdiPencil } from "@mdi/js";
import Color from "color";
const Slot = memo((props: any) => {
    const classes = useStyles();
    return (
        <Paper
            style={{
                flex: 1,
                animationDelay:
                    `${((props.j + 1) * (props.length + 1) + props.i) /
                    (props.length + 1)
                    / (props.length + 1)}s`,
            }}
            className={`${classes.paper} ${classes.lesson} ${props.create ? classes.noAnimate : null}`}
        >
            <div className={classes.container}>
                {[
                    {
                        type: "s",
                        label: "Subject",
                        Icon: <Icon path={mdiBook} />
                    },
                    {
                        type: "r",
                        label: "Room",
                        Icon: <Icon path={mdiMapMarker} />
                    },
                    {
                        type: "t",
                        label: "Teacher",
                        Icon: <Icon path={mdiFace} />
                    }
                ].map(({ type, label, Icon }) => (
                    <div className={`${classes[type]} ${classes.text}`} key={type}>
                        {Icon}
                        <TextField
                            placeholder={startCase(label)}
                            value={props.edit ? props[type] : startCase(label)}
                            onChange={props.edit ? props.onChange(props.i, props.j, type) : null}
                            className={classes.field}
                            onKeyDown={props.edit ? e => e.key === "Enter" && (e.target as any).blur() : null}
                            disabled={!props.edit}
                        />
                    </div>
                ))}
            </div>
        </Paper>
    );
}, (prev, next) => prev.r === next.r && prev.t === next.t && prev.s === next.s);
const useStyles = makeStyles(theme => ({
    paper: {
        padding: 8,
        margin: 8,
        minWidth: 160,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        animation: "fadein 0.5s forwards",
        opacity: 0,
        [theme.breakpoints.down("md")]: {
            margin: 0,
            padding: 8,
            borderRadius: 0,
            border: `1px solid ${theme.palette.divider}`
        },
        flexDirection: "column",
        "& svg:not(.action)": {
            marginTop: 4,
            marginBottom: -4
        },
        transition: "all 0.25s",
    },
    noAnimate: {
        animation: "none",
        opacity: 1,
    },
    lesson: {
        backgroundColor: theme.palette.background.paper,
        minHeight: 140
    },
    day: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        border: `1px solid ${theme.palette.primary.contrastText}`,
        "& ::selection": {
            color: theme.palette.primary.contrastText,
            backgroundColor: Color(theme.palette.primary.contrastText).alpha(0.32).toString(),
        }
    },
    period: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        minWidth: 160,
        display: "block",
        minHeight: 140,
        "& p": {
            textAlign: "center",
        },
        border: `1px solid ${theme.palette.primary.contrastText}`,
        "& ::selection": {
            color: theme.palette.primary.contrastText,
            backgroundColor: Color(theme.palette.primary.contrastText).alpha(0.32).toString(),
        }
    },
    subject: {
        color: theme.palette.secondary.main,
        textTransform: "capitalize"
    },
    teacher: {
        color: theme.palette.text.secondary,
        textTransform: "capitalize"
    },
    text: {
        fontSize: 16,
        display: "flex",
        marginBottom: 8,
        width: "100%",
    },
    container: {
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
        overflow: "auto",
        width: "100%",
        "& p": {
            width: "100%",
        }
    },
    actionDiv: {
        margin: -4,
        marginBottom: 0,
        display: "flex",
    },
    action: {
        color: theme.palette.primary.contrastText,
        "&:last-child": {
            marginLeft: "auto"
        }
    },
    field: {
        flex: 1,
        marginLeft: 8,
        textTransform: "capitalize",
    },
    periodContainer: {
        display: "flex",
        flexDirection: "column",
        minHeight: "100%",
    },
    paperContainer: {
        overflowY: "auto",
        overflowX: "hidden",
        flex: 1,
        display: "flex",
        flexDirection: "column",
    },
    lessonsContainer: {
        display: "flex",
        flexGrow: 1,
        minHeight: "100%",
        overflowX: "auto",
        overflowY: "hidden",
        "& > div": {
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
            minHeight: "100%",
        },
    },
}));
export default memo((props: any) => {
    const
        classes = useStyles(),
        edit = props.type === "edit",
        create = props.type === "create",
        days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        refs = {
            period: useRef(null),
            mon: useRef(null),
            tue: useRef(null),
            wed: useRef(null),
            thu: useRef(null),
            fri: useRef(null),
            sat: useRef(null),
        },
        scrollDay = day => () => {
            for (let ref in refs) {
                if (day !== ref && refs[ref].current) {
                    refs[ref].current.scrollTop = refs[day].current.scrollTop;
                }
            }
        };
    return (
        <Box
            display="flex"
            height={create ? "auto" : edit ? "100%" : "calc(100% - 72px)"}
            minHeight={create ? "auto" : edit ? "100%" : "calc(100% - 72px)"}
            flex={edit ? 1 : "initial"}
            p={props.noPadding ? undefined : { lg: "8px !important" }}
        >
            <div className={classes.periodContainer}>
                <Paper className={`${classes.day} ${classes.paper} ${create ? classes.noAnimate : null}`}>
                    <Typography>Period</Typography>
                </Paper>
                <div
                    onScroll={scrollDay("period")}
                    ref={refs.period}
                    className={classes.paperContainer}
                >
                    {props.timetable.periods.map((time, i) => (
                        <Paper
                            style={{
                                flex: 1,
                                animationDelay:
                                    `${(i + 1) * (props.timetable.lessons.length + 1) /(props.timetable.lessons.length + 1) /
                                    (props.timetable.periods.length + 1)}s`
                                }}
                                className={`${classes.paper} ${classes.period} ${create ? classes.noAnimate : null}`}
                                key={i}
                            >
                            {create && 
                                <div className={classes.actionDiv}>
                                    <Tooltip title="Delete Period">
                                        <IconButton aria-label="delete" className={classes.action} onClick={() => props.deletePeriod(i)} size="small">
                                            <Icon path={mdiDelete} className="action" />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Edit Period">
                                        <IconButton aria-label="edit" className={classes.action} onClick={() => props.editPeriod(i, time)} size="small">
                                            <Icon path={mdiPencil} className="action" />
                                        </IconButton>
                                    </Tooltip>
                                </div>
                            }
                            <div
                                className={classes.container}
                                style={{
                                    height: create ? "calc(100% - 48px)" : "100%",
                                }}
                            >
                                <Typography gutterBottom>
                                    {i + 1}
                                </Typography>
                                <Typography gutterBottom style={{wordWrap: "break-word"}}>
                                    {time}
                                </Typography>
                            </div>
                        </Paper>
                    ))}
                </div>
            </div>
            <div className={classes.lessonsContainer}>
                {props.timetable.lessons.map((day, i) => (
                    <div key={i}>
                        <Paper
                            className={`${classes.day} ${classes.paper} ${create ? classes.noAnimate : null}`}
                            style={{
                                animationDelay:
                                    `${(i + 1) / (props.timetable.lessons.length + 1)
                                    / (props.timetable.periods.length + 1)}s`,
                            }}
                        >
                            <Typography>{days[i]}</Typography>
                        </Paper>
                        <div
                            className={classes.paperContainer}
                            onScroll={scrollDay(days[i].toLowerCase())}
                            ref={refs[days[i].toLowerCase()]}
                        >
                            {day.map((lesson, j) => <Slot key={`${i}${j}`} lesson={lesson} i={i} j={j} edit={edit} length={props.timetable.lessons.length} onChange={props.onChange} create={create} r={lesson.r} s={lesson.s} t={lesson.t} />)}
                        </div>
                    </div>
                ))}
            </div>
        </Box>
    );
});