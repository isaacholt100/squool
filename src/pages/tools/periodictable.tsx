/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Loader from "../../components/Loader";
import {
    Button,
    Typography,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Box,
    Tooltip,
} from "@material-ui/core";
import { startCase, capitalize } from "lodash";
import Title from "../../components/Title";
import { Alert, AlertTitle } from "@material-ui/lab";
import clsx from "clsx";
import { defaultRedirect } from "../../lib/serverRedirect";

const elements = [{"name":"Hydrogen","symbol":"H"},{"name":"Helium","symbol":"He"},{"name":"Lithium","symbol":"Li"},{"name":"Beryllium","symbol":"Be"},{"name":"Boron","symbol":"B"},{"name":"Carbon","symbol":"C"},{"name":"Nitrogen","symbol":"N"},{"name":"Oxygen","symbol":"O"},{"name":"Fluorine","symbol":"F"},{"name":"Neon","symbol":"Ne"},{"name":"Sodium","symbol":"Na"},{"name":"Magnesium","symbol":"Mg"},{"name":"Aluminum","symbol":"Al"},{"name":"Silicon","symbol":"Si"},{"name":"Phosphorus","symbol":"P"},{"name":"Sulfur","symbol":"S"},{"name":"Chlorine","symbol":"Cl"},{"name":"Argon","symbol":"Ar"},{"name":"Potassium","symbol":"K"},{"name":"Calcium","symbol":"Ca"},{"name":"Scandium","symbol":"Sc"},{"name":"Titanium","symbol":"Ti"},{"name":"Vanadium","symbol":"V"},{"name":"Chromium","symbol":"Cr"},{"name":"Manganese","symbol":"Mn"},{"name":"Iron","symbol":"Fe"},{"name":"Cobalt","symbol":"Co"},{"name":"Nickel","symbol":"Ni"},{"name":"Copper","symbol":"Cu"},{"name":"Zinc","symbol":"Zn"},{"name":"Gallium","symbol":"Ga"},{"name":"Germanium","symbol":"Ge"},{"name":"Arsenic","symbol":"As"},{"name":"Selenium","symbol":"Se"},{"name":"Bromine","symbol":"Br"},{"name":"Krypton","symbol":"Kr"},{"name":"Rubidium","symbol":"Rb"},{"name":"Strontium","symbol":"Sr"},{"name":"Yttrium","symbol":"Y"},{"name":"Zirconium","symbol":"Zr"},{"name":"Niobium","symbol":"Nb"},{"name":"Molybdenum","symbol":"Mo"},{"name":"Technetium","symbol":"Tc"},{"name":"Ruthenium","symbol":"Ru"},{"name":"Rhodium","symbol":"Rh"},{"name":"Palladium","symbol":"Pd"},{"name":"Silver","symbol":"Ag"},{"name":"Cadmium","symbol":"Cd"},{"name":"Indium","symbol":"In"},{"name":"Tin","symbol":"Sn"},{"name":"Antimony","symbol":"Sb"},{"name":"Tellurium","symbol":"Te"},{"name":"Iodine","symbol":"I"},{"name":"Xenon","symbol":"Xe"},{"name":"Cesium","symbol":"Cs"},{"name":"Barium","symbol":"Ba"},{"name":"Lanthanum","symbol":"La"},{"name":"Cerium","symbol":"Ce"},{"name":"Praseodymium","symbol":"Pr"},{"name":"Neodymium","symbol":"Nd"},{"name":"Promethium","symbol":"Pm"},{"name":"Samarium","symbol":"Sm"},{"name":"Europium","symbol":"Eu"},{"name":"Gadolinium","symbol":"Gd"},{"name":"Terbium","symbol":"Tb"},{"name":"Dysprosium","symbol":"Dy"},{"name":"Holmium","symbol":"Ho"},{"name":"Erbium","symbol":"Er"},{"name":"Thulium","symbol":"Tm"},{"name":"Ytterbium","symbol":"Yb"},{"name":"Lutetium","symbol":"Lu"},{"name":"Hafnium","symbol":"Hf"},{"name":"Tantalum","symbol":"Ta"},{"name":"Tungsten","symbol":"W"},{"name":"Rhenium","symbol":"Re"},{"name":"Osmium","symbol":"Os"},{"name":"Iridium","symbol":"Ir"},{"name":"Platinum","symbol":"Pt"},{"name":"Gold","symbol":"Au"},{"name":"Mercury","symbol":"Hg"},{"name":"Thallium","symbol":"Tl"},{"name":"Lead","symbol":"Pb"},{"name":"Bismuth","symbol":"Bi"},{"name":"Polonium","symbol":"Po"},{"name":"Astatine","symbol":"At"},{"name":"Radon","symbol":"Rn"},{"name":"Francium","symbol":"Fr"},{"name":"Radium","symbol":"Ra"},{"name":"Actinium","symbol":"Ac"},{"name":"Thorium","symbol":"Th"},{"name":"Protactinium","symbol":"Pa"},{"name":"Uranium","symbol":"U"},{"name":"Neptunium","symbol":"Np"},{"name":"Plutonium","symbol":"Pu"},{"name":"Americium","symbol":"Am"},{"name":"Curium","symbol":"Cm"},{"name":"Berkelium","symbol":"Bk"},{"name":"Californium","symbol":"Cf"},{"name":"Einsteinium","symbol":"Es"},{"name":"Fermium","symbol":"Fm"},{"name":"Mendelevium","symbol":"Md"},{"name":"Nobelium","symbol":"No"},{"name":"Lawrencium","symbol":"Lr"},{"name":"Rutherfordium","symbol":"Rf"},{"name":"Dubnium","symbol":"Db"},{"name":"Seaborgium","symbol":"Sg"},{"name":"Bohrium","symbol":"Bh"},{"name":"Hassium","symbol":"Hs"},{"name":"Meitnerium","symbol":"Mt"},{"name":"Darmstadtium","symbol":"Ds"},{"name":"Roentgenium","symbol":"Rg"},{"name":"Copernicium","symbol":"Cn"},{"name":"Nihonium","symbol":"Nh"},{"name":"Flerovium","symbol":"Fl"},{"name":"Moscovium","symbol":"Mc"},{"name":"Livermorium","symbol":"Lv"},{"name":"Tennessine","symbol":"Ts"},{"name":"Oganesson","symbol":"Og"}];

const
    useStyles = makeStyles(theme => ({
        container: {
            overflow: "auto",
            whiteSpace: "nowrap",
            margin: "0 auto",
            maxHeight: "100%",
            flex: 1,
            width: "100%",
        },
        row: {
            whiteSpace: "nowrap",
            display: "table-row",
            height: 48,
            marginBottom: 6,
        },
        cell: {
            //width: "calc(100% / 18)",
            //paddingBottom: "calc(100% / 18)",
            [theme.breakpoints.down(880)]: {
                paddingBottom: 0,
                height: 48,
            },
            width: 48,
            height: 48,
            display: "inline-block",
            position: "relative",
            "& span": {
                textAlign: "center",
                fontSize: 20,
                display: "block"
            },
            "& button": {
                height: "100%",
                borderRadius: 6,
                padding: 0,
                width: "100%",
                minWidth: "100%",
                "&[disabled]": {
                    opacity: 0,
                },
            },
            margin: 3,
        },
        hover: {
            "&:hover": {
                opacity: 0.9,
            },
        },
        hide: {
            height: 30,
            visibility: "hidden",
        },
        row8: {
            "& .button": {
                backgroundColor: "#ff9800 !important",
                color: "#000 !important",
            }
        },
        row9: {
            "& .button": {
                backgroundColor: "#ff5722 !important",
                color: "#fff !important",
            },
        },
        symbolLa: {
            backgroundColor: "#ff9800 !important",
            color: "#000 !important",
        },
        symbolAc: {
            backgroundColor: "#ff5722 !important",
            color: "#fff !important",
        },
        symbolH: {
            backgroundColor: "#9e9e9e !important",
            color: "#000 !important",
        },
        col0: {
            "& .button": {
                backgroundColor: "#2196f3",
                color: "#fff",
            },
        },
        col1: {
            "& .button": {
                backgroundColor: "#00bcd4",
                color: "#000",
            },
        },
        transitions: {
            "& .button": {
                backgroundColor: "#4caf50",
                color: "#000",
            },
        },
        col12: {
            "& .button": {
                backgroundColor: "#607d8b",
                color: "#fff",
            },
        },
        col13: {
            "& .button": {
                backgroundColor: "#9c27b0",
                color: "#fff",
            },
        },
        col14: {
            "& .button": {
                backgroundColor: "#009688",
                color: "#fff",
            },
        },
        col15: {
            "& .button": {
                backgroundColor: "#8bc34a",
                color: "#fff",
            },
        },
        col16: {
            "& .button": {
                backgroundColor: "#e91e63",
                color: "#fff",
            },
        },
        col17: {
            "& .button": {
                backgroundColor: "#f44336",
                color: "#fff",
            },
        },
    })),
    structure = [
        [0, "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", 1],
        [2, 3, "", "", "", "", "", "", "", "", "", "", 4, 5, 6, 7, 8, 9],
        [10, 11, "", "", "", "", "", "", "", "", "", "", 12, 13, 14, 15, 16, 17],
        [...Array(18).keys()].map(x => x + 18),
        [...Array(18).keys()].map(x => x + 36),
        [-17, -16, -15, ...Array(15).keys()].map(x => x + 71),
        [-17, -16, -15, ...Array(15).keys()].map(x => x + 103),
        Array(18).fill(""),
        ["", "", ...Array(15).keys(), ""].map(x => x === "" ? x : +x + 56),
        ["", "", ...Array(15).keys(), ""].map(x => x === "" ? x : +x + 88)
    ];
export default function PeriodicTable() {
    const
        classes = useStyles(),
        [currentElement, setCurrentElement] = useState(null),
        [currentSymbol, setCurrentSymbol] = useState(""),
        close = () => {
            setCurrentSymbol("");
        },
        loadElement = async (symbol: string) => {
            setCurrentElement(null);
            try {
                const res = await fetch("/json/periodicTable/" + symbol + ".json");
                setCurrentElement(await res.json());
            } catch (err) {
                setCurrentElement(undefined);
                //snackbar.error("There was an error loading the periodic table");
            }
        },
        openDialog = (symbol: string) => () => {
            setCurrentSymbol(symbol);
            loadElement(symbol);
        };
    return (
        <>
            <Title title="Periodic Table" />
            {false ? <Loader /> : (
                <div className={clsx(classes.container, "flex flex_col align_items_center")}>
                    <div className="flex flex_col mx_auto">
                        {structure.map((row, i) => (
                            <div key={i} className={`${classes["row" + i]} ${classes.row}`}>
                                {row.map((index, j) => (
                                    <div className={`${classes.cell} ${j < 2 || j > 11 ? classes["col" + j] : classes.transitions}`} key={j}>
                                        <Box position="absolute" top={0} left={0} right={0} bottom={0} className={classes.hover}>
                                            <Tooltip title={elements[index]?.name} open={index === "" ? false : undefined}>
                                                <Button
                                                    className={index !== "" ? `button ${classes["symbol" + elements[index].symbol]}` : null}
                                                    onClick={index !== "" ? openDialog(elements[index].symbol) : null}
                                                    disabled={index === ""}
                                                    //disableTouchRipple
                                                >
                                                    <Typography component="span" className={index === "" ? classes.hide : null}>
                                                        {index !== "" ? elements[index].symbol : "p"}
                                                    </Typography>
                                                </Button>
                                            </Tooltip>
                                        </Box>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                    <Dialog
                        open={currentSymbol !== ""}
                        onClose={close}
                        aria-labelledby="element-info"
                    >
                        <DialogTitle id="element-info">Element info</DialogTitle>
                        <DialogContent>
                            {currentElement === null ? (
                                <Loader />
                            ) : currentElement === undefined ? (
                                <Alert severity="error" className="fadein" variant="filled">
                                    <AlertTitle>Uh oh!</AlertTitle>
                                    <Typography>There was an error loading the info for this element.</Typography>
                                    <Button variant="outlined" component="a" className={"mr_6 mt_6"} color="inherit" onClick={() => loadElement(currentSymbol)}>
                                        Retry
                                    </Button>
                                </Alert>
                            ) : (
                                <Table aria-label="element properties table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Element</TableCell>
                                            <TableCell align="right">{currentElement.name}</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {Object.keys(currentElement).filter(x => x !== "cpkHexColor" && currentElement[x] !== "").map(key => (
                                            <TableRow key={key}>
                                                <TableCell component="th" scope="row">
                                                    {key.includes("negativity") ? "Electron Negativity" : startCase(key)}
                                                </TableCell>
                                                <TableCell align="right">{capitalize(currentElement[key])}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={close} color="primary" autoFocus>
                                Close
                            </Button>
                        </DialogActions>
                    </Dialog>
                </div>
            )}
        </>
    );
};

export const getServerSideProps = defaultRedirect;