import React, { memo } from "react";
import { usePut } from "../../hooks/useRequest";
import { Typography, TextField } from "@material-ui/core";
import { Autocomplete, createFilterOptions } from "@material-ui/lab";
import MarginDivider from "../MarginDivider";
//import socket from "../../api/socket";
import fonts from "../../json/googleFonts.json";
import { useTheme } from "../../context/Theme";
import { startCase } from "lodash";

export default memo(() => {
    const
        [put] = usePut(),
        [{ fontFamily }, setTheme] = useTheme(),
        updateFontFamily = (f: string) => {
            f = f && startCase(f).trim();
            if (f && f !== fontFamily && fonts.some(i => i === f)) {
                setTheme({ fontFamily: f });
                put("/user/settings/theme", {
                    failedMsg: "updating the theme",
                    body: {
                        path: "theme.fontFamily",
                        val: f,
                    },
                    done: () => {} //socket.emit("user message", "/theme", { fontFamily: f.trim() })
                });
            }
        };
    return (
        <>
            <Typography variant="h6" gutterBottom>
                Font
            </Typography>
            <Autocomplete
                options={fonts}
                value={fontFamily}
                onChange={(_e, newValue) => updateFontFamily(newValue || "")}
                filterOptions={createFilterOptions({
                    limit: 16,
                    trim: true,
                })}
                selectOnFocus={false}
                renderInput={params => (
                    <TextField
                        {...params}
                        variant="outlined"
                        label="Font family"
                        placeholder="Search for 900 fonts from Google Fonts (try: 'Roboto Slab')"
                        fullWidth
                        onKeyDown={e => e.key === "Enter" && (e.target as any).blur()}
                        onBlur={e => updateFontFamily(e.target.value)}
                    />
                )}
            />
            <MarginDivider />
        </>
    );
});