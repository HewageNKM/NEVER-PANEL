import React, {useState} from 'react';
import Link from "next/link";
import {IoClose, IoMenu} from "react-icons/io5";
import {AnimatePresence, motion} from "framer-motion";

const NavMenu = () => {
    const [shoeMenu, setShoeMenu] = useState(false)
    return (
        <div className="absolute z-50 flex flex-col top-8 md:top-5 left-3">
                <div>
                    <button onClick={() => setShoeMenu(prevState => !prevState)}
                            className="text-2xl font-bold flex flex-row gap-1 justify-center items-center">
                        {shoeMenu ? <IoClose size={35}/> : <IoMenu size={35}/>}
                        <p className="md:block hidden">Menu</p>
                    </button>
                </div>
            <AnimatePresence>
                {shoeMenu && (<motion.div initial={{opacity: 0, y: '1vh'}} animate={{opacity: 1, y: 0}}
                                          exit={{opacity: 0, y: '1vh'}} className="bg-white">
                    <ul className="font-medium mt-2 p-2 rounded-lg flex-col  flex shadow-primary w-fit">
                        <li onClick={()=>setShoeMenu(false)}><Link href="/adminPanel/dashboard" className="hover:text-primary-100">Dashboard</Link></li>
                        <li onClick={()=>setShoeMenu(false)}><Link href="/adminPanel/inventory" className="hover:text-primary-100">Inventory</Link></li>
                        <li onClick={()=>setShoeMenu(false)}><Link href="/adminPanel/orders" className="hover:text-primary-100">Orders</Link></li>
                        <li onClick={()=>setShoeMenu(false)}><Link href="/adminPanel/users" className="hover:text-primary-100">Users</Link></li>
                        <li onClick={()=>setShoeMenu(false)}><Link href="/adminPanel/promotions" className="hover:text-primary-100">Promotions</Link></li>
                    </ul>
                </motion.div>)}
            </AnimatePresence>
        </div>
    );
};

export default NavMenu;
