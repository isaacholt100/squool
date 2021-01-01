/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useDelete, usePost, usePut } from "../../hooks/useRequest";
import {
    Typography,
    Button,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    CardActionArea,
    InputLabel,
    MenuItem,
    FormControl,
    Select,
    Box
} from "@material-ui/core";
import LoadBtn from "../../components/LoadBtn";
import ListView from "../../components/ListView";
//import { dispatchEmit } from "../../api/socketDispatch";
import { unique } from "../../lib/array";
import useConfirm from "../../hooks/useConfirm";
import { mdiDelete, mdiLink, mdiLinkOff } from "@mdi/js";
import Icon from "../../components/Icon";
import { useRouter } from "next/router";
import Link from "next/link";
import useRedirect from "../../hooks/useRedirect";
import IBook from "../../types/IBook";
import useUserInfo from "../../hooks/useUserInfo";
import useClasses from "../../hooks/useClasses";
import useBooks from "../../hooks/useBooks";
import { defaultRedirect } from "../../lib/serverRedirect";

export default function Books() {
    const
        isLoggedIn = useRedirect(),
        [post, postLoading] = usePost(),
        [del, deleteLoading] = useDelete(),
        [put, putLoading] = usePut(),
        [ConfirmDialog, confirm, closeConfirm] = useConfirm(deleteLoading),
        router = useRouter(),
        { role } = useUserInfo(),
        userClasses = useClasses(),
        [state, setState] = useState({
            nameError: "",
            name: "",
            classNameError: "",
            className: "",
            linkOpen: false,
            currentBook: "",
            classLink: "",
        }),
        [activePeriod, setActivePeriod] = useState(0),
        [createOpen, setCreateOpen] = useState(false),
        dispatch = useDispatch(),
        books = useBooks(),
        periods = unique(books.map(b => b.period)).sort().reverse(),
        filtered = books && books.filter(book => book.period === periods[activePeriod]),
        openDialog = (dialog, book_id) => {
            setState({
                ...state,
                [dialog]: true,
                currentBook: book_id,
            });
        },
        close = dialog => {
            setState({
                ...state,
                [dialog]: false,
                className: "",
                classNameError: "",
            });
        },
        createBook = () => {
            if (!books.some(x => x.name === state.name)) {
                post("/books", {
                    setLoading: true,
                    failedMsg: "creating this book",
                    body: {
                        name: state.name,
                        class_id: state.className === "" ? state.classLink : state.className,
                    },
                    done(data: any) {
                        /*dispatchEmit("/book/create", {
                            _id: data.book_id,
                            name: state.name,
                            class_id: state.className === "" ? state.classLink : state.className,
                            period: data.period,
                        });*/
                        dispatch({
                            type: "/book/create",
                            payload: {
                                _id: data.book_id,
                                name: state.name,
                                class_id: state.className === "" ? state.classLink : state.className,
                                period: data.period,
                            },
                        });
                        router.push(`/book/${data.book_id}/edit`);
                    },
                    errors(data: any) {
                        setState({
                            ...state,
                            ...data.errors,
                        });
                    },
                });
            } else {
                setState({
                    ...state,
                    nameError: "You already have a book with this name",
                });
            }
        },
        handleChange = name => event => {
            let errors = {};
            if (name === "name") {
                if (event.target.value.length < 3) {
                    errors = {
                        nameError: "Book name must be at least 3 characters",
                    };
                } else {
                    errors ={
                        ...state,
                        nameError: "",
                    };
                }
            }
            setState({
                ...state,
                ...errors,
                [name]: event.target.value
            });
        },
        submit = e => {
            e.preventDefault(); 
            if (state.classLink === "" && userClasses.some(a => a._id === state.classLink)) {
                setState({
                    ...state,
                    classNameError: "There is already a book linked with this class",
                });
            } else if (userClasses.some(a => a._id === state.className)) {
                setState({
                    ...state,
                    classNameError: "You're already in this class",
                });
            } else if (state.nameError === "" && state.classNameError === "") {
                createBook();
            } else {
                setState({
                    ...state,
                    nameError: "Book name must be at least 3 characters",
                });
            }
        },
        deleteBook = book_id => () => {
            del("/books", {
                setLoading: true,
                doneMsg: "Book deleted",
                body: { book_id },
                done() {
                    closeConfirm();
                    dispatch({
                        type: "/book/delete",
                        payload: book_id,
                    });
                    //dispatchEmit("/book/delete", book_id);
                },
            });
        },
        changeClass = e => {
            setState({
                ...state,
                classLink: e.target.value,
            });
        },
        linkClass = e => {
            e.preventDefault();
            if ((state.className !== "" || state.classLink !== "") && !putLoading) {
                const
                    _id = state.currentBook,
                    class_id = state.className === "" ? state.classLink : state.className;
                put("/books/class", {
                    setLoading: true,
                    body: {
                        class_id,
                        book_id: _id,
                    },
                    doneMsg: "Book linked to class",
                    failedMsg: "linking this book",
                    done(data) {
                        /*dispatchEmit("/book/update", {
                            _id,
                            class_id,
                        });*/
                        close("linkOpen");
                    },
                    errors: (data: any) => setState({
                        ...state,
                        ...data.errors,
                    })
                });
            }
        },
        unlinkBook = _id => () => {
            del("/books/class", {
                doneMsg: "Book unlinked from class",
                body: { book_id: _id },
                failedMsg: "unlinking this book",
                done() {
                    closeConfirm();
                    /*dispatchEmit("/book/update", {
                        _id,
                        class_id: "",
                    });*/
                },
            });
        },
        classPicker = (
            <FormControl 
                fullWidth 
                disabled={state.className !== ""}
                variant="outlined"
            >
                <InputLabel>Class</InputLabel>
                <Select
                    value={state.classLink}
                    onChange={changeClass}
                    labelWidth={40}
                >
                    {userClasses.map(item => (
                        <MenuItem
                            value={item._id}
                            key={item._id}
                        >
                            {item.name}
                        </MenuItem>
                    ))}
                    <MenuItem value="">
                        None
                    </MenuItem>
                </Select>
            </FormControl>
        );
    useEffect(() => {
        /*dispatch({
            type: "/moreActions",
            payload: [{
                label: "Refresh",
                fn: getBooks,
            }],
        });*/
        if (role !== "student") {
            //router.replace("/classes");
        }
    }, []);
    useEffect(() => {
        if (activePeriod >= periods.length && periods.length > 0) {
            setActivePeriod(Math.max(periods.length - 1, 0));
        }
    }, [periods.length]);
    return !isLoggedIn ? null : (
        <>
            <ListView
                name="Book"
                filtered={filtered}
                tabs={periods}
                height={104}
                filter={activePeriod}
                setFilter={f => setActivePeriod(f)}
                createOpen={createOpen}
                setCreateOpen={o => setCreateOpen(o)}
                createFn={() => setCreateOpen(true)}
                Actions={(book: IBook) => [{
                    label: "Delete",
                    fn: () => confirm("delete this book?", deleteBook(book._id)),
                    icon: <Icon path={mdiDelete} />,
                }, {
                    label: !book.class_id ? "Link" : "Unlink",
                    fn: () => !book.class_id ? openDialog("linkOpen", book._id) : confirm("unlink this book?", unlinkBook(book._id)),
                    icon: !book.class_id ? <Icon path={mdiLink} /> : <Icon path={mdiLinkOff} />,
                }]}
                Item={book => (
                    <Link href={`/book/${book._id}/edit`}>
                        <CardActionArea className={"p_8 full_height"}>
                            <div className="full_height">
                                <Typography variant="h6">
                                    {book.name}
                                </Typography>
                            </div>
                        </CardActionArea>
                    </Link>
                )}
                createForm={(
                    <form onSubmit={submit}>
                        <DialogContent>
                            <Box mb={1}>
                                <TextField
                                    autoFocus
                                    id="name"
                                    label="Book name"
                                    fullWidth
                                    helperText={state.nameError + " "}
                                    error={state.nameError !== ""}
                                    value={state.name}
                                    onChange={handleChange("name")}
                                    autoComplete="off"
                                    variant="outlined"
                                />
                            </Box>
                            {classPicker}
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setCreateOpen(false)} color="default">
                                Cancel
                            </Button>
                            <LoadBtn label="Create" disabled={state.nameError !== "" || state.name === ""} loading={postLoading} />
                        </DialogActions>
                    </form>
                )}
            />
            <Dialog
                open={state.linkOpen}
                onClose={() => close("linkOpen")}
                aria-labelledby="form-dialog-title"
            >
                <form onSubmit={linkClass}>
                    <DialogTitle id="form-dialog-title">Link class</DialogTitle>
                        <DialogContent>
                            {classPicker}
                        </DialogContent>
                        <DialogActions>
                        <Button onClick={() => setState({ ...state, linkOpen: false })} color="default">
                            Cancel
                        </Button>
                        <LoadBtn label="Link" disabled={state.className === "" && state.classLink === ""} loading={putLoading} />
                    </DialogActions>
                </form>
            </Dialog>
            {ConfirmDialog}
        </>
    );
};
export const getServerSideProps = defaultRedirect;