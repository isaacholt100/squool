/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import { usePut } from "../../hooks/useRequest";
import { useDispatch } from "react-redux";
//import socket from "../../api/socket";
import { FormControlLabel, Switch, Grid, Button, FormControl, FormLabel, RadioGroup, Radio } from "@material-ui/core";
import MarginDivider from "../MarginDivider";
import FontSettings from "./Font";
import ColorPicker from "./ColorPicker";
import { shades, colors } from "../../json/colors";
//import useSocket from "../../hooks/useSocket";
import { useTheme } from "../../context/Theme";
import useCarouselView from "../../hooks/useCarouselView";
import {io} from 'socket.io-client'

type Intent = "primary" | "secondary";

export default function Theme() {
    const
        [put] = usePut(),
        //socket = useSocket(),
        [theme, setTheme] = useTheme(),
        huesAndShades = (col: string, intent: Intent) => {
            const hue = Object.keys(colors).find(key => Object.values(colors[key]).includes(col));
            return {
                [intent + "Hue"]: hue,
                [intent + "Shade"]: Object.keys(colors[hue]).find(key => colors[hue][key] === col),
            };
        },
        [themeState, setThemeState] = useState(() => ({
            ...huesAndShades(theme.primary, "primary"),
            ...huesAndShades(theme.secondary, "secondary")
        })),
        dispatch = useDispatch(),
        carouselView = useCarouselView(),
        handleChangeHue = (name: Intent) => e => {
            setThemeState({
                ...themeState,
                [name + "Hue"]: e.target.value,
            });
            const payload = colors[e.target.value][themeState[`${name}Shade`]];
            //console.log(theme);
            
            setTheme({ [name]: payload });
            put("/user/settings/theme", {
                failedMsg: "updating the theme",
                body: {
                    path: `theme.${name}`,
                    val: payload,
                },
                done() {
                    //console.log("theme updated");
                }//socket.emit("user message", "/theme", { [name]: payload }),
            });
        },
        handleChangeShade = (name: Intent) => (_e, shade) => {
            setThemeState({
                ...themeState,
                [`${name}Shade`]: shades[shade],
            });
        },
        endChangeShade = (name: Intent) => (_e, shade: number) => {
            const payload = colors[themeState[name + "Hue"]][shades[shade]];
            setTheme({ [name]: payload });
            put("/user/settings/theme", {
                failedMsg: "updating the theme",
                body: {
                    path: `theme.${name}`,
                    val: payload,
                },
                done() {}//socket.emit("user message", "/theme", { [name]: payload }),
            });
        },
        resetTheme = () => {
            setThemeState({
                primaryShade: "500",
                secondaryShade: "500",
                primaryHue: "indigo",
                secondaryHue: "indigo",
            });
            setTheme(null);
            put("/user/settings/theme", {
                failedMsg: "updating the theme",
                body: {
                    path: `theme`,
                    val: {},
                },
                done() {

                }//socket.emit("user message", "/theme/reset")
            });
        },
        changeCarouselView = (_e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
            dispatch({
                type: "/user/carouselView",
                payload: checked,
            });
            put("/user/settings/carouselView", {
                failedMsg: "updating the theme",
                body: {
                    carouselView: checked,
                },
                done() {}//socket.emit("user message", "/user/carouselView", checked)
            });
        },
        handleTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const socket = io();
            setTheme({ type: e.target.value });
            put("/user/settings/theme", {
                failedMsg: "updating the theme",
                body: {
                    path: "theme.type",
                    val: e.target.value,
                },
                done() {
                    socket.emit("user message", "/theme", { type: e.target.value });
                }
            });
        };
        //console.log(theme);
    return (
        <>
            <FormControl component="fieldset" fullWidth>
                <FormLabel component="legend">Theme Type</FormLabel>
                <RadioGroup row aria-label="theme-type" name="theme-type" value={theme.type} onChange={handleTypeChange}>
                    <FormControlLabel value="light" control={<Radio />} label="Light" />
                    <FormControlLabel value="dark" control={<Radio />} label="Dark" />
                    <FormControlLabel value="system" control={<Radio />} label="System" />
                </RadioGroup>
            </FormControl>
            <FormControlLabel
                control={
                    <Switch
                        checked={carouselView}
                        onChange={changeCarouselView}
                        value="checked"
                    />
                }
                label="Condensed view"
            />
            <MarginDivider />
            <Grid container spacing={1}>
                <ColorPicker
                    intent="primary"
                    shade={themeState.primaryShade}
                    hue={themeState.primaryHue}
                    handleChangeHue={handleChangeHue}
                    handleChangeShade={handleChangeShade}
                    endChangeShade={endChangeShade}
                />
                <ColorPicker
                    intent="secondary"
                    shade={themeState.secondaryShade}
                    hue={themeState.secondaryHue}
                    handleChangeHue={handleChangeHue}
                    handleChangeShade={handleChangeShade}
                    endChangeShade={endChangeShade}
                />
            </Grid>
            <MarginDivider />
            <FontSettings />
            <Button color="default" onClick={resetTheme}>
                Reset Theme
            </Button>
        </>
    );
};