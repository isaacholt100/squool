import React, { useState } from "react";
import Code from "./Code";
import langs from "../../json/fileLanguages.json";
import { IconButton, Divider } from "@material-ui/core";
import { Box } from "@material-ui/core";
import { memo } from "react";
import AlertError from "../AlertError";
import extensions from "../../json/fileExtensions.json";
import { AudioViewer, VideoViewer, YoutubePlayer } from "./MediaViewer";
import MediaLoader from "./MediaLoader";
import Icon from "../Icon";
import { mdiDownload, mdiLaunch } from "@mdi/js";
import { canPlay, AUDIO_EXTENSIONS, MATCH_URL_SOUNDCLOUD } from "react-player/lazy/patterns";
import useSWR from "swr";

const getExtension = (name: string) => {
    const
        basename = name.split(/[\\/]/).pop(),
        pos = basename.lastIndexOf(".");
    if (basename === "" || pos < 1) {
        return "txt";
    }
    return basename.slice(pos + 1).toLowerCase();
}

const CodeViewer = memo(({ ext, url }: { url: string; ext: string }) => {
    const { data, error } = useSWR(url, (url, opts) => fetch(url, opts).then(res => res.text()));
    return data === undefined ? <MediaLoader /> : (
        error ? <AlertError msg={"Error loading file"} btn={null} /> : (
            <Code lang={ext} code={data.slice(0, 1000)} showLineNumbers wrapLongLines height="calc(100vh - 256px)" />
        ) 
    );
});

const ImgViewer = memo(({ src }: { src: string }) => {
    const [err, setErr] = useState(undefined);
    return err ? <AlertError msg="Error loading image" btn={null} /> : (
        <>
            {err === undefined && <MediaLoader />}
            <img style={{display: err === undefined ? "none" : "block", maxHeight: 1024, maxWidth: "100%"}} src={src} onLoad={() => setErr(false)} onError={() => setErr(true)} alt="Image can't be loaded" />
        </>
    );
});

const Actions = memo(({ url }: { url: string }) => (
    <>
        <div>
            <IconButton component="a" href={url} download className="mr_4">
                <Icon path={mdiDownload} />
            </IconButton>
            <IconButton component="a" href={"/file/view" + url} target="_blank">
                <Icon path={mdiLaunch} />
            </IconButton>
        </div>
        <Divider className="my_8" />
    </>
));

const DocumentViewer = ({ url }: { url: string }) => {
    return (
        <Box position="relative" height="100%" maxWidth={1024}>
            <iframe src={`https://docs.google.com/gview?url=${url}&embedded=true`} width="100%" height="100%" frameBorder="0" />
        </Box>
    );
}

const Viewer = memo(({ url, ext }: { url: string, ext: string }) => {
    if (langs.code.includes(extensions.code[ext] || ext)) {
        return <CodeViewer ext={extensions.code[ext] || ext} url={url} />;
    }
    if (langs.image.includes(extensions.image[ext] || ext)) {
        return <ImgViewer src={url} />
    }
    if (canPlay.youtube(url)) {
        return process.browser ? <YoutubePlayer url={url} /> : null;
    }
    function isUrlAudio(url: string): boolean {
        return AUDIO_EXTENSIONS.test(url) || MATCH_URL_SOUNDCLOUD.test(url);
    }
    if (isUrlAudio(url)) {
        return process.browser ? <AudioViewer url={url} /> : null;
    }
    function canPlayVideo(url: string): boolean {
        return canPlay.dailymotion(url) || canPlay.file(url) || canPlay.vimeo(url);
    }
    if (canPlayVideo(url)) {
        return process.browser ? <VideoViewer url={url} /> : null;
    }
    if (langs.document.includes(ext)) {
        return <DocumentViewer url={url} />;
    }
    return <>File can't be displayed</>;
});

export default function File({ url, ext }: { url: string, ext: string }) {
    return (
        <div className="flex flex_col flex_1 full_height">
            <Actions url={url} />
            <div className="flex_1" style={{width: "100%", maxWidth: 1024, margin: "0 auto"}}>
                <Viewer url={url} ext={ext} />
            </div>
        </div>
    );
};