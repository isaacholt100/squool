import React from "react";
import { Box, Button } from "@material-ui/core";

export default function UploadBtn({ onChange, accept, multiple }: { multiple?: boolean; accept: string; onChange(e: React.ChangeEvent<HTMLInputElement>): void }) {
    return (
        <>
            <Box clone display="none">
                <input
                    accept={accept}
                    multiple={multiple}
                    onChange={onChange}
                    id="file"
                    name="file"
                    type="file"
                />
            </Box>
            <label htmlFor="file">
                <Button variant="contained" color="primary" component="span">
                    Select {multiple ? "Files" : "File"}
                </Button>
            </label>
        </>
    );
}