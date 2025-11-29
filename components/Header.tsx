"use client";
import React, { useEffect, useState } from "react";
import Link from 'next/link';
import { CgProfile } from "react-icons/cg";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";

const Header: React.FC = () => {
    const [user, setUser] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const accessToken = localStorage.getItem("accessToken");
        const idToken = localStorage.getItem("idToken");
        if (accessToken && idToken) {
            // Defer state update to avoid synchronous setState in effect
            setTimeout(() => setUser(true), 0);
        }
    }, []);

    const closeMenu = () => setMenuOpen(false);

    return (
        <header className="bg-white shadow-sm sticky top-0 z-30">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                {/* Logo */}
                <div className="flex items-center space-x-2">
                    <Link href="/">
                      <img
                           src="https://i.postimg.cc/GtqPWQt4/image-2483.png"
                           alt="Zoomie Vet"
                           style={{ width: '82px', height: '74px', opacity: 1 }}
                        />
                    </Link>
                </div>

                {/* Desktop Menu */}
                <nav className="hidden md:flex items-center space-x-8">
                    <Link href="/#home" className="text-gray-600 hover:text-primary transition-colors">Home</Link>
                    <Link href="/#services" className="text-gray-600 hover:text-primary transition-colors">Services</Link>
                    <Link href="/#pricing" className="text-gray-600 hover:text-primary transition-colors">Pricing</Link>
                    <Link href="/#about" className="text-gray-600 hover:text-primary transition-colors">About</Link>
                    <Link href="/#contact" className="text-gray-600 hover:text-primary transition-colors">Contact</Link>
                </nav>

                {/* Desktop User/Profile */}
                <div className="hidden md:flex items-center space-x-4 relative">
                    {user ? (
                        <div className="relative group">
                            <CgProfile className="text-2xl cursor-pointer text-black" />
                            <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                <Link href="/dashboard" className="block px-4 py-2 hover:bg-gray-100 text-gray-700">Dashboard</Link>
                                <button
                                    onClick={() => {
                                        localStorage.removeItem("accessToken");
                                        localStorage.removeItem("idToken");
                                        window.location.href = "/";
                                    }}
                                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    ) : (
                        <Link
                            href={`https://us-east-2vpnzrjwhp.auth.us-east-2.amazoncognito.com/login?client_id=mprqfsjl2oapu6iscbb41gk9u&response_type=token&scope=openid+email+profile&redirect_uri=${process.env.NEXT_PUBLIC_REDIRECT_URL}`}
                            target="_blank"
                        >
                            <div className="flex items-center space-x-4">
                                <button className="text-gray-600 hover:text-primary font-medium cursor-pointer">Log in</button>
                                <button className="w-[130px] h-[50px] rounded-[8px] border border-emerald-500 text-emerald-500 flex items-center justify-center px-4 hover:bg-emerald-500 hover:text-white transition-colors duration-200 cursor-pointer">
                                    Get Started
                                </button>
                            </div>
                        </Link>
                    )}
                </div>

                {/* Hamburger */}
                <div className="md:hidden">
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="text-2xl focus:outline-none"
                    >
                        {menuOpen ? <HiOutlineX /> : <HiOutlineMenu />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`md:hidden bg-white shadow-md transition-max-height duration-300 overflow-hidden ${menuOpen ? "max-h-screen" : "max-h-0"}`}>
                <nav className="flex flex-col px-4 py-2 space-y-1">
                    <a href="#" onClick={closeMenu} className="block px-4 py-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-md">Home</a>
                    <a href="#services" onClick={closeMenu} className="block px-4 py-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-md">Services</a>
                    <a href="#pricing" onClick={closeMenu} className="block px-4 py-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-md">Pricing</a>
                    <a href="#about" onClick={closeMenu} className="block px-4 py-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-md">About</a>
                    <a href="#footer" onClick={closeMenu} className="block px-4 py-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-md">Contact</a>

                    {/* Divider */}
                    <div className="border-t border-gray-200 my-2"></div>

                    {/* Mobile User Section */}
                    {user ? (
                        <>
                            <Link href="/dashboard" onClick={closeMenu} className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">Dashboard</Link>
                            <button
                                onClick={() => {
                                    localStorage.removeItem("accessToken");
                                    localStorage.removeItem("idToken");
                                    window.location.href = "/";
                                }}
                                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                href={`https://us-east-2vpnzrjwhp.auth.us-east-2.amazoncognito.com/login?client_id=mprqfsjl2oapu6iscbb41gk9u&response_type=token&scope=openid+email+profile&redirect_uri=${process.env.NEXT_PUBLIC_REDIRECT_URL}`}
                                target="_blank"
                                onClick={closeMenu}
                            >
                                <button className="w-full h-12 rounded-md border text-gray-600 hover:text-primary hover:bg-gray-100 cursor-pointer">Log in</button>
                            </Link>
                            <Link
                                href={`https://us-east-2vpnzrjwhp.auth.us-east-2.amazoncognito.com/login?client_id=mprqfsjl2oapu6iscbb41gk9u&response_type=token&scope=openid+email+profile&redirect_uri=${process.env.NEXT_PUBLIC_REDIRECT_URL}`}
                                target="_blank"
                                onClick={closeMenu}
                            >
                                <button className="w-full h-12 rounded-md border border-emerald-500 text-emerald-500  hover:bg-emerald-500 hover:text-white transition-colors duration-200 cursor-pointer">Get Started</button>
                            </Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Header;
