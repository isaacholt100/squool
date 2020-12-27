import React from "react";
import { Typography, Button, CircularProgress } from "@material-ui/core";
import styles from "../css/loadPreview.module.css";
export default function LoadPreview({ status, getData, opacity }) {
    return (
        <div className={styles.root} style={{opacity, zIndex: opacity === 1 ? undefined : -1000}}>
            {status === "loading" ? (
                <>
                    <Typography variant="h5" gutterBottom color="inherit" className={styles.text}>Loading your data...</Typography>
                    <CircularProgress color="inherit" disableShrink />
                </>
            ) : (
                <>
                    <Typography variant="h5" gutterBottom className={styles.error_text}>
                        There was an error loading your data
                    </Typography>
                    <Button color="default" onClick={getData}>Retry</Button>
                </>
            )}
        </div>
    );
};