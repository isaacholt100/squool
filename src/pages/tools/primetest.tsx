import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { TextField, Typography, Card } from "@material-ui/core";
import Decimal from "decimal.js";
import LoadBtn from "../../components/LoadBtn";

const _0 = new Decimal(0);

const useStyles = makeStyles(theme => ({
    result: {
        color: theme.palette.secondary.main,
        marginLeft: "auto",
        borderRadius: 4,
        border: `2px solid ${theme.palette.secondary.main}`,
        padding: 4,
    }
}));
export default function PrimeTest() {
    const
        [number, setNumber] = useState(""),
        [message, setMessage] = useState(""),
        [loading, setLoading] = useState(false),
        classes = useStyles(),
        handleChange = event => {
            setNumber(event.target.value);
        },
        handleSubmit = () => {
            setLoading(true);
            const worker = new Worker("../../workers/prime.worker", { type: "module" });
            worker.postMessage(number);
            worker.addEventListener("message", ({ data }) => {
                if (typeof(data) === "boolean") {
                    setMessage("Number " + (data ? "is" : "is not") + " prime");
                } else {
                    setMessage(data);
                }
                worker.terminate();
                setLoading(false);
            });
        },
        prevent = e => {
            e.preventDefault();
            if (number.length !== 0) {
                handleSubmit();
            }
        };
    return (
        <div>
            <Card>
                <form onSubmit={prevent}>
                    <Typography variant="h5">Prime number test</Typography>
                    <TextField
                        id="number"
                        label="Number"
                        value={number}
                        onChange={handleChange}
                        margin="normal"
                        variant="outlined"
                        fullWidth
                        autoComplete="off"
                    />
                    <div className={"flex align_items_center"}>
                        <LoadBtn
                            label="Test"
                            disabled={number.length === 0 || Number.isNaN(+number)}
                            loading={loading}
                        />
                        {message !== "" && <div className={classes.result}>{message}</div>}
                    </div>
                </form>
            </Card>
        </div>
    );
};
