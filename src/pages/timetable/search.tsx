/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, forwardRef, useEffect } from "react";
import { useGet, usePost } from "../../hooks/useRequest";
import { makeStyles } from "@material-ui/core/styles";
import match from "autosuggest-highlight/match";
import parse from "autosuggest-highlight/parse";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Timetable from "../../components/Timetable";
import Loader from "../../components/Loader";
import {
    Button,
    Typography,
    TextField,
    Dialog,
    AppBar,
    Toolbar,
    IconButton,
    Slide,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Card,
    Box,
    Tooltip,
} from "@material-ui/core";
import useConfirm from "../../hooks/useConfirm";
import useTitle from "../../hooks/useTitle";
import Icon from "../../components/Icon";
import { mdiClose } from "@mdi/js";
import { useRouter } from "next/router";
import { TransitionProps } from "@material-ui/core/transitions";
import { dispatch } from "../../redux/store";
import Head from "next/head";

const
    useStyles = makeStyles(theme => ({
        highlight: {
            color: theme.palette.primary.main,
            fontWeight: "bold",
        },
        noOptions: {
            borderRadius: 16,
            border: `2px solid ${theme.palette.divider}`,
            margin: 0,
            marginTop: 8,
            color: theme.palette.text.hint,
            "&:hover": {
                backgroundColor: "initial",
            },
        },
        appBar: {
            position: "relative",
            backgroundColor: theme.palette.background.default,
            color: theme.palette.text.primary,
            borderBottom: `4px solid ${theme.palette.primary.main}`,
            boxShadow: "none",
            borderRadius: 0,
            paddingLeft: 4,
            paddingRight: 4,
        },
        title: {
            marginLeft: 8,
            flex: 1,
        },
        dialog: {
            "& > div > div": {
                backgroundColor: theme.palette.background.default,
            },
            overflow: "hidden",
        },
        iconBtn: {
            backgroundColor: theme.palette.background.paper,
        },
        autoComplete: {
            position: "relative",
            maxHeight: 240,
            "& ul": {
                maxHeight: 240,
            },
            borderRadius: 8,
            border: `2px solid gray`,
            margin: 0,
            marginTop: 8,
        },
    })),
    Transition = forwardRef((props: TransitionProps & { children?: React.ReactElement }, ref: React.Ref<unknown>) => <Slide direction="up" ref={ref} {...props} />);
export default function TimetableSearch() {
    const
        [post, loading] = usePost(),
        [get] = useGet(),
        [ConfirmDialog, confirm] = useConfirm(loading),
        classes = useStyles(),
        router = useRouter(),
        [val, setVal] = useState(""),
        [open, setOpen] = useState(false),
        [confirmOpen, setConfirmOpen] = useState(false),
        [preview, setPreview] = useState(null),
        [options, setOptions] = useState([]),
        handleChange = e => {
            setVal(e.target.value);
            if (e.target.value !== "") {
                get(`/timetables?val=${e.target.value.trim()}`, {
                    failedMsg: "loading the timetable suggestions",
                    done: setOptions,
                });
            } else {
                setOptions([]);
            }
        },
        handleOpen = table => () => {
            const parsed = JSON.parse(table.periods);
            setPreview({
                periods: parsed,
                sat: table.sat,
            });
            setOpen(true);
        },
        handleClose = () => {
            setOpen(false);
        },
        fillTable = (sat, periods) => [...Array(sat ? 6 : 5).keys()].map(() => (
            [...Array(periods.length).keys()].map(() => ({
                s: "",
                t: "",
                r: ""
            }))
        )),
        chooseTemplate = () => {
            post("/timetable", {
                setLoading: true,
                failedMsg: "updating your timetable template",
                body: {
                    periods: preview.periods,
                    lessons: fillTable(preview.sat, preview.periods),
                },
                done() {
                    /*dispatchEmit("/timetable/upload", {
                        periods: preview.periods,
                        lessons: fillTable(preview.sat, preview.periods),
                    });*/
                    dispatch({
                        type: "/timetable/upload",
                        payload: {
                            periods: preview.periods,
                            lessons: fillTable(preview.sat, preview.periods),
                        }
                    });
                    router.push("/timetable");
                }
            });
            /*request("/timetable/choose", "PUT", true, () => {
                dispatchEmit("/timetable/upload", {
                    periods: preview.periods,
                    lessons: fillTable(preview.sat, preview.periods),
                });
                history.push("/timetable");
            }, "updating your timetable template", {
                periods: preview.periods,
                lessons: fillTable(preview.sat, preview.periods),
            });*/
        };
    return (
        <>
            <Head>
                <title>Search Timetables</title>
            </Head>
            <div>
                <Card>
                    <Typography variant="h6" gutterBottom>Search timetable templates</Typography>
                    <Autocomplete
                        value={val}
                        onChange={(e, newValue) => setVal(newValue)}
                        classes={{
                            paper: classes.autoComplete,
                        }}
                        //disableOpenOnFocus
                        options={options.map(x => x.name)}
                        renderInput={params => (
                            <TextField
                                {...params}
                                label="Search your school name"
                                margin="normal"
                                fullWidth
                                variant="outlined"
                                onChange={handleChange}
                            />
                        )}
                        renderOption={(option, { inputValue }) => {
                            const
                                matches = match(option, inputValue),
                                parts = parse(option, matches);
                            return (
                                <div style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
                                    <div>
                                        {parts.map((part, index) => (
                                            <span key={index} className={part.highlight ? classes.highlight : undefined}>
                                                {part.text}
                                            </span>
                                        ))}
                                    </div>
                                    <Button
                                        color="secondary"
                                        onClick={handleOpen(options[options.findIndex(x => x.name === option)])}
                                        style={{marginLeft: "auto"}}
                                    >
                                        Preview
                                    </Button>
                                </div>
                            );
                        }}
                    />
                    <Dialog
                        open={confirmOpen}
                        onClose={() => setConfirmOpen(false)}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogTitle id="alert-dialog-title">Override existing timetable?</DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                You already have a timetable template. Choosing this one will mean you have to
                                re-enter your subjects.
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setConfirmOpen(false)} color="primary">
                                Cancel
                            </Button>
                            <Button onClick={chooseTemplate} color="primary" autoFocus>
                                Change
                            </Button>
                        </DialogActions>
                    </Dialog>
                    <Dialog
                        fullScreen
                        open={open}
                        onClose={handleClose}
                        TransitionComponent={Transition}
                        className={classes.dialog}
                    >
                        <AppBar className={classes.appBar}>
                            <Box component={Toolbar} pl={"0px !important"} pr="4px !important">
                                <Tooltip title="Close">
                                    <IconButton
                                        onClick={handleClose}
                                        aria-label="close"
                                        className={classes.iconBtn}
                                    >
                                        <Icon path={mdiClose} />
                                    </IconButton>
                                </Tooltip>
                                <Typography
                                    variant="h6"
                                    className={classes.title}
                                >
                                    Timetable preview
                                </Typography>
                                <Button
                                    color="primary"
                                    onClick={() => confirm("override your existing timetable template? Data from your current one can't be transferred to a new one.", chooseTemplate)}
                                >
                                    choose
                                </Button>
                            </Box>
                        </AppBar>
                        {preview ?
                            <Timetable
                                mode="view"
                                timetable={{
                                    periods: preview.periods,
                                    lessons: fillTable(preview.sat, preview.periods),
                                }}
                            />
                            : <Loader />
                        }
                    </Dialog>
                </Card>
            </div>
            {ConfirmDialog}
        </>
    );
};