import React, { useState } from 'react';
import Link from "next/link";
import { IoClose, IoMenu } from "react-icons/io5";
import { AnimatePresence, motion } from "framer-motion";

const NavMenu = () => {
    const [shoeMenu, setShoeMenu] = useState(false);

    return (
        <div className="absolute z-50 flex flex-col top-6 md:top-4 left-4">
            <div>
                <button
                    onClick={() => setShoeMenu((prevState) => !prevState)}
                    aria-expanded={shoeMenu}
                    className="text-2xl font-bold flex items-center gap-2 transition-colors duration-300 hover:text-gray-700"
                >
                    {shoeMenu ? <IoClose size={35} /> : <IoMenu size={35} />}
                    <p className="hidden md:block">Menu</p>
                </button>
            </div>
            <AnimatePresence>
                {shoeMenu && (
                    <motion.div
                        initial={{ opacity: 0, y: '2vh' }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: '2vh' }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="bg-white shadow-lg rounded-lg mt-2 p-3"
                    >
                        <ul className="font-medium space-y-2 flex flex-col">
                            <li>
                                <Link href="/adminPanel" className="hover:text-blue-500 transition-colors duration-200" onClick={() => setShoeMenu(false)}>
                                    Dashboard
                                </Link>
                            </li>
                            <li>
                                <Link href="/adminPanel/inventory" className="hover:text-blue-500 transition-colors duration-200" onClick={() => setShoeMenu(false)}>
                                    Inventory
                                </Link>
                            </li>
                            <li>
                                <Link href="/adminPanel/orders" className="hover:text-blue-500 transition-colors duration-200" onClick={() => setShoeMenu(false)}>
                                    Orders
                                </Link>
                            </li>
                            <li>
                                <Link href="/adminPanel/users" className="hover:text-blue-500 transition-colors duration-200" onClick={() => setShoeMenu(false)}>
                                    Users
                                </Link>
                            </li>
                            <li>
                                <Link href="/adminPanel/promotions" className="hover:text-blue-500 transition-colors duration-200" onClick={() => setShoeMenu(false)}>
                                    Promotions
                                </Link>
                            </li>
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default NavMenu;
