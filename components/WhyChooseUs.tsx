import React from 'react';
import { FaCheck, FaClock, FaDollarSign, FaTruckMedical } from 'react-icons/fa6';

const features = [
  {
    icon: <FaCheck className="text-2xl" />,
    title: "Licensed Professional (VA, FL, NJ)",
  },
  {
    icon: <FaClock className="text-2xl" />,
    title: "Convenient 24/7 Access",
  },
  {
    icon: <FaDollarSign className="text-2xl" />,
    title: "Affordable Pricing",
  },
  {
    icon: <FaTruckMedical className="text-2xl" />,
    title: "Prescription Delivery via Chewy",
  }
];

const WhyChooseUs = () => {
  return (
    <section id="about" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl text-black font-bold text-center mb-12">Why Choose Us</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-white text-black p-6 rounded-xl transition-shadow duration-300
                         hover:shadow-[0px_12px_24px_rgba(0,0,0,0.12),0px_8px_16px_rgba(0,0,0,0.08)]"
              style={{
                boxShadow: `
                  0px 2px 4px rgba(0,0,0,0.06),
                  0px 4px 8px rgba(0,0,0,0.08),
                  0px 8px 16px rgba(0,0,0,0.10)
                `
              }}
            >
              <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center text-primary mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
