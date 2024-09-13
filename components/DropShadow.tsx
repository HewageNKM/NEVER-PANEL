"use client"
import React, {ReactNode} from 'react';
import {motion} from "framer-motion";

const DropShadow = ({children}:{children:ReactNode}) => {
    return (
        <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="w-full absolute lg:min-h-screen min-h-[150vh] md:min-h-[120vh] top-0 z-50 flex bg-opacity-60 justify-center items-center bg-black">
            {children}
        </motion.div>
    );
};

export default DropShadow;
