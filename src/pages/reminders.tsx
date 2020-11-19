/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import {
    TextField,
    Box
} from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Switch from "@material-ui/core/Switch";
import { useDispatch, useSelector } from "react-redux";
import { KeyboardDatePicker, KeyboardTimePicker } from "@material-ui/pickers";
import { MenuItem, InputLabel, FormControl, FormControlLabel, Select } from "@material-ui/core";
import ListView from "../components/ListView";
import compareWeek from "compare-week";
import useConfirm from "../hooks/useConfirm";
import useSnackbar from "../hooks/useSnackbar";
import Icon from "../components/Icon";
import { mdiCheck, mdiClipboardAlert, mdiDelete, mdiPencil } from "@mdi/js";
import LoadBtn from "../components/LoadBtn";
import { useDelete, usePost, usePut } from "../hooks/useRequest";

const useStyles = makeStyles(theme => ({
    iconBtn: {
        marginLeft: 8,
    },
    swiper: {
        borderRadius: 16,
    },
    bounceUp: {
        animation: "bounce 0.5s forwards 0.5s",
        opacity: 0,
        height: "initial !important",
    },
    cardSwipe: {
        borderRadius: 0,
    },
    late: {
        color: theme.palette.error.main,
    },
    createBtn: {
        backgroundColor: theme.palette.primary.main,
        padding: 0,
        "& h5": {
            color: theme.palette.primary.contrastText,
        },
        width: "100%",
        margin: 0,
        "& *": {
            textAlign: "center",
        },
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    fab: {
        backgroundColor: theme.palette.primary.contrastText,
        color: theme.palette.primary.main,
        boxShadow: "none",
        "&:hover, &:active": {
            backgroundColor: theme.palette.primary.contrastText,
            color: theme.palette.primary.main,
            boxShadow: "none"
        }
    },
    date: {
        color: theme.palette.text.hint,
    }
}));

export default function Reminders() {
    const
        snackbar = useSnackbar(),
        [post, postLoading] = usePost(),
        [put, putLoading] = usePut(),
        [del, delLoading] = useDelete(),
        [ConfirmDialog, confirm, closeConfirm] = useConfirm(delLoading),
        dispatch = useDispatch(),
        classes = useStyles(),
        [selectedDate, handleDateChange] = useState(new Date()),
        [selectedTime, handleTimeChange] = useState(new Date()),
        [filter, setFilter] = useState(0),
        [allDay, setAllDay] = useState(false),
        reminders = useSelector((s: any) => s.reminders),
        [values, setValues] = useState({
            desc: "",
            name: "",
            repeat: 0,
        }),
        [currentTodo, setCurrentTodo] = useState(0),
        [dialogs, setDialogs] = useState({
            delete: false,
            edit: false,
            newTodo: false,
            poo: false
        }),
        close = dialog => () => {
            setDialogs({
                ...dialogs,
                [dialog]: false
            });
            setValues({
                desc: "",
                name: "",
                repeat: 0,
            });
        },
        open = (dialog, _id) => () => {
            setCurrentTodo(_id);
            let newDate = new Date();
            let newTime = newDate;
            if (dialog === "edit") {
                const reminder = reminders.find(r => r._id === _id);
                setValues({
                    desc: reminder.desc,
                    name: reminder.name,
                    repeat: reminder.repeat || 0,
                });
                if (reminder.repeat === 1) {
                    const date = new Date(reminder.date);
                    if (date.getTime() < new Date().getTime()) {
                        date.setDate(date.getDate() + 1);
                    }
                    newDate = date;;
                } else if (reminder.repeat === 2) {
                    const date = new Date(reminder.date);
                    if (date.getTime() < new Date().getTime()) {
                        date.setDate(date.getDate() + 7);
                    }
                    newDate = date;
                } else {
                    newDate = new Date(reminder.date);
                }
                newTime = new Date(reminder.date);
                setAllDay(Boolean(reminder.allDay));
            }
            handleDateChange(newDate);
            handleTimeChange(newTime);
            setDialogs({
                ...dialogs,
                [dialog]: true,
            });
        },
        handleChange = name => ({ target: { value }}) => {
            setValues({
                ...values,
                [name]: value,
            });
        },
        todoDone = _id => () => {
            del("/reminders", {
                setLoading: true,
                failedMsg: "deleting this reminder",
                body: { _id },
                done: () => {
                    //dispatchEmit("/reminder/delete", _id);
                    dispatch({
                        type: "/reminder/delete",
                        payload: _id,
                    });
                    snackbar.open("Reminder done", {
                        variant: "info",
                        action: key => (
                            <Button variant="outlined" onClick={undo(_id, key)}>Undo</Button>
                        )
                    });
                }
            });
        },
        deleteTodo = _id => () => {
            del("/reminders", {
                failedMsg: "deleting this reminder",
                setLoading: true,
                body: { _id },
                done() {
                    closeConfirm();
                    dispatch({
                        type: "/reminder/delete",
                        payload: _id,
                    });
                    //dispatchEmit("/reminder/delete", _id);
                }
            });
        },
        changeTodo = e => {
            e.preventDefault();
            if (!putLoading) {
                const todoTime = new Date(selectedTime),
                    date = new Date(selectedDate);
                if (allDay) {
                    date.setHours(23);
                    date.setMinutes(59);
                } else {
                    date.setHours(todoTime.getHours());
                    date.setMinutes(todoTime.getMinutes());
                }
                put("/reminders", {
                    setLoading: true,
                    failedMsg: "updating this reminder",
                    body: {
                        ...values,
                        _id: currentTodo,
                        allDay,
                        date,
                    }
                });
            }
        },
        undo = (_id, key) => () => {
            const doneTodo = reminders.find(r => r._id === _id);
            post("/reminders", {
                failedMsg: "undoing this reminder",
                done() {
                    snackbar.close(key);
                    //dispatchEmit("/reminder/undo", doneTodo);
                    dispatch({
                        type: "/reminder/undo",
                        payload: doneTodo,
                    });
                }
            });
        },
        createTodo = e => {
            e.preventDefault();
            if (!postLoading) {
                const
                    todoTime = new Date(selectedTime),
                    date = new Date(selectedDate);
                if (allDay) {
                    date.setHours(23);
                    date.setMinutes(59);
                } else {
                    date.setHours(todoTime.getHours());
                    date.setMinutes(todoTime.getMinutes());
                }
                post("/reminders", {
                    failedMsg: "creating this reminder",
                    setLoading: true,
                    body: {
                        ...values,
                        desc: values.desc,
                        date,
                        allDay: allDay,
                    },
                    done: data => {
                        /*dispatchEmit("/reminder/create", {
                            ...values,
                            date,
                            allDay,
                            _id: data,
                        });*/
                        dispatch({
                            type: "/reminder/create",
                            payload: {
                                ...values,
                                date,
                                allDay,
                                _id: data,
                            }
                        });
                        close("newTodo")();
                        setValues({
                            desc: "",
                            name: "",
                            repeat: 0,
                        });
                    }
                });
            }
        },
        form = (create = true) => (
            <form onSubmit={dialogs.newTodo ? createTodo : changeTodo}>
                {!create && (
                    <DialogTitle id="alert-dialog-name">Edit reminder</DialogTitle>
                )}
                <DialogContent>
                    <TextField
                        onChange={handleChange("name")}
                        value={values.name}
                        variant="outlined"
                        label="Name"
                        autoFocus
                        fullWidth
                        style={{
                            marginBottom: 16,
                            marginTop: 8,
                        }}
                    />
                    <TextField
                        onChange={handleChange("desc")}
                        value={values.desc}
                        variant="outlined"
                        label="Description"
                        fullWidth
                        style={{
                            marginBottom: 16,
                        }}
                    />
                    <KeyboardDatePicker
                        clearable
                        value={selectedDate}
                        placeholder="10/10/2018"
                        onChange={date => handleDateChange(date)}
                        minDate={new Date()}
                        format="dd/MM/yyyy"
                        fullWidth
                        DialogProps={{
                            fullWidth: false,
                            maxWidth: "xs"
                        }}
                        disablePast
                        inputVariant="outlined"
                        label="Date"
                    />
                    <KeyboardTimePicker
                        label="Time"
                        placeholder="08:00"
                        mask="__:__"
                        value={selectedTime}
                        onChange={date => handleTimeChange(date)}
                        ampm={false}
                        style={{
                            marginTop: 16
                        }}
                        disabled={allDay}
                        fullWidth
                        inputVariant="outlined"
                    />
                    <FormControlLabel
                        style={{
                            marginTop: 16
                        }}
                        control={
                            <Switch
                                checked={allDay}
                                onChange={e => setAllDay(e.target.checked)}
                                value="All Day"
                                inputProps={{ "aria-label": "all day" }}
                            />
                        }
                        label="All Day"
                    />
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Repeat</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={values.repeat || 0}
                            onChange={handleChange("repeat")}
                        >
                            <MenuItem value={0}>Don't repeat</MenuItem>
                            <MenuItem value={1}>Daily</MenuItem>
                            <MenuItem value={2}>Weekly</MenuItem>
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={close(dialogs.newTodo ? "newTodo" : "edit")}>
                        Cancel
                    </Button>
                    <LoadBtn
                        loading={dialogs.newTodo ? postLoading : putLoading}
                        label={create ? "Create" : "Change"}
                        disabled={values.name === ""}
                    />
                </DialogActions>
            </form>
        ),
        filtered = reminders.filter(r => {
            switch (filter) {
                case 4:
                    return r.repeat === 0 && new Date().getTime() > new Date(r.date).getTime();
                case 1:
                    if (r.repeat == 1) {
                        return true;
                    }
                    if (r.repeat == 2) {
                        return new Date().getDay() === new Date(r.date).getDay()
                    }
                    return new Date().toLocaleDateString() === new Date(r.date).toLocaleDateString();
                case 3:
                    if (r.repeat == 1) {
                        return true;
                    }
                    if (r.repeat == 2) {
                        return true;
                    }
                    return compareWeek(new Date(), new Date(r.date));
                case 2:
                    if (r.repeat == 1) {
                        return true;
                    }
                    if (r.repeat == 2) {
                        const diff = new Date().getDay() - new Date(r.date).getDay()
                        return diff === -1 || diff === 6;
                    }
                    const d = new Date();
                    d.setDate(new Date().getDate() + 1)
                    return d.toLocaleDateString() === new Date(r.date).toLocaleDateString();
                default:
                    return true;
            }
        });
    useEffect(() => {
        dispatch({
            type: "/moreActions",
            payload: [/*{
                label: "Refresh",
                fn: () => request.get("/reminders", {
                    setLoading: true,
                    failedMsg: "refreshing your reminders",
                    done: data => dispatch({
                        type: "/reminders/upload",
                        payload: data,
                    })
                })
            }*/],
        });
    }, []);
    return (
        <>
            <Dialog
                open={dialogs.edit}
                onClose={close("edit")}
            >
                {form(false)}
            </Dialog>
            <ListView
                name="Reminder"
                filtered={filtered}
                tabs={["All", "Today", "Tomorrow", "This Week", "Late"]}
                height={160}
                filter={filter}
                setFilter={setFilter}
                createOpen={dialogs.newTodo}
                setCreateOpen={close("newTodo")}
                createFn={open("newTodo", null)}
                Actions={(r: IReminder) => {
                    const icons = [{
                        label: "Delete",
                        fn: () => confirm("delete this reminder?", deleteTodo(r._id)),
                        icon: <Icon path={mdiDelete} />,
                    }, {
                        label: "Edit",
                        fn: open("edit", r._id),
                        icon: <Icon path={mdiPencil} />,
                    }];
                    if (r.repeat === 0) {
                        icons.push({
                            label: "Done",
                            fn: todoDone(r._id),
                            icon: <Icon path={mdiCheck} />,
                        });
                    }
                    return icons;
                }}
                Item={r => (
                    <Box p={"8px"}>
                        <Typography
                            variant="h6"
                            //gutterBottom
                            style={{ overflow: "hidden", /*textTruncate: "ellipsis",*/ whiteSpace: "nowrap" }}
                            className={
                                r.repeat === 0 && new Date().getTime() > new Date(r.date).getTime()
                                    ? classes.late
                                    : null
                            }
                        >
                            {r.name}
                        </Typography>
                    <Typography className={classes.date}>
                        {new Date(r.date).toLocaleDateString() + " "}
                        {r.allDay
                            ? "All Day"
                            : new Date(r.date)
                                .toLocaleTimeString()
                                .split(":")
                                .slice(0, -1)
                                .join(":")}
                        {r.repeat === 0 && new Date().getTime() > new Date(r.date).getTime() && (
                            <span className={classes.late}>
                                {" "}
                                <Icon path={mdiClipboardAlert} style={{ marginBottom: -4 }} /> Late
                            </span>
                        )}
                    </Typography>
                    <Typography style={{ height: 36, overflow: "hidden", /*textTruncate: "ellipsis",*/ whiteSpace: "nowrap" }}>{r.desc}</Typography>
                    </Box>
                )}
                createForm={form(true)}
            />
            {ConfirmDialog}
        </>
    )
};
interface IReminder {
    desc: string;
    repeat: number;
    allDay: boolean;
    date: string;
    _id: string;
    name: string;
}