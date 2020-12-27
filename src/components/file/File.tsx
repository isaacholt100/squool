import React, { useState } from 'react';
import Code from "./Code";
import langs from "../../json/fileLanguages.json";
import { IconButton, Divider } from '@material-ui/core';
import { Box } from "@material-ui/core";
import { memo } from 'react';
import AlertError from '../AlertError';
import extensions from "../../json/fileExtensions.json";
import MediaViewer from "./MediaViewer";
import MediaLoader from './MediaLoader';
import useRequest from "../../hooks/useRequest";
import Icon from '../Icon';
import { mdiDownload, mdiLaunch } from '@mdi/js';
import ReactPlayer from 'react-player/lazy';

const getExtension = (name: string) => {
    const
        basename = name.split(/[\\/]/).pop(),
        pos = basename.lastIndexOf(".");
    if (basename === "" || pos < 1) {
        return "txt";
    }
    return basename.slice(pos + 1).toLowerCase();
}

const CodeViewer = memo(({ ext, path }: { path: string; ext: string }) => {
    const [code, setCode] = useState(undefined);
    const request = useRequest();
    request.get("/files/" + name, {
        done: setCode,
        failedMsg: "loading this file",
        failed: () => setCode(null),
    });
    return code === undefined ? <MediaLoader /> : (
        code === null ? <AlertError msg={"Error loading file"} btn={null} /> : (
            <Code lang={ext} code={code} showLineNumbers wrapLines height="calc(100vh - 256px)" />
        ) 
    );
});

const MediaBox = memo(({ children }) => (
    <Box clone maxWidth="100%" maxHeight={1024}>
        {children}
    </Box>
));

const ImgViewer = memo(({ src }: { src: string }) => {
    const [err, setErr] = useState(undefined);
    return err ? <AlertError msg="Error loading image" btn={null} /> : (
        //<MediaBox>
        <>
            {err === undefined && <MediaLoader />}
            <Box clone display={err === undefined ? "none" : "block"}>
                <img src={src} onLoad={() => setErr(false)} onError={() => setErr(true)} alt="Image can't be loaded" />
            </Box>
        </>
        //</MediaBox>
    );
});

const Actions = memo(({ path }: { path: string }) => (
    <>
        <div>
            <IconButton component="a" href={"http://localhost:3000/uploaded-files" + path} download className="mr_4">
                <Icon path={mdiDownload} />
            </IconButton>
            <IconButton component="a" href={"/file/view" + path} target="_blank">
                <Icon path={mdiLaunch} />
            </IconButton>
        </div>
        <Divider className="my_8" />
    </>
));

const Viewer = memo(({ path }: { path: string }) => {
    const
        ext = getExtension(path);
    if (langs.code.includes(extensions.code[ext] || ext)) {
        return <CodeViewer ext={extensions.code[ext] || ext} path={path} />;
    }
    if (langs.image.includes(extensions.image[ext] || ext)) {
        return <ImgViewer src={path} />
    }
    if (ReactPlayer.canPlay(path)) {
        return process.browser ? <MediaViewer url={path} /> : null;
    }
    return <>File can't be displayed</>;
});

export default function File({ path }: { path: string }) {
    return (
        <>
            <Actions path={path} />
            <Viewer path={path} /> 
        </>
    );
};