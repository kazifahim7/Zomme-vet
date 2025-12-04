"use client";
import { useRouter } from "next/navigation";

export default function SubscriptionActive() {
  const router = useRouter();

  return (
    <div className="p-4 md:p-10 max-w-6xl mx-auto">
      <h2 className="text-xs md:text-3xl font-semibold tracking-wide mb-4">
        SUBSCRIPTION
      </h2>

      {/* Green Gradient Banner */}
      <div className="w-full rounded-2xl shadow bg-linear-to-r from-emerald-500 to-green-600 text-white px-6 py-8 mb-8">
        <p className="text-center text-sm opacity-90">You have unlocked</p>
        <h1 className="text-center text-4xl md:text-5xl font-bold leading-tight">
          50% off
        </h1>
        <p className="text-center text-sm opacity-90">Additional Visits!</p>
      </div>

      {/* Subscription Card */}
      <div className="bg-white rounded-2xl shadow p-6 md:p-8 mb-10">
        <div className="flex flex-col md:flex-row justify-between gap-6 md:gap-10 relative">
          {/* Left */}
          <div className="md:w-1/2">
            <h3 className="text-lg md:text-xl font-semibold mb-1">
              Annual Subscription
            </h3>

            <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-600 text-xs px-3 py-1 rounded-full">
              ● Active
            </span>

            <p className="text-gray-500 text-sm mt-4">
              06 August 2025, 02:09 PM
            </p>

            <p className="text-gray-700 font-semibold mt-1">$300 per year</p>
          </div>

          {/* Vertical Line */}
          <div className="hidden md:block w-px bg-gray-300"></div>

          {/* Right — Appointment Summary */}
          <div className="md:w-1/2 flex justify-center gap-12 md:gap-20">
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600">4/6</div>
              <p className="text-gray-500 text-sm">Used</p>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600">2</div>
              <p className="text-gray-500 text-sm">Remaining booking</p>
            </div>
          </div>
        </div>

        {/* Buttons centered */}
        <div className="flex justify-center gap-3 mt-8">
          <button className="bg-emerald-500 text-white px-5 py-2 rounded-lg text-sm">
            Change Plan
          </button>

          <button
            onClick={() => router.push("/subscription")}
            className="border border-red-400 text-red-500 px-5 py-2 rounded-lg text-sm"
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Payment History */}
      <div className="bg-white rounded-2xl shadow p-6 md:p-8 overflow-x-auto">
        <h3 className="font-semibold text-lg mb-4">Payment History</h3>

        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-600 text-left">
              <th className="p-3">SL</th>
              <th className="p-3">Date</th>
              <th className="p-3">Description</th>
              <th className="p-3">Earnings</th>
              <th className="p-3">Payment Status</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {[1, 2, 3, 4].map((i) => (
              <tr key={i} className="border-b">
                <td className="p-3">0{i}</td>
                <td className="p-3">12 Sep 2025, 11:02 PM</td>
                <td className="p-3">
                  Purchase subscription for {i}th booking
                </td>
                <td className="p-3">$37.5</td>

                <td className="p-3">
                  <span className="text-emerald-600 font-medium">Paid</span>
                </td>

                <td className="p-3 text-blue-500 cursor-pointer">
                  View Receipt
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
