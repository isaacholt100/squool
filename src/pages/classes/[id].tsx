/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useRef } from "react";
import useRequest, { useDelete, useGet } from "../../hooks/useRequest";
import { useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import {
    Typography,
    Chip,
    List,
    ListItem,
    IconButton,
    Tooltip,
    AppBar,
    Tabs,
    Tab,
    Card,
    Box,
} from "@material-ui/core";
import usePathname from "../../hooks/usePathname";
import useConfirm from "../../hooks/useConfirm";
import useTitle from "../../hooks/useTitle";
import Icon from "../../components/Icon";
import { mdiBlockHelper, mdiBook, mdiMessage } from "@mdi/js";
import { useRouter } from "next/router";
import Link from "next/link";
import Loader from "../../components/Loader";
import copyToClipboard from "../../lib/copyToClipboard";
import { NextPageContext } from "next";
import useUrlHashIndex from "../../hooks/useUrlHashIndex";

const
    useStyles = makeStyles(theme => ({
        kickout: {
            color: theme.palette.error.main,
        },
        messageBtn: {
            marginLeft: "auto",
        },
        classname: {
            color: theme.palette.primary.main,
        },
        yearGroup: {
            color: theme.palette.secondary.main,
        },
        classid: {
            color: theme.palette.text.hint,
        },
    }));

const pages = ["info", "students", "files", "homeworks", "tests"];
export default function Class() {
    const
        [del, delLoading] = useDelete(),
        [get] = useGet(),
        [ConfirmDialog, confirm] = useConfirm(delLoading),
        title = useTitle(),
        dispatch = useDispatch(),
        classes = useStyles(),
        [classInfo, setClassInfo] = useState(null),
        classRef = useRef(classInfo),
        router = useRouter(),
        [hashIndex, changeHash] = useUrlHashIndex(pages),
        [activeTab, setActiveTab] = useState(hashIndex),
        class_id = router.query.id as string,
        kickout = (_id: string) => {
            del("/classes/member", {
                setLoading: true,
                body: {
                    member_id: _id,
                    class_id,
                },
                failedMsg: "removing this class member",
                doneMsg: "Class member removed",
                done() {

                },
            });
        },
        getBook = member => {
            /*request("/book/id", "POST", false, data => {
                history.push("/book/" + data + "/view")
            }, "loading this book", {
                classid: classid,
                owner: member,
            });*/
        };
    useEffect(() => {
        !classInfo && get(`/classes?_id=${class_id}`, {
            setLoading: true,
            failedMsg: "loading the class info",
            done(data) {
                title(data.name + " Class");
                setClassInfo(data);
            },
            errors() {
                console.log("error");
                
                dispatch({
                    type: "LOAD_ERROR",
                    payload: "This class couldn't be found",
                });
            }
        });
        /*socket.on("member kicked out", member => {
            if (classInfo) {
                setClassInfo({
                    ...classRef.current,
                    members: classRef.current.members.replace(member + ", ", ""),
                });
            }
        });
        socket.on("your class joined", (classcode, member) => {
            if (classInfo) {
                if (classid === classcode) {
                    setClassInfo({
                        ...classRef.current,
                        members: classRef.current.members + member + ", ",
                    });
                }
            }
        });
        socket.on("your class left", (classcode, member) => {
            if (classid === classcode && classRef.current) {
                setClassInfo({
                    ...classRef.current,
                    members: classRef.current.members.replace(member + ", ", ""),
                });
            }
        });
        socket.off("member kicked out");
        socket.off("your class joined");
        socket.off("your class left");*/
    }, []);
    useEffect(() => {
        if (classRef) classRef.current = classInfo;
        //outsideClassInfo = classInfo;
    }, [classInfo]);
    console.log(router);
    console.log(activeTab);
    
    return !classInfo ? <Loader /> : (
        <div className="fadeup">
            <AppBar position="static" color="default">
                <Tabs
                    value={activeTab}
                    onChange={(e, p) => setActiveTab(p)}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="scrollable"
                    scrollButtons="auto"
                    aria-label="scrollable tabs"
                >
                {pages.map(p => (
                    <Tab label={p} key={p} onClick={() => changeHash(p)} />
                ))}
            </Tabs>
            </AppBar>
            <Box component={Card} mt={{xs: 1, lg: 2}}>
                {activeTab === 0 && (
                    <>
                        <Typography variant="h5" gutterBottom>
                            Class: <span className={classes.classname}>{classInfo.name}</span>
                        </Typography>
                        <Typography 
                            variant="h6"
                            gutterBottom
                        >
                            Year: <span className={classes.yearGroup}>{classInfo.yearGroup}</span>
                        </Typography>
                        <Typography
                            variant="h6"
                            gutterBottom
                        >
                            Class ID:{" "}
                            <Tooltip title="Click to Copy">
                                <Box component="span" color="text.hint" onClick={() => copyToClipboard(class_id)}>
                                    {class_id}
                                </Box>
                            </Tooltip>
                        </Typography>
                    </>
                )}
                {activeTab === 1 && (
                    <Box component={List} p={"0 !important"}>
                        {classInfo.members ? classInfo.members.split(",").filter(x => x !== " ").map(member => (
                            <Box clone p={"0 !important"} my={"4px"}>
                            <ListItem
                                key={member}
                            >
                                <Link href={"/profile/" + member}>
                                    <Chip 
                                        label={member}
                                        clickable
                                    />
                                </Link>
                                <Tooltip title="Message">
                                    <IconButton className="ml_auto">
                                        <Icon path={mdiMessage} />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="View book">
                                    <IconButton onClick={() => getBook(member)}>
                                        <Icon path={mdiBook} />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Kick out">
                                    <IconButton
                                        className={classes.kickout}
                                        onClick={() => confirm("kick out this member?", () => kickout(member._id))}
                                        //onClick={() => openKickOutDialog(member)}
                                    >
                                        <Icon path={mdiBlockHelper} />
                                    </IconButton>
                                </Tooltip>
                            </ListItem>
                            </Box>
                        )) : "There aren't any students in this class yet"}
                    </Box>
                )}
            </Box>
            {ConfirmDialog}
        </div>
    );
}
export async function getServerSideProps(ctx: NextPageContext) {
    return {props: {}};
}