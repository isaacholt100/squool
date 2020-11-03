/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
import useSnackbar from "../../hooks/useSnackbar";
import { mdiDelete, mdiLink, mdiLinkOff } from "@mdi/js";
import Icon from "../../components/Icon";
import { useRouter } from "next/router";
import Link from "next/link";
import { ObjectId } from "mongodb";

export default () => {
    const
        [post, postLoading] = usePost(),
        [del, deleteLoading] = useDelete(),
        [put, putLoading] = usePut(),
        [ConfirmDialog, confirm, closeConfirm] = useConfirm(deleteLoading),
        snackbar = useSnackbar(),
        router = useRouter(),
        role = useSelector((s: any) => s.userInfo.role),
        userClasses = useSelector((s: any) => s.userClasses),
        [state, setState] = useState({
            open: false,
            nameError: "",
            name: "",
            className: "",
            loaded: false,
            linkOpen: false,
            unlinkOpen: false,
            deleteOpen: false,
            currentBook: "",
            snackbarOpen: false,
            classLink: "",
            classNameError: "",
            activePeriod: 0,
            nameValid: false,
        }),
        books = useSelector(s => (s as any).books),
        periods = unique(books.map(b => b.period)).sort().reverse(),
        filtered = books && books.filter(book => book.period === periods[state.activePeriod]),
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
        closeDialog = () => {
            setState({
                ...state,
                open: false,
                nameValid: false,
                nameError: "",
                name: "",
                className: "",
                classNameError: "",
                classLink: "",
                linkOpen: false,
            });
        },
        createBook = () => {
            if (!books.some(x => x.name === state.name)) {
                post("/book", {
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
                        closeDialog();
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
            if (state.classLink === "" && userClasses.some(a => a.classid === state.classLink)) {
                setState({
                    ...state,
                    classNameError: "There is already a book linked with this class",
                });
            } else if (userClasses.some(a => a.classid === state.className)) {
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
            del("/book", {
                setLoading: true,
                doneMsg: "Book deleted",
                body: { book_id },
                done() {
                    closeConfirm();
                    //dispatchEmit("/book/delete", book_id);
                    setState({
                        ...state,
                        deleteOpen: false,
                    });
                },
            });
            /*request("/book", "DELETE", true, () => {
                dispatchEmit("/book/delete", book_id);
                setState({
                    ...state,
                    deleteOpen: false,
                });
                showSnackbar("Book deleted", {
                    variant: "info",
                });
            }, "deleting this book", {
                book_id,
            });*/
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
                put("/book/class", {
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
                        snackbar.info("Book linked to class");
                    },
                    errors: (data: any) => setState({
                        ...state,
                        ...data.errors,
                    })
                });
            }
        },
        unlinkBook = _id => () => {
            del("/book/class", {
                doneMsg: "Book unlinked from class",
                body: { book_id: _id },
                failedMsg: "unlinking this book",
                done() {
                    closeConfirm();
                    setState({
                        ...state,
                        unlinkOpen: false,
                    });
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
                            value={item.classid}
                            key={item.classid}
                        >
                            {item.name}
                        </MenuItem>
                    ))}
                    <MenuItem value="">
                        None
                    </MenuItem>
                </Select>
            </FormControl>
        ),
        getBooks = () => {
            /*request.get("/books", {
                setLoading: true,
                failedMsg: "loading your books",
                done: data => dispatch({
                    type: "UPLOAD_BOOKS",
                    payload: data,
                }),
            });*/
        };
    useEffect(() => {
        /*dispatch({
            type: "/moreActions",
            payload: [{
                label: "Refresh",
                fn: getBooks,
            }],
        });*/
        console.log(role);
        
        if (role !== "student") {
            //router.replace("/classes");
        }
    }, []);
    useEffect(() => {
        if (state.activePeriod >= periods.length && periods.length > 0) {
            setState({
                ...state,
                activePeriod: Math.max(periods.length - 1, 0),
            });
        }
    }, [periods.length]);
    return (
        <>
            <ListView
                name="Book"
                filtered={filtered}
                tabs={periods}
                height={104}
                filter={state.activePeriod}
                setFilter={f => setState({ ...state, activePeriod: f })}
                createOpen={state.open}
                setCreateOpen={o => setState({ ...state, open: o })}
                createFn={() => setState({ ...state, open: true })}
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
                            <Typography variant="h6">
                                {book.name}
                            </Typography>
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
                            <Button onClick={() => setState({ ...state, open: false })} color="default">
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
interface IBook {
    _id: ObjectId;
    name: string;
    class_id: ObjectId;
}