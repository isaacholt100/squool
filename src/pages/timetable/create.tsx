/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import { usePost } from "../../hooks/useRequest";
import { KeyboardTimePicker } from "@material-ui/pickers";
import { makeStyles } from "@material-ui/core/styles";
import Timetable from "../../components/Timetable";
import defaultTimetable from "../../json/defaultTimetable.json";

import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField, Switch, FormControlLabel } from "@material-ui/core";
import { useRouter } from "next/router";
import Head from "next/head";
import LoadBtn from "../../components/LoadBtn";
import useRedirect from "../../hooks/useRedirect";
import { defaultRedirect } from "../../lib/serverRedirect";

const
    useStyles = makeStyles(theme => ({
        add: {
            width:  160,
            margin: 8,
            borderRadius: 16,
            "&:focus, &:active": {
                boxShadow: "none"
            },
            [theme.breakpoints.down("md")]: {
                margin: 0,
                border: `1px solid ${theme.palette.primary.contrastText}`,
                borderRadius: "0px !important"
            },
        },
        switch: {
            color: theme.palette.text.primary,
            marginLeft: 2,
        }
    }));

export default function TimetableCreate() {
    const
        [post, loading] = usePost(),
        router = useRouter(),
        classes = useStyles(),
        [timetable, setTimetable] = useState(defaultTimetable),
        [timetableName, changeTimetableName] = useState(""),
        [dialogOpen, setDialogOpen] = useState(false),
        [periodEdited, setPeriodEdited] = useState(null),
        [periodStartTime, setPeriodStartTime] = useState(new Date()),
        [periodEndTime, setPeriodEndTime] = useState(new Date()),
        [sat, setSat] = useState(false),
        closeDialog = () => {
            setDialogOpen(false)
            setPeriodEdited(null)
        },
        timeValid = date => date.search(/^\d{2}:\d{2}$/) !== -1,
        createTimetable = e => {
            e.preventDefault();
            if (timetableName !== "" && timetable.periods.length !== 0 && timetableName.length < 45) {
                post("/timetables", {
                    setLoading: true,
                    failedMsg: "updating your timetable",
                    body: {
                        name: timetableName,
                        periods: timetable.periods,
                        sat,
                    },
                    done() {
                        router.push("/timetable/list");
                    }
                });
            }
        },
        deletePeriod = i => {
            let newTimetable = timetable;
            newTimetable.periods.splice(i, 1);
            newTimetable.lessons.forEach((item, index) => {
                newTimetable.lessons[index].splice(i, 1);
            });
            setTimetable(newTimetable);
        },
        editPeriod = (index, time) => {
            setDialogOpen(true);
            setPeriodStartTime(new Date("2014-08-18T" + time.split(" - ", 2)[0]));
            setPeriodEndTime(new Date("2014-08-18T" + time.split(" - ", 2)[1]));
            setPeriodEdited(index);
        },
        addPeriod = () => {
            const 
                startTime = ("0" + periodStartTime.getHours()).slice(-2) + ":" + ("0" + periodStartTime.getMinutes()).slice(-2),
                endTime = ("0" + periodEndTime.getHours()).slice(-2) + ":" + ("0" + periodEndTime.getMinutes()).slice(-2);
            if (timeValid(startTime) && timeValid(endTime) && periodStartTime.getTime() < periodEndTime.getTime()) {
                let newTimetable = timetable;
                if (periodEdited !== null) {
                    newTimetable.periods[periodEdited] = startTime + " - " + endTime;
                } else {
                    newTimetable.periods.push(startTime + " - " + endTime)
                    newTimetable.lessons.forEach((item, i) => {
                        newTimetable.lessons[i].push({
                            s: "[Subject]",
                            t: "[Teacher]",
                            r: "[Room]",
                        });
                    });
                }
                setTimetable(newTimetable);
                closeDialog();
            }
        };
    const isLoggedIn = useRedirect();
    return !isLoggedIn ? null : (
        <div>
            <Head>
                <title>Create Timetable</title>
            </Head>
            <form className="flex align_items_center" onSubmit={createTimetable}>
                <TextField
                    id="school"
                    label="Timetable name"
                    style={{flex: 1,}}
                    value={timetableName}
                    onChange={e => changeTimetableName(e.target.value)}
                    margin="dense"
                    variant="outlined"
                />
                <LoadBtn label="Create" color="secondary" disabled={timetableName === "" || timetable.periods.length === 0 || timetableName.length >= 45} style={{margin: "8px 0 4px 8px",}} loading={loading} />
            </form>
            <FormControlLabel
                control={
                    <Switch
                        checked={sat}
                        onChange={e => {
                            setSat(e.target.checked);
                            setTimetable({
                                ...timetable,
                                lessons: e.target.checked
                                    ? [...timetable.lessons, []]
                                    : timetable.lessons.filter((x, i) => i < 5)
                            })
                        }}
                        value="checked"
                    />
                }
                className={classes.switch}
                label="Saturday"
            />
            <Timetable
                type="create"
                editPeriod={editPeriod}
                deletePeriod={deletePeriod}
                timetable={timetable}
                noPadding
            />
            <Button
                onClick={() => setDialogOpen(true)}
                className={classes.add}
                variant="contained"
                color="secondary"
            >
                Add Period
            </Button>
            <Dialog
                open={dialogOpen}
                onClose={closeDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    Set the time interval for the new period
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={1}>
                        <Grid 
                            item
                            xs={12}
                            sm={6}
                        >
                            <KeyboardTimePicker
                                margin="normal"
                                ampm={false}
                                label="Start time"
                                value={periodStartTime}
                                onChange={setPeriodStartTime}
                                KeyboardButtonProps={{
                                    "aria-label": "change start time",
                                }}
                                fullWidth
                                inputVariant="outlined"
                            />
                        </Grid>
                        <Grid 
                            item
                            xs={12}
                            sm={6}
                        >
                            <KeyboardTimePicker
                                margin="normal"
                                ampm={false}
                                label="End time"
                                mask="__:__"
                                value={periodEndTime}
                                onChange={setPeriodEndTime}
                                KeyboardButtonProps={{
                                    "aria-label": "change end time",
                                }}
                                inputVariant="outlined"
                                fullWidth
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDialog}>Cancel</Button>
                    <Button onClick={addPeriod} color="primary" autoFocus disabled={new Date(periodStartTime).getTime() >= new Date(periodEndTime).getTime()}>
                        Add
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
export const getServerSideProps = defaultRedirect;