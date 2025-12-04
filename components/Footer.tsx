"use client";
import Image from "next/image";
import React from "react";
import {
  FaInstagram,
  FaFacebook,
  FaLinkedin,
  FaTwitter,
} from "react-icons/fa";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer id="contact" className="bg-emerald-500 text-black pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12 items-start">
          {/* Logo Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2">
              <Image
                src="https://i.postimg.cc/GtqPWQt4/image-2483.png"
                alt="Zoomie Vet"
                width={121}           
                height={108}          
                style={{ opacity: 1 }}
              />
            </div>
            <p className="text-black mb-6 text-sm sm:text-base md:text-base lg:text-lg">
              Zoomie Vet is a modern, cloud-powered veterinary telemedicine
              platform designed to make expert pet care accessible, convenient,
              and stress-free for pet owners everywhere.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-black hover:text-white transition-colors">
                <FaInstagram className="text-xl" />
              </a>
              <a href="#" className="text-black hover:text-white transition-colors">
                <FaFacebook className="text-xl" />
              </a>
              <a href="#" className="text-black hover:text-white transition-colors">
                <FaLinkedin className="text-xl" />
              </a>
              <a href="#" className="text-black hover:text-white transition-colors">
                <FaTwitter className="text-xl" />
              </a>
            </div>
          </div>

          {/* Quick Links Section */}
          <div className="md:ml-12 lg:ml-24 flex flex-col justify-start">
            <h4 className="text-base sm:text-lg md:text-lg lg:text-xl font-semibold mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm sm:text-base md:text-base lg:text-lg">
              <li>
                <a href="#" className="text-black hover:text-white transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#services" className="text-black hover:text-white transition-colors">
                  Services
                </a>
              </li>
              <li>
                <a href="#pricing" className="text-black hover:text-white transition-colors">
                  Pricing
                </a>
              </li>
            </ul>
          </div>

          {/* Company Section */}
          <div className="md:ml-12 lg:ml-24 flex flex-col justify-start">
            <h4 className="text-base sm:text-lg md:text-lg lg:text-xl font-semibold mb-4">
              Company
            </h4>
            <ul className="space-y-2 text-sm sm:text-base md:text-base lg:text-lg">
              <li>
                <a href="#about" className="text-black hover:text-white transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#contact" className="text-black hover:text-white transition-colors">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom Row */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-t border-black pt-4">
          <p className="text-black mb-2 md:mb-0 text-sm sm:text-base md:text-base lg:text-lg">
            © ZOOMIE VET {currentYear}. All rights reserved.
          </p>
          <ul className="flex space-x-4 text-sm sm:text-base md:text-base lg:text-lg">
            <li>
              <a href="#" className="text-black hover:text-white transition-colors">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="text-black hover:text-white transition-colors">
                Terms & Conditions
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
