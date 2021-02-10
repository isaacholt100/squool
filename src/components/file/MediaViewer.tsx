/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, useState, useEffect } from "react";
import screenfull, { Screenfull } from "screenfull";
import ReactPlayer from "react-player/lazy";
import { IconButton, Slider, Typography, Tooltip, makeStyles, FormControl, MenuItem, Select } from "@material-ui/core";
import AlertError from "../AlertError";
import Duration from "./Duration";
import MediaLoader from "./MediaLoader";
import Icon from "../Icon";
import clsx from "clsx";
import { mdiFullscreen, mdiFullscreenExit, mdiPause, mdiPictureInPictureBottomRight, mdiPlay, mdiSync, mdiVolumeMedium, mdiVolumeMute } from "@mdi/js";
import useIsMobile from "../../hooks/useIsMobile";
import { canPlay } from "react-player/lazy/patterns";
import YTPlayer from "react-player/youtube";
import useRefState from "../../hooks/useRefState";

const useStyles = makeStyles({
    thumb: {
        "&.Mui-focusVisible,&:hover": {
            boxShadow: `0px 0px 0px 4px rgba(255, 255, 255, 0.25)`,
            transition: "none",
        },
        "&.MuiSlider-active": {
            boxShadow: `0px 0px 0px 8px rgba(255, 255, 255, 0.25)`,
            transition: "none",
        },
    },
    bar: {
        transition: "all 0.5s",
        padding: 4,
        backgroundColor: "rgba(0, 0, 0, 0.32)",
        display: "flex",
        color: "#fff",
        position: "absolute",
        width: "100%",
        alignItems: "center",
        "& *": {
            fontFamily: "Helvetica, Arial, sans-serif !important",
            transition: "all 0.5s linear",
        },
        zIndex: 100,
    },
    topBar: {
        top: 0,
    },
    activeBtn: {
        backgroundColor: "rgba(255, 255, 255, 0.32) !important",
        "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.25) !important",
        },
    },
    player: {
        marginBottom: -4,
        outline: "none !important",
        position: "absolute",
        top: 0,
        left: 0,
    },
    sliderDiv: {
        flex: 1,
        display: "flex",
        alignItems: "center",
        position: "relative",
        height: 56,
        margin: "-4px 12px",
    },
    duration: {
        position: "absolute",
        top: 0,
    },
    left: {
        left: 0,
    },
    right: {
        right: 0,
    },
    rateSelect: {
        width: 64,
        "& ::after": {
            borderColor: "#fff",
        }
    },
    audioPlayerContainer: {
        position: "relative",
        width: "100%",
        height: 56,
    },
    slider: {
        color: "#fff !important",
        "& *": {
            transition: "all 0s ease-out"
        }
    },
    transition: {
        "& *": {
            transition: "all 0.5s linear"
        }
    },
    videoContainer: {
        position: "relative",
        paddingTop: "56.25%",
    },
    audioContainer: {
        display: "none",
    },
    cover: {
        position: "absolute",
        top: 0, 
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 99,
    },
});

interface IBasePlayerProps {
    isVideo: boolean;
    url: string;
    onReady(): void;
    onError(): void;
    opacity: number;
    loop: boolean;
    full: boolean;
    onKeyPress(e): void;
    seeking: boolean;
    setSeeking(s: boolean): void;
    onEnablePip?(): void;
    onDisablePip?(): void;
    pip?: boolean;
    dragging?: boolean;
    setDragging?(d: boolean): void;
    onMouseOverBar?(): void;
    onMouseOutBar?(): void;
    playing: boolean;
    setPlaying(p: boolean): void;
}

export function YoutubePlayer({ url }: { url: string }) {
    const classes = useStyles();
    return (
        <div className={classes.videoContainer}>
            <YTPlayer
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                }}
                url={url}
                height="100%"
                width="100%"
                config={{
                    playerVars: {
                        controls: 1,
                        disablekb: 0,
                        modestbranding: 1,
                        color: "white"
                    }
                }}
            />
        </div>
    );
}

function BasePlayer(props: IBasePlayerProps) {
    const
        classes = useStyles(),
        isMobile = useIsMobile(),
        [vol, setVol] = useRefState(0.75),
        [muted, setMuted] = useRefState(false),
        [played, setPlayed] = useRefState(0),
        [duration, setDuration] = useRefState(0),
        [rate, setRate] = useState(1),
        [volOpen, setVolOpen] = useState(false),
        player = useRef<ReactPlayer>(),
        volume = useRef(),
        seek = (_e, s: number) => {
            props.setSeeking(false);
            player.current.seekTo(s);
        },
        keyPress = e => {
            switch (e.key) {
                case "ArrowRight":
                    player.current.seekTo(Math.min(duration.current, played.current * duration.current + 15));
                    break;
                case "ArrowLeft":
                    player.current.seekTo(Math.max(0, played.current * duration.current - 15));
                    break;
                case "ArrowDown":
                    const v = Math.max(0, vol.current - 0.1);
                    setMuted(v === 0);
                    setVol(v);
                    break;
                case "ArrowUp":
                    setMuted(false);
                    setVol(Math.min(1, vol.current + 0.1));
                    break;
                case "m":
                    setMuted(!muted.current);
                    break;
                default:
                    props.onKeyPress && props.onKeyPress(e);
                    break;
            }
        };
    useEffect(() => {
        document.addEventListener("keydown", keyPress);
        return () => {
            document.removeEventListener("keydown", keyPress);
        }
    }, []);
    return (
        <>
            <div className={props.isVideo ? classes.videoContainer : classes.audioContainer}>
                <ReactPlayer
                    ref={player}
                    url={props.url}
                    playing={props.playing}
                    volume={vol.current}
                    pip={props.pip}
                    muted={muted.current}
                    width={"100%"}
                    height={"100%"}
                    className={classes.player}
                    playbackRate={rate}
                    progressInterval={10}
                    onReady={props.onReady}
                    onError={props.onError}
                    onDuration={d => setDuration(d)}
                    onEnded={() => props.setPlaying(props.loop)}
                    onPlay={() => props.setPlaying(true)}
                    onPause={() => props.setPlaying(false)}
                    onEnablePIP={props.onEnablePip}
                    onDisablePIP={props.onDisablePip}
                    onProgress={s => !props.seeking && setPlayed(s.played)}
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                    }}
                    config={{
                        dailymotion: {
                            params: {
                                controls: false,
                                autoplay: false,
                                "queue-enable": false,
                                "sharing-enable": false,
                                "ui-logo": false,
                                "ui-start-screen-info": false,
                                fullscreen: false,
                            }
                        },
                        vimeo: {
                            playerOptions: {
                                byline: false,
                                controls: false,
                                portrait: false,
                                title: false,
                                autoplay: false,
                            }
                        },
                    }}
                />
            </div>
            <div className={classes.bar} style={{opacity: props.opacity, bottom: 0, backgroundColor: props.isVideo ? "rgba(0, 0, 0, 0.32)" : "black"}} onMouseOver={props.onMouseOverBar} onMouseOut={props.onMouseOutBar}>
                    <Tooltip title={props.playing ? "Pause" : "Play"}>
                        <IconButton onClick={() => props.setPlaying(!props.playing)} color="inherit">
                            <Icon path={props.playing ? mdiPause : mdiPlay} />
                        </IconButton>
                    </Tooltip>
                    {!isMobile && (
                        <div onMouseEnter={() => setVolOpen(true)} onMouseLeave={() => !props.dragging && setVolOpen(false)} className="flex align_items_center">
                            <Tooltip title="Volume">
                                <IconButton ref={volume} onClick={() => setMuted(!muted.current)} color="inherit">
                                    <Icon path={!muted.current ? mdiVolumeMedium : mdiVolumeMute} />
                                </IconButton>
                            </Tooltip>
                            <div className="flex align_items_center" style={{transition: "all 0.5s linear", width: volOpen ? 80 : 0, opacity: volOpen ? 1 : 0, padding: volOpen ? "2px 8px" : "2px 0px"}}>
                                <Slider
                                    orientation="horizontal"
                                    value={muted.current ? 0 : vol.current}
                                    max={1}
                                    step={0.05}
                                    onChange={(_e, v: number) => {
                                        !props.dragging && props.setDragging && props.setDragging(true);
                                        setMuted(v === 0);
                                        setVol(v);
                                    }}
                                    onChangeCommitted={() => props.setDragging && props.setDragging(false)}
                                    aria-labelledby="volume"
                                    className={classes.slider}
                                    classes={{
                                        thumb: classes.thumb,
                                    }}
                                />
                            </div>
                        </div>
                    )}
                    <div className={classes.sliderDiv}>
                        <Typography className={clsx(classes.duration, classes.left)}>
                            <Duration seconds={duration.current * played.current} />
                        </Typography>
                        <Slider
                            max={0.999999}
                            value={played.current}
                            step={0.000001}
                            onMouseDown={() => props.setSeeking(true)}
                            onTouchStart={() => props.setSeeking(true)}
                            onChangeCommitted={seek}
                            onChange={(_e, p) => setPlayed(p as number)}
                            aria-labelledby="seek"
                            className={clsx(classes.slider)}
                            classes={{
                                thumb: classes.thumb,
                            }}
                        />
                        <Typography className={clsx(classes.duration, classes.right)}>
                            -<Duration seconds={duration.current * (1 - played.current)} />
                        </Typography>
                    </div>
                    {/*<Tooltip title="Rate">*/}
                        <FormControl className={classes.rateSelect}>
                            <Select
                                labelId="rate"
                                id="rate-select"
                                value={rate}
                                onChange={e => setRate(e.target.value as number)}
                            >
                                {[0.25, 0.5, 0.75, 1, 1.25, 1.5, 2].map(n => (
                                    <MenuItem value={n} key={n}>{n + "x"}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    {/*</Tooltip>*/}
                </div>
        </>
    );
}

export const VideoViewer = ({ url }: { url: string }) => {
    const
        isYoutube = canPlay.youtube(url),
        classes = useStyles(),
        timer = useRef<NodeJS.Timeout>(),
        [show, setShow] = useState(true),
        [err, setErr] = useState(false),
        [loaded, setLoaded] = useState(false),
        [loop, setLoop] = useRefState(false),
        [full, setFull] = useState(false),
        [pip, setPip] = useRefState(false),
        [dragging, setDragging] = useState(false),
        [seeking, setSeeking] = useState(false),
        [playing, setPlaying] = useRefState(false),
        container = useRef(),
        canPip = ReactPlayer.canEnablePIP(url),
        isMobile = useIsMobile(),
        fullScreen = () => {
            (screenfull as Screenfull).toggle(container.current);
        },
        showControls = () => {
            if (!isMobile) {
                clearTimeout(timer.current);
                timer.current = setTimeout(() => setShow(false), 5000);
            }
            setShow(true);
        },
        onKeyPress = e => {
            switch (e.key) {
                case "l":
                    setLoop(!loop.current);
                    break;
                case "f":
                    screenfull.isEnabled && fullScreen();
                    break;
                case "p":
                    canPip && setPip(!pip.current);
                    break;
                case " ":
                    setPlaying(!playing.current);
                    break;
            }
        },
        showControlsPermanent = () => {
            clearTimeout(timer.current);
            setShow(true);
        },
        onMouseOut = () => {
            !seeking && !dragging && setShow(false);
        }
    useEffect(() => {
        (screenfull as Screenfull).on("change", () => setFull((screenfull as Screenfull).isFullscreen));
        return () => (screenfull as Screenfull).off("change", () => setFull((screenfull as Screenfull).isFullscreen));
    }, []);
    return err ? <AlertError msg="Error loading media" btn={null} /> : (
        <>
            {!loaded && <MediaLoader />}
            <div
                ref={container}
                style={{
                    ...(full ? { maxWidth: "100vw", maxHeight: "100vh"} : {}),
                    display: loaded ? "block" : "none",
                    position: "relative"
                }}
            >
                {!isYoutube && (
                    <>
                        <div
                            className={classes.cover}
                            onMouseMove={showControls}
                            onMouseOut={onMouseOut}
                            onMouseOver={showControls}
                            onTouchStart={() => setShow(!show)}
                            onClick={!isMobile ? () => setPlaying(!playing.current) : null}
                        />
                        <div className={clsx(classes.bar, classes.topBar)} style={{opacity: show ? 1 : 0}} onMouseOver={showControlsPermanent}>
                            {canPip && (
                                <Tooltip title="Pop Out (p)">
                                    <IconButton onClick={() => setPip(!pip)} color="inherit" className={clsx(pip && classes.activeBtn, "mr_6")} disabled={full}>
                                        <Icon path={mdiPictureInPictureBottomRight} />
                                    </IconButton>
                                </Tooltip>
                            )}
                            {screenfull.isEnabled && (
                                <Tooltip title="Full Screen (f)">
                                    <IconButton onClick={fullScreen} color="inherit" className="mr_6">
                                        <Icon path={full ? mdiFullscreenExit : mdiFullscreen} />
                                    </IconButton>
                                </Tooltip>
                            )}
                            <Tooltip title="Loop (l)">
                                <IconButton onClick={() => setLoop(!loop)} color="inherit" className={loop.current ? classes.activeBtn : null}>
                                    <Icon path={mdiSync} />
                                </IconButton>
                            </Tooltip>
                        </div>
                    </>
                )}
                <BasePlayer playing={playing.current} setPlaying={setPlaying} onMouseOverBar={showControlsPermanent} onMouseOutBar={onMouseOut} dragging={dragging} setDragging={setDragging} pip={pip.current} onEnablePip={() => setPip(true)} onDisablePip={() => setPip(false)} url={url} isVideo={true} opacity={show ? 1 : 0} full={full} onReady={() => setLoaded(true)} onError={() => setErr(true)} loop={loop.current} onKeyPress={onKeyPress} seeking={seeking} setSeeking={setSeeking} />
            </div>
        </>
    );
};

export function AudioViewer({ url }: { url: string }) {
    const
        [err, setErr] = useState(false),
        [loaded, setLoaded] = useState(false),
        [seeking, setSeeking] = useState(false),
        [playing, setPlaying] = useRefState(false),
        classes = useStyles(),
        onKeyPress = e => {
            if (e.key === " ") {
                setPlaying(!playing.current);
            }
        };
    return err ? <AlertError msg="Error loading media" btn={null} /> : (
        <>
            {!loaded && <MediaLoader />}
            <div className={classes.audioPlayerContainer} style={{display: loaded ? "block" : "none"}}>
                <BasePlayer onKeyPress={onKeyPress} playing={playing.current} setPlaying={setPlaying} url={url} isVideo={false} opacity={1} full={false} onReady={() => setLoaded(true)} onError={() => setErr(true)} loop={false} seeking={seeking} setSeeking={setSeeking} />
            </div>
        </>
    );
}