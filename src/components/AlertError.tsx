import React, { ReactChild } from "react";
import { Alert, AlertTitle } from "@material-ui/lab";
import { Button, Typography } from "@material-ui/core";
import Link from "next/link";

interface IProps {
    msg: string;
    btn: ReactChild;
}
export default function AlertError(props: IProps) {
    return (
        <div>
            <Alert severity="error" className="fadein" variant="filled">
                <AlertTitle>Uh oh!</AlertTitle>
                <Typography>{props.msg}</Typography>
                <div className={"mt_6"}>
                    <Link href="/">
                        <Button variant="outlined" component="a" className={"mr_6"} color="inherit">
                            Go Home
                        </Button>
                    </Link>
                    {props.btn}
                </div>
            </Alert>
        </div>
    );
}