import React from "react";
import { Divider } from "@material-ui/core";

export default function MarginDivider(props: { dense?: boolean }) {
    return <Divider className={props.dense ? "my_6" : "my_12"} />;
}