"use client";
import { CheckIcon } from "./icons";

export default function BookingSteps({ step }: { step: number }) {
  const steps = [
    { id: 1, name: "Select Pet" },
    { id: 2, name: "Date & Time" },
    { id: 3, name: "Booking Details" },
    { id: 4, name: "Review" },
  ];

  return (
    <>
      {/* Mobile View */}
      <div className="md:hidden border border-gray-200 rounded-lg p-4 mb-6">
        <h2 className="text-base font-semibold mb-3 pb-2 border-b">Booking Steps</h2>

        <div className="flex gap-3 overflow-x-auto pb-2">
          {steps.map((s) => (
            <div
              key={s.id}
              className={`px-4 py-2 whitespace-nowrap rounded-full border text-sm ${
                s.id === step
                  ? "bg-emerald-500 text-white border-teal-500"
                  : "bg-gray-100 text-gray-700 border-gray-300"
              }`}
            >
              Step {s.id}: {s.name}
            </div>
          ))}
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden md:block w-64 border border-gray-200 rounded-lg p-4">
        {/* Heading inside box */}
        <h2 className="text-base font-semibold mb-6 pb-2 border-b">Booking Steps</h2>

        <div className="relative space-y-16">
          {steps.map((s, index) => (
            <div key={s.id} className="flex items-center gap-3 relative">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${
                  s.id < step
                    ? "bg-emerald-500 border-emerald-500 text-white"
                    : s.id === step
                    ? "bg-blue-600 border-blue-600 text-white"
                    : "bg-white border-gray-400 text-gray-600"
                }`}
              >
                {s.id < step ? <CheckIcon /> : <span>{s.id}</span>}
              </div>

              <span
                className={`text-sm font-medium ${
                  s.id === step ? "text-blue-600" : "text-gray-700"
                }`}
              >
                {s.name}
              </span>

              {index < steps.length - 1 && (
                <div className="absolute left-3 top-6 h-16 w-0.5 bg-gray-300"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
