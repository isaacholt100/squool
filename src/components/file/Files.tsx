/* eslint-disable react-hooks/exhaustive-deps */
import React, { memo, useRef, useState } from "react";
import { List, ListItem, Checkbox, ListItemText, ListItemSecondaryAction, IconButton, Box, Tooltip, Button, Dialog, DialogActions, DialogTitle, DialogContent, TextField, Chip, Typography, Divider, ListItemIcon, InputAdornment, Menu, MenuItem, Popover, AppBar, Toolbar } from "@material-ui/core";
import { useEffect } from "react";
import useRequest, { useDelete, usePost } from "../../hooks/useRequest";
import useContrastText from "../../hooks/useContraxtText";
import { Autocomplete } from "@material-ui/lab";
import isHotkey from "is-hotkey";
import UploadBtn from "../UploadBtn";
import useSnackbar from "../../hooks/useSnackbar";
import formatBytes from "../../lib/formatBytes";
import { equal } from "../../lib/array";
import Icon from "../Icon";
import { mdiClose, mdiCloseCircle, mdiCloudUpload, mdiContentSave, mdiDelete, mdiDownload, mdiFilter, mdiInformation, mdiSelectAll, mdiSortAlphabeticalAscending, mdiSortAlphabeticalDescending, mdiSortClockAscending, mdiSortClockDescending } from "@mdi/js";
import useUserInfo from "../../hooks/useUserInfo";
import IFile, { Tags } from "../../types/IFile";
import LoadBtn, { LoadIconBtn } from "../LoadBtn";
import { ObjectID } from "bson";
import { useMember } from "../../hooks/useMembers";
import { getDB } from "../../lib/idb";
import useContextMenu from "../../hooks/useContextMenu";
import { ContextMenuItem } from "../../types/contextMenu";
import File from "./File";
import { useIsOnline } from "../../context/IsOnline";

const MiniTag = ({ color, name }) => (
    <Tooltip title={name}>
        <Box height={16} width={16} bgcolor={color} borderRadius={"50%"} mr={"2px"} />
    </Tooltip>
);

const TagField = ({ tagsVal, setTags, disabled, tags }: { tagsVal: string[]; setTags(t: string[]): void; disabled?: boolean; tags: Tags }) => {
    const contrastText = useContrastText();
    const tagsList = Object.keys(tags);
    return (
        <Autocomplete
            value={tagsVal}
            multiple
            onChange={(e, n) => setTags(n)}
            id="tags"
            options={tagsList}
            disabled={disabled}
            fullWidth
            renderInput={params => (
                <TextField
                    {...params}
                    label="Tags"
                    variant="outlined"
                    margin="normal"
                />
            )}
            renderOption={(option) => (
                <>
                    <Box height={24} width={24} bgcolor={tags[option]} borderRadius={"50%"} mr="12px" />
                    {option}
                </>
            )}
            renderTags={(value, getTagProps) => value.map((option, i) => {
                const bg = tags[option], color = contrastText(bg);
                return (
                    <Chip
                        label={option}
                        {...getTagProps({ index: i })}
                        key={i}
                        style={{
                            backgroundColor: bg,
                            color,
                        }}
                        deleteIcon={(
                            <Box clone css={{"&:hover": { opacity: 0.75 }} as any}>
                                <Icon path={mdiCloseCircle} color={color} size="20px" />
                            </Box>
                        )}
                    />
                );
            })}
        />
    );
}

const SORT_BY_ICONS = [mdiSortAlphabeticalAscending, mdiSortAlphabeticalDescending, mdiSortClockAscending, mdiSortClockDescending];
const SORT_BY_OPTIONS = ["A-Z", "Z-A", "Date (oldest)", "Date (newest)"];

function UploadDialog(props: { open: boolean; setOpen(o: boolean): void; tags: Tags }) {
    const
        [post, postLoading] = usePost(),
        [name, setName] = useState(""),
        [fileTags, setFileTags] = useState<string[]>([]),
        [uploadFile, setUploadFile] = useState<File>(null),
        snackbar = useSnackbar(),
        selectFiles = (f: FileList) => {
            if (f[0].size >= 3172389719) {
                snackbar.error("File too big");
            } else {
                name === "" && setName(f[0].name);
                setUploadFile(f[0]);
                props.setOpen(true);
            }
        },
        upload = e => {
            e.preventDefault();

        };
    
    useEffect(() => {
        const onDrop = (e: DragEvent) => {
            e.preventDefault();
            selectFiles(e.dataTransfer.files);
        }
        const onPaste = (e: ClipboardEvent) => selectFiles(e.clipboardData.files);
        document.addEventListener("paste", onPaste);
        document.addEventListener("dragover", e => e.preventDefault());
        document.addEventListener("drop", onDrop);
        return () => {
            document.removeEventListener("paste", onPaste);
            document.removeEventListener("dragover", e => e.preventDefault());
            document.removeEventListener("drop", onDrop);
        }
    }, []);
    return (
        <Dialog
            open={props.open}
            onClose={() => props.setOpen(false)}
            aria-labelledby="upload-file"
        >
            <DialogTitle id="upload-file">Upload File</DialogTitle>
            <form onSubmit={upload}>
                <DialogContent>
                    <TextField
                        value={name}
                        onChange={e => setName(e.target.value)}
                        label="Name"
                        fullWidth
                        autoFocus
                        //margin="normal"
                    />
                    <TagField tags={props.tags} tagsVal={fileTags} setTags={setFileTags} />
                    <UploadBtn accept="*" onChange={e => selectFiles(e.target.files)} />
                    {uploadFile && (
                        <Typography>
                            Size: {formatBytes(uploadFile.size)}
                        </Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => props.setOpen(false)}>
                        Cancel
                    </Button>
                    <LoadBtn disabled={!uploadFile || name === ""} loading={postLoading} label="Upload" />
                </DialogActions>
            </form>
        </Dialog>
    );
}

const FileDialog = memo((props: { close(): void, currentFile?: IFile, tags: Tags, name: string; setName(n: string): void, deleteFiles(files: string[]): void, fileTags: string[], setFileTags(tags: string[]): void }) => {
    const
        user_id = useUserInfo()._id,
        uploader = useMember(props.currentFile.owner_id),
        contrastText = useContrastText(),
        disabled = props.currentFile && props.currentFile.owner_id !== user_id && !props.currentFile.viewer_ids.includes(user_id) && !props.currentFile.writer_ids.includes(user_id);

    return (
        <>
            <DialogTitle id="file-title">File Info</DialogTitle>
            <DialogContent>
                {disabled ? (
                    <>
                        <Typography gutterBottom>
                            Name: {props.name}
                        </Typography>
                        <Typography gutterBottom>
                            Tags:{" "}
                        </Typography>
                        {props.currentFile.tags.length === 0 ? "No tags" : (
                            props.currentFile.tags.map(tag => {
                                const bg = props.tags[tag], color = contrastText(bg);
                                return (
                                    <Chip
                                        label={tag}
                                        key={tag}
                                        style={{
                                            backgroundColor: bg,
                                            color,
                                            marginRight: 4,
                                            marginBottom: 4,
                                        }}
                                    />
                                );
                            }
                        ))}
                    </>
                ) : (
                    <>
                        <TextField
                            value={props.name}
                            onChange={e => props.setName(e.target.value)}
                            label="Name"
                            disabled={disabled}
                            fullWidth
                        />
                        <TagField tags={props.tags} tagsVal={props.fileTags} setTags={props.setFileTags} disabled={disabled} />
                    </>
                )}
                <Typography gutterBottom>
                    Size: {formatBytes(props.currentFile.size)}
                </Typography>
                <Typography gutterBottom>
                    Uploaded: {new ObjectID(props.currentFile._id).getTimestamp().toLocaleDateString()}
                </Typography>
                <Typography gutterBottom>
                    Uploaded by: {uploader.firstName + " " + uploader.lastName}
                </Typography>
                {props.currentFile.owner_id === user_id && (
                    <Button onClick={() => props.deleteFiles([props.currentFile._id])}>
                        Delete
                    </Button>
                )}
            </DialogContent>
            <DialogActions>
                {props.currentFile?.name === props.name && equal(props.currentFile?.tags.sort(), props.fileTags.sort()) ? (
                    <Button onClick={props.close}>
                        Close
                    </Button>
                ) : (
                    <>
                        <Button onClick={props.close}>
                            Close
                        </Button>
                        <Button onClick={undefined}>
                            Update
                        </Button>
                    </>
                )}
            </DialogActions>
        </>
    );
}, (prev, next) => next.currentFile === null);

const ViewDialog = memo((props: { url: string, ext: string, close(): void }) => {
    return (
        <div className="flex full_height flex_col">
            <AppBar>
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={props.close} aria-label="close">
                        <Icon path={mdiClose} />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <File url={props.url} ext={props.ext} />
        </div>
    );
}, (prev, next) => prev.url === next.url || next.url === null);

export default function Files(props: { files: IFile[], tags: Tags, setFiles(f: IFile[]): void, db_id: string }) {
    const
        [ContextMenu, openContextMenu] = useContextMenu(),
        user_id = useUserInfo()._id,
        [del, delLoading] = useDelete(),
        request = useRequest(),
        [selected, setSelected] = useState<string[]>([]),
        [currentFile, setCurrentFile] = useState<IFile>(null),
        [name, setName] = useState(""),
        [fileTags, setFileTags] = useState<string[]>(),
        [search, setSearch] = useState(""),
        [sortBy, setSortBy] = useState(0),
        [filterTags, setFilterTags] = useState(Object.keys(props.tags)),
        [uploadOpen, setUploadOpen] = useState(false),
        noneSelected = selected.length === 0,
        searchField = useRef(),
        snackbar = useSnackbar(),
        [sortByAnchor, setSortByAnchor] = useState<HTMLElement>(null),
        [filterAnchor, setFilterAnchor] = useState<HTMLElement>(null),
        [saveLoading, setSaveLoading] = useState(false),
        [viewFile, setViewFile] = useState<[string, string]>([null, null]),
        isOnline = useIsOnline(),
        toggleSelected = _id => {
            if (selected.includes(_id)) {
                setSelected(selected.filter(f => f !== _id));
            } else {
                setSelected([...selected, _id]);
            }
        },
        selectAll = () => setSelected(props.files.map(f => f._id)),
        fileInfo = (f: IFile) => () => {
            setName(f.name);
            setFileTags(f.tags);
            setCurrentFile(f);
            //setFileId(_id);
        },
        deleteFiles = (files: string[]) => {
            del("/files", {
                setLoading: true,
                failedMsg: "deleting this file",
                body: files,
                done() {
                    props.setFiles(props.files.filter(f => !files.includes(f._id)));
                },
            });
        },
        updateFile = () => {
            request.put("/files", {
                setLoading: true,
                failedMsg: "updating this file",
                body: {
                    _id: currentFile._id,
                    name,
                    tags: fileTags,
                },
                //done: props.setFiles,
            });
        },
        openFile = (file: IFile) => () => {
            if (file.blob) {
                setViewFile([URL.createObjectURL(file.blob), file.extension]);
            } else {
                setViewFile([file.url, file.extension]);
            }
        },
        toggleFilter = (tag: string) => {
            setFilterTags(filterTags.includes(tag) ? filterTags.filter(t => t !== tag) : [...filterTags, tag]);
        },
        sortFn = (a: IFile, b: IFile) => {
            switch (sortBy) {
                case 0: {
                    return a.name > b.name ? 1 : -1;
                }
                case 1: {
                    return a.name < b.name ? 1 : -1;
                }
                case 2: {
                    return new ObjectID(a._id).generationTime - new ObjectID(b._id).generationTime;
                }
                default: {
                    return new ObjectID(b._id).generationTime - new ObjectID(a._id).generationTime;
                }
            }
        },
        /*saveFileOffline = async (f: IFile) => {
            try {
                setSaveLoading(true);
                const db = await getDB(props.db_id);
                const exists = (await db.get("files", f._id)) !== undefined;
                if (exists) {
                    snackbar.info("File '" + f.name + "' is already saved");
                } else {
                    const res = await fetch(f.url);
                    const blob = await res.blob();
                    await db.add("files", { ...f, blob }, f._id);
                    snackbar.success("File '" + f.name + "' saved and is now available offline");
                }
            } catch (err) {
                console.error(err);
                snackbar.error("There was an error saving the file '" + f.name + "'");
            } finally {
                setSaveLoading(false);
            }
        },*/
        saveFilesOffline = async (files: IFile[], fn: () => void = null) => {
            setSaveLoading(true);
            const worker = new Worker("../../workers/saveFilesOffline", { type: "module", name: "saveFilesOffline" });
            worker.postMessage({
                db_id: props.db_id,
                files,
            });
            worker.addEventListener("message", async e => {
                setSaveLoading(false);
                if (e.data) {
                    fn && fn();
                    snackbar.success(files.length + " file" + (files.length !== 1 ? "s" : "") + " saved and " + (files.length !== 1 ? "are" : "is") + " now available offline");
                    const test = await getDB(props.db_id);
                } else {
                    snackbar.error("There was an error saving these files");
                }
                worker.terminate();
            });
        },
        saveToDevice = async () => {
            const list = props.files.filter(f => selected.includes(f._id));
            await saveFilesOffline(list, () => setSelected([]));
        },
        onContextMenu = (file: IFile) => (e: React.MouseEvent) => {
            const items: ContextMenuItem[] = [{
                label: "Delete",
                icon: <Icon path={mdiDelete} />,
                fn() {
                    deleteFiles([file._id]);
                }
            }, {
                label: "Download",
                icon: <Icon path={mdiDownload} />,
                fn() {}
            }, {
                label: "Save to device",
                icon: <Icon path={mdiContentSave} />,
                fn() {
                    saveFilesOffline([file]);
                }
            }, {
                label: "File Info",
                icon: <Icon path={mdiInformation} />,
                fn() {
                    fileInfo(file)();
                }
            }];
            openContextMenu(items)(e);
        };
    useEffect(() => {
        const keyDown = e => {
            if (isHotkey("shift+a", e)) {
                e.preventDefault();
                selectAll();
            } else if (isHotkey("shift+u", e)) {
                e.preventDefault();
                setUploadOpen(true);
            } else if (isHotkey("esc", e)) {
                e.preventDefault();
                setSelected([]);
            } else if (isHotkey("mod+f", e)) {
                e.preventDefault();
                (searchField.current as any).focus();
            }
        }
        document.addEventListener("keydown", keyDown);
        return () => {
            document.removeEventListener("keydown", keyDown);
        }
    }, []);
    return (
        <>
            {ContextMenu}
            <Dialog fullScreen open={viewFile[0] !== null} onClose={() => setViewFile([null, null])}>
                <ViewDialog close={() => setViewFile([null, null])} url={viewFile[0]} ext={viewFile[1]} />
            </Dialog>
            <Dialog
                open={currentFile !== null}
                onClose={() => setCurrentFile(null)}
                aria-labelledby="file-title"
                aria-describedby="file-description"
            >
                <FileDialog close={() => setCurrentFile(null)} currentFile={currentFile} tags={props.tags} name={name} setName={setName} deleteFiles={deleteFiles} fileTags={fileTags} setFileTags={setFileTags} />
            </Dialog>
            <UploadDialog open={uploadOpen} setOpen={setUploadOpen} tags={props.tags} />
            <div className="flex mb_8">
                <TextField
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    label="Search Files"
                    fullWidth
                    className="flex_1 mr_8"
                    inputRef={searchField}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton size="small" aria-label="clear search field" onMouseDown={e => e.preventDefault()} onClick={() => setSearch("")}>
                                    <Icon path={mdiClose} />
                                </IconButton>
                            </InputAdornment>
                        )
                    }}
                />
                <Tooltip title="Upload Files">
                    <Button color="secondary" onClick={() => setUploadOpen(true)} style={{minWidth: 0, padding: "6px 8px"}}>
                        <Icon path={mdiCloudUpload} />
                    </Button>
                </Tooltip>
            </div>
            <div className="flex" style={{overflow: "auto"}}>
                {props.files.every(f => selected.includes(f._id)) ? (
                    <Tooltip title="Clear Selection">
                        <IconButton onClick={() => setSelected([])} className="mr_4">
                            <Icon path={mdiClose} />
                        </IconButton>
                    </Tooltip>
                ) : (
                    <Tooltip title="Select All">
                        <IconButton onClick={selectAll} className="mr_4">
                            <Icon path={mdiSelectAll} />
                        </IconButton>
                    </Tooltip>
                )}
                <Tooltip title="Sort By">
                    <IconButton className="mr_4" onClick={e => setSortByAnchor(e.currentTarget)}>
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
                    {SORT_BY_OPTIONS.map((opt, i) => (
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
                    <IconButton className="mr_4" onClick={e => setFilterAnchor(e.currentTarget)}>
                        <Icon path={mdiFilter} />
                    </IconButton>
                </Tooltip>
                <Popover
                    id="filter-menu"
                    anchorEl={filterAnchor}
                    keepMounted
                    open={Boolean(filterAnchor)}
                    onClose={() => setFilterAnchor(null)}
                    PaperProps={{
                        style: {
                            maxHeight: 256
                        }
                    }}
                >
                    <List disablePadding>
                        <MenuItem onClick={() => setFilterTags(Object.keys(props.tags))}>Reset</MenuItem>
                        {Object.keys(props.tags).map(tag => (
                            <ListItem key={tag} button selected={filterTags.includes(tag)} onClick={() => toggleFilter(tag)}>
                                <Box height={24} width={24} bgcolor={props.tags[tag]} borderRadius={"50%"} mr="12px" />
                                <ListItemText primary={tag} className="mr_8" />
                                <ListItemSecondaryAction>
                                    <Checkbox
                                        edge="end"
                                        onChange={() => toggleFilter(tag)}
                                        checked={filterTags.includes(tag)}
                                    />
                                </ListItemSecondaryAction>
                            </ListItem>
                        ))}
                    </List>
                </Popover>
                <Divider orientation="vertical" className="ml_auto mr_4" flexItem />
                <Tooltip title="Delete">
                    <IconButton disabled={noneSelected || selected.some(_id => !props.files.find(file => file._id === _id)?.writer_ids?.includes(user_id))} className="mr_4" onClick={() => deleteFiles(selected)}>
                        <Icon path={mdiDelete} />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Download">
                    <IconButton disabled={noneSelected} className="mr_4">
                        <Icon path={mdiDownload} />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Save to device">
                    <IconButton disabled={noneSelected || saveLoading || !isOnline} onClick={saveToDevice}>
                        <LoadIconBtn loading={saveLoading}>
                            <Icon path={mdiContentSave} />
                        </LoadIconBtn>
                    </IconButton>
                </Tooltip>
            </div>
            <Box component={List} overflow="auto" className="p_0">
                {props.files.filter(f => f.name.toLowerCase().includes(search.toLowerCase()) && filterTags.some(t => f.tags.includes(t))).sort(sortFn).map(f => (
                    <Box whiteSpace="nowrap" textOverflow="ellipsis" overflow="hidden" borderRadius={8} mt="4px" key={f._id}>
                        {b => <ListItem role={undefined} button dense {...b} onClick={openFile(f)} disableRipple /*selected={selected.includes(f._id)}*/ onContextMenu={onContextMenu(f)}>
                            <ListItemIcon>
                                <Checkbox
                                    checked={selected.includes(f._id)}
                                    inputProps={{ "aria-labelledby": `file-${f.name}-${f._id}` }}
                                    tabIndex={-1}
                                    color="secondary"
                                    onClick={e => {
                                        e.stopPropagation();
                                        toggleSelected(f._id);
                                    }}
                                />
                            </ListItemIcon>
                            <ListItemText
                                id={`file-${f.name}-${f._id}`}
                                primary={f.name}
                                secondary={(
                                    <div className="flex mt_8">
                                        {f.tags.sort().map(t => (
                                            <MiniTag key={t} name={t} color={props.tags[t]} />
                                        ))}
                                    </div>
                                )}
                            />
                            <ListItemSecondaryAction>
                                <Tooltip title="File Info">
                                    <IconButton edge="end" aria-label="info" onClick={fileInfo(f)}>
                                        <Icon path={mdiInformation} />
                                    </IconButton>
                                </Tooltip>
                            </ListItemSecondaryAction>
                        </ListItem>}
                    </Box>
                ))}
            </Box>
        </>
    );
}