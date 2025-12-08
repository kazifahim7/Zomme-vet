"use client";
import { ApiPet } from "./Step1";
import { Pet, DateOption, AppointmentTime, Reason } from "./types";

export default function Step4({
  selectedPet,
  selectedDate,
  selectedTime,
  reason,
  description,
  onPrevious,
  onConfirm,
}: {
  selectedPet: ApiPet | null;
  selectedDate: DateOption | null;
  selectedTime: AppointmentTime | null;
  reason: Reason | "";
  description: string;
  onPrevious: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="w-full max-w-3xl">
      <h2 className="text-lg font-semibold mb-6">Review & Confirm</h2>

      <div className="space-y-6">
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-semibold mb-2">Pet</h3>
          <p className="font-medium">{selectedPet?.name}</p>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-semibold mb-2">Date & Time</h3>
          <p className="font-medium">{selectedDate?.day}, {selectedDate?.date}</p>
          <p className="text-sm">{selectedTime?.time}</p>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-semibold mb-2">Reason</h3>
          <p>{reason}</p>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-semibold mb-2">Description</h3>
          <p>{description}</p>
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <button onClick={onPrevious} className="px-6 py-2 border border-emerald-500 rounded cursor-pointer text-emerald-500 hover:bg-gray-100 transition ">
          Previous
        </button>

        <button
          onClick={onConfirm}
          className="px-6 py-2 bg-emerald-500 text-white rounded cursor-pointer hover:bg-emerald-700 transition "
        >
          Confirm Booking
        </button>
      </div>
    </div>
  );
}
