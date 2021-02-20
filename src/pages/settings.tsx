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
import { NextPageContext } from "next";
import serverRedirect from "../lib/serverRedirect";
import { ObjectId } from "mongodb";
import getDB from "../server/getDB";
import Title from "../components/Title";

const PAGES = ["account", "profile", "theme"];

function AccountPage() {
    return (
        <>
            <Email />
            <Password />
            <School />
            <DeleteAccount />
        </>
    );
}
function ProfilePage() {
    return (
        <>
            <Icon />
            <Name />
        </>
    );
}

export default function Settings() {
    const
        isLoggedIn = useRedirect(),
        [hashIndex, changeHash] = useUrlHashIndex(PAGES),
        [page, setPage] = useState(hashIndex);
    return (
        <>
            <Title title="Settings" />
            {!isLoggedIn ? null : (
                <div>
                    <AppBar position="relative" color="default">
                        <Tabs
                            value={page}
                            onChange={(_e, p) => setPage(p)}
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
                    <Box component={Card} my={{ lg: "12px", sm: "6px", xs: "6px" }}>
                        {page === 0 && <AccountPage />}
                        {page === 1 && <ProfilePage />}
                        {page === 2 && <Theme />}
                    </Box>
                </div>
            )}
        </>
    );
};