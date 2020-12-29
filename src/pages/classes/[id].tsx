/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useRef } from "react";
import { useDelete, useGet } from "../../hooks/useRequest";
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
import Files from "../../components/file/Files";
import IFile, { Tags } from "../../types/IFile";
import { ObjectID } from "bson";
import { getClassDB } from "../../lib/idb";
import { useIsOnline } from "../../context/IsOnline";

const sampleFiles: IFile[] = [{
    name: "file.png",
    size: 998298,
    _id: new ObjectID().toHexString(),
    tags: ["image", "png", "file"],
    viewer_ids: [new ObjectID().toHexString(), new ObjectID().toHexString()],
    owner_id: new ObjectID().toHexString(),
    writer_ids: [],
    url: "https://file-examples-com.github.io/uploads/2017/10/file_example_JPG_100kB.jpg",
}, {
    name: "pic.jpg",
    size: 24363452,
    _id: new ObjectID().toHexString(),
    owner_id: new ObjectID().toHexString(),
    viewer_ids: [new ObjectID().toHexString(), new ObjectID().toHexString()],
    tags: ["image", "cool"],
    url: "https://file-examples-com.github.io/uploads/2017/10/file_example_JPG_100kB.jpg",
    writer_ids: [],
}];
const sampleTags: Tags = {
    "image": "#378ef2",
    "png": "#4caf50",
    "file": "#3f51b5",
    "cool": "#ff4722"
}

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
        [isOnline] = useIsOnline(),
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
        [offlineFiles, setOfflineFiles] = useState<IFile[]>([]),
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
    useEffect(() => {
        (async () => {
            const db = await getClassDB(class_id);
            const list = await db.getAll("files");
            setOfflineFiles(list);
        })();
    }, []);
    console.log(isOnline, offlineFiles);
    
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
            <Box component={Card} my={{ xs: "8px", lg: "16px", }}>
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
                    <List className="p_0">
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
                    </List>
                )}
                {activeTab === 2 && (
                    <Files db={async () => getClassDB(class_id) as any} files={isOnline ? sampleFiles : offlineFiles} setFiles={(f) => {}} tags={sampleTags} />
                )}
            </Box>
            {ConfirmDialog}
        </div>
    );
}
export async function getServerSideProps(ctx: NextPageContext) {
    return {props: {}};
}