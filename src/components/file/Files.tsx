/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import { List, ListItem, ListItemIcon, Checkbox, ListItemText, ListItemSecondaryAction, IconButton, Box, Tooltip, Button, Dialog, DialogActions, DialogTitle, DialogContent, DialogContentText, TextField, Chip, Typography, Divider } from "@material-ui/core";
import { useEffect } from "react";
import useRequest from "../../hooks/useRequest";
import useContrastText from "../../hooks/useContraxtText";
import { Info, Close, SelectAll, CloudUpload, Delete, GetApp, Save } from "@material-ui/icons";
import { Autocomplete } from "@material-ui/lab";
import { ObjectId } from "mongodb";
import isHotkey from "is-hotkey";
import UploadBtn from "../UploadBtn";
import useSnackbar from "../../hooks/useSnackbar";
import formatBytes from "../../api/formatBytes";
import { useSelector } from "react-redux";
import { equal } from "../../api/array";
const sampleFiles = [{
    name: "file.png",
    size: 998298,
    _id: ObjectId(),
    tags: ["image", "png", "file"],
    user_ids: [ObjectId(), ObjectId()],
    owner_id: ObjectId(),
    url: "",
}, {
    name: "pic.jpg",
    size: 24363452,
    _id: ObjectId(),
    owner_id: ObjectId(),
    user_ids: [ObjectId(), ObjectId()],
    tags: ["image", "cool"],
    url: "",
}];
const tags = [{
    name: "image",
    color: "#ff0000"
}, {
    name: "cool",
    color: "#ffff00"
}, {
    name: "png",
    color: "#ff00ff"
}, {
    name: "file",
    color: "#00ff00"
}];
const MiniTag = ({ color, name }) => (
    <Tooltip title={name}>
        <Box height={16} width={16} bgcolor={color} borderRadius={0.5} mr={"2px"} />
    </Tooltip>
);
const TagField = ({ tagsVal, setTags, create, disabled }) => {
    const contrastText = useContrastText();
    return (
        <Autocomplete
            value={tagsVal}
            onChange={(e, n) => setTags(n)}
            id="tags"
            options={tags}
            disabled={disabled}
            fullWidth
            renderInput={params => (
                <TextField
                    {...params}
                    label="Tags"
                    variant="outlined"
                    margin="dense"
                />
            )}
            renderTags={(value, getTagProps) => value.map((option, i) => {
                const bg = tags.find(t => t.name === option).color;
                return (
                    <Box clone bgcolor={bg} color={contrastText(bg)}>
                        <Chip
                            variant="outlined"
                            label={option}
                            {...getTagProps({ i })}
                        />
                    </Box>
                );
            })}
        />
    );
}
export default () => {
    const
        request = useRequest(),
        user_id = useSelector(s => s.userInfo._id),
        snackbar = useSnackbar(),
        [files, setFiles] = useState(sampleFiles),
        [uploadFile, setUploadFile] = useState(null),
        [selected, setSelected] = useState([]),
        [fileId, setFileId] = useState(""),
        [name, setName] = useState(""),
        [fileTags, setFileTags] = useState([]),
        create = fileId === "new",
        currentFile = !create && fileId ? files.some(f => f._id === fileId) : null,
        disabled = !create && currentFile.owner_id !== user_id && !currentFile.user_ids.includes(user_id),
        noneSelected = selected.length === 0,
        toggleSelected = _id => () => {
            if (selected.includes(_id)) {
                setSelected(selected.filter(f => f._id !== _id));
            } else {
                setSelected([...selected, _id]);
            }
        },
        selectAll = () => setSelected(files.map(f => f._id)),
        fileInfo = (_id, name, tags) => () => {
            setName(name);
            setFileTags(tags);
            setFileId(_id);
        },
        selectFiles = f => {
            if (f[0].size >= 3172389719) {
                snackbar.error("File too big");
            } else {
                name === "" && setName(f[0].name);
                setUploadFile(f[0]);
                setFileId("new");
            }
        },
        deleteFile = () => {
            request.delete("/files", {
                setLoading: true,
                failedMsg: "deleting this file",
                body: selected,
                done: () => setFiles(files.filter(f => !selected.includes(f._id))),
            });
        },
        updateFile = () => {
            request.put("/files", {
                setLoading: true,
                failedMsg: "updating this file",
                body: {
                    _id: fileId,
                    name,
                    tags: fileTags,
                },
                done: setFiles,
            });
        };
    useEffect(() => {
        request.get("/files", {
            setLoading: true,
            failedMsg: "getting the files",
            done: setFiles,
        });
        const keyDown = e => {
            if (isHotkey("mod+a", e)) {
                e.preventDefault();
                selectAll();
            } else if (isHotkey("mod+u", e)) {
                e.preventDefault();
                setFileId("new");
            } else if (isHotkey("esc", e)) {
                e.preventDefault();
                setSelected([]);
            }
        }
        const onDrop = e => {
            e.preventDefault();
            selectFiles(e.dataTransfer.files);
        }
        const onPaste = e => selectFiles(e.clipboardData.files);
        document.addEventListener("paste", onPaste);
        document.addEventListener("dragover", e => e.preventDefault());
        document.addEventListener("drop", onDrop);
        document.addEventListener("keydown", keyDown);
        return () => {
            document.removeEventListener("paste", onPaste);
            document.removeEventListener("dragover", e => e.preventDefault());
            document.removeEventListener("drop", onDrop);
            document.removeEventListener("keydown", keyDown);
        }
    }, []);
    return (
        <>
            <Box display="flex" alignItems="space-between">
                {files.every(f => selected.includes(f._id)) ? (
                    <IconButton onClick={() => setSelected([])}>
                        <Close />
                    </IconButton>
                ) : (
                    <IconButton onClick={selectAll}>
                        <SelectAll />
                    </IconButton>
                )}
                <Box clone mr="8px" ml="auto">
                    <Divider orientation="vertical" flexItem />
                </Box>
                <Tooltip title="Delete">
                    <IconButton disabled={noneSelected}>
                        <Delete />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Download">
                    <IconButton disabled={noneSelected}>
                        <GetApp />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Save to device">
                    <IconButton disabled={noneSelected}>
                        <Save />
                    </IconButton>
                </Tooltip>
            </Box>
            <Box component={List} overflow="auto">
                <Button
                    onClick={() => setFileId("new")}
                    color="primary"
                    endIcon={<CloudUpload />}
                    fullWidth
                >
                    Upload
                </Button>
                {files.map(f => (
                    <Box whiteSpace="nowrap" textOverflow="ellipsis" overflow="hidden" borderRadius={8} mb="2px">
                        {b => <ListItem key={f._id} role={undefined} dense button onClick={toggleSelected(f._id)} {...b}>
                            <ListItemSecondaryAction>
                                <Checkbox
                                    edge="start"
                                    checked={selected.includes(f._id)}
                                    tabIndex={-1}
                                    disableRipple
                                    inputProps={{ "aria-labelledby": `file-${f.name}-${f._id}` }}
                                />
                            </ListItemSecondaryAction>
                            <ListItemText
                                id={`file-${f.name}-${f._id}`}
                                primary={f.name}
                                secondary={(
                                    <>
                                        {f.tags.map(t => (
                                            <MiniTag name={t} color={tags.find(tag => t === tag).color} />
                                        ))}
                                    </>
                                )}
                            />
                            <ListItemSecondaryAction>
                                <IconButton edge="end" aria-label="info" onClick={fileInfo(f._id, f.name, f.tags)}>
                                    <Info />
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>}
                    </Box>
                ))}
            </Box>
            <Dialog
                open={fileId !== ""}
                onClose={() => setFileId("")}
                aria-labelledby="file-title"
                aria-describedby="file-description"
            >
                <DialogTitle id="file-title">{create ? "Upload File" : "File Info"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="file-description">
                        Upload files.
                    </DialogContentText>
                    <TextField
                        value={name}
                        onChange={e => setName(e.target.value)}
                        label="Name"
                        disabled={disabled}
                    />
                    <TagField tagsVal={fileTags} setTags={setFileTags} disabled={disabled} />
                    {(!create || uploadFile) && (
                        <Typography>
                            Size: {formatBytes((create ? uploadFile : currentFile).size)}
                        </Typography>
                    )}
                    {create ? (
                        <UploadBtn accept="*" onChange={e => selectFiles(e.target.files)} />
                    ) : (
                        <>
                            <Typography>
                                Uploaded: {new ObjectId(fileId).getTimestamp().toLocaleDateString()}
                            </Typography>
                            <Typography>
                                Uploaded by: {currentFile.owner_id}
                            </Typography>
                            {currentFile.owner_id === user_id && (
                                <Button onClick={deleteFile}>
                                    Delete
                                </Button>
                            )}
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    {create ? (
                        <>
                            <Button onClick={() => setFileId("")}>
                                Cancel
                            </Button>
                            <Button disabled={!uploadFile} onClick={() => setFileId("")} color="primary">
                                Upload
                            </Button>
                        </>
                    ) : currentFile.name === name && equal(currentFile.tags.sort(), fileTags.sort()) ? (
                        <Button onClick={() => setFileId("")}>
                            Close
                        </Button>
                    ) : (
                        <>
                            <Button onClick={() => setFileId("")}>
                                Cancel
                            </Button>
                            <Button onClick={updateFile}>
                                Update
                            </Button>
                        </>
                    )}
                </DialogActions>
            </Dialog>
        </>
    );
}