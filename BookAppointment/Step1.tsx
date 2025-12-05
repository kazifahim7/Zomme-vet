"use client";
import { pets } from "./data";
import { Pet } from "./types";

export default function Step1({
  selectedPet,
  onSelect,
  onNext,
}: {
  selectedPet: Pet | null;
  onSelect: (pet: Pet) => void;
  onNext: () => void;
}) {
  return (
    <div className="w-full max-w-3xl">
      <h2 className="text-lg font-semibold mb-4">Select Your Pet</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
        {pets.map((pet) => (
          <div
            key={pet.id}
            onClick={() => onSelect(pet)}
            className={`p-4 border rounded-lg cursor-pointer transition ${
              selectedPet?.id === pet.id
                ? "border-emerald-500 bg-teal-50"
                : "border-gray-200 hover:bg-gray-100"
            }`}
          >
            <div className="text-4xl">{pet.image}</div>
            <h3 className="font-semibold">{pet.name}</h3>
            <p className="text-xs text-gray-500">{pet.breed}</p>
            <button className="text-sm text-blue-500">{pet.years} years {pet.months} months</button>
          </div>
        ))}
      </div>

      <button
        onClick={onNext}
        disabled={!selectedPet}
        className="px-6 py-2 bg-emerald-500 text-white rounded disabled:bg-gray-300 cursor-pointer"
      >
        Continue
      </button>
    </div>
  );
}
