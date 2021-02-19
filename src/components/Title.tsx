import Head from "next/head";
import { ReactNode } from "react";

export default function Title(props: { children?: ReactNode, title: string }) {
    return (
        <Head>
            <title>{props.title + " | Squool"}</title>
            {props.children}
        </Head>
    )
}