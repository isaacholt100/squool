/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, memo } from "react";
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
import useUserInfo from "../../hooks/useUserInfo";

const sampleFiles: IFile[] = [{
    name: "file",
    extension: "png",
    size: 998298,
    _id: "5fedaf6e73757100007b314d",
    tags: ["image", "png", "file"],
    viewer_ids: [new ObjectID().toHexString(), new ObjectID().toHexString()],
    owner_id: "5ed7edf6b556eb28e51d597d",
    writer_ids: [],
    url: "https://file-examples-com.github.io/uploads/2017/10/file_example_JPG_100kB.jpg",
    modified: new Date(),
}, {
    name: "pic",
    extension: "jpg",
    size: 24363452,
    _id: new ObjectID("5fedaf6e73757100007b3150").toHexString(),
    owner_id: "5ed7edf6b556eb28e51d597d",
    viewer_ids: [new ObjectID().toHexString(), new ObjectID().toHexString()],
    tags: ["image", "cool"],
    url: "https://file-examples-com.github.io/uploads/2017/10/file_example_JPG_100kB.jpg",
    writer_ids: [],
    modified: new Date("2020-12-30T12:05:55.874Z"),
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
function Class() {
    const
        [isOnline] = useIsOnline(),
        [del, delLoading] = useDelete(),
        [files, setFiles] = useState<IFile[]>(null),
        [get] = useGet(),
        [ConfirmDialog, confirm] = useConfirm(delLoading),
        dispatch = useDispatch(),
        classes = useStyles(),
        [classInfo, setClassInfo] = useState(null),
        router = useRouter(),
        [hashIndex, changeHash] = useUrlHashIndex(pages),
        [activeTab, setActiveTab] = useState(hashIndex),
        [offlineFiles, setOfflineFiles] = useState<IFile[]>([]),
        class_id = router.query.id as string,
        user_id = useUserInfo()._id,
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
        },
        getOfflineFiles = async () => {
            const db = await getClassDB("class_" + class_id);
            const list = await db.getAll("files");
            setOfflineFiles(list);
        },
        syncOfflineFiles = () => {
            // Make sure files aved offline in IDB are updated when files saved in shared DB are updated.
            console.log({files});
            const worker = new Worker("../../workers/syncOfflineFiles", { type: "module", name: "syncOfflineFiles" });
            worker.postMessage({
                user_id,
                db_id: "class_" + class_id,
                files,
            });
            console.log("posted");
            
            worker.addEventListener("message", e => {
                console.log(e.data);
                
                if (e.data) {

                } else {

                }
                worker.terminate();
            });
        };
        
    useEffect(() => {
        get(`/classes?_id=${class_id}`, {
            //setLoading: true,
            failedMsg: "loading the class info",
            done(data) {
                //title(data.name + " Class");
                setClassInfo(data);
            },
            errors() {
                dispatch({
                    type: "LOAD_ERROR",
                    payload: "This class couldn't be found",
                });
            }
        });
        setFiles(sampleFiles);
    }, []);
    useEffect(() => {
        if (!isOnline) {
            getOfflineFiles();
        }
    }, [isOnline]);
    useEffect(() => {
        console.log("effect");
        files !== null && isOnline && user_id && syncOfflineFiles();
    }, [files, user_id]);
    return !classInfo ? <Loader /> : (
        <div className="fadeup">
            <AppBar position="relative" color="default">
                <Tabs
                    value={activeTab}
                    onChange={(e, p) => setActiveTab(p)}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="scrollable"
                    scrollButtons="auto"
                    aria-label="class tabs"
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
                    <>
                    <button onClick={() => {
                        const oldFiles = [...files];
                        oldFiles[0].name = "newName";
                        oldFiles[0].modified = new Date();
                        setFiles(oldFiles);
                    }}>Test</button>
                    <Files db_id={"class_" + class_id} files={isOnline ? (files || []) : offlineFiles || []} setFiles={(f) => {}} tags={sampleTags} />
                    </>
                )}
            </Box>
            {ConfirmDialog}
        </div>
    );
}
export default memo(Class);
export async function getServerSideProps(ctx: NextPageContext) {
    return {props: {}};
}