import React from 'react';
import { FaCheck } from 'react-icons/fa';

const Pricings = () => {
  return (
    <section id="pricing" className="bg-gray-50 py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Section Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-gray-900 mb-12 sm:mb-16 tracking-tight">
          Pricing
        </h1>

        {/* Pricing Cards Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 max-w-4xl mx-auto">
          
          {/* Single Consultation Card */}
          <div className="bg-white border-2 border-gray-100 rounded-2xl p-6 sm:p-8 lg:p-10 shadow-lg hover:shadow-xl transition-all duration-300">
            {/* Price Section */}
            <div className="text-center mb-6 sm:mb-8">
              <div className="flex justify-center items-baseline">
                <span className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900">$75</span>
              </div>
              <p className="text-lg sm:text-xl text-gray-600 mt-2 sm:mt-3 font-medium">per consultation</p>
            </div>

            {/* CTA Button */}
            <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white text-base sm:text-lg font-semibold py-3 sm:py-4 px-4 sm:px-6 rounded-xl transition-colors duration-200 mb-6 sm:mb-10 shadow-md hover:shadow-lg cursor-pointer">
              Book Now
            </button>

            {/* Features List */}
            <ul className="space-y-3 sm:space-y-4">
              <li className="flex items-start text-sm sm:text-base md:text-lg text-gray-700">
                <FaCheck className="text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                30 min video call
              </li>
              <li className="flex items-start text-sm sm:text-base md:text-lg text-gray-700">
                <FaCheck className="text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                Prescription management
              </li>
            </ul>
          </div>

          {/* Annual Subscription Card */}
          <div className="bg-white border-2 border-gray-100 rounded-2xl p-6 sm:p-8 lg:p-10 shadow-lg hover:shadow-xl transition-all duration-300">
            {/* Price Section */}
            <div className="text-center mb-6 sm:mb-8">
              <div className="flex justify-center items-baseline">
                <span className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900">$300</span>
              </div>
              <p className="text-lg sm:text-xl text-gray-600 mt-2 sm:mt-3 font-medium">per year</p>
            </div>

            {/* CTA Button */}
            <button className="w-full bg-amber-500 hover:bg-amber-600 text-white text-base sm:text-lg font-semibold py-3 sm:py-4 px-4 sm:px-6 rounded-xl transition-colors duration-200 mb-6 sm:mb-10 shadow-md hover:shadow-lg cursor-pointer">
              Subscribe Now
            </button>

            {/* Features List */}
            <ul className="space-y-3 sm:space-y-4">
              <li className="flex items-start text-sm sm:text-base md:text-lg text-gray-700">
                <FaCheck className="text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                6 consultations included
              </li>
              <li className="flex items-start text-sm sm:text-base md:text-lg text-gray-700">
                <FaCheck className="text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                50% off additional visits ($37.50 each)
              </li>
              <li className="flex items-start text-sm sm:text-base md:text-lg text-gray-700">
                <FaCheck className="text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                Priority scheduling
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricings;
