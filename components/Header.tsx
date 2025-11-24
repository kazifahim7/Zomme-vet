"use client";
import React, { useEffect, useState } from "react";
import Link from 'next/link';
import { CgProfile } from "react-icons/cg";

const Header: React.FC = () => {
     const [user,setUser]=useState(false)
     useEffect(()=>{
          const accessToken = localStorage.getItem("accessToken");
          const idToken = localStorage.getItem("idToken");
          if(accessToken && idToken){
               // eslint-disable-next-line react-hooks/set-state-in-effect
               setUser(true)
          }
     },[])
     return (
          <header className="bg-white shadow-sm sticky top-0 z-50">
               <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                         {/* <FaPaw className="text-primary text-2xl" /> */}
                         < img src="https://i.postimg.cc/GtqPWQt4/image-2483.png" alt="Zoomie Vet" style={{ width: '82px', height: '74px', opacity: 1 }} />
                    </div>

                    <nav className="hidden md:flex items-center space-x-8">
                         <a href="#" className="text-gray-600 hover:text-primary">Home</a>
                         <a href="#services" className="text-gray-600 hover:text-primary">Services</a>
                         <a href="#pricing" className="text-gray-600 hover:text-primary">Pricing</a>
                         <a href="#about" className="text-gray-600 hover:text-primary">About</a>
                         <a href="#contact" className="text-gray-600 hover:text-primary">Contact</a>
                    </nav>

                    <div className="flex items-center space-x-4 relative">
                         {user ? (
                              <div className="relative group">
                                   {/* Profile Icon */}
                                   <CgProfile className="text-2xl cursor-pointer" />

                                   {/* Dropdown */}
                                   <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                        <Link
                                             href="/admin"
                                             className="block px-4 py-2 hover:bg-gray-100 text-gray-700"
                                        >
                                             Admin
                                        </Link>

                                        <Link href={"https://us-east-2vpnzrjwhp.auth.us-east-2.amazoncognito.com/logout?client_id=mprqfsjl2oapu6iscbb41gk9u&logout_uri=https://zoomievetcare.com/"}>
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
                                       </Link>
                                   </div>
                              </div>
                         ) : (
                              <Link
                                   href={`https://us-east-2vpnzrjwhp.auth.us-east-2.amazoncognito.com/login?client_id=mprqfsjl2oapu6iscbb41gk9u&response_type=token&scope=openid+email+profile&redirect_uri=${process.env.NEXT_PUBLIC_REDIRECT_URL}`}
                                   target="_blank"
                              >
                                   <button className="text-gray-600 hover:text-primary cursor-pointer font-medium">
                                        Log in
                                   </button>
                              </Link>
                         )}
                    </div>

               </div>
          </header>
     );
};

export default Header;
