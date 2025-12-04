"use client";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";

export default function Subscription() {
  const router = useRouter();

  return (
    <div className="p-4 md:p-10 max-w-7xl mx-auto">
      <h2 className="text-sm md:text-3xl font-bold mb-4">SUBSCRIPTION</h2>

      <h1 className="text-center text-xl md:text-3xl font-bold mb-8">
        Subscribe for Better Value
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* ------ Card 1 ------ */}
        <div className="bg-white p-6 md:p-10 rounded-xl md:rounded-2xl shadow 
                        flex flex-col md:flex-row items-start gap-8 
                        md:md:min-h-80 w-full">
          <div className="flex-1 space-y-3">
            <h2 className="text-3xl md:text-4xl font-bold">$75</h2>
            <p className="text-gray-500 text-sm md:text-base mb-4">per consultation</p>

            <button
              onClick={() => router.push("/subscription/active")}
              className="bg-emerald-500 text-white px-6 py-2 md:px-8 md:py-3 
                         rounded-lg text-sm md:text-base">
              Book Now
            </button>
          </div>

          <div className="w-full h-px md:w-px md:h-full bg-gray-200" />

          <ul className="flex-1 space-y-3 text-sm md:text-base">
            <li className="flex items-center gap-3">
              <Check size={20} className="text-emerald-500" />
              30 min video call
            </li>
            <li className="flex items-center gap-3">
              <Check size={20} className="text-emerald-500" />
              Prescription management
            </li>
          </ul>
        </div>

        {/* ------ Card 2 ------ */}
        <div className="bg-white p-6 md:p-10 rounded-xl md:rounded-2xl shadow 
                        flex flex-col md:flex-row items-start gap-8 
                        md:min-h-80 w-full">
          <div className="flex-1 space-y-3">
            <h2 className="text-3xl md:text-4xl font-bold">$300</h2>
            <p className="text-gray-500 text-sm md:text-base mb-4">per year</p>

            <button
              onClick={() => router.push("/subscription/active")}
              className="bg-amber-500 text-white px-6 py-2 md:px-8 md:py-3
                         rounded-lg text-sm md:text-base">
              Subscribe Now
            </button>
          </div>

          <div className="w-full h-px md:w-px md:h-full bg-gray-200" />

          <ul className="flex-1 space-y-3 text-sm md:text-base">
            <li className="flex items-center gap-3">
              <Check size={20} className="text-emerald-500" />
              6 consultations included
            </li>
            <li className="flex items-center gap-3">
              <Check size={20} className="text-emerald-500" />
              50% off additional visits
            </li>
            <li className="flex items-center gap-3">
              <Check size={20} className="text-emerald-500" />
              Priority scheduling
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
