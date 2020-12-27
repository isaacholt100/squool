/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useDelete, usePost } from "../../hooks/useRequest";
import {
    Typography,
    Button,
    TextField,
    DialogActions,
    DialogContent,
    CardActionArea,
    CircularProgress
} from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import ListView from "../../components/ListView";
import { unique } from "../../lib/array";
import useConfirm from "../../hooks/useConfirm";
import Icon from "../../components/Icon";
import { mdiDelete } from "@mdi/js";
import LoadBtn from "../../components/LoadBtn";
import Link from "next/link";
import useRedirect from "../../hooks/useRedirect";
import IClass from "../../types/IClass";
import { RootState } from "../../redux/store";

export default function Class() {
    const
        dispatch = useDispatch(),
        [del, delLoading] = useDelete(),
        [post, postLoading] = usePost(),
        [ConfirmDialog, confirm] = useConfirm(delLoading),
        email = useSelector((s: RootState) => s.userInfo.email),
        role = useSelector((s: RootState) => s.userInfo.role),
        userClasses = useSelector((s: RootState) => s.classes),
        [createOpen, setCreateOpen] = useState(false),
        [name, setName] = useState(""),
        [options, setOptions] = useState(null),
        [teachers, setTeachers] = useState([]),
        [yearGroup, setYearGroup] = useState(""),
        [activeYear, setActiveYear] = useState(0),
        disabled = +yearGroup > 13 || +yearGroup < 1 || name === "",
        years = unique(userClasses.map(c => c.yearGroup)).sort().reverse(),
        filtered = userClasses.filter(c => c.yearGroup === years[activeYear]),
        createClass = e => {
            e.preventDefault();
            if (!disabled && !postLoading) {
                post("/classes", {
                    setLoading: true,
                    failedMsg: "creating the class",
                    body: {
                        name,
                        yearGroup,
                        teacher_ids: teachers,
                    },
                    done(data) {
                        /*dispatchEmit("/classes/create", {
                            name,
                            yearGroup,
                            //teacher_ids: teachers.map(t => t._id),
                            member_ids: teachers.map(t => t._id),
                            //member_ids: [],
                            _id: data,
                        });*/
                        dispatch({
                            type: "/classes/create",
                            payload: {
                                name,
                                yearGroup,
                                //teacher_ids: teachers.map(t => t._id),
                                member_ids: teachers.map(t => t._id),
                                //member_ids: [],
                                _id: data,
                            }
                        }); 
                        setCreateOpen(false);
                    }
                });
            }
        },
        deleteClass = (c: IClass) => () => {
            del("/classes", {
                setLoading: true,
                failedMsg: "deleting this class",
                body: {
                    class_id: c._id,
                    member_ids: c.member_ids,
                },
                done() {
                    /*dispatchEmit({
                        type: "/classes/delete",
                        payload: c._id,
                    });*/
                    dispatch({
                        type: "/classes/delete",
                        payload: c._id,
                    });
                }
            });
        },
        getSchoolTeachers = () => {
            
        };
    useEffect(() => {
        if (activeYear >= years.length && years.length > 0) {
            setActiveYear(Math.max(years.length - 1, 0));
        }
    }, [years.length]);
    const isLoggedIn = useRedirect();
    return !isLoggedIn ? null : (
        <>
            <ListView
                name="Class"
                height={104}
                filtered={filtered}
                tabs={years.map(y => "Year " + y)}
                filter={activeYear}
                setFilter={setActiveYear}
                createOpen={createOpen}
                setCreateOpen={setCreateOpen}
                noCreate={role === "student"}
                createFn={() => {
                    getSchoolTeachers();
                    setCreateOpen(true);
                }}
                Actions={(c: IClass) => [{
                    label: "Delete",
                    fn: () => confirm("delete this class?", deleteClass(c)),
                    icon: <Icon path={mdiDelete} />
                }]}
                Item={c => (
                    <Link href={`/classes/${c._id}`}>
                        <CardActionArea className={"p_8 full_height"}>
                            <div className="full_height">
                                <Typography variant="h6" gutterBottom>
                                    {c.name}
                                </Typography>
                            </div>
                        </CardActionArea>
                    </Link>
                )}
                createForm={(
                    <form onSubmit={createClass}>
                        <DialogContent>
                            <TextField
                                id="outlined-name"
                                label="Name"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                margin="normal"
                                variant="outlined"
                                style={{ width: "calc(100% - 128px)" }}
                                autoFocus
                            />
                            <TextField
                                id="outlined-name"
                                label="Year"
                                value={yearGroup}
                                onChange={e => setYearGroup(e.target.value)}
                                margin="normal"
                                variant="outlined"
                                type="number"
                                style={{ width: 120, marginLeft: 8 }}
                                error={yearGroup !== "" && (+yearGroup > 13 || +yearGroup < 1)}
                                inputProps={{
                                    min: "1",
                                    max: "13"
                                }}
                            />
                            <Autocomplete
                                options={options || []}
                                value={teachers}
                                multiple
                                loading={options === null}
                                filterSelectedOptions
                                renderInput={params => (
                                    <TextField
                                        {...params}
                                        label="Other teachers"
                                        margin="normal"
                                        fullWidth
                                        variant="outlined"
                                        InputProps={{
                                            ...params.InputProps,
                                            endAdornment: (
                                                <>
                                                    {options === null ? <CircularProgress color="inherit" size={20} /> : null}
                                                    {params.InputProps.endAdornment}
                                                </>
                                            ),
                                        }}
                                    />
                                )}
                                onChange={(e, newVal) => setTeachers(newVal)}
                                getOptionLabel={option => option.email}
                                filterOptions={(a, { inputValue }) => a.filter(x => (x.name.includes(inputValue) || x.email.includes(inputValue)) && x.email !== email)}
                                renderOption={option => option.name + " - " + option.email}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button
                                onClick={() => setCreateOpen(false)}
                                color="default"
                                disabled={postLoading}
                            >
                                cancel
                            </Button>
                            <LoadBtn
                                disabled={disabled}
                                label="Create"
                                loading={postLoading}
                            />
                        </DialogActions>
                    </form>
                )}
            />
            {ConfirmDialog}
        </>
    );
};