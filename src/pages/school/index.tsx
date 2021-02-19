/* eslint-disable react-hooks/exhaustive-deps */
import { Fragment, useEffect, useState } from "react";
import { useDelete, usePut } from "../../hooks/useRequest";
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
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    InputAdornment,
    Menu,
} from "@material-ui/core";
import useConfirm from "../../hooks/useConfirm";
import Icon from "../../components/Icon";
import { mdiClose, mdiDelete, mdiFilter, mdiPencil, mdiPlus, mdiSortAlphabeticalAscending, mdiSortAlphabeticalDescending } from "@mdi/js";
import useUrlHashIndex from "../../hooks/useUrlHashIndex";
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
import Title from "../../components/Title";
import useSWR, { mutate } from "swr";
import ISchool, { IPermissions } from "../../types/ISchool";
import Loader from "../../components/Loader";
import useMembers from "../../hooks/useMembers";
import usePasswordAuth from "../../hooks/usePasswordAuth";

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
                    mutate("/api/school", (current: ISchool) => {
                        return {
                            ...current,
                            name,
                        };
                    }, false);
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

function RoleDialog(props: { open: boolean, mode: "edit" | "create", close(): void, initialTitle: string, initialUserId: string, roles: Record<string, string> }) {
    const
        [put, loading] = usePut(),
        [roleTitle, setRoleTitle] = useState(() => props.initialTitle),
        [userId, setUserId] = useState(() => props.initialUserId),
        titleHelper = roleTitle.length > 40 ? "Title too long" : ((props.mode === "create" || props.initialTitle !== roleTitle) && props.roles[roleTitle]) ? "Role already exists" : " ",
        submit = (e) => {
            e.preventDefault();
            put("/school/roles", {
                setLoading: true,
                body: {
                    roleTitle,
                    user_id: userId,
                    oldTitle: (props.initialTitle === roleTitle) ? undefined : props.initialTitle,
                },
                done() {
                    mutate("/api/school", (current: ISchool) => {
                        delete current.roles[props.initialTitle];
                        current.roles[roleTitle] = userId;
                        return current;
                    }, false);
                    props.close();
                },
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
                        className="mb_6"
                    />
                    <MembersAutocomplete
                        value={userId}
                        setValue={setUserId as any}
                        multiple={false}
                        users={[{
                            email: "email@domain.tld",
                            firstName: "Mrs",
                            lastName: "Someone",
                            _id: "5ed7edf6b556eb28e51d597d",
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
                        disabled={roleTitle === "" || titleHelper !== " " || !userId}
                        loading={loading}
                    />
                </DialogActions>
            </form>
        </Dialog>
    );
}

function SchoolSettings(props: { permissions: IPermissions }) {
    const
        [put, putLoading] = usePut(),
        [PasswordDialog, passwordConfirm, closePasswordDialog] = usePasswordAuth(putLoading),
        [state, setState] = useState(() => props.permissions),
        keys = Object.keys(state),
        canRevert = keys.some(k => state[k] !== props.permissions[k]),
        handleChange = (permission: string) => (e: React.ChangeEvent<{ value: string }>) => {
            setState({
                ...state,
                [permission]: e.target.value,
            });
        },
        updatePermissions = (password: string, setError: () => void) => {
            put("/school/permissions", {
                setLoading: true,
                body: {
                    permissions: state,
                    password,
                },
                doneMsg: "Permissions updated",
                failedMsg: "updating the permissions",
                done() {
                    mutate("/api/school", (current: ISchool) => {
                        console.log(current);
                        
                        current.permissions = state;
                        return current;
                    }, false);
                    closePasswordDialog();
                },
                errors() {
                    setError();
                },
            });
        };
    return (
        <>
            {PasswordDialog}
            <Typography variant="h5" gutterBottom>
                Permissions
            </Typography>
            {keys.sort().map(permission => (
                <div className="flex space_between align_items_center mt_6" key={permission}>
                    <Typography id={permission + "-permission-label"}>{startCase(permission)}</Typography>
                    <Box clone minWidth={144}>
                        <FormControl variant="outlined">
                            <Select
                                labelId={permission + "-permission-label"}
                                id={permission + "-permission-select"}
                                value={state[permission]}
                                onChange={handleChange(permission)}
                            >
                                <MenuItem value={0}>Owner (You)</MenuItem>
                                <MenuItem value={1}>All Admins</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </div>
            ))}
            <MarginDivider />
            <div className="flex space_between">
                <Button color="secondary" disabled={!canRevert} onClick={() => passwordConfirm(updatePermissions)}>Update</Button>
                <Button disabled={!canRevert} onClick={() => setState(props.permissions)}>Revert</Button>
            </div>
        </>
    );
}

function InfoPage({ schoolInfo }: { schoolInfo: ISchool }) {
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
                done() {
                    mutate("/api/school", (current: ISchool) => {
                        delete current.roles[title];
                        return current;
                    }, false);
                    closeConfirm();
                },
            });
        };
    return (
        <>
            {ConfirmDialog}
            <ChangeSchoolNameDialog open={nameOpen} close={() => setNameOpen(false)} initial={schoolInfo.name} />
            <RoleDialog open={roleOpen} close={() => setRoleOpen(false)} initialTitle={currentRole === null ? "" : currentRole[0]} initialUserId={currentRole === null ? null : currentRole[1]} mode={currentRole === null ? "create" : "edit"} roles={schoolInfo.roles} />
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
                                _id: "5ed7edf6b556eb28e51d597d",
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

const SORT_BY_ICONS = [mdiSortAlphabeticalAscending, mdiSortAlphabeticalDescending];
const ROLES = ["admins", "owner", "students", "teachers"];

function MembersPage() {
    const
        members = useMembers(),
        [search, setSearch] = useState(""),
        [sortByAnchor, setSortByAnchor] = useState(null),
        [sortBy, setSortBy] = useState(0),
        [filterRolesAnchor, setFilterRolesAnchor] = useState(null),
        [filterRoles, setFilterRoles] = useState(ROLES),
        toggleFilterRole = (role: string) => {
            if (filterRoles.includes(role)) {
                setFilterRoles(filterRoles.filter(r => r !== role));
            } else {
                setFilterRoles([...filterRoles, role].sort());
            }
        };
    return (
        <>
            <TextField
                label="Search members"
                value={search}
                onChange={e => setSearch(e.target.value)}
                fullWidth
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton size="small" aria-label="clear search field" className="p_3" onMouseDown={e => e.preventDefault()} onClick={() => setSearch("")}>
                                <Icon path={mdiClose} />
                            </IconButton>
                        </InputAdornment>
                    )
                }}
            />
            <div className="flex mt_6">
                <Tooltip title="Sort By">
                    <IconButton className="mr_6" onClick={e => setSortByAnchor(e.currentTarget)}>
                        <Icon path={SORT_BY_ICONS[sortBy]} />
                    </IconButton>
                </Tooltip>
                <Menu
                    id="sort-by-menu"
                    anchorEl={sortByAnchor}
                    keepMounted
                    open={Boolean(sortByAnchor)}
                    onClose={() => setSortByAnchor(null)}
                >
                    {["A-Z", "Z-A"].map((opt, i) => (
                        <MenuItem
                            key={i}
                            selected={sortBy === i}
                            onClick={() => {
                                setSortByAnchor(null);
                                setSortBy(i);
                            }}
                        >
                            {opt}
                        </MenuItem>
                    ))}
                </Menu>
                <Tooltip title="Filter Tags">
                    <IconButton className="mr_6" onClick={e => setFilterRolesAnchor(e.currentTarget)}>
                        <Icon path={mdiFilter} />
                    </IconButton>
                </Tooltip>
                <Menu
                    id="filter-menu"
                    anchorEl={filterRolesAnchor}
                    keepMounted
                    open={Boolean(filterRolesAnchor)}
                    onClose={() => setFilterRolesAnchor(null)}
                    variant="menu"
                    PaperProps={{
                        style: {
                            maxHeight: 256
                        }
                    }}
                >
                    {ROLES.map(role => (
                        <MenuItem key={role} button selected={filterRoles.includes(role)} onClick={() => toggleFilterRole(role)}>
                            {role}
                        </MenuItem>
                    ))}
                </Menu>
            </div>
        </>
    );
}

export default function School() {
    const
        { role } = useUserInfo(),
        pages = ["info", "invite", "members", "classes"];
    if (role === "owner") {
        pages.push("settings");
    }
    const
        [hashIndex, changeHash] = useUrlHashIndex(pages),
        [activeTab, setActiveTab] = useState(hashIndex),
        { data: schoolInfo } = useSWR<ISchool>("/api/school"),
        isLoggedIn = useRedirect();
    return (
        <>
            <Title title="School" />
            {!isLoggedIn ? null : !schoolInfo ? <Loader /> : (
                <div>
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
                        {activeTab === 0 && <InfoPage schoolInfo={schoolInfo} />}
                        {activeTab === 1 && <InvitePage />}
                        {activeTab === 2 && <MembersPage />}
                        {activeTab === 4 && <SchoolSettings permissions={schoolInfo.permissions} />}
                    </Box>
                </div>
            )}
        </>
    );
}
//export const getServerSideProps = defaultRedirect;