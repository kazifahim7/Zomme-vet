"use client";
import React from "react";
import Link from 'next/link';

const Header: React.FC = () => {
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

                    <div className="flex items-center space-x-4">
                         <Link href={`https://us-east-2vpnzrjwhp.auth.us-east-2.amazoncognito.com/login?client_id=mprqfsjl2oapu6iscbb41gk9u&response_type=token&scope=openid+email+profile&redirect_uri=${process.env.NEXT_PUBLIC_REDIRECT_URL}`} target="_blank"><button className="text-gray-600 hover:text-primary cursor-pointer font-medium">Log in</button></Link>
                         <button className=" w-[107px]h-[50px]gap-[12px]opacity-100 rounded-[8px] border p-[12px] text-emerald-500 border-emerald-500 flex items-center justify-center
          ">Get Started</button>
                    </div>
               </div>
          </header>
     );
};

export default Header;
