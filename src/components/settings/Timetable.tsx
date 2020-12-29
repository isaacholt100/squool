import React, { memo } from "react";
import useRequest from "../../hooks/useRequest";
//import { dispatchEmit } from "../../api/socketDispatch";
import { FormControlLabel, Switch, Button } from "@material-ui/core";
import MarginDivider from "../MarginDivider";
import Link from "next/link";
import useTimetable from "../../hooks/useTimetable";
export default memo(() => {
    const
        request = useRequest(),
        timetable = useTimetable(),
        periodsLength = timetable.periods.length,
        sat = timetable.lessons.length === 6,
        change = (e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
            request.put("/timetable/sat", {
                failedMsg: "updating your timetable",
                body: {
                    sat: checked,
                    length: periodsLength,
                },
                done: () => {}//dispatchEmit("/timetable/sat", checked),
            });
        };
    return (
        <>
            <div className={"full_width mb_8"}>
                <FormControlLabel
                    //disabled={periodsLength === 0}
                    control={
                        <Switch
                            checked={sat}
                            onChange={change}
                            value="checked"
                        />
                    }
                    label="Saturday on timetable"
                />
            </div>
            <Link href="/timetable/search">
                <Button component="a" color="secondary">
                    Change Template
                </Button>
            </Link>
            <MarginDivider />
        </>
    );
});