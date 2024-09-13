'use client'
import React from 'react';
import {AnimatePresence, motion} from "framer-motion"
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/lib/store";
import {hideToast} from "@/lib/toastSlice/toastSlice";

const Toast = () => {
    const dispatch:AppDispatch = useDispatch();
    const {type,message} = useSelector((state:RootState) => state.toastSlice);

    return (
        <AnimatePresence>
            <motion.div initial={{opacity: 0, y: '5vw'}} animate={{opacity: 1, y: 0}} exit={{opacity: 0, y: '5vw'}}
                        transition={{type: "spring", damping: 20, stiffness: 180}}
                        className="absolute z-50 top-0 right-0">
                <div
                    className={`p-4 relative m-4 px-4 py-2 rounded-lg ${type == "Error" && 'bg-red-500 text-red-200'}`}>
                    <p className="font-bold capitalize">{type}</p>
                    <p className="text-sm capitalize">{message}</p>
                    <div className="absolute right-3 top-1 hover:scale-105 transition-all duration-300">
                        <button onClick={() => dispatch(hideToast())}>
                            X
                        </button>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default Toast;
