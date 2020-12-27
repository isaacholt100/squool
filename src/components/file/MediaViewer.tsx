/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, memo, useState, useEffect } from "react";
import screenfull, { Screenfull } from "screenfull";
import ReactPlayer from "react-player/lazy";
import { Box, IconButton, Slider, Typography, Tooltip, makeStyles, FormControl, MenuItem, Select } from "@material-ui/core";
import AlertError from "../AlertError";
import Duration from "./Duration";
import MediaLoader from "./MediaLoader";
import Icon from "../Icon";
import clsx from "clsx";
import { mdiFullscreen, mdiFullscreenExit, mdiPause, mdiPictureInPictureBottomRight, mdiPlay, mdiSync, mdiVolumeMedium, mdiVolumeMute } from "@mdi/js";
import useIsMobile from "../../hooks/useIsMobile";

const AUDIO_EXTENSIONS = /\.(m4a|mp4a|mpga|mp2|mp2a|mp3|m2a|m3a|wav|weba|aac|oga|spx)($|\?)/i;

const useStyles = makeStyles(theme => ({
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
            //transition: "all 0.5s linear",
        }
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
    audioContainer: {
        position: "relative",
        width: "100%",
        height: 56,
    },
    slider: {
        color: "#fff !important",
    }
}));

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
}

function BasePlayer(props: IBasePlayerProps) {
    const
        classes = useStyles(),
        isMobile = useIsMobile(),
        [playing, setPlaying] = useState(false),
        [vol, setVol] = useState(0.75),
        [muted, setMuted] = useState(false),
        [played, setPlayed] = useState(0),
        [duration, setDuration] = useState(0),
        [rate, setRate] = useState(1),
        [pip, setPip] = useState(false),
        [volOpen, setVolOpen] = useState(false),
        [dragging, setDragging] = useState(false),
        player = useRef<ReactPlayer>(),
        volume = useRef(),
        seek = (e, s: number) => {
            props.setSeeking(false);
            player.current.seekTo(s);
        },
        keyPress = e => {
            console.log(e.key);
            
            switch (e.key) {
                case "ArrowRight":
                    player.current.seekTo(Math.min(duration, played * duration + 15));
                    break;
                case "ArrowLeft":
                    player.current.seekTo(Math.max(duration, played * duration - 15));
                    break;
                case "ArrowDown":
                    setVol(Math.max(0, vol - 0.1));
                    break;
                case "ArrowUp":
                    setVol(Math.min(1, vol + 0.1));
                    break;
                case "m":
                    setMuted(!muted);
                    break;
                case " ":
                    setPlaying(!playing)
                    break;
                default:
                    props.onKeyPress && props.onKeyPress(e);
                    break;
            }
        };
    useEffect(() => {
        document.addEventListener("keypress", keyPress);
    });
    useEffect(() => {
        return () => {
            document.removeEventListener("keypress", keyPress);
        }
    }, []);
    return (
        <>
            <div onClick={!isMobile && props.isVideo ? () => setPlaying(!playing) : null}>
                <ReactPlayer
                    ref={player}
                    url={props.url}
                    playing={playing}
                    volume={vol}
                    pip={pip}
                    muted={muted}
                    width="100%"
                    height="100%"
                    className={classes.player}
                    playbackRate={rate}
                    progressInterval={100}
                    onReady={props.onReady}
                    onError={props.onError}
                    onDuration={d => setDuration(d)}
                    onEnded={() => setPlaying(props.loop)}
                    onPlay={() => setPlaying(true)}
                    onPause={() => setPlaying(false)}
                    onEnablePIP={() => setPip(true)}
                    onDisablePIP={() => setPip(false)}
                    onProgress={s => !props.seeking && setPlayed(s.played)}
                    config={{
                        youtube: {
                            playerVars: {
                                controls: 0,
                                color: "white",
                                disablekb: 1,
                                fs: 0,
                                modestbranding: 1,
                            }
                        }
                    }}
                />
            </div>
            <div className={classes.bar} style={{opacity: props.opacity, bottom: props.full ? 0 : 4, backgroundColor: props.isVideo ? "rgba(0, 0, 0, 0.32)" : "black"}}>
                <Tooltip title={playing ? "Pause" : "Play"}>
                    <IconButton onClick={() => setPlaying(!playing)} color="inherit">
                        <Icon path={playing ? mdiPause : mdiPlay} />
                    </IconButton>
                </Tooltip>
                {!isMobile && (
                    <div onMouseEnter={() => setVolOpen(true)} onMouseLeave={() => !dragging && setVolOpen(false)} className="flex align_items_center">
                        <Tooltip title="Volume">
                            <IconButton ref={volume} onClick={() => setMuted(!muted)} color="inherit">
                                <Icon path={!muted ? mdiVolumeMedium : mdiVolumeMute} />
                            </IconButton>
                        </Tooltip>
                        <div className="flex align_items_center" style={{transition: "all 0.5s", width: volOpen ? 80 : 0, opacity: volOpen ? 1 : 0, padding: volOpen ? "2px 8px" : "2px 0px",}}>
                            <Slider
                                orientation="horizontal"
                                value={muted ? 0 : vol}
                                max={1}
                                step={0.05}
                                onMouseDown={() => setDragging(true)}
                                onChange={(e, v: number) => {
                                    setMuted(false);
                                    setVol(v);
                                }}
                                onMouseUp={() => setDragging(false)}
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
                        <Duration seconds={duration * played} />
                    </Typography>
                    <Slider
                        max={0.999999}
                        value={played}
                        step={0.000001}
                        onMouseDown={() => props.setSeeking(true)}
                        onTouchStart={() => props.setSeeking(true)}
                        onChangeCommitted={seek}
                        onChange={(e, p) => setPlayed(p as number)}
                        aria-labelledby="seek"
                        className={classes.slider}
                        classes={{
                            thumb: classes.thumb,
                        }}
                    />
                    <Typography className={clsx(classes.duration, classes.right)}>
                        -<Duration seconds={duration * (1 - played)} />
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

const VideoViewer = memo(({ url }: { url: string }) => {
    const
        classes = useStyles(),
        timer = useRef<NodeJS.Timeout>(),
        [show, setShow] = useState(true),
        [err, setErr] = useState(false),
        [loaded, setLoaded] = useState(false),
        [loop, setLoop] = useState(false),
        [full, setFull] = useState(false),
        [pip, setPip] = useState(false),
        [seeking, setSeeking] = useState(false),
        container = useRef(),
        canPip = ReactPlayer.canEnablePIP(url),
        fullScreen = () => {
            (screenfull as Screenfull).toggle(container.current);
        },
        showControls = () => {
            clearTimeout(timer.current);
            timer.current = setTimeout(() => setShow(false), 5000);
            setShow(true);
        },
        onKeyPress = e => {
            switch (e.key) {
                case "l":
                    setLoop(!loop);
                    break;
                case "f":
                    screenfull.isEnabled && fullScreen();
                    break;
                case "p":
                    canPip && setPip(!pip);
                    break;
            }
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
                onMouseMove={showControls}
                onMouseOut={() => !seeking && setShow(false)}
                onMouseOver={showControls}
                onTouchStart={() => setShow(!show)}
            >
                <div className={clsx(classes.bar, classes.topBar)} style={{opacity: show ? 1 : 0}} onTouchStart={show ? null : () => setShow(!show)}>
                    {canPip && (
                        <Tooltip title="Pop Out (p)">
                            <IconButton onClick={() => setPip(!pip)} color="inherit" className={clsx(pip && classes.activeBtn, "mr_4")} disabled={full}>
                                <Icon path={mdiPictureInPictureBottomRight} />
                            </IconButton>
                        </Tooltip>
                    )}
                    {screenfull.isEnabled && (
                        <Tooltip title="Full Screen (f)">
                            <IconButton onClick={fullScreen} color="inherit" className="mr_4">
                                <Icon path={full ? mdiFullscreenExit : mdiFullscreen} />
                            </IconButton>
                        </Tooltip>
                    )}
                    <Tooltip title="Loop (l)">
                        <IconButton onClick={() => setLoop(!loop)} color="inherit" className={loop ? classes.activeBtn : null}>
                            <Icon path={mdiSync} />
                        </IconButton>
                    </Tooltip>
                </div>
                <BasePlayer url={url} isVideo={true} opacity={show ? 1 : 0} full={full} onReady={() => setLoaded(true)} onError={() => setErr(true)} loop={loop} onKeyPress={onKeyPress} seeking={seeking} setSeeking={setSeeking} />
            </div>
        </>
    );
});

function AudioViewer({ url }: { url: string }) {
    const
        [err, setErr] = useState(false),
        [loaded, setLoaded] = useState(false),
        [seeking, setSeeking] = useState(false),
        classes = useStyles();
    return err ? <AlertError msg="Error loading media" btn={null} /> : (
        <>
            {!loaded && <MediaLoader />}
            <Box border="2px" borderColor="secondary.main">
                <div className={classes.audioContainer}>
                    <BasePlayer url={url} isVideo={false} opacity={1} full={false} onReady={() => setLoaded(true)} onError={() => setErr(true)} loop={false} onKeyPress={undefined} seeking={seeking} setSeeking={setSeeking} />
                </div>
            </Box>
        </>
    );
}

function MediaViewer({ url }: { url: string }) {
    const isAudio = AUDIO_EXTENSIONS.test(url);
    return isAudio ? <AudioViewer url={url} /> : <VideoViewer url={url} />;
}

export default MediaViewer;