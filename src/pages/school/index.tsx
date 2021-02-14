/* eslint-disable react-hooks/exhaustive-deps */
import { Fragment, useEffect, useState } from "react";
import { useDelete, useGet, usePut } from "../../hooks/useRequest";
import { useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import {
    Typography,
    List,
    IconButton,
    Tooltip,
    AppBar,
    Tabs,
    Tab,
    Card,
    Box,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    DialogActions,
} from "@material-ui/core";
import useConfirm from "../../hooks/useConfirm";
import Icon from "../../components/Icon";
import { mdiDelete, mdiPencil, mdiPlus } from "@mdi/js";
import { useRouter } from "next/router";
import useUrlHashIndex from "../../hooks/useUrlHashIndex";
import IFile from "../../types/IFile";
import { ObjectID } from "bson";
import { useIsOnline } from "../../context/IsOnline";
import useUserInfo from "../../hooks/useUserInfo";
import { defaultRedirect } from "../../lib/serverRedirect";
import useRedirect from "../../hooks/useRedirect";
import CopyButton from "../../components/CopyButton";
import MarginDivider from "../../components/MarginDivider";
import { roleHasPermission } from "../../lib/role";
import LoadBtn from "../../components/LoadBtn";
import UserItem from "../../components/UserItem";
import { startCase } from "lodash";
import MembersAutocomplete from "../../components/MembersAutocomplete";
import IUser from "../../types/IUser";

const schoolInfo = {
    name: "CRGS",
    roles: {
        "Headmaster": "whgodf90gdjfdjfg",
        "Assistant": "whgodf90gdjfdjfg",
    },
    permissions: {
        changeName: 1,
        changeRoles: 1,
        createClasses: 2,
        removeUsers: 1,
    }
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

function InvitePage() {
    const
        userInfo = useUserInfo(),
        signupLink = window.location.origin + "/signup?id=" + userInfo.school_id;
    return (
        <>
            <Typography variant="h5" gutterBottom>
                For pre-existing users:
            </Typography>
            <Typography>
                Users can join this school by changing their school ID in Settings to{" "}
                <Typography component="span" color="secondary">
                    {userInfo.school_id}
                </Typography>
            </Typography>
            <MarginDivider />
            <Typography variant="h5" gutterBottom>
                For new users:
            </Typography>
            <Typography>
                People signing up can join this school with this link:{" "}<Typography component="span" color="secondary">
                    {signupLink}
                </Typography>
            </Typography>
            <MarginDivider />
            <CopyButton
                label="Copy ID"
                text={userInfo.school_id}
                color="secondary"
                className="mr_6"
            />
            <CopyButton
                label="Copy Link"
                text={signupLink}
                color="secondary"
            />
        </>
    );
}

function ChangeSchoolNameDialog(props: { initial: string, open: boolean, close(): void }) {
    const
        [name, setName] = useState(() => props.initial),
        [put, loading] = usePut(),
        updateName = (e) => {
            e.preventDefault();
            put("/school/name", {
                setLoading: true,
                body: {
                    name,
                },
                done() {
                    props.close();
                },
                doneMsg: "School name updated",
                failedMsg: "updating the school name",
            });
        },
        helperText = name.length > 40 ? "Name too long" : " ";
    return (
        <Dialog open={props.open} onClose={props.close} aria-labelledby="change-school-name">
            <DialogTitle id="change-school-name">Change School Name</DialogTitle>
            <form onSubmit={updateName}>
                <DialogContent>
                    <TextField
                        autoFocus
                        id="school-name-field"
                        label="School Name"
                        fullWidth
                        value={name}
                        onChange={e => setName(e.target.value)}
                        error={helperText !== " "}
                        helperText={helperText}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={props.close}>
                        Cancel
                    </Button>
                    <LoadBtn
                        label="Change"
                        disabled={name === "" || helperText !== " "}
                        loading={loading}
                    />
                </DialogActions>
            </form>
        </Dialog>
    );
}

function RoleDialog(props: { open: boolean, mode: "edit" | "create", close(): void, initialTitle: string, initialUserId: string }) {
    const
        [put, loading] = usePut(),
        [roleTitle, setRoleTitle] = useState(() => props.initialTitle),
        [userId, setUserId] = useState(() => props.initialUserId),
        titleHelper = roleTitle.length > 40 ? "Title too long" : " ",
        submit = (e) => {
            e.preventDefault();
            put("/school/roles", {
                setLoading: true,
                body: {
                    roleTitle,
                    user_id: new ObjectID().toHexString(),
                },
                done: props.close,
                doneMsg: props.mode === "edit" ? "Role updated" : "Role created",
                failedMsg: (props.mode === "edit" ? "editing" : "creating") + " this role"
            });
        };
    useEffect(() => {
        setRoleTitle(props.initialTitle);
    }, [props.initialTitle]);
    useEffect(() => {
        setUserId(props.initialUserId);
    }, [props.initialUserId]);
    return (
        <Dialog open={props.open} onClose={props.close} aria-labelledby={"school-role-" + props.mode}>
            <DialogTitle id={"school-role-" + props.mode}>{startCase(props.mode) + " School Role"}</DialogTitle>
            <form onSubmit={submit}>
                <DialogContent>
                    <TextField
                        autoFocus
                        id="role-title-field"
                        label="Role Title"
                        fullWidth
                        value={roleTitle}
                        onChange={e => setRoleTitle(e.target.value)}
                        error={titleHelper !== " "}
                        helperText={titleHelper}
                    />
                    <MembersAutocomplete
                        value={userId}
                        setValue={setUserId as any}
                        multiple={false}
                        users={[{
                            email: "email@domain.tld",
                            firstName: "Mrs",
                            lastName: "Someone",
                            _id: "whgodf90gdjfdjfg",
                            role: "admin",
                            icon: "",
                        }]}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={props.close}>
                        Cancel
                    </Button>
                    <LoadBtn
                        label="Change"
                        disabled={roleTitle === "" || titleHelper !== " "}
                        loading={loading}
                    />
                </DialogActions>
            </form>
        </Dialog>
    );
}

function InfoPage() {
    const
        userInfo = useUserInfo(),
        canChangeRoles = roleHasPermission(userInfo.role, schoolInfo.permissions.changeRoles),
        [nameOpen, setNameOpen] = useState(false),
        [roleOpen, setRoleOpen] = useState(false),
        [currentRole, setCurrentRole] = useState<[string, string]>(null),
        [del, delLoading] = useDelete(),
        [ConfirmDialog, confirm, closeConfirm] = useConfirm(delLoading),
        editRole = (title: string, _id: string) => () => {
            setCurrentRole([title, _id]);
            setRoleOpen(true);
        },
        openCreateRole = () => {
            setCurrentRole(null);
            setRoleOpen(true);
        },
        deleteRole = (title: string) => {
            del("/school/roles", {
                setLoading: true,
                body: {
                    roleTitle: title,
                },
                failedMsg: "deleting this role",
                doneMsg: "Role deleted",
                done: closeConfirm,
            });
        };
    return (
        <>
            {ConfirmDialog}
            <ChangeSchoolNameDialog open={nameOpen} close={() => setNameOpen(false)} initial={schoolInfo.name} />
            <RoleDialog open={roleOpen} close={() => setRoleOpen(false)} initialTitle={currentRole === null ? "" : currentRole[0]} initialUserId={currentRole === null ? null : currentRole[1]} mode={currentRole === null ? "create" : "edit"} />
            <div className="flex">
                <Typography variant="h4" className="flex_1" color="primary">
                    {schoolInfo.name}    
                </Typography>
                {roleHasPermission(userInfo.role, schoolInfo.permissions.changeName) && (
                    <div className="flex align_items_center">
                        <Tooltip title="Edit Name">
                            <IconButton color="secondary" size="small" onClick={() => setNameOpen(true)}>
                                <Icon path={mdiPencil} />
                            </IconButton>
                        </Tooltip>
                    </div>
                )}
            </div>
            <MarginDivider />
            <div className="flex mb_6">
                <Typography variant="h5" className="flex_1">
                    School Roles:    
                </Typography>
                {canChangeRoles && (
                    <div className="flex align_items_center">
                        <Tooltip title="Add Role">
                            <IconButton color="secondary" size="small" onClick={openCreateRole}>
                                <Icon path={mdiPlus} />
                            </IconButton>
                        </Tooltip>
                    </div>
                )}
            </div>
            <List dense className="mb_-3">
                {Object.keys(schoolInfo.roles).sort().map(role => (
                    <Fragment key={role}>
                        <div className="flex align_items_center mb_6">
                            <Typography color="primary" className="flex_1">{role}</Typography>
                            {canChangeRoles && (
                                <>
                                    <Tooltip title="Edit Role" onClick={editRole(role, schoolInfo.roles[role])}>
                                        <IconButton color="inherit" size="small" aria-label="delete" className="mr_6">
                                            <Icon path={mdiPencil} />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Remove Role">
                                        <IconButton className="color_error" color="inherit" size="small" aria-label="delete" onClick={() => confirm("delete the role '" + role + "'?", () => deleteRole(role))}>
                                            <Icon path={mdiDelete} />
                                        </IconButton>
                                    </Tooltip>
                                </>
                            )}
                        </div>
                        <UserItem
                            user={{
                                email: "email@domain.tld",
                                firstName: "Mrs",
                                lastName: "Someone",
                                _id: "whgodf90gdjfdjfg",
                                role: "admin",
                                icon: "",
                            }}
                        />
                    </Fragment>
                ))}
            </List>
        </>
    );
}

const pages = ["info", "invite", "students", "teachers", "admins", "classes"];
export default function School() {
    const
        [isOnline] = useIsOnline(),
        [del, delLoading] = useDelete(),
        [files, setFiles] = useState<IFile[]>(null),
        [get] = useGet(),
        [ConfirmDialog, confirm] = useConfirm(delLoading),
        dispatch = useDispatch(),
        classes = useStyles(),
        router = useRouter(),
        [hashIndex, changeHash] = useUrlHashIndex(pages),
        [activeTab, setActiveTab] = useState(hashIndex),
        userInfo = useUserInfo();
        
    useEffect(() => {
    }, []);
    const isLoggedIn = useRedirect();
    return !isLoggedIn ? null : (
        <div className="fadeup">
            <AppBar position="relative" color="default">
                <Tabs
                    value={activeTab}
                    onChange={(_e, p) => setActiveTab(p)}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="scrollable"
                    scrollButtons="off"
                    aria-label="school tabs"
                >
                {pages.map(p => (
                    <Tab label={p} key={p} onClick={() => changeHash(p)} />
                ))}
            </Tabs>
            </AppBar>
            <Box component={Card} my={{ xs: "6px", lg: "12px", }}>
                {activeTab === 0 && <InfoPage />}
                {activeTab === 1 && <InvitePage />}
                {activeTab === 2 && (
                    <>

                    </>
                )}
            </Box>
            {ConfirmDialog}
        </div>
    );
}
export const getServerSideProps = defaultRedirect;