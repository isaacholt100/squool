/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef } from "react";
import useRequest, { usePut } from "../../hooks/useRequest";
import { useDispatch, useSelector } from "react-redux";
//import socket from "../../api/socket";
import Loader from "../../components/Loader";
import Timetable from "../../components/Timetable";
import { useRouter } from "next/router";


export default function TimetableView() {
    const
        [put] = usePut(),
        //socket = useSocket(),
        dispatch = useDispatch(),
        router = useRouter(),
        //classes = useStyles(),
        timetable = useSelector((s: any) => s.timetable),
        sat = useRef(timetable.lessons.length === 6),
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
        if (timetable.periods.length === 0) {
            router.replace("/timetable/search");
        }
        dispatch({
            type: "/moreActions",
            payload: [{
                label: "Toggle saturday",
                fn: () => {
                    put("/user/timetable", {
                        failedMsg: "updating your timetable",
                        body: {
                            sat: !sat.current,
                            length: timetable.periods.length,
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
        sat.current = timetable.lessons.length === 6;
    }, [timetable.lessons.length]);
    return (
        timetable && timetable.periods.length > 0 ?
            <Timetable
                type="edit"
                onChange={handleChange}
                onEnter={handleEnter}
                timetable={timetable}
            />
        : <Loader />
    );
};