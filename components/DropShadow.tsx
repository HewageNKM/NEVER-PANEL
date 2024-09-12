"use client"
import React, {ReactNode} from 'react';
import {motion} from "framer-motion";

const DropShadow = ({children}:{children:ReactNode}) => {
    return (
        <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="w-full top-0 absolute flex bg-opacity-60  justify-center items-center min-h-screen bg-black">
            {children}
        </motion.div>
    );
};

export default DropShadow;
