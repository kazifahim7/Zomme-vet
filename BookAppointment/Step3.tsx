"use client";
import { Reason } from "./types";

export default function Step3({
  reason,
  description,
  onReason,
  onDescription,
  onNext,
  onPrevious,
}: {
  reason: Reason | "";
  description: string;
  onReason: (r: Reason) => void;
  onDescription: (d: string) => void;
  onNext: () => void;
  onPrevious: () => void;
}) {
  const reasons = [
    { value: "checkup", label: "Regular Checkup" },
    { value: "sick", label: "Sick Visit" },
    { value: "vaccination", label: "Vaccination" },
    { value: "grooming", label: "Grooming" },
  ];

  return (
    <div className="w-full max-w-3xl">
      <h2 className="text-lg font-semibold mb-4">Booking Details</h2>

      <label className="text-sm font-medium">Reason</label>
      <select
        value={reason}
        onChange={(e) => onReason(e.target.value as Reason)}
        className="w-full border rounded p-2 mb-6"
      >
        <option value="">Select Reason</option>
        {reasons.map((r) => (
          <option key={r.value} value={r.value}>
            {r.label}
          </option>
        ))}
      </select>

      <label className="text-sm font-medium">Description</label>
      <textarea
        value={description}
        onChange={(e) => onDescription(e.target.value)}
        className="w-full border rounded p-3 h-32 mb-6"
        placeholder="Describe symptoms..."
      />

      <div className="flex justify-between">
        <button onClick={onPrevious} className="px-6 py-2 border rounded cursor-pointer">
          Previous
        </button>

        <button
          onClick={onNext}
          disabled={!reason}
          className="px-6 py-2 bg-emerald-500 text-white rounded disabled:bg-gray-300 cursor-pointer"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
