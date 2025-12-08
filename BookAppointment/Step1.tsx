/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import api from "@/utils/api";

export interface ApiPet {
  age: number | null;
  allergies: any[];
  breed: string;
  color: string;
  createdAt: string;
  gender: string;
  isActive: boolean;
  medicalHistory: any[];
  medications: any[];
  microchipId: string | null;
  name: string;
  notes: string;
  ownerId: string;
  petId: string;
  profileImageUrl: string;
  species: string;
  updatedAt: string;
  vaccinations: any[];
  weight: number;
}

export default function Step1({
  selectedPet,
  onSelect,
  onNext,
}: {
  selectedPet: ApiPet | null;
  onSelect: (pet: ApiPet) => void;
  onNext: () => void;
}) {
  const [pets, setPets] = useState<ApiPet[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPetsData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await api.get('/pets');

        // Validate response structure
        if (response.data && Array.isArray(response.data.pets)) {
          setPets(response.data.pets);
        } else {
          console.error('Unexpected API response structure:', response.data);
          setError('Invalid data format received');
        }
      } catch (err) {
        console.error('Failed to fetch pets:', err);
        setError('Failed to load pets. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchPetsData();
  }, []);

  // Helper function to calculate years/months from age
  const getAgeDisplay = (age: number | null): string => {
    if (age === null || age === undefined) return "Age unknown";

    const years = Math.floor(age);
    const months = Math.round((age - years) * 12);

    if (years === 0 && months === 0) return "Newborn";
    if (years === 0) return `${months} month${months !== 1 ? 's' : ''}`;
    if (months === 0) return `${years} year${years !== 1 ? 's' : ''}`;

    return `${years} year${years !== 1 ? 's' : ''} ${months} month${months !== 1 ? 's' : ''}`;
  };

  if (loading) {
    return (
      <div className="w-full max-w-3xl">
        <h2 className="text-lg font-semibold mb-4">Select Your Pet</h2>
        <div className="flex justify-center items-center h-48">
          <div className="text-gray-500">Loading pets...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-3xl">
        <h2 className="text-lg font-semibold mb-4">Select Your Pet</h2>
        <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl">
      <h2 className="text-lg font-semibold mb-4">Select Your Pet</h2>

      {pets.length === 0 ? (
        <div className="p-8 text-center border border-gray-200 rounded-lg">
          <p className="text-gray-500">No pets found. Please add a pet first.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
            {pets.map((pet) => (
              <div
                key={pet.petId}
                onClick={() => onSelect(pet)}
                className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${selectedPet?.petId === pet.petId
                    ? "border-emerald-500 bg-teal-50 shadow-sm"
                    : "border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                  }`}
              >
                {/* Pet Image */}
                <div className="flex justify-center mb-3">
                  {pet.profileImageUrl ? (
                    <img
                      src={pet.profileImageUrl}
                      alt={pet.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-2xl">🐾</span>
                    </div>
                  )}
                </div>

                <h3 className="font-semibold text-center truncate">{pet.name}</h3>
                <p className="text-xs text-gray-500 text-center truncate">{pet.breed}</p>
                <div className="text-sm text-blue-500 text-center mt-2">
                  {getAgeDisplay(pet.age)}
                </div>
                <p className="text-xs text-gray-400 text-center mt-1">
                  {pet.species} • {pet.weight}kg
                </p>
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <button
              onClick={onNext}
              disabled={!selectedPet}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${selectedPet
                  ? "bg-emerald-500 hover:bg-emerald-600 text-white cursor-pointer"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
            >
              Continue
            </button>
          </div>
        </>
      )}
    </div>
  );
}