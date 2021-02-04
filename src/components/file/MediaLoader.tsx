import React from "react";
import { CircularProgress, } from "@material-ui/core";

export default function MediaLoader() {
    return <div className="p_6 flex justify_content_center"><CircularProgress disableShrink /></div>;
}