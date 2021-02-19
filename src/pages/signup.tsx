/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, ChangeEvent } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch } from "react-redux";
import { startCase } from "lodash";
import {
    Typography,
    Button,
    FormControlLabel,
    Checkbox,
    FormGroup,
    TextField,
    Radio,
    RadioGroup,
    Divider,
    Box,
    Card,
    Link as ButtonLink,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from "@material-ui/core";
import LoadBtn from "../components/LoadBtn";
import { usePost } from "../hooks/useRequest";
import Link from "next/link";
import jwtCookies from "../lib/jwtCookies";
import useAuthRedirect from "../hooks/useAuthRedirect";
import { useRouter } from "next/router";
import isEmailValid from "../lib/isEmailValid";
import Title from "../components/Title";
import BtnLink from "../components/BtnLink";

interface IFields {
    firstName: string;
    lastName: string;
    email: string;
    schoolID: string;
    password: string;
    repeatPassword: string;
}

const
    initialValues: IFields = {
        firstName: "",
        lastName: "",
        email: "",
        schoolID: "",
        password: "",
        repeatPassword: "",
    },
    useStyles = makeStyles({
        firstName: {
            width: "calc(50% - 4px)",
            textTransform: "capitalize"
        },
        lastName: {
            width: "calc(50% - 4px)",
            marginLeft: 8,
            textTransform: "capitalize"
        },
        password: {
            width: "calc(50% - 4px)",
        },
        repeatPassword: {
            width: "calc(50% - 4px)",
            marginLeft: 8,
        },
    });
export default function Signup() {
    const
        [post, loading] = usePost(),
        //socket = useSocket(),
        //title = useTitle(),
        router = useRouter(),
        [values, setValues] = useState(initialValues),
        [helpers, setHelpers] = useState(initialValues),
        [role, setRole] = useState("student"),
        [staySignedIn, setStaySignedIn] = useState(true),
        dispatch = useDispatch(),
        classes = useStyles(),
        autoCompleteNames = {
            firstName: role === "student" ? "given-name" : "honorific-prefix",
            lastName: "family-name",
            email: "email",
            schoolID: "on",
            password: "new-password",
            repeatPassword: "new-password",
        },
        //history = useHistory(),
        signup = (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            const email = values.email.trim().toLocaleLowerCase();
            const schoolID = values.schoolID.trim();
            const firstName = values.firstName.trim();
            const lastName = values.lastName.trim();
            post("/user", {
                setLoading: true,
                failedMsg:  "signing you up",
                body: {
                    email,
                    firstName,
                    lastName,
                    schoolID,
                    password: values.password,
                    repeatPassword: values.repeatPassword,
                    role,
                    staySignedIn,
                },
                done: (data: any) => {
                    setIsRedirecting(true);
                    jwtCookies({
                        accessToken: data.accessToken,
                        refreshToken: data.refreshToken,
                        staySignedIn,
                        userInfo: {
                            user_id: data.user_id,
                            role,
                            firstName,
                            lastName,
                            icon: "",
                            email,
                            ...(schoolID ? {
                                school_id: schoolID,
                            } : {}),
                            carouselView: false,
                        },
                    });
                    router.replace("/home");
                    dispatch({
                        type: "/user/info/update",
                        payload: {
                            email,
                            name: values.firstName + " " + values.lastName,
                            role,
                            user_id: data.user_id,
                        },
                    });
                    //socket.connect(`http://${serverUrl.split(":5000")[0]}`);
                },
                errors: data => setHelpers({
                    ...helpers,
                    ...data.errors as object,
                })
            });
        },
        handleClear = () => {
            setHelpers(initialValues);
            setValues(initialValues);
        },
        handleChange = (field: keyof(IFields)) => (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
            let newState = {};
            const { value } = e.target;
            setValues({
                ...values,
                [field]: value,
            });
            if (!field.includes("assword") ? value.trim() === "" : value === "") {
                newState = {
                    [field]: "Field required",
                };
            } else {
                newState = {
                    [field]: "",
                };
            }
            if (field === "repeatPassword") {
                if (value.length === 0) {
                    newState = {
                        repeatPassword: "",
                    };
                } else if (value !== values.password) {
                    newState = {
                        repeatPassword: "Passwords must match",
                    };
                }
            } else if (field === "password") {
                if (value.length < 6) {
                    newState = {
                        password: "Password must at least 6 characters",
                    };
                }
                if (values.repeatPassword.length === 0) {
                    newState = {
                        ...newState,
                        repeatPassword: "",
                    };
                } else if (values.repeatPassword !== value) {
                    newState = {
                        ...newState,
                        repeatPassword: "Passwords must match",
                    };
                }
            } else if (field === "schoolID") {
                if (isOwner && value.trim() === "") {
                    newState = {
                        schoolID: "Please enter your school name",
                    };
                } else {
                    newState = {
                        schoolID: "",
                    };
                }
            } else if (field === "email") {
                if (!isEmailValid(value)) {
                    newState = {
                        email: "Email address invalid",
                    };
                }
            } else if (field === "firstName" || field === "lastName") {
                setValues({
                    ...values,
                    [field]: value
                        .toLowerCase()
                        .split(" ")
                        .map(s => s.charAt(0).toUpperCase() + s.substring(1))
                        .join(" "),
                });
            }
            setHelpers({
                ...helpers,
                ...newState,
            });
        },
        changeRole = (e: ChangeEvent<{ value: string }>) => {
            if (values.schoolID === "" && helpers.schoolID !== "") {
                setHelpers({
                    ...helpers,
                    schoolID: "",
                });
            }
            setRole(e.target.value);
        },
        isOwner = role === "owner",
        disabled =
            helpers.email !== "" ||
            helpers.password !== "" ||
            helpers.repeatPassword !== "" ||
            helpers.firstName !== "" ||
            helpers.lastName !== "" ||
            (isOwner && helpers.schoolID !== "") ||
            values.email === "" ||
            values.password === "" ||
            values.repeatPassword === "" ||
            values.firstName === "" ||
            values.lastName === "" ||
            (isOwner && values.schoolID === ""),
        [isLoggedIn, setIsRedirecting] = useAuthRedirect();
    useEffect(() => {
        const id = window.location.search.split("id=")[1]?.split("&")[0];
        if (id) {
            setValues({
                ...values,
                schoolID: id + "",
            });
        }
    }, []);
    return (
        <>
            <Title title="Sign Up" />
            {isLoggedIn ? null : (
                <>
                    <div>
                        <Box maxWidth={600} /*className={effects.fadeup}*/ mx="auto" component={Card}>
                            <Typography variant="h5" gutterBottom>
                                Sign up to{" "}
                                <BtnLink href="/" variant="h5" label="Squool" />
                            </Typography>
                            <form noValidate onSubmit={signup}>
                                <Box clone mb={"24px !important"} mt="6px">
                                    <FormControl variant="outlined" fullWidth>
                                        <InputLabel id="account-type-label">
                                            Account Type
                                        </InputLabel>
                                        <Select
                                            labelId="account-type-label"
                                            id="account-type-select"
                                            value={role}
                                            onChange={changeRole}
                                            label="Account Type"
                                        >
                                            <MenuItem value="student">Student</MenuItem>
                                            <MenuItem value="teacher">Teacher</MenuItem>
                                            <MenuItem value="admin">Admin</MenuItem>
                                            <MenuItem value="owner">Owner (Head Admin)</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Box>
                                {Object.keys(initialValues).map((field: keyof IFields, i) => (
                                    <TextField
                                        autoFocus={i === 0}
                                        key={field}
                                        id={field}
                                        name={field}
                                        required={field !== "schoolID" || isOwner}
                                        error={helpers[field] !== "" && (!isOwner ? field !== "schoolID" || helpers[field] === "School not found" : true)}
                                        autoComplete={autoCompleteNames[field]}
                                        variant="outlined"
                                        type={field.includes("assword") ? "password" : "text"}
                                        label={
                                            field === "firstName" && role !== "student"
                                                ? "Title"
                                                : field === "schoolID" && isOwner
                                                    ? "Create School (Enter Name)"
                                                    : startCase(field)
                                        }
                                        value={values[field]}
                                        onChange={handleChange(field)}
                                        helperText={helpers[field] + " "}
                                        fullWidth
                                        className={classes[field] + " mt_6"}
                                    />
                                ))}
                                <Box clone mt="-6px" mb="6px">
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={staySignedIn}
                                                onChange={(_e, checked) => setStaySignedIn(checked)}
                                                value="Stay signed in"
                                                color="primary"
                                            />
                                        }
                                        label="Stay signed in"
                                    />
                                </Box>
                                <div className="flex space_between">
                                    <LoadBtn loading={loading} label="Sign Up" disabled={disabled} />
                                    <Button
                                        onClick={handleClear}
                                        variant="outlined"
                                        color="primary"
                                    >
                                        clear
                                    </Button>
                                </div>
                            </form>
                            <Divider className={"my_6"} />
                            <Typography variant="h6" gutterBottom>
                                Already have an account?
                            </Typography>
                            <Link href="/login">
                                <Button
                                    color="secondary"
                                    component="a"
                                >
                                    Login
                                </Button>
                            </Link>
                        </Box>
                    </div>
                </>
            )}
        </>
    );
};
