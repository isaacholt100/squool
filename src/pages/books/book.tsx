/* eslint-disable no-restricted-globals */
/* eslint-disable default-case */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, createRef, useMemo, useRef } from "react";
import { useParams, useHistory, Prompt } from "react-router";
import { useDispatch } from "react-redux";
import Loader from "../../components/Loader";
import { Editor } from "@tinymce/tinymce-react";
import tinymce from "tinymce";
//import "tinymce/icons/default";
import "tinymce/themes/silver";
import "tinymce/plugins/textpattern";
import "tinymce/plugins/lists";
import "tinymce/plugins/advlist";
import "tinymce/plugins/codesample";
import "tinymce/plugins/hr";
import "tinymce/plugins/image";
import "tinymce/plugins/imagetools";
import "tinymce/plugins/importcss";
import "tinymce/plugins/link";
import "tinymce/plugins/media";
import "tinymce/plugins/wordcount";
import "tinymce/plugins/nonbreaking";
import "tinymce/plugins/paste";
import "tinymce/plugins/print";
import "tinymce/plugins/table";
import "tinymce/plugins/searchreplace";
import isHotkey from "is-hotkey";
import {
    Alert,
    AlertTitle,
    ToggleButton,
    ToggleButtonGroup
} from "@material-ui/lab";
//import socket from "../../api/socket";
import * as colors from "@material-ui/core/colors";
import bookStyles from "../../json/bookstyles.json";
import equationSymbols from "../../json/equationSymbols.json";
import entities from "../../json/bookEntities.json";
import AnimateHeight from "react-animate-height";
import useRequest from "../../hooks/useRequest";
import {
    FormatAlignLeft,
    FormatAlignCenter,
    FormatAlignRight,
    FormatAlignJustify,
    FormatBold,
    FormatItalic,
    FormatUnderlined,
    FormatColorFill,
    FormatColorText,
    StrikethroughS,
    FormatListBulleted,
    FormatListNumbered,
    Undo,
    Redo,
    KeyboardArrowDown,
    FormatClear,
    FontDownload,
    Title,
    FormatIndentIncrease,
    FormatIndentDecrease,
    SelectAll,
    Done,
    Link,
    Photo,
    Videocam,
    EmojiSymbols,
    FormatQuote,
    Info,
    Comment,
    Add,
    Delete,
    Edit,
    Print,
    MoreHoriz,
    YouTube,
    BrightnessHigh,
    BlurOn,
    Exposure,
    FilterBAndW,
    RotateLeft,
    InvertColors,
    Opacity,
    Flare,
    Adjust,
    Search,
    KeyboardArrowUp,
    DoneAll,
    Close,
    Feedback
} from "@material-ui/icons";
import Icon from "@mdi/react";
import {
    mdiTable,
    mdiTableColumnPlusAfter,
    mdiTableColumnPlusBefore,
    mdiTableRowPlusAfter,
    mdiTableRowPlusBefore,
    mdiTableMergeCells,
    mdiArrowSplitVertical,
    mdiTableRowRemove,
    mdiTableColumnRemove,
    mdiDelete,
    mdiBrush,
    mdiRotateRight,
    mdiRotateLeft,
    mdiFlipHorizontal,
    mdiFlipVertical,
    mdiTune,
    mdiMinus,
    mdiVolumeHigh,
    mdiPencil,
    mdiLinkOff,
    mdiContentCut,
    mdiContentCopy,
    mdiFormatSuperscript,
    mdiFormatSubscript,
    mdiTableColumnWidth,
    mdiFormatLetterMatches,
    mdiFormatLetterCaseUpper,
    mdiMathIntegral,
    mdiSlashForwardBox,
    mdiOpenInNew,
} from "@mdi/js";
import {
    Tooltip,
    MenuItem,
    makeStyles,
    ButtonBase,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Menu,
    IconButton,
    List,
    ListItem,
    ListItemSecondaryAction,
    Slider,
    ListItemIcon,
    Link as LinkBtn,
    FormControlLabel,
    Checkbox,
    Radio,
    useMediaQuery,
    Box
} from "@material-ui/core";
import useTitle from "../../hooks/useTitle";
import useSnackbar from "../../hooks/useSnackbar";
import useContraxtText from "../../hooks/useContraxtText";
import useSocket from "../../hooks/useSocket";
import UploadBtn from "../../components/UploadBtn";
const
    mdiTableMinus = "M15 19V17H23V19H15M4 3H18C19.11 3 20 3.9 20 5V12.08C18.45 11.82 16.92 12.18 15.68 13H12V17H13.08C12.97 17.68 12.97 18.35 13.08 19H4C2.9 19 2 18.11 2 17V5C2 3.9 2.9 3 4 3M4 7V11H10V7H4M12 7V11H18V7H12M4 13V17H10V13H4Z",
    mdiTableArrowUp = "M4 3H18C19.11 3 20 3.9 20 5V12.08C18.45 11.82 16.92 12.18 15.68 13H12V17H13.08C12.97 17.68 12.97 18.35 13.08 19H4C2.9 19 2 18.11 2 17V5C2 3.9 2.9 3 4 3M4 7V11H10V7H4M12 7V11H18V7H12M4 13V17H10V13H4M21.94 17.5H19.94V21.5H17.94V17.5H15.94L18.94 14.5L21.94 17.5",
    mdiTableArrowDown = "M4 3H18C19.11 3 20 3.9 20 5V12.08C18.45 11.82 16.92 12.18 15.68 13H12V17H13.08C12.97 17.68 12.97 18.35 13.08 19H4C2.9 19 2 18.11 2 17V5C2 3.9 2.9 3 4 3M4 7V11H10V7H4M12 7V11H18V7H12M4 13V17H10V13H4M15.94 18.5H17.94V14.5H19.94V18.5H21.94L18.94 21.5L15.94 18.5",
    mdiTableMultiple = "M7 2H21C22.11 2 23 2.9 23 4V16C23 17.11 22.11 18 21 18H7C5.9 18 5 17.11 5 16V4C5 2.9 5.9 2 7 2M7 6V10H13V6H7M15 6V10H21V6H15M7 12V16H13V12H7M15 12V16H21V12H15M3 20V6H1V20C1 21.11 1.89 22 3 22H19V20H3Z",
    useStyles = makeStyles(theme => ({
        popupPaper: {
            overflowY: "auto",
            maxHeight: 300,
            border: `2px solid ${theme.palette.secondary.main}`,
        },
        btnGroup: {
            marginRight: 4,
        },
        toolbar: {
            display: "flex",
            // overflow: "auto",
            marginBottom: 4,
        },
        menu: {
            "& .MuiMenu-paper": {
                maxHeight: 300,
                overflow: "auto",
                //transform: "translateY(40px)",
                marginTop: 40,
            },
            "&::webkit-scrollbar": {
                display: "none",
            },
        },
        field: {
            marginTop: 8,
        },
        symbol: {
            height: 24,
            width: 24,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "50%",
            margin: 2,
            "&:hover": {
                backgroundColor: theme.palette.text.hint,
            },
        },
        activeSymbol: {
            color: theme.palette.secondary.main,
        },
        infoText: {
            color: theme.palette.secondary.main,
        },
        edit: {
            color: theme.palette.secondary.main,
            marginRight: 8,
        },
        delete: {
            color: theme.palette.error.main,
        },
        commentField: {
            "& textarea": {
                color: theme.palette.text.primary,
            },
            width: "calc(100% - 64px)",
        },
        findReplace: {
            position: "fixed",
            top: 8,
            right: 8,
        },
        rotate0: {
            transform: "rotate(0deg)",
            transition: "all 0.5s",
        },
        rotate180: {
            transform: "rotate(180deg)",
            transition: "all 0.5s",
        },
        opacity0: {
            opacity: 0,
        },
        opacity1: {
            opacity: 1,
        },
        equationBtn: {
            "&, & :first-child": {
                height: 40,
                width: 40,
                padding: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            },
        },
        contextMenu: {
            overflow: "auto",
            maxHeight: 320,
            width: 200,
            "& .MuiListItemIcon-root": {
                minWidth: "initial",
            },
        },
        mr2: {
            marginRight: 2,
        },
        mb4: {
            marginBottom: 4,
        },
    })),
    replacements = [
        {start: "*", end: "*", format: "italic"},
        {start: "**", end: "**", format: "bold"},
        {start: "#", format: "h1"},
        {start: "##", format: "h2"},
        {start: "###", format: "h3"},
        {start: "####", format: "h4"},
        {start: "#####", format: "h5"},
        {start: "######", format: "h6"},
        {start: "1. ", cmd: "InsertOrderedList"},
        {start: "* ", cmd: "InsertUnorderedList"},
        {start: "- ", cmd: "InsertUnorderedList" },
        {start: "---", replacement: "<hr />"},
        {start: "--", replacement: "—"},
        {start: "-", replacement: "—"},
        {start: "(c)", replacement: "©"},
        {start: "(r)", replacement: "®"},
        {start: "(C)", replacement: "©"},
        {start: "(R)", replacement: "®"},
    ],
    fontSizes = [6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 28, 32, 36, 44, 56, 72],
    stop = e => e.preventDefault(),
    arraysEqual = (array1, array2) => (
        (array1 && array2) && (array1.length === array2.length && array1.every(v => array2.includes(v)))
    ),
    nextNode = node => {
        if (node.hasChildNodes()) {
            return node.firstChild;
        } else {
            while (node && !node.nextSibling) {
                node = node.parentNode;
            }
            if (!node) {
                return null;
            }
            return node.nextSibling;
        }
    },
    getRangeSelectedNodes = range => {
        let node = range.startContainer;
        const endNode = range.endContainer;
        if (node === endNode) {
            return [node];
        }
        let rangeNodes = [];
        while (node && node !== endNode) {
            rangeNodes.push( node = nextNode(node) );
        }
        node = range.startContainer;
        while (node && node !== range.commonAncestorContainer) {
            rangeNodes.unshift(node);
            node = node.parentNode;
        }
        return rangeNodes;
    },
    stopProp = {
        onMouseDown: stop,
    },
    DropDownMenu = props => {
        const classes = useStyles();
        return (
            <>
                <ToggleButtonGroup
                    size="small"
                    value={props.isOpen ? "selected" : ""}
                    className={classes.btnGroup}
                >
                    <Tooltip
                        title={props.title}
                        value="selected"
                        PopperProps={{
                            className: classes[props.isOpen ? "opacity0" : "opacity1"],
                        }}
                    >
                        <Box clone width={typeof(props.icon) === "string" ? 57 : null}>
                            <ToggleButton
                                value="selected"
                                onClick={props.open}
                                {...stopProp}
                            >
                                {props.icon}
                                <Box clone ml="auto">
                                    <KeyboardArrowDown className={classes[props.isOpen ? "rotate180" : "rotate0"]} />
                                </Box>
                            </ToggleButton>
                        </Box>
                    </Tooltip>
                </ToggleButtonGroup>
                <Menu
                    anchorEl={props.anchorEl}
                    open={props.isOpen}
                    onClose={props.close}
                    className={classes.menu}
                    variant="menu"
                >
                    {props.children}
                </Menu>
            </>
        );
    },
    StandAloneBtn = ({ title, value, fn, icon, className, onChange = null, disabled = [], ...other }) => {
        const classes = useStyles();
        return (
            <ToggleButtonGroup
                size="small"
                className={classes.btnGroup}
                value={value}
                onChange={onChange}
                {...other}
            >
                {title.map((x, i) => (
                    <Tooltip title={x} value={onChange !== null ? x : "value"} key={i}>
                        <ToggleButton
                            value={onChange !== null ? x : "value"}
                            onClick={fn[i]}
                            {...stopProp}
                            disabled={disabled[i]}
                            //className={className[i]}
                        >
                            {icon[i]}
                        </ToggleButton>
                    </Tooltip>
                ))}
            </ToggleButtonGroup>
        );
    },
    initialAnchorEls = {
        fontSize: null,
        fontFamily: null,
        block: null,
        color: null,
        background: null,
        table: null,
        link: null,
        image: null,
        video: null,
        findReplace: null,
    },
    initialValues = {
        url: "",
        alt: "",
        rows: "3",
        cols: "3",
        newComment: "",
        currentComment: null,
        tableColor: "#9E9E9E",
        tableStriped: false,
        filledCol: false,
        filledHeader: false,
        find: "",
        replace: "",
        wholeWord: false,
        caseStrict: false,
    },
    initialHelpers = {
        url: "",
        alt: "",
        rows: "",
        cols: "",
    },
    initialFilters = {
        blur: 0,
        brightness: 1,
        contrast: 1,
        grayscale: 0,
        "hue-rotate": 0,
        invert: 0,
        opacity: 1,
        saturate: 1,
        sepia: 0,
    },
    maxFilters = {
        blur: 4,
        brightness: 2,
        contrast: 2,
        grayscale: 1,
        "hue-rotate": 360,
        invert: 1,
        opacity: 1,
        saturate: 2,
        sepia: 1,
    },
    filterUnits = {
        blur: "px",
        brightness: "",
        contrast: "",
        grayscale: "",
        "hue-rotate": "deg",
        invert: "",
        opacity: "",
        saturate: "",
        sepia: "",
    };
let oldDecoration = "", oldScript = "", oldAlignment = "Left", oldLinkHref = "", oldIsQuote = false, oldColor = "#000000", oldBackground = "#ffffff", oldFontSize = "16px", oldSelectedNode = null, oldCurrentNode = null, oldListType = "", oldIsEquation = false;
const isLarge = window.innerWidth > 600;
let globalOpen = isLarge;
export default () => {
    const
        classes = useStyles(),
        socket = useSocket(),
        request = useRequest(),
        title = useTitle(),
        snackbar = useSnackbar(),
        contrastText = useContraxtText(),
        findField = createRef(),
        isSmall = useMediaQuery("(max-width: 600px)"),
        [bookContent, setBookContent] = useState(null),
        [error, setError] = useState(null),
        dispatch = useDispatch(),
        { mode, code } = useParams(),
        history = useHistory(),
        [alignment, setAlignment] = useState("Left"),
        [decoration, setDecoration] = useState([]),
        [fontSize, setFontSize] = useState("16px"),
        [script, setScript] = useState(""),
        [listType, setListType] = useState(""),
        [anchorEls, setAnchorEls] = useState(initialAnchorEls),
        [background, setBackground] = useState("#ffffff"),
        [currentColor, setCurrentColor] = useState("#000000"),
        [colorType, setColorType] = useState("color"),
        [dialogOpen, setDialogOpen] = useState(false),
        [currentDialog, setCurrentDialog] = useState(""),
        [values, setValues] = useState(initialValues),
        [helpers, setHelpers] = useState(initialHelpers),
        [symbol, setSymbol] = useState(""),
        [hasUndo, setHasUndo] = useState(false),
        [hasRedo, setHasRedo] = useState(false),
        [isQuote, setIsQuote] = useState(false),
        [isEquation, setIsEquation] = useState(false),
        [linkHref, setLinkHref] = useState(""),
        [comments, setComments] = useState([]),
        commentsRef = useRef(comments),
        [selectedNode, setSelectedNode] = useState(null),
        [customBtnsOpen, setCustomBtnsOpen] = useState(false),
        [filter, setFilter] = useState("Opacity"),
        [filters, setFilters] = useState(initialFilters),
        [currentNode, setCurrentNode] = useState({}),
        [mouse, setMouse] = useState([null, null]),
        [findOpen, setFindOpen] = useState(false),
        [isSaved, setIsSaved] = useState(true),
        [toolbarOpen, setToolbarOpen] = useState(globalOpen),
        getBlock = (editor, node) => {
            let newBlock = "", el;
            const parents = name => editor.dom.getParents(node).find(x => x.nodeName === name);
            switch (node.nodeName) {
                case "TD":
                    newBlock = "Normal";
                    break;
                case "P":
                    newBlock = "Normal";
                    break;
                case "H1":
                    newBlock = "Heading 1";
                    break;
                case "H2":
                    newBlock = "Heading 2";
                    break;
                case "H3":
                    newBlock = "Heading 3";
                    break;
                case "H4":
                    newBlock = "Heading 4";
                    break;
                case "PRE":
                    newBlock = "Code";
                    break;
                default:
                    if (parents("TD")) {
                        newBlock = "Normal";
                        el = parents("TD");
                    }
                    if (parents("P")) {
                        newBlock = "Normal";
                        el = parents("P");
                    }
                    if (parents("H1")) {
                        newBlock = "Heading 1";
                        el = parents("H1");
                    }
                    if (parents("H2")) {
                        newBlock = "Heading 2";
                        el = parents("H2");
                    }
                    if (parents("H3")) {
                        newBlock = "Heading 3";
                        el = parents("H3");
                    }
                    if (parents("H4")) {
                        newBlock = "Heading 4";
                        el = parents("H4");
                    }
                    if (parents("PRE")) {
                        newBlock = "Code";
                        el = parents("PRE");
                    }
            }
            return [newBlock, el];
        },
        updateCheckbox = name => e => {
            setValues({
                ...values,
                [name]: e.target.checked,
            });
        },
        updateField = name => e => {
            const { value } = e.target;
            !((name === "rows" || name === "cols") && value !== "" && (!Number.isInteger(value * 1) || value * 1 < 1 || value * 1 > 10 || value.includes("."))) && setValues({
                ...values,
                [name]: value,
            });
            setHelpers({
                ...helpers,
                [name]: "",
            });
        },
        update = c => {
            request.put("/book", {
                failedMsg: "updating your book",
                done: () => socket.emit("book content update", code, c),
                body: {
                    book_id: code,
                    content: c,
                },
            });
        },
        focus = () => tinymce.activeEditor && tinymce.activeEditor.focus(),
        closeDialog = () => {
            setDialogOpen(false);
            setValues(initialValues);
            focus();
        },
        openDialog = name => () => {
            setCurrentDialog(name);
            setDialogOpen(true);
            closePoppers();
            if (name === "link") {
                setValues({
                    ...values,
                    alt: tinymce.activeEditor.selection.getSel().toString(),
                    url: linkHref,
                });
            }
        },
        insertHTML = html => tinymce.activeEditor && tinymce.activeEditor.undoManager.transact(() => tinymce.activeEditor.insertContent(html)),
        getNode = () => tinymce.activeEditor && tinymce.activeEditor.selection.getNode(),
        checkUrl = (name, successFn) => {
            if (values.url.trim() !== "") {
                fetch("http://" + values.url.replace("http://", "").replace("https://", "")).then(res => {
                    if (res.status === 404) {
                        setHelpers({
                            ...helpers,
                            url: `This url doesn't exist!`,
                        });
                    } else {
                        tinymce.activeEditor.undoManager.transact(successFn);
                    }
                })
                .catch(successFn);
            } else {
                setHelpers({
                    ...helpers,
                    url: `This ${name} needs a url!`,
                });
            }
        },
        insertBlock = () => {
            switch (currentDialog) {
                case "edit source":
                    if (selectedNode === "iframe") {
                        tinymce.activeEditor.undoManager.transact(() => {
                            tinymce.activeEditor.dom.remove(currentNode);
                            insertHTML(`<iframe src="https://www.youtube.com/embed/${values.url.replace("youtube.com/watch?v=", "").replace("https://", "").replace("www.", "").trim()}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`);
                        });
                    } else {
                        checkUrl("", () => {
                            if (selectedNode === "img") {
                                tinymce.activeEditor.dom.setAttrib(getNode(), "src", values.url);
                                tinymce.activeEditor.dom.setAttrib(getNode(), "data-mce-src", values.url);
                                tinymce.activeEditor.dom.setAttrib(getNode(), "alt", values.alt);
                            } else {
                                tinymce.activeEditor.dom.setAttrib(currentNode.firstChild.children[0], "src", values.url);
                                tinymce.activeEditor.dom.setAttrib(currentNode, "data-ephox-embed-iri", values.url);
                            }
                            setValues(initialValues);
                            setHelpers(initialHelpers);
                            closeDialog();
                        });
                    }
                    break;
                case "table":
                    if (values.cols.trim() === "" || values.rows.trim() === "") {
                        setHelpers({
                            ...helpers,
                            cols: "Tables need some rows!",
                            rows: "Tables need some columns!",
                        });
                    } else {
                        tinymce.activeEditor.undoManager.transact(() => tinymce.activeEditor.plugins.table.insertTable(values.cols * 1, values.rows * 1));
                        setValues(initialValues);
                        setHelpers(initialHelpers);
                        closeDialog();
                    }
                    break;
                case "image":
                    checkUrl("image", () => {
                        let src = "http://" + values.url.replace("http://", "").replace("https://", "");
                        const img = tinymce.activeEditor.dom.create("img", {src, alt: values.alt});
                        tinymce.activeEditor.selection.setNode(img);
                        tinymce.activeEditor.dom.fire(img, "click");
                        setSelectedNode("img");
                        setValues(initialValues);
                        setHelpers(initialHelpers);
                        closeDialog();
                    });
                    break;
                case "link":
                    checkUrl("link", () => {
                        let url = "http://" + values.url.replace("http://", "").replace("https://", "");
                        if (linkHref !== "") {
                            tinymce.activeEditor.dom.setAttrib(getNode().nodeName === "A" ? getNode() : tinymce.activeEditor.dom.getParents(getNode()).find(x => x.nodeName === "A"), "href", url);
                        } else {
                            if (values.alt !== "" && values.alt === tinymce.activeEditor.selection.getSel().toString()) {
                                tinymce.activeEditor.formatter.apply("text-color-#2196f3");
                                cmd("mceInsertLink", false, url)();
                            } else {
                                cmd("Delete");
                                insertHTML(`<a href="${url}" data-mce-href="${url}" data-mce-selected="inline-boundary">${values.alt === "" ? values.url : values.alt}</a>`);
                            }
                        }
                        setSelectedNode("link");
                        setValues(initialValues);
                        setHelpers(initialHelpers);
                        closeDialog();
                    });
                    break;
                case "video":
                    checkUrl("video", () => {
                        insertHTML(`<div style="width: 100%;" contenteditable="false" data-ephox-embed-iri=${values.url} data-mce-style="width: 100%;"><video style="width: 100%" controls><source src="${values.url}" />Video ${(values.alt === "" ? "here " : " ")  + values.alt}. Your browser doesn't support videos :( Here's the link to the file: ${values.url}</video><span class="mce-shim" data-mce-bogus="1"></span></div>`);
                        setSelectedNode("video");
                        setValues(initialValues);
                        setHelpers(initialHelpers);
                        closeDialog();
                    });
                    break;
                case "youtube video":
                    checkUrl("video", () => {
                        insertHTML(`<iframe src="https://www.youtube.com/embed/${values.url.replace("youtube.com/watch?v=", "").replace("https://", "").replace("www.", "").trim()}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`);
                        setSelectedNode("iframe");
                        setValues(initialValues);
                        setHelpers(initialHelpers);
                        closeDialog();
                    });
                    break;
                case "audio":
                    checkUrl("audio", () => {
                        insertHTML(`<div style="width: 100%;" contenteditable="false" data-ephox-embed-iri="${values.url}" data-mce-style="width: 100%;"><audio style="width: 100%;" controls="controls" data-mce-style="width: 100%;"><source src="${values.url}" type="audio/mpeg">Your browser doesn't support audio :( Here's the link to the file: ${values.url}</audio><span class="mce-shim" data-mce-bogus="1"></span></div>`);
                        setSelectedNode("audio");
                        setValues(initialValues);
                        setHelpers(initialHelpers);
                        closeDialog();
                    });
                    break;
                case "symbol":
                    tinymce.activeEditor.undoManager.transact(() => {
                        cmd("Delete")();
                        insertHTML(symbol);
                    });
                    closeDialog();
                    focus();
                    break;
            }
        },
        closePoppers = () => {
            setAnchorEls(initialAnchorEls);
        },
        closePopper = name => () => {
            setAnchorEls({
                ...anchorEls,
                [name]: null,
            });
        },
        openPopper = name => e => {
            setAnchorEls({
                ...anchorEls,
                [name]: e.currentTarget,
            });
        },
        applyFilters = () => {
            const node = getNode();
            let style = "filter: " + Object.keys(filters).map(i => `${i}(${filters[i] + filterUnits[i]})`).join(" ") + ";";
            tinymce.activeEditor.undoManager.transact(() => {
                tinymce.activeEditor.dom.setAttrib(node, "style", style);
                tinymce.activeEditor.dom.setAttrib(node, "data-mce-style", style);
            });
            closeDialog();
            focus();
        },
        changeFontSize = i => () => {
            /*tinymce.activeEditor.formatter.register("font-size-" + i, {
                inline: "span",
                styles: {
                    "font-size": i,
                },
            });*/
            tinymce.activeEditor.undoManager.transact(() => tinymce.activeEditor.formatter.apply("font-size-" + i));
            //cmd("mceAddUndoLevel")();
            setFontSize(i);
            closePoppers();
        },
        changeFontFamily = family => () => {
            /*tinymce.activeEditor.formatter.register("font-family-" + family, {
                inline: "span",
                styles: {
                    "font-family": (family.includes(" ") ? '"' : "") + family + (family.includes(" ") ? '"' : ""),
                },
            });*/
            tinymce.activeEditor.undoManager.transact(() => tinymce.activeEditor.formatter.apply("font-family-" + family));
            //cmd("mceAddUndoLevel")();
            closePoppers();
        },
        changeBlock = block => () => {
            let el = "p";
            if (block.includes("Head")) {
                el = "h" + block.split("Heading ")[1];
            } else if (block === "Quote") {
                el = "blockquote";
            } else if (block === "Code") {
                el = "pre";
            }
            tinymce.activeEditor.undoManager.transact(cmd("formatBlock", false, el));
            //cmd("mceAddUndoLevel")();
            closePoppers();
        },
        changeColor = color => () => {
            /*tinymce.activeEditor.formatter.register((colorType === "color" ? "text-color" : "background-color") + "-" + color, {
                inline: "span",
                styles: {
                    [colorType === "color" ? "color" : "background-color"]: color === "transparent" ?"transparent" : `rgb(${r}, ${g}, ${b})`,
                },
            });*/
            tinymce.activeEditor.undoManager.transact(() => tinymce.activeEditor.formatter.apply((colorType === "color" ? "text-color" : "background-color") + "-" + color));
            //cmd("mceAddUndoLevel")();
            if (colorType === "color") {
                setCurrentColor(color);
            } else {
                setBackground(color);
            }
            closePoppers();
        },
        cmd = (...args) => () => tinymce.activeEditor.execCommand(...args),
        addComment = e => {
            e.preventDefault();
            if (values.newComment !== "") {
                request.post("/book/comment", {
                    failedMsg: "creating this comment",
                    done: _id => {
                        setValues({
                            ...values,
                            currentComment: null,
                            newComment: "",
                        });
                        setComments([
                            ...comments,
                            {
                                content: values.newComment,
                                _id,
                            }
                        ]);
                        socket.emit("book comment created", code, {
                            content: values.newComment,
                            _id,
                        });
                    },
                    body: {
                        book_id: code,
                        content: values.newComment,
                    },
                });
                /*request("/book/comment", "POST", false, _id => {
                    setComments([
                        ...comments,
                        {
                            content: values.newComment,
                            _id,
                        }
                    ]);
                    socket.emit("book comment created", code, {
                        content: values.newComment,
                        _id,
                    });
                }, "creating this comment", {
                    book_id: code,
                    content: values.newComment,
                });*/
                //updateComments(newComments);
            }
        },
        editComment = _id => e => {
            const { target } = e;
            if (_id !== values.currentComment) {
                new Promise(res => {
                    res();
                    setValues({
                        ...values,
                        currentComment: _id,
                    });
                }).then(() => {
                    const textarea = tinymce.activeEditor.dom.getParents(target).find(x => x.nodeName === "LI").firstChild.firstChild.firstChild.firstChild;
                    textarea.focus();
                    setTimeout(() => textarea.selectionStart = textarea.selectionEnd = 10000, 0);
                });
            } else {
                commitComment(_id)();
            }
        },
        deleteComment = _id => () => {
            /*let newComments = [
                ...comments.slice(0, i),
                ...comments.slice(i + 1),
            ];*/
            setComments(comments.filter(c => c._id !== _id));
            request.delete("/book/comment", {
                failedMsg: "deleting this comment",
                done: () => socket.emit("book comment deleted", code, _id),
                body: {
                    book_id: code,
                    comment_id: _id,
                },
            });
            //updateComments(newComments);
        },
        commitComment = _id => () => {
            const { content } = comments.find(c => c._id === _id);
            setValues({
                ...values,
                currentComment: null,
            });
            request.put("/book/comment", {
                failedMsg: "editing this comment",
                done: () => socket.emit("book comment edited", code, {
                    _id,
                    content,
                }),
                body: {
                    book_id: code,
                    comment_id: _id,
                    content,
                },
            });
            /*request("/book/comment", "PUT", false, () => {
                socket.emit("book comment edited", code, {
                    _id,
                    content,
                });
            }, "editing this comment", {
                book_id: code,
                comment_id: _id,
                content,
            });*/
        },
        updateComment = _id => e => {
            /*let newComments = [
                ...comments.slice(0, i),
                e.target.value,
                ...comments.slice(i + 1),
            ];*/
            setComments(comments.map(c => c._id === _id ? { ...c, content: e.target.value } : c));
            //updateComments(newComments);
        },
        applyStyles = () => {
            closeDialog();
            const className = (values.tableStriped ? "table-striped " : " ") + (values.filledCol ? "filled-col " : " ") + (values.filledHeader ? "filled-header " : " ") + "table-color-" + values.tableColor.slice(1);
            tinymce.activeEditor.undoManager.transact(() => tinymce.activeEditor.dom.setAttrib(tinymce.activeEditor.dom.getParents(getNode()).find(x => x.nodeName === "TABLE"), "class", className));
        },
        closeMenu = () => {
            setMouse([null, null]);
        },
        getSelectedNodes = () => {
            const sel = tinymce.activeEditor.selection.getSel();
            if (!sel.isCollapsed) {
                return getRangeSelectedNodes(sel.getRangeAt(0)).filter(x => x && x.nodeName === "#text" && x.textContent !== "");
            }
            return [];
        },
        isFormat = x => {
            let isTrue = false;
            [...getSelectedNodes()].forEach(item => {
                isTrue = isTrue || (tinymce.activeEditor.formatter.match(x, {}, item.parentNode));
            });
            return isTrue;
        },
        isDefaultVal = name => (
            [...getSelectedNodes()].some(el => (
                !Object.keys(tinymce.activeEditor.formatter.get()).some(x => (
                    x.includes(name + "-") && tinymce.activeEditor.formatter.match(x, {}, el)))
                )
            )
        ),
        getSingleFormat = (el, name, defaultVal, i = 0) => {
            const elmatch = Object.keys(tinymce.activeEditor.formatter.get()).find(x => x.includes(name + "-") && (el.textContent !== "" ? tinymce.activeEditor.formatter.match(x, {}, el) : tinymce.activeEditor.formatter.match(x)));
            if (elmatch || el.nodeName === "BODY") {
                return elmatch ? elmatch.replace(name + "-", "") : defaultVal;
            }
            return getSingleFormat(el.parentNode, name, defaultVal, 1);
        },
        getFormat = (name, editor, currentEl) => {
            let defaultVal = "#000000";
            if (getNode().nodeName === "A") {
                defaultVal = "#2196f3";
            }
            if (name === "background-color") {
                defaultVal = "#ffffff";
            } else if (name === "font-family") {
                defaultVal = "Arial";
                if (isEquation || editor.formatter.match("equation", {}, currentEl)) {
                    defaultVal = "Cambria Math";
                }
            } else if (name === "font-size") {
                switch (getBlock(editor, currentEl)[0]) {
                    case "Heading 1":
                        defaultVal = "48px";
                        break;
                    case "Heading 2":
                        defaultVal = "36px";
                        break;
                    case "Heading 3":
                        defaultVal = "28px";
                        break;
                    case "Heading 4":
                        defaultVal = "24px";
                        break;
                    default:
                        defaultVal = "16px";
                }
                if (isEquation || editor.formatter.match("equation", {}, currentEl)) {
                    defaultVal = "20px";
                }
            }
            if (editor.selection.getSel().isCollapsed) {
                return [getSingleFormat(currentEl, name, defaultVal)];
            } else {
                let formats = Object.keys(editor.formatter.get()).filter(x => x.includes(`${name}-`) && isFormat(x));
                if (isDefaultVal(name)) {
                    formats.push(defaultVal);
                }
                return (formats.length < 1 || !formats[0]) ? [defaultVal] : [...new Set(formats.map(x => x.replace(`${name}-`, "")))];
            }
        },
        keyDownProp = {
            onKeyDown: e => {
                if (e.key === "Enter") {
                    insertBlock();
                }
            }
        },
        contextMenu = area => e => {
            if (!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) && !dialogOpen) {
                e.preventDefault();
                e.stopPropagation();
                const { top, left } = area === "editor"
                    ? tinymce.activeEditor.getContentAreaContainer().getBoundingClientRect()
                    : { top: 0, left: 0 };
                setMouse([e.clientX + left, e.clientY + top]);
                if (e.srcElement && (e.srcElement.nodeName === "AUDIO" || e.srcElement.nodeName === "VIDEO")) {
                    tinymce.activeEditor.selection.select(e.srcElement.parentNode);
                }
            }
        },
        alignmentOptions = [
            {
                label: "Left",
                icon: FormatAlignLeft,
            },
            {
                label: "Center",
                icon: FormatAlignCenter,
            },
            {
                label: "Right",
                icon: FormatAlignRight,
            },
            {
                label: "Justify",
                icon: FormatAlignJustify,
            },
        ],
        scriptOptions = [
            {
                label: "Superscript",
                icon: mdiFormatSuperscript,
            },
            {
                label: "Subscript",
                icon: mdiFormatSubscript,
            },
        ],
        decorationOptions = [
            {
                label: "Bold",
                icon: FormatBold,
            },
            {
                label: "Italic",
                icon: FormatItalic,
            },
            {
                label: "Underline",
                icon: FormatUnderlined,
            },
            {
                label: "Strikethrough",
                icon: StrikethroughS,
            },
        ],
        listOptions = [
            {
                label: "Bulleted List",
                icon: FormatListBulleted,
            },
            {
                label: "Numbered List",
                icon: FormatListNumbered,
            },
        ],
        editOptions = [
            {
                label: "Cut",
                icon: <Icon path={mdiContentCut} color="currentColor" size="24px" />,
            },
            {
                label: "Copy",
                icon: <Icon path={mdiContentCopy} color="currentColor" size="24px" />,
            },
            /*{
                label: "Paste",
                icon: (
                    <svg viewBox="0 0 24 24" className="MuiSvgIcon-root">
                        <path d="M19 2h-4.18C14.4.84 13.3 0 12 0c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm7 18H5V4h2v3h10V4h2v16z" />
                    </svg>
                ),
            },*/
        ],
        findReplace = tinymce.activeEditor && tinymce.activeEditor.contentCSS.length > 0 && (
            <Box whiteSpace="nowrap" display="flex">
                <Box display="flex" flexDirection={isSmall ? "column" : "row"}>
                    <Box display="flex" alignItems="center" className={classes[!isSmall ? "mr2" : "mb4"]}>
                        <Box clone width={160} mr={"4px !important"}>
                            <TextField
                                value={values.find}
                                onChange={updateField("find")}
                                placeholder="Find"
                                onKeyDown={e => e.key === "Enter" ? tinymce.activeEditor.plugins.searchreplace.next() : null}
                                onFocus={values.find !== "" ? () => tinymce.activeEditor.plugins.searchreplace.find(values.find, values.caseStrict, values.wholeWord) : null}
                                inputRef={findField}
                                variant="outlined"
                            />
                        </Box>
                        <StandAloneBtn
                            title={["Match Whole Word", "Case Sensitive"]}
                            onChange={() => {}}
                            fn={["wholeWord", "caseStrict"].map(x => () => setValues({...values, [x]: !values[x]}))}
                            icon={[<Icon size="24px" color="currentColor" path={mdiFormatLetterMatches} />, <Icon size="24px" color="currentColor" path={mdiFormatLetterCaseUpper} />]}
                            value={[values.caseStrict && "Case Sensitive", values.wholeWord && "Match Whole Word"]}
                        />
                        <StandAloneBtn
                            title={["Next", "Previous"]}
                            fn={[tinymce.activeEditor.plugins.searchreplace.next, tinymce.activeEditor.plugins.searchreplace.prev]}
                            icon={[<KeyboardArrowDown />, <KeyboardArrowUp />]}
                        />
                    </Box>
                    <Box display="flex" alignItems="center">
                        <Box clone width={160} mr={"4px !important"}>
                            <TextField
                                value={values.replace}
                                onChange={updateField("replace")}
                                placeholder="Replace"
                                onKeyDown={e => e.key === "Enter" ? () => () => tinymce.activeEditor.undoManager.transact(() => tinymce.activeEditor.plugins.searchreplace.replace(values.replace, true, false)) : null}
                                onFocus={values.find !== "" ? () => tinymce.activeEditor.plugins.searchreplace.find(values.find, values.caseStrict, values.wholeWord) : null}
                                className={classes.frField}
                                variant="outlined"
                            />
                        </Box>
                        <StandAloneBtn
                            title={["Replace", "Replace All"]}
                            fn={[() => tinymce.activeEditor.undoManager.transact(() => tinymce.activeEditor.plugins.searchreplace.replace(values.replace, true, false)), () => tinymce.activeEditor.undoManager.transact(() => tinymce.activeEditor.plugins.searchreplace.replace(values.replace, true, true))]}
                            icon={[<Done />, <DoneAll />]}
                            disabled={Array(2).fill(values.find === "")}
                        />
                        <StandAloneBtn
                            title={["Close"]}
                            fn={[() => {
                                setFindOpen(false);
                                tinymce.activeEditor.plugins.searchreplace.done();
                                focus();
                            }]}
                            icon={[<Close />]}
                        />
                    </Box>
                </Box>
            </Box>
        );
    let dialogContent = currentDialog !== "info" ? currentDialog !== "symbol" ? currentDialog !== "table" ? (
        <>
            <TextField
                label="URL"
                variant="outlined"
                value={values.url}
                onChange={updateField("url")}
                fullWidth
                className={classes.field}
                {...keyDownProp}
                autoFocus
                helperText={helpers.url + " "}
                error={helpers.url !== ""}
            />
            {((currentDialog === "link" && linkHref === "" && tinymce.activeEditor && tinymce.activeEditor.selection && tinymce.activeEditor.selection.getSel().toString().trim() === "") || selectedNode === "img" || currentDialog === "image") && (
                <TextField
                    label="Alt Text"
                    variant="outlined"
                    value={values.alt}
                    onChange={updateField("alt")}
                    fullWidth
                    className={classes.field}
                    {...keyDownProp}
                />
            )}
            {currentDialog === "image" && (
                <form>
                    <UploadBtn
                        multiple
                        accept="image/*"
                        onChange={e => {
                            const form = new FormData();
                            form.append("file", e.target.files[0]);
                            if (e.target.files[0].size >= 52428800) {
                                snackbar.error("Image too big");
                            } else {
                                request.post("/files/editor_images", {
                                    file: true,
                                    failedMsg: "uploading the image",
                                    done: data => {
                                        const img = tinymce.activeEditor.dom.create("img", {src: data.location, alt: values.alt});
                                        closeDialog();
                                        focus();
                                        tinymce.activeEditor.undoManager.transact(() => tinymce.activeEditor.selection.setNode(img));
                                    },
                                    body: form,
                                });
                            }
                        }}
                    />
                </form>
            )}
        </>
    ) : (
        <>
            <Box clone width="calc(50% - 4px)" mr={2}>
                <TextField
                    label="Rows"
                    variant="outlined"
                    value={values.rows}
                    onChange={updateField("rows")}
                    className={classes.field}
                    helperText={helpers.rows + " "}
                    error={helpers.rows !== ""}
                    autoFocus
                />
            </Box>
            <Box clone width="calc(50% - 4px)" mr={2}>
                <TextField
                    label="Columns"
                    variant="outlined"
                    value={values.cols}
                    onChange={updateField("cols")}
                    className={classes.field}
                    helperText={helpers.cols + " "}
                    error={helpers.cols !== ""}
                    {...keyDownProp}
                />
            </Box>
        </>
    ) : (
        <>
            <Typography variant="h5" gutterBottom>{symbol}</Typography>
            <Box display="flex" flexWrap="wrap">
                {entities.map(entity => (
                    <ButtonBase key={entity} className={`${classes.symbol} ${symbol === entity ? classes.activeSymbol : null}`} onClick={() => setSymbol(entity)}>
                        {entity}
                    </ButtonBase>
                ))}
            </Box>
        </>
    ) : (
        <div>
            <Typography gutterBottom>
                Word count:{" "}
                <span className={classes.infoText}>
                    {tinymce.activeEditor.plugins.wordcount.body.getWordCount()}
                </span>
            </Typography>
            <Typography gutterBottom>
                Character count:{" "}
                <span className={classes.infoText}>
                    {tinymce.activeEditor.plugins.wordcount.body.getCharacterCount()}
                </span>
            </Typography>
            <Typography gutterBottom>
                Character count (without spaces):{" "}
                <span className={classes.infoText}>
                    {tinymce.activeEditor.plugins.wordcount.body.getCharacterCountWithoutSpaces()}
                </span>
            </Typography>
        </div>
    );
    if (currentDialog === "comments") {
        dialogContent = (
            <>
                <form onSubmit={addComment}>
                    <Box display="flex" alignItems="center" mt={"4px"}>
                        <Box clone mr={2} flex={1}>
                            <TextField
                                variant="outlined"
                                label="Comment"
                                value={values.newComment}
                                onChange={updateField("newComment")}
                                autoFocus
                                onBlur={() => setValues({...values, currentComment: null})}
                            />
                        </Box>
                        <Box height={48}>
                            <Tooltip title="Add">
                                <div>
                                    <IconButton type="submit" color="primary" disabled={values.newComment === ""}>
                                        <Add />
                                    </IconButton>
                                </div>
                            </Tooltip>
                        </Box>
                    </Box>
                </form>
                <List>
                    {(comments || []).map((c, i) => (
                        <ListItem key={i}>
                            <TextField
                                value={c.content}
                                onChange={updateComment(c._id)}
                                placeholder="Comment"
                                multiline
                                disabled={values.currentComment !== c._id}
                                className={classes.commentField}
                                onDoubleClick={editComment(c._id)}
                                onBlur={commitComment(c._id)}
                                //onKeyDown={e => e.key === "Enter" && commitComment(c._id)}
                            />
                            <ListItemSecondaryAction>
                                <Tooltip title="Edit">
                                    <IconButton edge="end" aria-label="edit" onClick={editComment(c._id)}  className={classes.edit}>
                                        {values.currentComment === c._id ? <Done /> : <Edit />}
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete">
                                    <IconButton edge="end" aria-label="delete" onClick={deleteComment(c._id)} className={classes.delete}>
                                        <Delete />
                                    </IconButton>
                                </Tooltip>
                            </ListItemSecondaryAction>
                        </ListItem>
                    ))}
                </List>
            </>
        )
    } else if (currentDialog === "image filters") {
        dialogContent = (
            <Box display="flex" flexDirection="column-reverse">
                <Box clone width="100%">
                    <img
                        src={tinymce.activeEditor.dom.getAttrib(getNode(), "src")}
                        style={{
                            filter: Object.keys(filters).map(i => `${i}(${filters[i] + filterUnits[i]})`).join(" "), 
                        }}
                        alt=""
                    />
                </Box>
                <Box clone m={2} width="calc(100% - 16px)">
                    <Slider
                        step={maxFilters[filter.toLowerCase().replace(" ", "-")] / 100}
                        min={0}
                        max={maxFilters[filter.toLowerCase().replace(" ", "-")]}
                        value={filters[filter.toLowerCase().replace(" ", "-")]}
                        onChange={(e, newVal) => setFilters({...filters, [filter.toLowerCase().replace(" ", "-")]: newVal})}
                    />
                </Box>
                <Box display="flex" justifyContent="space-between">
                    <Button onClick={() => setFilters(initialFilters)}>Reset All</Button>
                    <Button
                        onClick={() => (
                            setFilters({
                                ...filters,
                                [filter.toLowerCase().replace(" ", "-")]: initialFilters[filter.toLowerCase().replace(" ", "-")]
                            })
                        )}
                    >
                        Reset
                    </Button>
                </Box>
                <Box overflow="auto" pb={2} whiteSpace="nowrap" textAlign="center">
                    <Box mx="auto" display="inline-block" width="auto">
                        <StandAloneBtn
                            value={filter}
                            exclusive
                            icon={[<BlurOn />, <BrightnessHigh />, <Exposure />, <FilterBAndW />, <RotateLeft />, <InvertColors />, <Opacity />, <Flare />, <Adjust />]}
                            title={["Blur", "Brightness", "Contrast", "Grayscale", "Hue Rotate", "Invert", "Opacity", "Saturate", "Sepia"]}
                            onChange={(e, newFilter) => newFilter !== null && setFilter(newFilter)}
                            fn={[...Array(10)].fill(null)}
                        />
                    </Box>
                </Box>
            </Box>
        );
    } else if (currentDialog === "table styles") {
        dialogContent = (
            <>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={values.tableStriped}
                            onChange={updateCheckbox("tableStriped")}
                        />
                    }
                    label="Striped Table"
                />
                <br />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={values.filledHeader}
                            onChange={updateCheckbox("filledHeader")}
                        />
                    }
                    label="Filled Header"
                />
                <br />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={values.filledCol}
                            onChange={updateCheckbox("filledCol")}
                        />
                    }
                    label="Filled First Column"
                />
                <br />
                <Typography gutterBottom>Table Colour</Typography>
                {["#03A9F4", "#00BCD4", "#4CAF50", "#8BC34A", "#CDDC39", "#FFEB3B", "#FFC107", "#FF9800", "#9E9E9E"].map(color => (
                    <Box color="#000 !important" bgcolor={color + " !important"} m={"2px"}>
                        {props => <Radio
                            checked={values.tableColor === color}
                            onChange={updateField("tableColor")}
                            value={color}
                            inputProps={{
                                "aria-label": color,
                            }}
                            {...props}
                        />}
                    </Box>
                ))}
            </>
        );
    }
    let customBtns = null;
    let contextBtns = [
        {
            label: "Link",
            icon: <Link />,
            fn: openDialog("link")
        },
        {
            label: "Bold",
            icon: <FormatBold />,
            fn: cmd("Bold")
        },
        {
            label: "Italic",
            icon: <FormatItalic />,
            fn: cmd("Italic")
        },
        {
            label: "Underline",
            icon: <FormatUnderlined />,
            fn: cmd("Underline")
        },
        {
            label: "Align Left",
            icon: <FormatAlignLeft />,
            fn: cmd("justifyLeft")
        },
        {
            label: "Align Center",
            icon: <FormatAlignCenter />,
            fn: cmd("justifyCenter")
        },
        {
            label: "Align Right",
            icon: <FormatAlignRight />,
            fn: cmd("justifyRight")
        },
        {
            label: "Superscript",
            icon: mdiFormatSuperscript,
            fn: cmd("superscript")
        },
        {
            label: "Subscript",
            icon: mdiFormatSubscript,
            fn: cmd("subscript")
        },
    ];
    if (isEquation) {
        customBtns = equationSymbols.filter((x, i, arr) => x.replacement && !arr.slice(0, i).some(a => a.replacement === x.replacement)).map(x => ({
            label: x.start,
            icon: <Box component="span" fontSize={24}>{x.replacement}</Box>,
            fn: () => insertHTML(x.replacement),
        }));
    } else if (linkHref !== "") {
        customBtns = [
            {
                label: "Open Link",
                icon: mdiOpenInNew,
                fn: () => window.open(linkHref, "_blank"),
            },
            {
                label: "Edit Link",
                icon: mdiPencil,
                fn: openDialog("link"),
            },
            {
                label: "Remove Link",
                icon: mdiLinkOff,
                fn: () => {
                    cmd("Unlink")();
                    tinymce.activeEditor.formatter.remove("text-color-#2196f3", {}, getNode());
                },
            },
        ];
        contextBtns = [
            ...contextBtns.slice(1),
            ...customBtns,
        ];
    } else if (selectedNode === "img") {
        customBtns = [
            {
                label: "Rotate Right",
                icon: mdiRotateRight,
                fn: cmd("mceImageRotateRight"),
            },
            {
                label: "Rotate Left",
                icon: mdiRotateLeft,
                fn: cmd("mceImageRotateLeft"),
            },
            {
                label: "Flip Vertical",
                icon: mdiFlipVertical,
                fn: cmd("mceImageFlipVertical"),
            },
            {
                label: "Flip Horizontal",
                icon: mdiFlipHorizontal,
                fn: cmd("mceImageFlipHorizontal"),
            },
            {
                label: "Image Filters",
                icon: mdiTune,
                fn: () => {
                    let newFilters = {};
                    const node = getNode();
                    let style = tinymce.activeEditor.dom.getAttrib(node, "style");
                    if (style.includes("filter: ")) {
                        style = style.split("filter: ")[1].split(";")[0].split(" ");
                        style.forEach(x => {
                            newFilters[x.split("(")[0]] = x.split("(")[1].split(")")[0].replace(/[a-zA-Z]/g, "") * 1;
                        });
                    }
                    setFilters({
                        ...initialFilters,
                        ...newFilters,
                    });
                    openDialog("image filters")();
                    tinymce.activeEditor.dom.fire(node, "click");
                },
            },
            {
                label: "Edit Source",
                icon: mdiPencil,
                fn: () => {
                    const node = getNode();
                    setValues({
                        ...values,
                        alt: tinymce.activeEditor.dom.getAttrib(node, "alt"),
                        url: node.src,
                    });
                    openDialog("edit source")();
                    tinymce.activeEditor.dom.fire(node, "click");
                },
            },
            {
                label: "Delete",
                icon: mdiDelete,
                fn: cmd("Delete"),
            },
        ];
        contextBtns = customBtns;
    } else if (selectedNode === "table") {
        customBtns = [
            {
                label: "Insert Column Before",
                icon: mdiTableColumnPlusBefore,
                fn: () => {
                    const table = tinymce.activeEditor.dom.getParents(getNode()).find(x => x.nodeName === "TBODY");
                    if ([...table.firstChild.childNodes].every((x, i, arr) => Math.round(x.style.width.replace("%", "")) === Math.round(arr[0].style.width.replace("%", "")))) {
                        tinymce.activeEditor.undoManager.transact(() => {
                            cmd("mceTableInsertColBefore")();
                            const tds = [...table.firstChild.childNodes].length;
                            [...table.childNodes].forEach(row => [...row.childNodes].forEach(cell => {
                                tinymce.activeEditor.dom.setAttrib(cell, "style", tinymce.activeEditor.dom.getAttrib(cell, "style") + "width: " + 100 / (tds + 1) + "%");
                            }));
                        });
                    } else {
                        cmd("mceTableInsertColBefore")();
                    }
                },
            },
            {
                label: "Insert Column After",
                icon: mdiTableColumnPlusAfter,
                fn: () => {
                    const table = tinymce.activeEditor.dom.getParents(getNode()).find(x => x.nodeName === "TBODY");
                    if ([...table.firstChild.childNodes].every((x, i, arr) => Math.round(x.style.width.replace("%", "")) === Math.round(arr[0].style.width.replace("%", "")))) {
                        tinymce.activeEditor.undoManager.transact(() => {
                            cmd("mceTableInsertColAfter")();
                            const tds = [...table.firstChild.childNodes].length;
                            [...table.childNodes].forEach(row => [...row.childNodes].forEach(cell => {
                                tinymce.activeEditor.dom.setAttrib(cell, "style", tinymce.activeEditor.dom.getAttrib(cell, "style") + "width: " + 100 / (tds + 1) + "%");
                            }));
                        });
                    } else {
                        cmd("mceTableInsertColAfter")();
                    }
                },
            },
            {
                label: "Delete Column",
                icon: mdiTableColumnRemove,
                fn: cmd("mceTableDeleteCol"),
            },
            {
                label: "Insert Row Before",
                icon: mdiTableRowPlusBefore,
                fn: cmd("mceTableInsertRowBefore"),
            },
            {
                label: "Insert Row After",
                icon: mdiTableRowPlusAfter,
                fn: cmd("mceTableInsertRowAfter"),
            },
            {
                label: "Delete Row",
                icon: mdiTableRowRemove,
                fn: cmd("mceTableDeleteRow"),
            },
            {
                label: "Cut Row",
                icon: mdiTableMinus,
                fn: cmd("mceTableCutRow"),
            },
            {
                label: "Copy Row",
                icon: mdiTableMultiple,
                fn: cmd("mceTableCopyRow"),
            },
            {
                label: "Paste Row Before",
                icon: mdiTableArrowUp,
                fn: cmd("mceTablePasteRowBefore"),
            },
            {
                label: "Paste Row After",
                icon: mdiTableArrowDown,
                fn: cmd("mceTablePasteRowAfter"),
            },
            {
                label: "Merge Cells",
                icon: mdiTableMergeCells,
                fn: cmd("mceTableMergeCells"),
            },
            {
                label: "Split Cells",
                icon: mdiArrowSplitVertical,
                fn: cmd("mceTableSplitCells"),
            },
            {
                label: "Table Styles",
                icon: mdiBrush,
                fn: () => {
                    openDialog("table styles")();
                    const className = tinymce.activeEditor.dom.getAttrib(tinymce.activeEditor.dom.getParents(getNode()).find(x => x.nodeName === "TABLE"), "class") || "";
                    setValues({
                        ...values,
                        tableStriped: className.includes("table-striped"),
                        filledHeader: className.includes("filled-header"),
                        filledCol: className.includes("filled-col"),
                        tableColor: className.includes("table-color-") ? "#" + className.split("table-color-")[1] : "#9E9E9E",
                    });
                },
            },
            {
                label: "Equalise Width",
                icon: mdiTableColumnWidth,
                fn: () => {
                    const table = tinymce.activeEditor.dom.getParents(getNode()).find(x => x.nodeName === "TBODY");
                    const tds = [...table.firstChild.childNodes].length;
                    [...table.childNodes].forEach(row => [...row.childNodes].forEach(cell => {
                        tinymce.activeEditor.dom.setAttrib(cell, "style", "width: " + 100 / tds + "%");
                    }));
                },
            },
            {
                label: "Delete Table",
                icon: mdiDelete,
                fn: cmd("mceTableDelete"),
            },
        ];
        contextBtns = customBtns;
    } else if (selectedNode === "video" || selectedNode === "audio") {
        customBtns = [
            {
                label: "Edit Source",
                icon: mdiPencil,
                fn: () => {
                    setValues({
                        ...values,
                        url: getNode().firstChild.children[0].src,
                    });
                    openDialog("edit source")();
                },
            },
            {
                label: "Delete",
                icon: mdiDelete,
                fn: cmd("Delete"),
            },
        ];
        contextBtns = customBtns;
    } else if (selectedNode === "iframe") {
        customBtns = [
            {
                label: "Edit Source",
                icon: mdiPencil,
                fn: () => {
                    setValues({
                        ...values,
                        url: getNode().children[0].src,
                    });
                    openDialog("edit source")();
                },
            },
            {
                label: "Delete",
                icon: mdiDelete,
                fn: cmd("Delete"),
            },
        ];
        contextBtns = customBtns;
    }
    useEffect(() => {
        console.log("mount");
        request.get(`/book/${code}`, {
            failedMsg: "loading your book",
            setLoading: true,
            done: data => {
                console.log(data);
                dispatch({
                    type: "/moreActions",
                    payload: [{
                        fn: () => setToolbarOpen(!globalOpen),
                        label: "Toggle Toolbar"
                    }]
                });
                socket.emit("join", code);
                setError(null);
                let newContent = data.content || "";
                if (data.type === "student") {
                    history.replace(`/book/${code}/edit`);
                    if (new Date().toDateString() !== data.lastEdited) {
                        newContent = newContent + `<br><hr><span data-mce-style="color: #9E9E9E;" style="color: rgb(158, 158, 158);">${new Date().toLocaleDateString()}</span><br><br><p></p>`;
                    }
                } else {
                    history.replace(`/book/${code}/view`);
                }
                setComments(data.comments);
                setBookContent(newContent);
                title(data.name);
            },
            errors: () => dispatch({
                type: "LOAD_ERROR",
                payload: "This book couldn't be found",
            }),
        });
        /*request(`/book/${code}`, "GET", true, data => {
            dispatch({
                type: "/moreActions",
                payload: [{
                    fn: () => {
                        setToolbarOpen(!globalOpen);
                    },
                    label: "Toggle Toolbar"
                }]
            });
            socket.emit("join", code);
            setError(null);
            let newContent = data.content || "";
            if (data.type === "student") {
                history.replace(`/book/${code}/edit`);
                if (new Date().toDateString() !== data.lastEdited) {
                    newContent = newContent + `<br><hr><span data-mce-style="color: #9E9E9E;" style="color: rgb(158, 158, 158);">${new Date().toLocaleDateString()}</span><br><br><p></p>`;
                }
            } else {
                history.replace(`/book/${code}/view`);
            }
            setComments(data.comments);
            setBookContent(newContent);
            pageTitle(data.name);
        }, "loading your book", undefined, () => dispatch({
            type: "LOAD_ERROR",
            payload: "This book couldn't be found",
        }));*/
        const onKeyDown = e => {
            if (isHotkey("mod+p", e)) {
                cmd("mcePrint")();
            } else if (isHotkey("mod+z", e)) {
                cmd("undo")();
            } else if (isHotkey("mod+shift+z", e) || isHotkey("mod+y", e)) {
                cmd("redo")();
            } else if (isHotkey("escape", e)) {
                setAnchorEls(initialAnchorEls);
                closeDialog();
                closePoppers();
                setFindOpen(false);
            } else if (isHotkey("mod+f", e)) {
                e.preventDefault();
                setFindOpen(true);
            }
        }
        document.addEventListener("keydown", onKeyDown);
        socket.on("book content updated", (book_id, newContent) => {
            if (book_id === code && tinymce.activeEditor) {
                tinymce.activeEditor.getBody().innerHTML = newContent;
            }
        });
        socket.on("book comment", (book_id, newComments) => {
            if (book_id === code) {
                setComments(newComments);
            }
        });
        socket.on("book comment created", (book_id, c) => {
            if (book_id === code) {
                setComments([...commentsRef.current, c]);
            }
        });
        socket.on("book comment deleted", (book_id, _id) => {
            if (book_id === code) {
                setComments(commentsRef.current.filter(c => c._id !== _id));
            }
        });
        socket.on("book comment edited", (book_id, comment) => {
            if (book_id === code) {
                setComments(commentsRef.current.map(c => c._id === comment._id ? {...c, content: comment.content} : c));
            }
        });
        document.querySelector("*").addEventListener("contextmenu", contextMenu("doc"));
        window.addEventListener("resize", closeMenu);
        return () => {
            document.removeEventListener("keydown", onKeyDown);
            document.querySelector("*").removeEventListener("contextmenu", contextMenu("doc"));
            window.removeEventListener("resize", closeMenu);
            if (!isSaved) {
                request.put("/book", {
                    failedMsg: "updating your book",
                    body: {
                        book_id: code,
                        content: tinymce.activeEditor.getContent(),
                    },
                    done: () => {
                        setIsSaved(true);
                        socket.emit("book content update", code, tinymce.activeEditor.getContent());
                    }
                });
                /*request("/book", "PUT", false, () => {
                    setIsSaved(true);
                    socket.emit("book content update", code, tinymce.activeEditor.getContent());
                }, "updating your book", {
                    book_id: code,
                    content: tinymce.activeEditor.getContent(),
                });*/
            }
            socket.emit("leave", code);
        }
    }, []);
    useEffect(() => {
        globalOpen = toolbarOpen;
    }, [toolbarOpen]);
    useEffect(() => {
        commentsRef.current = comments;
    }, [comments]);
    useEffect(() => {
        if (anchorEls.background) {
            colorType !== "background" && setColorType("background");
        } else if (anchorEls.color) {
            colorType !== "color" && setColorType("color");
        }
    }, [anchorEls.background, anchorEls.color]);
    useEffect(() => {
        customBtnsOpen && setCustomBtnsOpen(false);
    }, [selectedNode]);
    useEffect(() => {
        values.find.trim() !== "" && tinymce.activeEditor.plugins.searchreplace.find(values.find, values.caseStrict, values.wholeWord);
    }, [values.wholeWord, values.caseStrict, values.find]);
    useEffect(() => {
        findOpen && findField.current.focus();
    }, [findOpen]);
    if (!error && tinymce.activeEditor && tinymce.activeEditor.dom && tinymce.activeEditor.dom.select("audio")[0]) {
        tinymce.activeEditor.dom.select("audio").forEach(audio => {
            audio.onfocus = () => tinymce.activeEditor.selection.select(audio.parentNode);
            audio.onmousedown = () => {
                tinymce.activeEditor.selection.select(audio.parentNode);
                tinymce.activeEditor.dom.setAttrib(audio.parentNode, "data-mce-selected", "1");
            }
        });
    };
    if (!error && tinymce.activeEditor && tinymce.activeEditor.dom && tinymce.activeEditor.dom.select("img")[0]) {
        tinymce.activeEditor.dom.select("img").forEach(img => {
            img.onmousedown = () => {
                tinymce.activeEditor.selection.select(img);
            }
        });
    };
    window.addEventListener("beforeunload", e => {
        if (!isSaved) {
            return "Currently, your book content hasn't been saved. If you leave now, you'll lose changes. Are you sure?";
        }
    });
    return (
        !error ?
            <Box className={tinymce.activeEditor && tinymce.activeEditor.contentCSS.length > 0 && bookContent !== null ? "fadeup" : null} height={1} flex={1} display="flex" flexDirection="column" maxWidth={1280}>
                <Box display="flex" flexDirection="column" flex={1} zIndex={1200}>
                    {tinymce.activeEditor && tinymce.activeEditor.contentCSS.length > 0 && bookContent !== null ? (
                        <AnimateHeight duration={500} height={toolbarOpen ? "auto" : 0} animateOpacity>
                            {mode === "edit" ?
                                <Box overflow="auto" height={96} mb="4px">
                                    {findOpen && isSmall ? findReplace : (
                                        <>
                                            <div className={classes.toolbar}>
                                                {customBtnsOpen && isEquation ? (
                                                    <ToggleButtonGroup size="small" className={classes.btnGroup}>
                                                        <Tooltip title="Fraction">
                                                            <ToggleButton
                                                                className={classes.equationBtn}
                                                                value="frac"
                                                                onClick={() => tinymce.activeEditor.insertContent("<span>&nbsp;<span class='frac'><sup>&nbsp;&nbsp;</sup><span class='slash'>/</span><sub>&nbsp;&nbsp;</sub></span><span>&nbsp;</span></span>")}
                                                                {...stopProp}
                                                            >
                                                                <Icon path={mdiSlashForwardBox} size="24px" color="currentColor" />
                                                            </ToggleButton>
                                                        </Tooltip>
                                                        {customBtns && customBtns.slice(0, Math.ceil(customBtns.length / 2)).map(btn => (
                                                            <Tooltip title={btn.label} key={btn.label}>
                                                                <ToggleButton
                                                                    value={btn.label}
                                                                    onClick={btn.fn}
                                                                    {...stopProp}
                                                                    className={classes.equationBtn}
                                                                >
                                                                    {typeof btn.icon === "string" ? (
                                                                        <Icon path={btn.icon} size="24px" color="currentColor" />
                                                                    ) : btn.icon}
                                                                </ToggleButton>
                                                            </Tooltip>
                                                        ))}
                                                    </ToggleButtonGroup>
                                            ) : (
                                                <>
                                        <ToggleButtonGroup
                                            value={decoration}
                                            size="small"
                                            className={classes.btnGroup}
                                            //onChange={(e, newVal) => setDecoration(newVal)}
                                        >
                                            {decorationOptions.map(option => (
                                                <Tooltip title={option.label} key={option.label} value={option.label}>
                                                    <ToggleButton
                                                        value={option.label}
                                                        onClick={cmd(option.label)}
                                                        {...stopProp}
                                                    >
                                                        <option.icon />
                                                    </ToggleButton>
                                                </Tooltip>
                                            ))}
                                        </ToggleButtonGroup>
                                        <ToggleButtonGroup
                                            size="small"
                                            value={alignment}
                                            exclusive
                                            className={classes.btnGroup}
                                            onChange={(e, newVal) => newVal !== null && setAlignment(newVal)}
                                        >
                                            {alignmentOptions.map(option => (
                                                <Tooltip title={"Align " + option.label} key={option.label} value={option.label}>
                                                    <ToggleButton
                                                        value={option.label}
                                                        onClick={option.label !== alignment ? cmd("justify" + (option.label.includes("ify") ? "Full" : option.label)) : null}
                                                        {...stopProp}
                                                    >
                                                        <option.icon />
                                                    </ToggleButton>
                                                </Tooltip>
                                            ))}
                                        </ToggleButtonGroup>
                                        <ToggleButtonGroup
                                            value={script}
                                            size="small"
                                            className={classes.btnGroup}
                                            exclusive
                                            //onChange={(e, newVal) => setScript(newVal)}
                                        >
                                            {scriptOptions.map((option, i) => (
                                                <Tooltip title={option.label} key={option.label} value={option.label}>
                                                    <ToggleButton
                                                        value={option.label}
                                                        onClick={() => {
                                                            new Promise(res => {
                                                                res();
                                                                script === scriptOptions[(i - 1) ** 2].label && cmd(scriptOptions[(i - 1) ** 2].label)();
                                                                ;
                                                            }).then(cmd(option.label));
                                                        }}
                                                        {...stopProp}
                                                    >
                                                        <Icon path={option.icon} size="24px" color="currentColor" />
                                                    </ToggleButton>
                                                </Tooltip>
                                            ))}
                                        </ToggleButtonGroup>
                                        <ToggleButtonGroup
                                            size="small"
                                            value={Boolean(anchorEls.color) ? "color" : Boolean(anchorEls.background) ? "background" : ""}
                                            className={classes.btnGroup}
                                        >
                                            <Tooltip
                                                title="Text Color"
                                                value="color"
                                                PopperProps={{
                                                    className: classes[Boolean(anchorEls.color) ? "opacity0" : "opacity1"],
                                                }}
                                            >
                                                <ToggleButton
                                                    value="fontSize"
                                                    onClick={openPopper("color")}
                                                    {...stopProp}
                                                    className="colorbtn"
                                                    style={{
                                                        backgroundColor: (currentColor.match(" ") || []).length < 1 ? currentColor : "initial",
                                                        color: (currentColor.match(" ") || []).length < 1 ? contrastText(currentColor) : "inherit",
                                                    }}
                                                >
                                                    <FormatColorText />
                                                    <KeyboardArrowDown className={classes[anchorEls.color ? "rotate180" : "rotate0"]} />
                                                </ToggleButton>
                                            </Tooltip>
                                            <Tooltip
                                                title="Background"
                                                value="background"
                                                PopperProps={{
                                                    className: classes[Boolean(anchorEls.background) ? "opacity0" : "opacity1"],
                                                }}
                                            >
                                                <ToggleButton
                                                    value="background"
                                                    onClick={openPopper("background")}
                                                    {...stopProp}
                                                    className="colorbtn"
                                                    style={{
                                                        backgroundColor: (background.match(" ") || []).length < 1 ? background : "initial",
                                                        color: (background.match(/ /g) || []).length < 1 ? contrastText(background) : "inherit",
                                                    }}
                                                >
                                                    <FormatColorFill />
                                                    <KeyboardArrowDown className={classes[anchorEls.background ? "rotate180" : "rotate0"]} />
                                                </ToggleButton>
                                            </Tooltip>
                                        </ToggleButtonGroup>
                                        <Menu
                                            anchorEl={anchorEls.background ? anchorEls.background : anchorEls.color}
                                            open={Boolean(anchorEls.background) ? Boolean(anchorEls.background) : Boolean(anchorEls.color)}
                                            className={classes.menu}
                                            variant="menu"
                                            onClose={closePopper(colorType)}
                                        >
                                            <Box clone bgcolor="#fff" height={24} width={24} color="#000">
                                                <ButtonBase
                                                    onClick={changeColor("#ffffff")}
                                                    {...stopProp}
                                                >
                                                    {(colorType === "color" ? currentColor : background).includes("#ffffff") && (
                                                        <Done />
                                                    )}
                                                </ButtonBase>
                                            </Box>
                                            <Box clone bgcolor="#000" height={24} width={24} color="#fff">
                                                <ButtonBase
                                                    onClick={changeColor("#000000")}
                                                    {...stopProp}
                                                >
                                                    {(colorType === "color" ? currentColor : background).includes("#000000") && (
                                                        <Done />
                                                    )}
                                                </ButtonBase>
                                            </Box>
                                            <Box display="flex">
                                                {Object.values(colors).slice(1).filter((x, i) => ![3, 6, 8, 10, 13, 15].includes(i)).map((obj, i) => (
                                                    <Box display="flex" flexDirection="column" key={i}>
                                                        {Object.values(obj).slice(2, 9).map((color, j) => (
                                                            <Box clone bgcolor={color} height={24} width={24} color={contrastText(color)} key={i + "" + j}>
                                                                <ButtonBase
                                                                    onClick={changeColor(color)}
                                                                    {...stopProp}
                                                                >
                                                                    {(colorType === "color" ? currentColor : background).includes(color) && (
                                                                        <Done />
                                                                    )}
                                                                </ButtonBase>
                                                            </Box>
                                                        ))}
                                                    </Box>
                                                ))}
                                            </Box>
                                        </Menu>
                                        <DropDownMenu
                                            close={e => closePopper("fontSize")(e)}
                                            open={e => openPopper("fontSize")(e)}
                                            anchorEl={anchorEls.fontSize}
                                            icon={(fontSize.match(" ") || []).length > 0 ? "" : fontSize.replace("px", "")}
                                            isOpen={Boolean(anchorEls.fontSize)}
                                            title="Font Size"
                                        >
                                            {fontSizes.map(i => (
                                                <MenuItem
                                                    value={i + 6}
                                                    key={i}
                                                    onClick={changeFontSize(`${i + 6}px`)}
                                                    {...stopProp}
                                                    selected={fontSize.includes(`${i + 6}px`)}
                                                >
                                                    {i + 6}
                                                </MenuItem>
                                            ))}
                                        </DropDownMenu>
                                        <DropDownMenu
                                            close={e => closePopper("fontFamily")(e)}
                                            open={e => openPopper("fontFamily")(e)}
                                            anchorEl={anchorEls.fontFamily}
                                            icon={<FontDownload />}
                                            isOpen={Boolean(anchorEls.fontFamily)}
                                            title="Font Family"
                                        >
                                            {["Arial", "Arial Black", "Book Antiqua", "Cambria Math", "Courier New", "Georgia", "Helvetica", "Impact ", "Symbol", "Tahoma", "Terminal", "Times New Roman", "Trebuchet MS", "Verdana", "Webdings", "Wingdings"].map(family => (
                                                <Box clone fontFamily={`${family.includes("dings") ? "Arial" : family} !important`} key={family}>
                                                    <MenuItem
                                                        value={family}
                                                        onClick={changeFontFamily(family)}
                                                        {...stopProp}
                                                        selected={tinymce.activeEditor && getFormat("font-family", tinymce.activeEditor, getNode()).map(x => x.replace(/'/, "").replace(/"/, "")).includes(family)}
                                                    >
                                                        {family}
                                                    </MenuItem>
                                                </Box>
                                            ))}
                                        </DropDownMenu>
                                        <DropDownMenu
                                            close={e => closePopper("block")(e)}
                                            open={e => openPopper("block")(e)}
                                            anchorEl={anchorEls.block}
                                            icon={<Title />}
                                            isOpen={Boolean(anchorEls.block)}
                                            title="Font Style"
                                        >
                                            {["Normal", "Heading 1", "Heading 2", "Heading 3", "Heading 4", "Code"].map(block => (
                                                <MenuItem
                                                    value={block}
                                                    key={block}
                                                    onClick={changeBlock(block)}
                                                    {...stopProp}
                                                    selected={tinymce.activeEditor && block === getBlock(tinymce.activeEditor, getNode())[0]}
                                                >
                                                    {block}
                                                </MenuItem>
                                            ))}
                                        </DropDownMenu>
                                        <StandAloneBtn
                                            title={["Clear Format"]}
                                            fn={[cmd("RemoveFormat")]}
                                            icon={[<FormatClear />]}
                                        />
                                        <StandAloneBtn
                                            title={["Comments"]}
                                            fn={[openDialog("comments")]}
                                            icon={[<Comment />]}
                                        />
                                        <StandAloneBtn
                                            title={["Print"]}
                                            fn={[cmd("mcePrint")]}
                                            icon={[<Print />]}
                                        />
                                        <StandAloneBtn
                                            title={["Info"]}
                                            fn={[openDialog("info")]}
                                            icon={[<Info />]}
                                        />
                                        </>
                                            )}
                                    </div>
                                    {findOpen && !isSmall ? findReplace : (
                                        <div className={classes.toolbar}>
                                            <StandAloneBtn
                                                title={["More Options"]}
                                                fn={[() => setCustomBtnsOpen(!customBtnsOpen)]}
                                                icon={[<MoreHoriz />]} 
                                                disabled={[!Boolean(customBtns)]}
                                            />
                                            {customBtnsOpen && customBtns ? (
                                                <ToggleButtonGroup size="small" className={classes.btnGroup}>
                                                    {customBtns && (isEquation ? customBtns.slice(Math.ceil(customBtns.length / 2)) : customBtns).map(btn => (
                                                        <Tooltip title={btn.label} key={btn.label}>
                                                            <ToggleButton
                                                                value={btn.label}
                                                                onClick={btn.fn}
                                                                {...stopProp}
                                                                className={classes.equationBtn}
                                                            >
                                                                {typeof btn.icon === "string" ? (
                                                                    <Icon path={btn.icon} size="24px" color="currentColor" />
                                                                ) : btn.icon}
                                                            </ToggleButton>
                                                        </Tooltip>
                                                    ))}
                                                </ToggleButtonGroup>
                                            ) : (
                                                <>
                                                    <StandAloneBtn
                                                        title={["Insert Link"]}
                                                        icon={[<Link />]}
                                                        fn={[openDialog("link")]}
                                                    />
                                                    <StandAloneBtn
                                                        title={["Insert Table"]}
                                                        icon={[<Icon path={mdiTable} color="currentColor" size="24px" />]}
                                                        fn={[openDialog("table")]}
                                                    />
                                                    <StandAloneBtn
                                                        title={["Insert Image", "Insert Youtube Video", "Insert Video", "Insert Audio"]}
                                                        fn={[openDialog("image"), openDialog("youtube video"), openDialog("video"), openDialog("audio")]}
                                                        icon={[<Photo />, <YouTube />, <Videocam />, <Icon path={mdiVolumeHigh} color="currentColor" size="24px" />]}
                                                    />
                                                    <StandAloneBtn
                                                        title={["Insert Line"]}
                                                        fn={[() => insertHTML("<hr />")]}
                                                        icon={[<Icon size="24px" path={mdiMinus} color="currentColor" />]}
                                                    />
                                                    <StandAloneBtn
                                                        title={["Insert Symbol"]}
                                                        fn={[openDialog("symbol")]}
                                                        icon={[<EmojiSymbols />]}
                                                    />
                                                    <StandAloneBtn
                                                        title={["Toggle Quote"]}
                                                        fn={[cmd("mceBlockQuote")]}
                                                        icon={[<FormatQuote />]}
                                                        value={isQuote && "value"}
                                                        //onChange={() => setIsQuote(!isQuote)}
                                                    />
                                                    <StandAloneBtn
                                                        title={["Toggle Equation"]}
                                                        fn={[() => tinymce.activeEditor.formatter.toggle("equation")]}
                                                        icon={[<Icon path={mdiMathIntegral} size="24px" color="currentColor" />]}
                                                        value={isEquation && "value"}
                                                    />
                                                    <ToggleButtonGroup
                                                        value={listType}
                                                        size="small"
                                                        className={classes.btnGroup}
                                                        exclusive
                                                        //onChange={(e, newVal) => setListType(newVal)}
                                                    >
                                                        {listOptions.map(option => (
                                                            <Tooltip title={option.label} key={option.label} value={option.label}>
                                                                <ToggleButton
                                                                    value={option.label}
                                                                    onClick={cmd("Insert" + (option.label.includes("ul") ? "UnorderedList" : "OrderedList"))}
                                                                    {...stopProp}
                                                                >
                                                                    <option.icon />
                                                                </ToggleButton>
                                                            </Tooltip>
                                                        ))}
                                                    </ToggleButtonGroup>
                                                    <StandAloneBtn
                                                        title={["Indent", "Outdent"]}
                                                        fn={[cmd("indent"), cmd("outdent")]}
                                                        icon={[<FormatIndentIncrease />, <FormatIndentDecrease />]}
                                                    />
                                                    <StandAloneBtn
                                                        title={["Select All", ...editOptions.map(option => option.label)]}
                                                        fn={[cmd("selectall"), ...editOptions.map(option => cmd(option.label === "paste" ? "pasteastext" : option.label))]}
                                                        icon={[<SelectAll />, ...editOptions.map(option => option.icon)]}
                                                    />
                                                    <StandAloneBtn
                                                        title={["Undo", "Redo"]}
                                                        fn={[cmd("undo"), cmd("redo")]}
                                                        icon={[<Undo />, <Redo />]}
                                                        disabled={[!hasUndo, !hasRedo]}
                                                    />
                                                    <StandAloneBtn
                                                        title={["Find and Replace"]}
                                                        fn={[() => {
                                                            setFindOpen(true);
                                                        }]}
                                                        icon={[<Search />]}
                                                    />
                                                </>
                                            )}
                                        </div>
                                    )}
                                    
                                        </>
                                )}
                                </Box> : (
                                    <div className={classes.toolbar}>
                                        <StandAloneBtn
                                            title={["Add Feedback"]}
                                            value={isEquation && "value"}
                                            fn={[() => tinymce.activeEditor.formatter.toggle("feedback")]}
                                            icon={[<Feedback />]}
                                        />
                                        <StandAloneBtn
                                            title={["Comments"]}
                                            fn={[openDialog("comments")]}
                                            icon={[<Comment />]}
                                        />
                                    </div>
                                )}
                                <Menu
                                    keepMounted
                                    open={mouse[0] !== null}
                                    onClose={closeMenu}
                                    anchorReference="anchorPosition"
                                    anchorPosition={
                                    mouse[0] !== null && mouse[1] !== null
                                        ? { top: mouse[1], left: mouse[0] }
                                        : undefined
                                    }
                                    MenuListProps={{
                                        dense: true,
                                        className: classes.contextMenu,
                                    }}
                                >
                                    {contextBtns.map((btn, i) => (
                                        <Box clone display="flex" key={i}>
                                            <MenuItem
                                                onClick={() => {
                                                    closeMenu();
                                                    focus();
                                                    btn.fn();
                                                }}
                                            >
                                                <Typography variant="inherit">{btn.label}</Typography>
                                                <Box ml="auto" minWidth={24}>
                                                    <ListItemIcon>
                                                        {typeof btn.icon === "string" ? (
                                                            <Icon path={btn.icon} size="24px" color="currentColor" />
                                                        ) : btn.icon}
                                                    </ListItemIcon>
                                                </Box>
                                            </MenuItem>
                                        </Box>
                                    ))}
                                </Menu>
                                <Dialog
                                    open={dialogOpen}
                                    onClose={closeDialog}
                                    aria-labelledby="alert-dialog-title"
                                    aria-describedby="alert-dialog-description"
                                >
                                    <DialogTitle id="alert-dialog-title">{currentDialog}</DialogTitle>
                                    <DialogContent>
                                        {dialogContent}
                                    </DialogContent>
                                    <DialogActions>
                                        <Button onClick={closeDialog} color="default">
                                            {(currentDialog !== "info" && currentDialog !== "comments") ? "Cancel" : "Close"}
                                        </Button>
                                        {currentDialog !== "image filters" && currentDialog !== "info" && currentDialog !== "comments" && currentDialog !== "table styles" && (
                                            <Button onClick={insertBlock} color="primary">
                                                {currentDialog !== "edit source" ? "Insert" : "Update"}
                                            </Button>
                                        )}
                                        {currentDialog === "image filters" && (
                                            <Button color="primary" onClick={applyFilters}>
                                                Apply
                                            </Button>
                                        )}
                                        {currentDialog === "table styles" && (
                                            <Button color="primary" onClick={applyStyles}>
                                                Apply
                                            </Button>
                                        )}
                                    </DialogActions>
                                </Dialog>
                            </AnimateHeight>
                        ) : (
                            <Loader disableShrink />
                        )}
                        <Box flex={1} display={tinymce.activeEditor && tinymce.activeEditor.contentCSS.length > 0 && bookContent !== null ? "flex" : "none"} flexDirection="column">
                            {useMemo(() => (
                                bookContent !== null && <Editor
                                    apiKey="cc8ok26kps0ap5ulzs5j1m06y5bfxmtuyv6s5ndzp7rmys4y"
                                    initialValue={bookContent}
                                    onEditorChange={update}
                                    t
                                    plugins="textpattern lists advlist codesample hr image imagetools importcss link media wordcount nonbreaking paste print table searchreplace"
                                    onKeyPress={e => {
                                        if (isHotkey("mod+p", e)) {
                                            cmd("mcePrint")();
                                        }
                                    }}
                                    onFocus={() => tinymce.activeEditor.plugins.searchreplace.done()}
                                    onContextMenu={contextMenu("editor")}
                                    onInit={() => {
                                        tinymce.activeEditor.addShortcut("meta+f", "find and replace", () => {
                                            mode === "edit" ? setFindOpen(true) : (() => {})();
                                        });
                                        tinymce.activeEditor.addShortcut("meta+k", "link", () => {
                                            mode === "edit" ? openDialog("link")() : (() => {})();
                                        });
                                        tinymce.activeEditor.getBody().parentNode.scrollTop = tinymce.activeEditor.getBody().parentNode.scrollHeight;
                                        if (mode === "edit") {
                                            focus();
                                            tinymce.activeEditor.selection.select(tinymce.activeEditor.getBody(), true);
                                            tinymce.activeEditor.selection.collapse(false);
                                        } else {
                                            setIsEquation(true);
                                        }
                                    }}
                                    init={{
                                        height: 256,
                                        media_live_embeds: true,
                                        content_css: "/editor.css",
                                        toolbar: false,
                                        menubar: false,
                                        statusbar: false,
                                        importcss_append: true,
                                        nonbreaking_force_tab: true,
                                        list_indent_on_tab: true,
                                        paste_data_images: true,
                                        images_reuse_filename: true,
                                        contextmenu: false,
                                        end_container_on_empty_block: true,
                                        formats: bookStyles,
                                        textpattern_patterns: replacements,
                                        automatic_uploads: true,
                                        force_p_newlines: false,
                                        force_br_newlines: true,
                                        convert_newlines_to_brs: true,
                                        remove_linebreaks: false,    
                                        images_upload_url: "http://localhost:5000/upload/images",
                                        images_upload_handler: (blobInfo, success, failure) => {
                                            console.log(blobInfo);
                                            
                                            if (blobInfo.blob().size >= 52428800) {
                                                failure("Failed to upload");
                                                snackbar.error("Image too big to upload");
                                                return;
                                            } else {
                                                const form = new FormData();
                                                form.append("file", blobInfo.blob(), blobInfo.filename());
                                                request.post("/files/editor_images", {
                                                    body: form,
                                                    failedMsg: "uploading the image",
                                                    failed: () => {
                                                        failure("Error uploading");
                                                        return;
                                                    },
                                                    done: data => success(data.location)
                                                });
                                                /*request("/upload/images", "POST", false, data => {
                                                    success(data.location);
                                                }, "uploading the image", form, () => {
                                                    failure("Error uploading");
                                                    showSnackbar("There was an error uploading this image", {
                                                        variant: "error",
                                                    });
                                                    return;
                                                });*/
                                            }
                                        },
                                        init_instance_callback: editor => {
                                            editor.on("ClearUndos", () => {
                                                setHasUndo(false);
                                            });
                                            editor.on("AddUndo", () => {
                                                setHasUndo(true);
                                            });
                                            editor.on("TypingUndo", () => {
                                                setHasUndo(true);
                                            });
                                            editor.on("Undo", () => {
                                                setHasUndo(editor.undoManager.hasUndo());
                                                setHasRedo(true);
                                            });
                                            editor.on("Redo", () => {
                                                setHasRedo(editor.undoManager.hasRedo());
                                                setHasUndo(true);
                                            });
                                            editor.on("NodeChange", e => {
                                                if (e.selectionChange && mode === "edit") {
                                                    const parents = editor.dom.getParents(getNode());
                                                    let newListType = "";
                                                    if (parents.some(x => x.nodeName === "UL")) {
                                                        newListType = "Bulleted List";
                                                    } else if (parents.some(x => x.nodeName === "OL")) {
                                                        newListType = "Numbered List";
                                                    }
                                                    newListType !== oldListType && setListType(newListType);
                                                    let newLinkHref = editor.dom.getAttrib(getNode().nodeName !== "A" ? parents.filter(x => x.nodeName === "A")[0] : getNode(), "href");
                                                    let newDecoration = [];
                                                    editor.formatter.match("bold") && newDecoration.push("Bold");
                                                    editor.formatter.match("italic") && newDecoration.push("Italic");
                                                    editor.formatter.match("underline") && newDecoration.push("Underline");
                                                    editor.formatter.match("strikethrough") && newDecoration.push("Strikethrough");
                                                    if (!arraysEqual(oldDecoration, newDecoration)) {
                                                        setDecoration(newDecoration);
                                                    }
                                                    let newAlignment = "Left";
                                                    if (editor.formatter.match("aligncenter")) {
                                                        newAlignment = "Center";
                                                    } else if (editor.formatter.match("alignright")) {
                                                        newAlignment = "Right";
                                                    } else if (editor.formatter.match("alignjustify")) {
                                                        newAlignment = "Justify";
                                                    }
                                                    newAlignment !== oldAlignment && setAlignment(newAlignment);
                                                    let newScript = "";
                                                    if (editor.formatter.match("superscript")) {
                                                        newScript = "Superscript";
                                                    }
                                                    if (editor.formatter.match("subscript")) {
                                                        newScript = "Subscript";
                                                    }
                                                    newScript !== oldScript && setScript(newScript);
                                                    const newIsQuote = parents.map(el => el.nodeName).includes("BLOCKQUOTE");
                                                    newIsQuote !== oldIsQuote && setIsQuote(newIsQuote);
                                                    const newIsEquation = editor.formatter.match("equation");
                                                    if (newIsEquation !== oldIsEquation) {
                                                        if (newIsEquation) {
                                                            tinymce.activeEditor.plugins.textpattern.setPatterns(equationSymbols);
                                                        } else {
                                                            tinymce.activeEditor.plugins.textpattern.setPatterns(replacements);
                                                        }
                                                        setIsEquation(newIsEquation);
                                                        oldIsEquation = newIsEquation;
                                                    }
                                                    newLinkHref !== oldLinkHref && setLinkHref(newLinkHref);
                                                    if (oldDecoration !== newDecoration) {
                                                        oldDecoration = newDecoration;
                                                    }
                                                    if (oldLinkHref !== newLinkHref) {
                                                        oldLinkHref = newLinkHref;
                                                    }
                                                    if (oldAlignment !== newAlignment) {
                                                        oldAlignment = newAlignment;
                                                    }
                                                    if (oldScript !== newScript) {
                                                        oldScript = newScript;
                                                    }
                                                    if (oldIsQuote !== newIsQuote) {
                                                        oldIsQuote = newIsQuote;
                                                    }
                                                    if (oldListType !== newListType) {
                                                        oldListType = newListType;
                                                    }
                                                    let newSelectedNode = "";
                                                    let newCurrentNode = "";
                                                    if (e.srcElement && e.srcElement.nodeName === "AUDIO") {
                                                        newSelectedNode = "audio";
                                                        newCurrentNode = e.srcElement.getNode().parentNode;
                                                        editor.selection.select(newCurrentNode);
                                                    } else if ([...getNode().childNodes].some(x => x.nodeName === "AUDIO")) {
                                                        newSelectedNode = "audio";
                                                        newCurrentNode = getNode();
                                                    } else if ([...getNode().childNodes].some(x => x.nodeName === "VIDEO")) {
                                                        newSelectedNode = "video";
                                                        newCurrentNode = getNode();
                                                    } else if ([...getNode().childNodes].some(x => x.nodeName === "IFRAME")) {
                                                        newSelectedNode = "iframe";
                                                        newCurrentNode = getNode();
                                                    } else if (getNode().className === "mce-shim") {
                                                        newSelectedNode = "iframe";
                                                        newCurrentNode = getNode().parentNode;
                                                        editor.selection.select(newCurrentNode);
                                                    } else if (getNode().nodeName === "IMG") {
                                                        newSelectedNode = "img";
                                                        newCurrentNode = getNode();
                                                    } else if (tinymce.activeEditor.dom.getParents(getNode()).some(x => x.nodeName === "TABLE")) {
                                                        newSelectedNode = "table";
                                                        newCurrentNode = getNode();
                                                    }
                                                    if (newSelectedNode !== "" && JSON.stringify(getNode()) !== JSON.stringify(oldCurrentNode)) {
                                                        setCurrentNode(newCurrentNode);
                                                        oldCurrentNode = getNode();
                                                    }
                                                    if (oldSelectedNode !== newSelectedNode) {
                                                        setSelectedNode(newSelectedNode);
                                                        oldSelectedNode = newSelectedNode;
                                                    }
                                                } else if (e.selectionChange && mode === "view") {
                                                    const newIsEquation = editor.formatter.match("feedback");
                                                    if (newIsEquation !== oldIsEquation) {
                                                        setIsEquation(newIsEquation);
                                                        oldIsEquation = newIsEquation;
                                                    }
                                                }
                                            });
                                            editor.on("SelectionChange", () => {
                                                if (mode === "edit") {
                                                    const currentEl = getNode();
                                                    const newColor = getFormat("text-color", editor, currentEl).join(" ");
                                                    const newBackground = getFormat("background-color", editor, currentEl).join(" ");
                                                    const newFontSize = getFormat("font-size", editor, currentEl).join(" ");
                                                    //if (!arraysEqual(oldColor, newColor)) {
                                                    if (oldColor !== newColor) {
                                                        setCurrentColor(newColor);
                                                        oldColor = newColor;
                                                    }
                                                    //if (!arraysEqual(oldBackground, newBackground)) {
                                                    if (oldBackground !== newBackground) {
                                                        setBackground(newBackground);
                                                        oldBackground = newBackground;
                                                    }
                                                    //if (!arraysEqual(oldFontSize, newFontSize)) {
                                                    if (oldFontSize !== newFontSize) {
                                                        setFontSize(newFontSize);
                                                        oldFontSize = newFontSize;
                                                    }
                                                }
                                            });
                                        }
                                    }}
                                />
                            ), [bookContent])}
                        </Box>
                        <Box p={"4px"} textAlign="right" display={tinymce.activeEditor && tinymce.activeEditor.contentCSS.length > 0 && bookContent !== null ? "block" : "none"}>
                            <LinkBtn href="https://www.tiny.cloud" color="inherit" target="_blank">
                                Powered By Tiny
                            </LinkBtn>
                        </Box>
                    </Box>
                    <Prompt when={!isSaved} message="Currently, your book content hasn't been saved. If you leave now, you'll lose changes. Are you sure?" />
            </Box>
        : (
            <Alert severity="warning">
                <AlertTitle>Wait a second!</AlertTitle>
                {error}
            </Alert>
        )
    );
}