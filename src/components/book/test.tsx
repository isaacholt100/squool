// @ts-nocheck
/* eslint-disable no-restricted-globals */
/* eslint-disable default-case */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, createRef, useMemo, useRef } from "react";
import { useDispatch } from "react-redux";
import Loader from "../../components/Loader";
import { Editor } from "@tinymce/tinymce-react";
import tinymce from "tinymce";
import "tinymce/icons/default";
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
import Icon from "../../components/Icon";
import clsx from "clsx";
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
    mdiChevronDown,
    mdiFormatAlignLeft,
    mdiFormatAlignCenter,
    mdiFormatAlignRight,
    mdiFormatAlignJustify,
    mdiFormatBold,
    mdiFormatItalic,
    mdiFormatUnderline,
    mdiFormatStrikethroughVariant,
    mdiFormatListBulleted,
    mdiFormatListNumbered,
    mdiChevronUp,
    mdiCheck,
    mdiCheckAll,
    mdiClose,
    mdiPlus,
    mdiBlur,
    mdiBrightness6,
    mdiContrastBox,
    mdiImageFilterBlackWhite,
    mdiInvertColors,
    mdiOpacity,
    mdiFlare,
    mdiImageFilterVintage,
    mdiLink,
    mdiFormatColorText,
    mdiFormatColorFill,
    mdiFormatFont,
    mdiMessageAlert,
    mdiMessageReplyText,
    mdiFormatTitle,
    mdiFormatClear,
    mdiPrinter,
    mdiInformation,
    mdiDotsHorizontal,
    mdiImage,
    mdiYoutube,
    mdiVideo,
    mdiEmoticon,
    mdiFormatQuoteClose,
    mdiFormatIndentIncrease,
    mdiFormatIndentDecrease,
    mdiSelectAll,
    mdiUndo,
    mdiRedo,
    mdiMagnify,
    mdiContentPaste,
    mdiSymbol,
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
import useSnackbar from "../../hooks/useSnackbar";
import useContraxtText from "../../hooks/useContraxtText";
import UploadBtn from "../../components/UploadBtn";
import { useRouter } from "next/router";
import useRefState from "../../hooks/useRefState";
import katex from "katex";
import "katex/dist/katex.css";

interface IStandAloneBtnProps {
    title: string[];
    value?: string[] | string;
    fn: (() => void)[];
    icon: string[];
    className?: string;
    onChange?: any;
    disabled?: boolean[];
    [key: string]: any;
}

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
                minWidth: 40,
            },
            "&::webkit-scrollbar": {
                display: "none",
            },
        },
        field: {
            marginTop: 6,
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
            marginRight: 6,
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
            top: 6,
            right: 6,
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
        colReverse: {
            flexDirection: "column-reverse",
        },
        noWrap: {
            whiteSpace: "nowrap",
        },
        frField: {
            width: 160,
            marginRight: 4,
        },
        tableField: {
            width: "calc(50% - 4px)",
        },
        spaceBetween: {
            justifyContent: "space-between",
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
                        PopperProps={{
                            style: {
                                opacity: props.isOpen ? 0 : 1,
                            }
                        }}
                        
                    >
                        <ToggleButton
                            value="selected"
                            onClick={props.open}
                            {...stopProp}
                        >
                            {props.icon}
                            <Icon path={mdiChevronDown} className={clsx("ml_auto", classes[props.isOpen ? "rotate180" : "rotate0"])} />
                        </ToggleButton>
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
    StandAloneBtn = ({ title, value, fn, icon, className, onChange = null, disabled = [], ...other }: IStandAloneBtnProps) => {
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
                    <Tooltip title={x} key={i} value={x}>
                        <ToggleButton
                            value={onChange !== null ? x : "value"}
                            onClick={fn[i]}
                            {...stopProp}
                            disabled={disabled[i]}
                            //className={className[i]}
                        >
                            <Icon path={icon[i]} />
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

const isLarge = window.innerWidth > 600;
let globalOpen = isLarge;
export default function Book() {
    const
        classes = useStyles(),
        //socket = useSocket(),
        request = useRequest(),
        //title = useTitle(),
        snackbar = useSnackbar(),
        contrastText = useContraxtText(),
        findField = createRef(),
        isSmall = useMediaQuery("(max-width: 600px)"),
        [bookContent, setBookContent] = useState(null),
        [error, setError] = useState(null),
        dispatch = useDispatch(),
        router = useRouter(),
        book_id = router.query.id,
        mode = "edit",
        [alignment, setAlignment] = useRefState("Left"),
        [decoration, setDecoration] = useRefState([]),
        [fontSize, setFontSize] = useRefState("16px"),
        [script, setScript] = useRefState(""),
        [listType, setListType] = useRefState(""),
        [anchorEls, setAnchorEls] = useState(initialAnchorEls),
        [background, setBackground] = useRefState("#ffffff"),
        [currentColor, setCurrentColor] = useRefState("#000000"),
        [colorType, setColorType] = useState("color"),
        [dialogOpen, setDialogOpen] = useState(false),
        [currentDialog, setCurrentDialog] = useState(""),
        [values, setValues] = useState(initialValues),
        [helpers, setHelpers] = useState(initialHelpers),
        [symbol, setSymbol] = useState(""),
        [hasUndo, setHasUndo] = useState(false),
        [hasRedo, setHasRedo] = useState(false),
        [isQuote, setIsQuote] = useRefState(false),
        [isEquation, setIsEquation] = useRefState(false),
        [linkHref, setLinkHref] = useRefState(""),
        [comments, setComments] = useState([]),
        commentsRef = useRef(comments),
        [selectedNode, setSelectedNode] = useRefState<string>(null),
        [customBtnsOpen, setCustomBtnsOpen] = useState(false),
        [filter, setFilter] = useState("Opacity"),
        [filters, setFilters] = useState(initialFilters),
        [currentNode, setCurrentNode] = useRefState({} as any),
        [mouse, setMouse] = useState([null, null]),
        [findOpen, setFindOpen] = useState(false),
        [isSaved, setIsSaved] = useState(true),
        [toolbarOpen, setToolbarOpen] = useState(globalOpen),
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
                done() {
                    //socket.emit("book content update", code, c)
                },
                body: {
                    book_id,
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
                    url: linkHref.current,
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
                    if (selectedNode.current === "iframe") {
                        tinymce.activeEditor.undoManager.transact(() => {
                            tinymce.activeEditor.dom.remove(currentNode.current);
                            insertHTML(`<iframe src="https://www.youtube.com/embed/${values.url.replace("youtube.com/watch?v=", "").replace("https://", "").replace("www.", "").trim()}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`);
                        });
                    } else {
                        checkUrl("", () => {
                            if (selectedNode.current === "img") {
                                tinymce.activeEditor.dom.setAttrib(getNode(), "src", values.url);
                                tinymce.activeEditor.dom.setAttrib(getNode(), "data-mce-src", values.url);
                                tinymce.activeEditor.dom.setAttrib(getNode(), "alt", values.alt);
                            } else {
                                tinymce.activeEditor.dom.setAttrib(currentNode.current.firstChild.children[0], "src", values.url);
                                tinymce.activeEditor.dom.setAttrib(currentNode.current, "data-ephox-embed-iri", values.url);
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
                        tinymce.activeEditor.undoManager.transact(() => tinymce.activeEditor.plugins.table.insertTable(+values.cols, +values.rows));
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
                        if (linkHref.current !== "") {
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
                        insertHTML(
                            `<math contenteditable="false" data-latex="${"z^2+4"}">
                                ${katex.renderToString("z^2+4", {
                                    throwOnError: false,
                                    output: "html",
                                }).replace(/<span(.*)><\/span>/g, "<span $1></span>")}
                            </math>`
                        );
                        /*insertHTML(katex.renderToString("z^2+4", {
                            throwOnError: false,
                            output: "html",
                        }));*/
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
            tinymce.activeEditor.undoManager.transact(() => tinymce.activeEditor.formatter.apply("font-size-" + i));
            setFontSize(i);
            closePoppers();
        },
        changeFontFamily = family => () => {
            tinymce.activeEditor.undoManager.transact(() => tinymce.activeEditor.formatter.apply("font-family-" + family));
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
            closePoppers();
        },
        changeColor = color => () => {
            tinymce.activeEditor.undoManager.transact(() => tinymce.activeEditor.formatter.apply((colorType === "color" ? "text-color" : "background-color") + "-" + color));
            //cmd("mceAddUndoLevel")();
            if (colorType === "color") {
                setCurrentColor(color);
            } else {
                setBackground(color);
            }
            closePoppers();
        },
        cmd = (cmd: string, ui?: boolean, value?: any, args?: any) => () => tinymce.activeEditor.execCommand(cmd, ui, value, args),
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
                        /*socket.emit("book comment created", book_id, {
                            content: values.newComment,
                            _id,
                        });*/
                    },
                    body: {
                        book_id,
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
                    setValues({
                        ...values,
                        currentComment: _id,
                    });
                    res(undefined);
                }).then(() => {
                    const textarea: any = tinymce.activeEditor.dom.getParents(target).find(x => x.nodeName === "LI").firstChild.firstChild.firstChild.firstChild;
                    textarea.focus();
                    setTimeout(() => {
                        textarea.selectionStart = textarea.selectionEnd = 10000
                    }, 0);
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
                done() {
                    //socket.emit("book comment deleted", code, _id)
                },
                body: {
                    book_id,
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
                done() {
                    /*socket.emit("book comment edited", book_id, {
                        _id,
                        content,
                    })*/
                },
                body: {
                    book_id,
                    comment_id: _id,
                    content,
                },
            });
        },
        updateComment = _id => e => {
            setComments(comments.map(c => c._id === _id ? { ...c, content: e.target.value } : c));
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
                if (isEquation.current || editor.formatter.match("equation", {}, currentEl)) {
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
                if (isEquation.current || editor.formatter.match("equation", {}, currentEl)) {
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
                icon: mdiFormatAlignLeft,
            },
            {
                label: "Center",
                icon: mdiFormatAlignCenter,
            },
            {
                label: "Right",
                icon: mdiFormatAlignRight,
            },
            {
                label: "Justify",
                icon: mdiFormatAlignJustify,
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
                icon: mdiFormatBold,
            },
            {
                label: "Italic",
                icon: mdiFormatItalic,
            },
            {
                label: "Underline",
                icon: mdiFormatUnderline,
            },
            {
                label: "Strikethrough",
                icon: mdiFormatStrikethroughVariant,
            },
        ],
        listOptions = [
            {
                label: "Bulleted List",
                icon: mdiFormatListBulleted,
            },
            {
                label: "Numbered List",
                icon: mdiFormatListNumbered,
            },
        ],
        editOptions = [
            {
                label: "Cut",
                icon: mdiContentCut,
            },
            {
                label: "Copy",
                icon: mdiContentCopy,
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
            <div className={clsx("flex", classes.noWrap)}>
                <div className="flex" style={{flexDirection: isSmall ? "column" : "row"}}>
                    <div className={clsx("flex align_items_center", classes[!isSmall ? "mr2" : "mb4"])}>
                        <TextField
                            value={values.find}
                            onChange={updateField("find")}
                            placeholder="Find"
                            onKeyDown={e => e.key === "Enter" ? tinymce.activeEditor.plugins.searchreplace.next() : null}
                            onFocus={values.find !== "" ? () => tinymce.activeEditor.plugins.searchreplace.find(values.find, values.caseStrict, values.wholeWord) : null}
                            inputRef={findField}
                            variant="outlined"
                            className={classes.frField}
                        />
                        <StandAloneBtn
                            title={["Match Whole Word", "Case Sensitive"]}
                            onChange={() => {}}
                            fn={["wholeWord", "caseStrict"].map(x => () => setValues({...values, [x]: !values[x]}))}
                            icon={[mdiFormatLetterMatches, mdiFormatLetterCaseUpper]}
                            value={[values.caseStrict && "Case Sensitive", values.wholeWord && "Match Whole Word"]}
                        />
                        <StandAloneBtn
                            title={["Next", "Previous"]}
                            fn={[tinymce.activeEditor.plugins.searchreplace.next, tinymce.activeEditor.plugins.searchreplace.prev]}
                            icon={[mdiChevronDown, mdiChevronUp]}
                        />
                    </div>
                    <div className="flex align_items_center">
                        <TextField
                            value={values.replace}
                            onChange={updateField("replace")}
                            placeholder="Replace"
                            onKeyDown={e => {
                                if (isHotkey("mod+enter", e as any)) {
                                    tinymce.activeEditor.undoManager.transact(() => tinymce.activeEditor.plugins.searchreplace.replace(values.replace, true, true));
                                } else if (e.key === "Enter") {
                                    tinymce.activeEditor.undoManager.transact(() => tinymce.activeEditor.plugins.searchreplace.replace(values.replace, true, false));
                                }
                            }}
                            onFocus={values.find !== "" ? () => tinymce.activeEditor.plugins.searchreplace.find(values.find, values.caseStrict, values.wholeWord) : null}
                            className={classes.frField}
                            variant="outlined"
                        />
                        <StandAloneBtn
                            title={["Replace", "Replace All"]}
                            fn={[
                                () => tinymce.activeEditor.undoManager.transact(() => tinymce.activeEditor.plugins.searchreplace.replace(values.replace, true, false)),
                                () => tinymce.activeEditor.undoManager.transact(() => tinymce.activeEditor.plugins.searchreplace.replace(values.replace, true, true))
                            ]}
                            icon={[mdiCheck, mdiCheckAll]}
                            disabled={Array(2).fill(values.find === "")}
                        />
                        <StandAloneBtn
                            title={["Close"]}
                            fn={[() => {
                                setFindOpen(false);
                                tinymce.activeEditor.plugins.searchreplace.done();
                                focus();
                            }]}
                            icon={[mdiClose]}
                        />
                    </div>
                </div>
            </div>
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
            {((currentDialog === "link" && linkHref.current === "" && tinymce.activeEditor && tinymce.activeEditor.selection && tinymce.activeEditor.selection.getSel().toString().trim() === "") || selectedNode.current === "img" || currentDialog === "image") && (
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
            <TextField
                label="Rows"
                variant="outlined"
                value={values.rows}
                onChange={updateField("rows")}
                className={clsx("mt_6 mr_6", classes.tableField)}
                helperText={helpers.rows + " "}
                error={helpers.rows !== ""}
                autoFocus
            />
            <TextField
                label="Columns"
                variant="outlined"
                value={values.cols}
                onChange={updateField("cols")}
                className={clsx("mt_6", classes.tableField)}
                helperText={helpers.cols + " "}
                error={helpers.cols !== ""}
                {...keyDownProp}
            />
        </>
    ) : (
        <>
            <Typography variant="h5" gutterBottom>{symbol}</Typography>
            <div className="flex flex_wrap">
                {entities.map((entity, i) => (
                    <ButtonBase key={i} className={`${classes.symbol} ${symbol === entity ? classes.activeSymbol : null}`} onClick={() => setSymbol(entity)}>
                        {entity}
                    </ButtonBase>
                ))}
            </div>
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
                    <div className="flex align_items_center mt_6">
                        <TextField
                            className="flex_1 mr_6"
                            variant="outlined"
                            label="Comment"
                            value={values.newComment}
                            onChange={updateField("newComment")}
                            autoFocus
                            onBlur={() => setValues({...values, currentComment: null})}
                        />
                        <Box height={48}>
                            <Tooltip title="Add">
                                <div>
                                    <IconButton type="submit" color="primary" disabled={values.newComment === ""}>
                                        <Icon path={mdiPlus} />
                                    </IconButton>
                                </div>
                            </Tooltip>
                        </Box>
                    </div>
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
                                        {values.currentComment === c._id ? <Icon path={mdiCheck} /> : <Icon path={mdiPencil} />}
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete">
                                    <IconButton edge="end" aria-label="delete" onClick={deleteComment(c._id)} className={classes.delete}>
                                        <Icon path={mdiDelete} />
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
            <div className={clsx("flex", classes.colReverse)}>
                <img
                    src={tinymce.activeEditor.dom.getAttrib(getNode(), "src")}
                    style={{
                        filter: Object.keys(filters).map(i => `${i}(${filters[i] + filterUnits[i]})`).join(" "), 
                        width: "100%"
                    }}
                    alt=""
                />
                <Box clone m={2} width="calc(100% - 16px)">
                    <Slider
                        step={maxFilters[filter.toLowerCase().replace(" ", "-")] / 100}
                        min={0}
                        max={maxFilters[filter.toLowerCase().replace(" ", "-")]}
                        value={filters[filter.toLowerCase().replace(" ", "-")]}
                        onChange={(e, newVal) => setFilters({...filters, [filter.toLowerCase().replace(" ", "-")]: newVal})}
                    />
                </Box>
                <div className={clsx("flex", classes.spaceBetween)}>
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
                </div>
                <Box className="overflow_auto nowrap" overflow="auto" pb={2} whiteSpace="nowrap" textAlign="center">
                    <Box mx="auto" display="inline-block" width="auto">
                        <StandAloneBtn
                            value={filter}
                            exclusive
                            icon={[mdiBlur, mdiBrightness6, mdiContrastBox, mdiImageFilterBlackWhite, mdiRotateLeft, mdiInvertColors, mdiOpacity, mdiFlare, mdiImageFilterVintage]}
                            title={["Blur", "Brightness", "Contrast", "Grayscale", "Hue Rotate", "Invert", "Opacity", "Saturate", "Sepia"]}
                            onChange={(e, newFilter) => newFilter !== null && setFilter(newFilter)}
                            fn={[...Array(10)].fill(null)}
                        />
                    </Box>
                </Box>
            </div>
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
            icon: mdiLink,
            fn: openDialog("link")
        },
        {
            label: "Bold",
            icon: mdiFormatBold,
            fn: cmd("Bold")
        },
        {
            label: "Italic",
            icon: mdiFormatItalic,
            fn: cmd("Italic")
        },
        {
            label: "Underline",
            icon: mdiFormatUnderline,
            fn: cmd("Underline")
        },
        {
            label: "Align Left",
            icon: mdiFormatAlignLeft,
            fn: cmd("justifyLeft")
        },
        {
            label: "Align Center",
            icon: mdiFormatAlignCenter,
            fn: cmd("justifyCenter")
        },
        {
            label: "Align Right",
            icon: mdiFormatAlignRight,
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
    if (isEquation.current) {
        customBtns = equationSymbols.filter((x, i, arr) => x.replacement && !arr.slice(0, i).some(a => a.replacement === x.replacement)).map(x => ({
            label: x.start,
            icon: <Box component="span" fontSize={24}>{x.replacement}</Box>,
            fn: () => insertHTML(x.replacement),
        }));
    } else if (linkHref.current !== "") {
        customBtns = [
            {
                label: "Open Link",
                icon: mdiOpenInNew,
                fn: () => window.open(linkHref.current, "_blank"),
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
            ...customBtns,
            ...contextBtns.slice(1),
        ];
    } else if (selectedNode.current === "img") {
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
                    const styleString = tinymce.activeEditor.dom.getAttrib(node, "style");
                    if (styleString.includes("filter: ")) {
                        const styles = styleString.split("filter: ")[1].split(";")[0].split(" ");
                        styles.forEach(x => {
                            newFilters[x.split("(")[0]] = +x.split("(")[1].split(")")[0].replace(/[a-zA-Z]/g, "");
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
                    const node = getNode() as any;
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
    } else if (selectedNode.current === "table") {
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
    } else if (selectedNode.current === "video" || selectedNode.current === "audio") {
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
    } else if (selectedNode.current === "iframe") {
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
        request.get(`/books?_id=${book_id}`, {
            failedMsg: "loading your book",
            setLoading: true,
            done: data => {
                //console.log(data);
                dispatch({
                    type: "/moreActions",
                    payload: [{
                        fn: () => setToolbarOpen(!globalOpen),
                        label: "Toggle Toolbar"
                    }]
                });
                //socket.emit("join", code);
                setError(null);
                let newContent = data.content || "";
                if (data.type === "student") {
                    //history.replace(`/book/${code}/edit`);
                    if (new Date().toDateString() !== data.lastEdited) {
                        newContent = newContent + `<br><hr><span data-mce-style="color: #9E9E9E;" style="color: rgb(158, 158, 158);">${new Date().toLocaleDateString()}</span><br><br><p></p>`;
                    }
                } else {
                    //history.replace(`/book/${code}/view`);
                }
                setComments(data.comments);
                setBookContent(newContent);
                //title(data.name);

                const head = tinymce.activeEditor.contentDocument.head;
                const copyScript = document.createElement("script");
                copyScript.type = "text/javascript";
                copyScript.src = "https://cdn.jsdelivr.net/npm/katex@0.12.0/dist/contrib/copy-tex.min.js";
                const chemScript = document.createElement("script");
                chemScript.type = "text/javascript";
                chemScript.src = "https://cdn.jsdelivr.net/npm/katex@0.12.0/dist/contrib/mhchem.min.js";
                const katexScript = document.createElement("script");
                katexScript.type = "text/javascript";
                katexScript.src = "https://cdn.jsdelivr.net/npm/katex@0.12.0/dist/katex.min.js";
                head.appendChild(katexScript);
                head.appendChild(copyScript);
                head.appendChild(chemScript);
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
        /*socket.on("book content updated", (book_id, newContent) => {
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
        });*/
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
                        book_id,
                        content: tinymce.activeEditor.getContent(),
                    },
                    done: () => {
                        setIsSaved(true);
                        //socket.emit("book content update", book_id, tinymce.activeEditor.getContent());
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
            //socket.emit("leave", book_id);
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
    if (!error && tinymce.activeEditor?.dom?.select("audio")[0]) {
        tinymce.activeEditor.dom.select("audio").forEach(audio => {
            audio.onfocus = () => tinymce.activeEditor.selection.select(audio.parentNode);
            audio.onmousedown = () => {
                tinymce.activeEditor.selection.select(audio.parentNode);
                tinymce.activeEditor.dom.setAttrib(audio.parentNode, "data-mce-selected", "1");
            }
        });
    };
    if (!error && tinymce.activeEditor?.dom?.select("img")[0]) {
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
            <Box height={1} flex={1} display="flex" flexDirection="column" maxWidth={1280}>
                <div className="flex flex_col flex_1">
                    {tinymce.activeEditor?.contentCSS?.length > 0 && bookContent !== null ? (
                        <AnimateHeight duration={500} height={toolbarOpen ? "auto" : 0} animateOpacity>
                            {mode === "edit" ?
                                <Box overflow="auto" height={96} mb="4px">
                                    {findOpen && isSmall ? findReplace : (
                                        <>
                                            <div className={classes.toolbar}>
                                                {customBtnsOpen && isEquation.current ? (
                                                    <ToggleButtonGroup size="small" className={classes.btnGroup}>
                                                        <Tooltip title="Fraction">
                                                            <ToggleButton
                                                                className={classes.equationBtn}
                                                                value="frac"
                                                                onClick={() => tinymce.activeEditor.insertContent("<span>&nbsp;<span class='frac'><sup>&nbsp;&nbsp;</sup><span class='slash'>/</span><sub>&nbsp;&nbsp;</sub></span><span>&nbsp;</span></span>")}
                                                                {...stopProp}
                                                            >
                                                                <Icon path={mdiSlashForwardBox} />
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
                                                                        <Icon path={btn.icon} />
                                                                    ) : btn.icon}
                                                                </ToggleButton>
                                                            </Tooltip>
                                                        ))}
                                                    </ToggleButtonGroup>
                                            ) : (
                                                <>
                                        <ToggleButtonGroup
                                            value={decoration.current}
                                            size="small"
                                            className={classes.btnGroup}
                                        >
                                            {decorationOptions.map(option => (
                                                <Tooltip title={option.label} key={option.label} value={option.label}>
                                                    <ToggleButton
                                                        value={option.label}
                                                        onClick={cmd(option.label)}
                                                        {...stopProp}
                                                    >
                                                        <Icon path={option.icon} />
                                                    </ToggleButton>
                                                </Tooltip>
                                            ))}
                                        </ToggleButtonGroup>
                                        <ToggleButtonGroup
                                            size="small"
                                            value={alignment.current}
                                            exclusive
                                            className={classes.btnGroup}
                                            onChange={(e, newVal) => newVal !== null && setAlignment(newVal)}
                                        >
                                            {alignmentOptions.map(option => (
                                                <Tooltip title={"Align " + option.label} key={option.label} value={option.label}>
                                                    <ToggleButton
                                                        value={option.label}
                                                        onClick={option.label !== alignment.current ? cmd("justify" + (option.label.includes("ify") ? "Full" : option.label)) : null}
                                                        {...stopProp}
                                                    >
                                                        <Icon path={option.icon} />
                                                    </ToggleButton>
                                                </Tooltip>
                                            ))}
                                        </ToggleButtonGroup>
                                        <ToggleButtonGroup
                                            value={script.current}
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
                                                                script.current === scriptOptions[(i - 1) ** 2].label && cmd(scriptOptions[(i - 1) ** 2].label)();
                                                                ;
                                                                res(undefined);
                                                            }).then(cmd(option.label));
                                                        }}
                                                        {...stopProp}
                                                    >
                                                        <Icon path={option.icon} />
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
                                                        backgroundColor: (currentColor.current.match(" ") || []).length < 1 ? currentColor.current : "initial",
                                                        color: (currentColor.current.match(" ") || []).length < 1 ? contrastText(currentColor.current) : "inherit",
                                                    }}
                                                >
                                                    <Icon path={mdiFormatColorText} />
                                                    <Icon path={mdiChevronDown} className={classes[anchorEls.color ? "rotate180" : "rotate0"]} />
                                                </ToggleButton>
                                            </Tooltip>
                                            <Tooltip
                                                title="Background"
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
                                                        backgroundColor: (background.current.match(" ") || []).length < 1 ? background.current : "initial",
                                                        color: (background.current.match(/ /g) || []).length < 1 ? contrastText(background.current) : "inherit",
                                                    }}
                                                >
                                                    <Icon path={mdiFormatColorFill} />
                                                    <Icon path={mdiChevronDown} className={classes[anchorEls.background ? "rotate180" : "rotate0"]} />
                                                </ToggleButton>
                                            </Tooltip>
                                        </ToggleButtonGroup>
                                        <Menu
                                            anchorEl={anchorEls.background ? anchorEls.background : anchorEls.color}
                                            open={Boolean(anchorEls.background) ? Boolean(anchorEls.background) : Boolean(anchorEls.color)}
                                            className={classes.menu}
                                            variant="menu"
                                            onClose={closePopper(colorType)}
                                            transitionDuration={100}
                                        >
                                            <Box clone bgcolor="#fff" height={24} width={24} color="#000">
                                                <ButtonBase
                                                    onClick={changeColor("#ffffff")}
                                                    {...stopProp}
                                                >
                                                    {(colorType === "color" ? currentColor.current : background.current).includes("#ffffff") && (
                                                        <Icon path={mdiCheck} />
                                                    )}
                                                </ButtonBase>
                                            </Box>
                                            <Box clone bgcolor="#000" height={24} width={24} color="#fff">
                                                <ButtonBase
                                                    onClick={changeColor("#000000")}
                                                    {...stopProp}
                                                >
                                                    {(colorType === "color" ? currentColor.current : background.current).includes("#000000") && (
                                                        <Icon path={mdiCheck} />
                                                    )}
                                                </ButtonBase>
                                            </Box>
                                            <div className="flex">
                                                {Object.values(colors).slice(1).filter((x, i) => ![3, 6, 8, 10, 13, 15].includes(i)).map((obj, i) => (
                                                    <div className="flex flex_col" key={i}>
                                                        {Object.values(obj).slice(2, 9).map((color, j) => (
                                                            <Box clone bgcolor={color} height={24} width={24} color={contrastText(color)} key={i + "" + j}>
                                                                <ButtonBase
                                                                    style={{
                                                                        backgroundColor: color,
                                                                        color: contrastText(color),
                                                                    }}
                                                                    onClick={changeColor(color)}
                                                                    {...stopProp}
                                                                >
                                                                    {(colorType === "color" ? currentColor.current : background.current).includes(color) && (
                                                                        <Icon path={mdiCheck} />
                                                                    )}
                                                                </ButtonBase>
                                                            </Box>
                                                        ))}
                                                    </div>
                                                ))}
                                            </div>
                                        </Menu>
                                        <DropDownMenu
                                            close={e => closePopper("fontSize")()}
                                            open={e => openPopper("fontSize")(e)}
                                            anchorEl={anchorEls.fontSize}
                                            icon={(fontSize.current.match(" ") || []).length > 0 ? "" : fontSize.current.replace("px", "")}
                                            isOpen={Boolean(anchorEls.fontSize)}
                                            title="Font Size"
                                        >
                                            {fontSizes.map(i => (
                                                <MenuItem
                                                    value={i + 6}
                                                    key={i}
                                                    onClick={changeFontSize(`${i + 6}px`)}
                                                    {...stopProp}
                                                    selected={fontSize.current.includes(`${i + 6}px`)}
                                                >
                                                    {i + 6}
                                                </MenuItem>
                                            ))}
                                        </DropDownMenu>
                                        <DropDownMenu
                                            close={e => closePopper("fontFamily")()}
                                            open={e => openPopper("fontFamily")(e)}
                                            anchorEl={anchorEls.fontFamily}
                                            icon={<Icon path={mdiFormatFont} />}
                                            isOpen={Boolean(anchorEls.fontFamily)}
                                            title="Font Family"
                                        >
                                            {["Arial", "Arial Black", "Book Antiqua", "Cambria Math", "Courier New", "Georgia", "Helvetica", "Impact ", "Symbol", "Tahoma", "Terminal", "Times New Roman", "Trebuchet MS", "Verdana", "Webdings", "Wingdings"].map(family => (
                                                <MenuItem
                                                    value={family}
                                                    key={family}
                                                    style={{
                                                        fontFamily: (family.includes("dings") ? "Arial" : family),
                                                    }}
                                                    onClick={changeFontFamily(family)}
                                                    {...stopProp}
                                                    selected={tinymce.activeEditor && getFormat("font-family", tinymce.activeEditor, getNode()).map(x => x.replace(/'/, "").replace(/"/, "")).includes(family)}
                                                >
                                                    {family}
                                                </MenuItem>
                                            ))}
                                        </DropDownMenu>
                                        <DropDownMenu
                                            close={closePopper("block")}
                                            open={openPopper("block")}
                                            anchorEl={anchorEls.block}
                                            icon={<Icon path={mdiFormatTitle} />}
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
                                            icon={[mdiFormatClear]}
                                        />
                                        <StandAloneBtn
                                            title={["Comments"]}
                                            fn={[openDialog("comments")]}
                                            icon={[mdiMessageReplyText]}
                                        />
                                        <StandAloneBtn
                                            title={["Print"]}
                                            fn={[cmd("mcePrint")]}
                                            icon={[mdiPrinter]}
                                        />
                                        <StandAloneBtn
                                            title={["Info"]}
                                            fn={[openDialog("info")]}
                                            icon={[mdiInformation]}
                                        />
                                        </>
                                            )}
                                    </div>
                                    {findOpen && !isSmall ? findReplace : (
                                        <div className={classes.toolbar}>
                                            <StandAloneBtn
                                                title={["More Options"]}
                                                fn={[() => setCustomBtnsOpen(!customBtnsOpen)]}
                                                icon={[mdiDotsHorizontal]} 
                                                disabled={[!Boolean(customBtns)]}
                                            />
                                            {customBtnsOpen && customBtns ? (
                                                <ToggleButtonGroup size="small" className={classes.btnGroup}>
                                                    {customBtns && (isEquation.current ? customBtns.slice(Math.ceil(customBtns.length / 2)) : customBtns).map(btn => (
                                                        <Tooltip title={btn.label} key={btn.label}>
                                                            <ToggleButton
                                                                value={btn.label}
                                                                onClick={btn.fn}
                                                                {...stopProp}
                                                                className={classes.equationBtn}
                                                            >
                                                                <Icon path={btn.icon} />
                                                            </ToggleButton>
                                                        </Tooltip>
                                                    ))}
                                                </ToggleButtonGroup>
                                            ) : (
                                                <>
                                                    <StandAloneBtn
                                                        title={["Insert Link"]}
                                                        icon={[mdiLink]}
                                                        fn={[openDialog("link")]}
                                                    />
                                                    <StandAloneBtn
                                                        title={["Insert Table"]}
                                                        icon={[mdiTable]}
                                                        fn={[openDialog("table")]}
                                                    />
                                                    <StandAloneBtn
                                                        title={["Insert Image", "Insert Youtube Video", "Insert Video", "Insert Audio"]}
                                                        fn={[openDialog("image"), openDialog("youtube video"), openDialog("video"), openDialog("audio")]}
                                                        icon={[mdiImage, mdiYoutube, mdiVideo, mdiVolumeHigh]}
                                                    />
                                                    <StandAloneBtn
                                                        title={["Insert Line"]}
                                                        fn={[() => insertHTML("<hr />")]}
                                                        icon={[mdiMinus]}
                                                    />
                                                    <StandAloneBtn
                                                        title={["Insert Symbol"]}
                                                        fn={[openDialog("symbol")]}
                                                        icon={[mdiSymbol]}
                                                    />
                                                    <StandAloneBtn
                                                        title={["Toggle Quote"]}
                                                        fn={[cmd("mceBlockQuote")]}
                                                        icon={[mdiFormatQuoteClose]}
                                                        value={isQuote.current && "value"}
                                                        //onChange={() => setIsQuote(!isQuote)}
                                                    />
                                                    <StandAloneBtn
                                                        title={["Toggle Equation"]}
                                                        fn={[() => tinymce.activeEditor.formatter.toggle("equation")]}
                                                        icon={[mdiMathIntegral]}
                                                        value={isEquation.current && "value"}
                                                    />
                                                    <ToggleButtonGroup
                                                        value={listType.current}
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
                                                                    <Icon path={option.icon} />
                                                                </ToggleButton>
                                                            </Tooltip>
                                                        ))}
                                                    </ToggleButtonGroup>
                                                    <StandAloneBtn
                                                        title={["Indent", "Outdent"]}
                                                        fn={[cmd("indent"), cmd("outdent")]}
                                                        icon={[mdiFormatIndentIncrease, mdiFormatIndentDecrease]}
                                                    />
                                                    <StandAloneBtn
                                                        title={["Select All", "Cut", "Copy", "Paste"]}
                                                        fn={[cmd("selectall"), cmd("cut"), cmd("copy"), cmd("paste")]}
                                                        icon={[mdiSelectAll, mdiContentCut, mdiContentCopy, mdiContentPaste]}
                                                    />
                                                    <StandAloneBtn
                                                        title={["Undo", "Redo"]}
                                                        fn={[cmd("undo"), cmd("redo")]}
                                                        icon={[mdiUndo, mdiRedo]}
                                                        disabled={[!hasUndo, !hasRedo]}
                                                    />
                                                    <StandAloneBtn
                                                        title={["Find and Replace"]}
                                                        fn={[() => {
                                                            setFindOpen(true);
                                                        }]}
                                                        icon={[mdiMagnify]}
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
                                            value={isEquation.current && "value"}
                                            fn={[() => tinymce.activeEditor.formatter.toggle("feedback")]}
                                            icon={[mdiMessageAlert]}
                                        />
                                        <StandAloneBtn
                                            title={["Comments"]}
                                            fn={[openDialog("comments")]}
                                            icon={[mdiMessageReplyText]}
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
                                        <MenuItem
                                            key={i}
                                            className="flex"
                                            onClick={() => {
                                                closeMenu();
                                                focus();
                                                btn.fn();
                                            }}
                                        >
                                            <Typography variant="inherit">{btn.label}</Typography>
                                            <Box ml="auto" minWidth={24}>
                                                <ListItemIcon>
                                                    <Icon path={btn.icon} />
                                                </ListItemIcon>
                                            </Box>
                                        </MenuItem>
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
                        <div className="flex_1 flex_col" style={{display: tinymce.activeEditor && tinymce.activeEditor.contentCSS.length > 0 && bookContent !== null ? "flex" : "none"}}>
                            {useMemo(() => (
                                bookContent !== null && <Editor
                                    apiKey="cc8ok26kps0ap5ulzs5j1m06y5bfxmtuyv6s5ndzp7rmys4y"
                                    initialValue={bookContent}
                                    onEditorChange={update}
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
                                        height: "100%",
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
                                        custom_elements: "math", 
                                        extended_valid_elements: 'math',
                                        verify_html: false,
                                        images_upload_url: "http://localhost:5000/upload/images",
                                        images_upload_handler: (blobInfo, success, failure) => {
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
                                                    done(data) {
                                                        success(data.location);
                                                    }
                                                });
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
                                                    setListType(newListType);
                                                    let newLinkHref = editor.dom.getAttrib(getNode().nodeName !== "A" ? parents.filter(x => x.nodeName === "A")[0] : getNode(), "href");
                                                    const newDecoration: string[] = [];
                                                    editor.formatter.match("bold") && newDecoration.push("Bold");
                                                    editor.formatter.match("italic") && newDecoration.push("Italic");
                                                    editor.formatter.match("underline") && newDecoration.push("Underline");
                                                    editor.formatter.match("strikethrough") && newDecoration.push("Strikethrough");
                                                    if (!arraysEqual(decoration.current, newDecoration)) {
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
                                                    setAlignment(newAlignment);
                                                    let newScript = "";
                                                    if (editor.formatter.match("superscript")) {
                                                        newScript = "Superscript";
                                                    }
                                                    if (editor.formatter.match("subscript")) {
                                                        newScript = "Subscript";
                                                    }
                                                    newScript !== script.current && setScript(newScript);
                                                    const newIsQuote = parents.map(el => el.nodeName).includes("BLOCKQUOTE");
                                                    setIsQuote(newIsQuote);
                                                    const newIsEquation = editor.formatter.match("equation");
                                                    if (newIsEquation !== isEquation.current) {
                                                        if (newIsEquation) {
                                                            tinymce.activeEditor.plugins.textpattern.setPatterns(equationSymbols);
                                                        } else {
                                                            tinymce.activeEditor.plugins.textpattern.setPatterns(replacements);
                                                        }
                                                        setIsEquation(newIsEquation);
                                                    }
                                                    setLinkHref(newLinkHref);
                                                    let newSelectedNode = "";
                                                    let newCurrentNode;
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
                                                    if (newSelectedNode !== "" && JSON.stringify(getNode()) !== JSON.stringify(currentNode.current)) {
                                                        setCurrentNode(newCurrentNode);
                                                    }
                                                    setSelectedNode(newSelectedNode);
                                                } else if (e.selectionChange && mode === "view") {
                                                    /*const newIsEquation = editor.formatter.match("feedback");
                                                    setIsEquation(newIsEquation);*/
                                                }
                                            });
                                            editor.on("SelectionChange", () => {
                                                if (mode === "edit") {
                                                    const currentEl = getNode();
                                                    const newColor = getFormat("text-color", editor, currentEl).join(" ");
                                                    const newBackground = getFormat("background-color", editor, currentEl).join(" ");
                                                    const newFontSize = getFormat("font-size", editor, currentEl).join(" ");
                                                    setCurrentColor(newColor);
                                                    setBackground(newBackground);
                                                    setFontSize(newFontSize);
                                                }
                                            });
                                        }
                                    }}
                                />
                            ), [bookContent])}
                        </div>
                        <Box p={"4px"} textAlign="right" display={tinymce.activeEditor && tinymce.activeEditor.contentCSS.length > 0 && bookContent !== null ? "block" : "none"}>
                            <LinkBtn href="https://www.tiny.cloud" color="inherit" target="_blank">
                                Powered By Tiny
                            </LinkBtn>
                        </Box>
                    </div>
            </Box>
        : (
            <Alert severity="warning">
                <AlertTitle>Wait a second!</AlertTitle>
                {error}
            </Alert>
        )
    );
}