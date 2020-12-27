import React, { useState } from "react";
import { Tabs, Tab, AppBar, Card, Box } from "@material-ui/core";
import Icon from "../components/settings/Icon";
import Password from "../components/settings/Password";
import School from "../components/settings/School";
import DeleteAccount from "../components/settings/DeleteAccount";
import Theme from "../components/settings/Theme";
import useRedirect from "../hooks/useRedirect";
import Name from "../components/settings/Name";
import Email from "../components/settings/Email";
import useUrlHashIndex from "../hooks/useUrlHashIndex";

const PAGES = ["account", "profile", "theme"];

export default function Settings() {
    const
        isLoggedIn = useRedirect(),
        [hashIndex, changeHash] = useUrlHashIndex(PAGES),
        [page, setPage] = useState(hashIndex);
    return !isLoggedIn ? null : (
        <div>
            <Box clone mb={{ xs: "8px !important", lg: "16px !important" }}>
                <AppBar position="relative" color="default">
                    <Tabs
                        value={page}
                        onChange={(e, p) => setPage(p)}
                        indicatorColor="primary"
                        textColor="primary"
                        variant="scrollable"
                        scrollButtons="auto"
                        aria-label="scrollable tabs"
                    >
                        {PAGES.map((tab, i) => (
                            <Tab
                                key={i}
                                id={`tab-${i + 1}`}
                                aria-controls={tab}
                                label={tab}
                                onClick={() => changeHash(tab)}
                            />
                        ))}
                    </Tabs>
                </AppBar>
            </Box>
            <Box component={Card} mb={{ xs: 0.5, lg: 1, }}>
                {page === 0 && (
                    <>
                        <Email />
                        <Password />
                        {/*<Timetable />*/}
                        <School />
                        <DeleteAccount />
                    </>
                )}
                {page === 1 && (
                    <>
                        <Icon />
                        <Name />
                    </>
                )}
                {page === 2 && <Theme />}
            </Box>
        </div>
    );
};