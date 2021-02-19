/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef } from "react";
import { usePut } from "../../hooks/useRequest";
import { useDispatch } from "react-redux";
//import socket from "../../api/socket";
import Loader from "../../components/Loader";
import Timetable from "../../components/Timetable";
import { useRouter } from "next/router";
import useRedirect from "../../hooks/useRedirect";
import useTimetable from "../../hooks/useTimetable";
import { defaultRedirect } from "../../lib/serverRedirect";
import Title from "../../components/Title";


export default function TimetableView() {
    const
        [put] = usePut(),
        //socket = useSocket(),
        dispatch = useDispatch(),
        router = useRouter(),
        //classes = useStyles(),
        timetable = useTimetable();
    if (timetable?.periods?.length === 0) {
        router.replace("/timetable/search");
    }
    const
        length = useRef(timetable?.periods?.length),
        sat = useRef(timetable?.lessons?.length === 6),
        handleChange = (day, period, key) => e => {
            const { value } = e.target;
            const obj = {
                value,
                day,
                period,
                key,
            };
            dispatch({
                type: "/timetable/update",
                payload: obj,
            });
        },
        onBlur = (day, period, key) => () => {
            const value = timetable.lessons[day][period][key];
            const obj = {
                value,
                day,
                period,
                key,
            };
            put("/user/timetable", {
                failedMsg: "updating your timetable",
                body: obj,
                done() {
                    //socket.emit("user message", "/timetable/update", obj);
                }
            });
        },
        handleEnter = e => {
            if (e.key === "Enter") {
                e.target.blur();
            }
        };
    useEffect(() => {
        dispatch({
            type: "/moreActions",
            payload: [{
                label: "Toggle saturday",
                fn: () => {
                    put("/user/timetable", {
                        failedMsg: "updating your timetable",
                        body: {
                            sat: !sat.current,
                            length: length.current,
                        },
                        done() {
                            dispatch({
                                type: "/timetable/sat",
                                payload: !sat.current,
                            });
                            //dispatchEmit("/timetable/sat", !sat)
                        }
                    });
                }
            }, {
                label: "Change template",
                fn: () => router.push("/timetable/search"),
            }]
        });
    }, []);
    useEffect(() => {
        sat.current = timetable?.lessons?.length === 6;
    }, [timetable?.lessons?.length]);
    useEffect(() => {
        length.current = timetable?.periods?.length;
    }, []);
    const isLoggedIn = useRedirect();
    return (
        <>
            <Title title="Timetable" />
            {!isLoggedIn ? null : (
                timetable && timetable.periods.length > 0 ?
                    <Timetable
                        type="edit"
                        onChange={handleChange}
                        onEnter={handleEnter}
                        timetable={timetable}
                        onBlur={onBlur}
                    />
                : <Loader />
            )}
        </>
    );
};
//export const getServerSideProps = defaultRedirect;