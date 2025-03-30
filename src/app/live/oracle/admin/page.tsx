"use client";

import SimpleWrapper from "@/src/components/common/SimpleWrapper";
import { socket } from "@/src/utils/socket";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
const toastconfig = {id: "oracleAdminToast"};
export default function Oracle() {

    const [pause, setPause] = useState(false);
    
    const handleRoll = () => {
        if (pause) return;
        
        socket.emit("select", "I wanna roll!");
    }

    const handleReset = () => {
        
        socket.emit("reset");
    }


    useEffect(() => {
        socket.connect();

        if (socket.connected) {
            toast.success("Connected!");
        }

        return () => {
            socket.disconnect();
        };
    }, []);


    useEffect(() => {
        socket.on("preparing", (msg: string) => {
            setPause(true);
            toast.loading("Oracle is preparing", toastconfig);
        });

        return () => {
            socket.off("preparing");
        };
    }, []);

    useEffect(() => {
        socket.on("reset", (msg: string) => {
            toast.success("Oracle is ready", toastconfig);
            setPause(false);
        });

        return () => {
            socket.off("reset");
        };
    }, []);

    useEffect(()=>{
        (()=>{
            console.debug("State:", pause);
        })()
    },[ pause])

    return (
        <SimpleWrapper>
            <div className="pt-20 text-center text-offwhite font-bold">
                <h1 className="text-6xl lg:text-9xl uppercase text-gradient lg:leading-none">
                    Oracle
                </h1>
                <p className="block text-xl lg:text-3xl">
                    Never forget. Never Bias
                </p>
            </div>
            <div className="py-20"></div>
            <div className="text-center">
                <button
                    onClick={handleRoll}
                    className="navbutton btn-md px-6 py-3 text-lg font-bold text-white rounded-2xl shadow-lg transition-all hover:scale-110"
                    disabled={pause}
                >
                    Roll It
                </button>
                <br />
                <br />
                <button
                    onClick={handleReset}
                    className="navbutton px-6 py-3 btn-md text-lg font-bold text-white rounded-2xl shadow-lg transition-all hover:scale-110"
                    // disabled={pause}
                >
                    Reset
                </button>
            </div>
        </SimpleWrapper>
    );
}
