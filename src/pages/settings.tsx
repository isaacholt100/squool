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

function AccountPage({ email }: { email: string }) {
    return (
        <>
            <Email email={email} />
            <Password />
            <School />
            <DeleteAccount />
        </>
    );
}
function ProfilePage(props: { icon: string; firstName: string; lastName: string; }) {
    return (
        <>
            <Icon icon={props.icon} />
            <Name firstName={props.firstName} lastName={props.lastName} />
        </>
    );
}

export default function Settings(props: { email: string, icon: string, firstName: string, lastName: string }) {
    const
        isLoggedIn = useRedirect(),
        [hashIndex, changeHash] = useUrlHashIndex(PAGES),
        [page, setPage] = useState(hashIndex);
    return (
        <>
            <Title title="Settings" />
            {!isLoggedIn ? null : (
                <div>
                    <Box>
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
                    <Box component={Card} my={{ xs: "6px", lg: "12px", }}>
                        {page === 0 && <AccountPage email={props.email} />}
                        {page === 1 && <ProfilePage icon={props.icon} firstName={props.firstName} lastName={props.lastName} />}
                        {page === 2 && <Theme />}
                    </Box>
                </div>
            )}
        </>
    );
};
export async function getServerSideProps(ctx: NextPageContext) {
    return serverRedirect(ctx, async (cookies) => {
        const user_id = new ObjectId(cookies.user_id);
        const db = await getDB();
        const users = db.collection("users");
        const user = await users.findOne({ _id: user_id }, { projection: { firstName: 1, lastName: 1, email: 1, icon: 1, _id: 0} });
        return {
            props: user
        }
    });
}