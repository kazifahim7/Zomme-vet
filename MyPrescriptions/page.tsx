"use client";
import React, { useState } from 'react';

// --- TYPES ---
interface Prescription {
  id: number;
  medication: string;
  petName: string;
  petType: string;
  petBreed: string;
  imageUrl: string;
  date: string;
  dosage: string;
  daysSupply: number;
  instruction: string;
  refillsRemaining: number;
  status: 'Active' | 'Expired';
}

type Tab = 'active' | 'expired' | 'all';

// --- MOCK DATA ---
const mockPrescriptions: Prescription[] = [
  {
    id: 1,
    medication: 'Amoxicillin 250mg',
    petName: 'Max',
    petType: 'Dog',
    petBreed: 'British Shorthair',
    imageUrl: "https://placehold.co/60x60/81C784/ffffff?text=M",
    date: '25 December 2025',
    dosage: '1 tablet twice daily',
    daysSupply: 7,
    instruction: 'Give with food. Monitor coughing and appetite...',
    refillsRemaining: 3,
    status: 'Active',
  },
  {
    id: 2,
    medication: 'Amoxicillin 250mg',
    petName: 'Max',
    petType: 'Dog',
    petBreed: 'British Shorthair',
    imageUrl: "https://placehold.co/60x60/81C784/ffffff?text=M",
    date: '25 December 2025',
    dosage: '1 tablet twice daily',
    daysSupply: 7,
    instruction: 'Give with food. Monitor coughing and appetite...',
    refillsRemaining: 3,
    status: 'Active',
  },
  {
    id: 3,
    medication: 'Amoxicillin 250mg',
    petName: 'Max',
    petType: 'Dog',
    petBreed: 'British Shorthair',
    imageUrl: "https://placehold.co/60x60/81C784/ffffff?text=M",
    date: '25 December 2025',
    dosage: '1 tablet twice daily',
    daysSupply: 7,
    instruction: 'Give with food. Monitor coughing and appetite...',
    refillsRemaining: 0,
    status: 'Expired', // Changed to Expired
  },
  {
    id: 4,
    medication: 'Ibuprofen 50mg',
    petName: 'Fido',
    petType: 'Dog',
    petBreed: 'Labrador',
    imageUrl: "https://placehold.co/60x60/66BB6A/ffffff?text=F",
    date: '10 November 2025',
    dosage: '1 capsule daily',
    daysSupply: 14,
    instruction: 'Give with food. For pain relief...',
    refillsRemaining: 1,
    status: 'Active',
  },
  {
    id: 5,
    medication: 'Flea & Tick Prevention',
    petName: 'Luna',
    petType: 'Cat',
    petBreed: 'Persian',
    imageUrl: "https://placehold.co/60x60/FFA726/ffffff?text=L",
    date: '01 October 2025',
    dosage: '1 applicator monthly',
    daysSupply: 30,
    instruction: 'Apply to back of neck...',
    refillsRemaining: 0,
    status: 'Expired', // Changed to Expired
  },
  {
    id: 6,
    medication: 'Flea & Tick Prevention',
    petName: 'Luna',
    petType: 'Cat',
    petBreed: 'Persian',
    imageUrl: "https://placehold.co/60x60/FFA726/ffffff?text=L",
    date: '01 October 2025',
    dosage: '1 applicator monthly',
    daysSupply: 30,
    instruction: 'Apply to back of neck...',
    refillsRemaining: 1,
    status: 'Active', 
  },
];


// --- SUB-COMPONENTS ---

interface PrescriptionCardProps {
  prescription: Prescription;
  showStatus: boolean;
}

const PrescriptionCard: React.FC<PrescriptionCardProps> = ({ prescription, showStatus }) => {
  const { medication, petName, petType, petBreed, imageUrl, date, dosage, daysSupply, instruction, refillsRemaining, status, id } = prescription;

  const handleOrder = () => {
    console.log(`Ordering ${medication} for ID ${id}`);
    alert(`Ordering ${medication} on Chewy. (Mock Action)`);
  };

  const handleViewDetails = () => {
    console.log(`Viewing details for ID ${id}`);
    alert(`Showing details page for ${medication}. (Mock Action)`);
  };
  
  const statusColor = status === 'Active' ? 'text-emerald-600 bg-emerald-100' : 'text-red-600 bg-red-100';

  return (
    <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100 flex flex-col justify-between">
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-3">{medication}</h3>

        {/* Pet Info */}
        <div className="flex items-center space-x-3 mb-4">
          <img
            src={imageUrl}
            alt={petName}
            className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
            onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src='https://placehold.co/40x40/81C784/ffffff?text=P' }}
          />
          <div>
            <p className="text-base font-semibold text-gray-800">{petName}</p>
            <p className="text-xs text-gray-500">{petType} • {petBreed}</p>
          </div>
        </div>

        {/* Details */}
        <div className="text-sm text-gray-700 space-y-1 mb-4">
          <p className="flex justify-between">
            <span className="text-gray-500">Date:</span>
            <span className="font-medium">{date}</span>
          </p>
          <p className="flex justify-between">
            <span className="text-gray-500">Dosage:</span>
            <span className="font-medium">{dosage}</span>
          </p>
          <p className="flex justify-between">
            <span className="text-gray-500">Supply:</span>
            <span className="font-medium">{daysSupply} days</span>
          </p>
          <p className="text-sm">
            <span className="text-gray-500">Instruction:</span>
            <span className="block text-gray-700 mt-0.5 line-clamp-2">{instruction}</span>
          </p>
        </div>
      </div>
      
      {/* Footer / Status / Actions */}
      <div className="pt-4 border-t border-gray-100 mt-auto">
        <div className="flex justify-between items-center mb-3">
            <p className="text-sm text-gray-600 font-medium">
              {refillsRemaining} Refills remaining
            </p>
            {showStatus && (
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusColor}`}>
                    {status}
                </span>
            )}
        </div>

        <div className="flex justify-between items-center space-x-2">
          <button
            onClick={handleOrder}
            className="text-blue-600 hover:text-blue-800 font-semibold text-sm transition py-1 cursor-pointer"
          >
            Order on Chewy
          </button>
          <button
            onClick={handleViewDetails}
            className="text-gray-600 hover:text-gray-800 font-medium text-sm transition py-1"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};


// --- MAIN COMPONENT ---
export default function PrescriptionsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('active');

  const getFilteredPrescriptions = () => {
    switch (activeTab) {
      case 'active':
        return mockPrescriptions.filter(p => p.status === 'Active');
      case 'expired':
        return mockPrescriptions.filter(p => p.status === 'Expired');
      case 'all':
      default:
        return mockPrescriptions;
    }
  };

  const filteredPrescriptions = getFilteredPrescriptions();
  const showStatusOnCard = activeTab === 'all';

  const renderTab = (tab: Tab, label: string) => (
    <button
      key={tab}
      onClick={() => setActiveTab(tab)}
      className={`pb-2 px-4 transition-colors font-medium text-sm sm:text-base ${
        activeTab === tab
          ? 'text-emerald-600 border-b-2 border-emerald-600'
          : 'text-gray-500 hover:text-gray-700 border-b-2 border-transparent hover:border-gray-300'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-white font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-2xl font-bold text-gray-800 mb-8 uppercase tracking-wide">
          Prescriptions
        </h1>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-8 overflow-x-auto">
          <div className="flex whitespace-nowrap">
            {renderTab('active', 'Active Prescriptions')}
            {renderTab('expired', 'Expired Prescriptions')}
            {renderTab('all', 'All Prescriptions')}
          </div>
        </div>

        {/* Prescription Cards Grid */}
        {filteredPrescriptions.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPrescriptions.map(p => (
              <PrescriptionCard key={p.id} prescription={p} showStatus={showStatusOnCard} />
            ))}
          </div>
        ) : (
          <div className="text-center p-12 bg-white rounded-xl shadow-md border border-gray-100">
            <p className="text-xl text-gray-600 font-medium">No {activeTab === 'all' ? 'prescriptions' : `${activeTab} prescriptions`} found.</p>
            <p className="text-gray-500 mt-2">Check your other tabs or book a new appointment.</p>
          </div>
        )}

      </div>
    </div>
  );
}