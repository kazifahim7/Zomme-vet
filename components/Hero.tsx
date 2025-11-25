"use client";
import React from "react";
import Image from "next/image";

const Hero = () => {
  const loginUrl = `https://us-east-2vpnzrjwhp.auth.us-east-2.amazoncognito.com/login?client_id=mprqfsjl2oapu6iscbb41gk9u&response_type=token&scope=openid+email+profile&redirect_uri=${process.env.NEXT_PUBLIC_REDIRECT_URL}`;

  return (
    <section id="home"  className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-4 flex flex-col-reverse md:flex-row items-center gap-12">

        {/* Text Content */}
        <div className="md:w-1/2 text-center md:text-left">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
            Virtual Vet Visits,{" "}
            <span className="text-primary">Real Care</span>
          </h1>

          <p className="text-base sm:text-lg text-gray-600 mb-8 leading-relaxed">
            Connect with Dr. Michelle Lapera for expert veterinary care from the
            comfort of your home. Fast, affordable, and convenient telemedicine
            for your beloved pets.
          </p>

          <a href={loginUrl} target="_blank" rel="noopener noreferrer">
            <button className="bg-emerald-500 text-white text-lg px-8 py-3 rounded-lg w-full sm:w-auto hover:bg-emerald-600 transition-colors duration-200 cursor-pointer">
              Schedule Your First Visit
            </button>
          </a>
        </div>

        {/* Image */}
        <div className="md:w-1/2 flex justify-center">
          <div className="rounded-[24px] shadow-xl overflow-hidden w-full max-w-[500px]">
            <Image
              src="https://i.postimg.cc/QMsmwHxW/unsplash-X3VRnoyj3Gw.png"
              alt="Veterinarian with dog"
              width={500}
              height={340}
              className="object-cover w-full h-auto rounded-[24px]"
            />
          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;
