"use client";
import React from 'react';
import { Download, BookOpenCheck, DollarSign, Stethoscope, Clock, Calendar, CheckCircle } from 'lucide-react';

// --- MOCK DATA ---
const appointmentData = {
  pet: { 
    name: "Max", 
    type: "Dog", 
    breed: "British Shorthair", 
    // Placeholder image URL
    imageUrl: "https://placehold.co/60x60/81C784/ffffff?text=M" 
  },
  vet: { name: "Dr. Michelle Lapera" },
  status: "Completed",
  duration: "30 minutes",
  date: "25 December 2025, 04:01–04:30 PM",
  callStatus: "Call ended - 30 minutes",
  reason: "Sick Visit",
  description: "Max has been coughing occasionally and showing mild lethargy for the last 2 days. No vomiting or diarrhea. Eating less than usual.",
  price: 75,
  paymentStatus: "Paid",
  prescription: [
    { sl: '01', medication: 'Amoxicillin 250mg', dosage: '1 tablet twice daily', instruction: 'Give with food for 7 days. Monitor appetite, coughing, and hydration.' },
    { sl: '02', medication: 'Amoxicillin 250mg', dosage: '1 tablet twice daily', instruction: 'Give with food for 7 days. Monitor appetite, coughing, and hydration.' },
    { sl: '03', medication: 'Amoxicillin 250mg', dosage: '1 tablet twice daily', instruction: 'Give with food for 7 days. Monitor appetite, coughing, and hydration.' },
    { sl: '04', medication: 'Amoxicillin 250mg', dosage: '1 tablet twice daily', instruction: 'Give with food for 7 days. Monitor appetite, coughing, and hydration.' },
  ],
};

// --- ACTION HANDLERS ---
const handleDownload = () => {
  console.log("Downloading Summary...");
  alert("Summary Download initiated. (Mock Action)");
};

const handleBookFollowUp = () => {
  console.log("Booking Follow-Up...");
  alert("Redirecting to booking page for follow-up. (Mock Action)");
};

const handleViewTranscript = () => {
  console.log("Viewing Transcript...");
  alert("Opening appointment transcript. (Mock Action)");
};

// --- SUB-COMPONENTS ---

const AppointmentSummary = () => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
    <div className="flex justify-between items-start mb-6 border-b pb-4">
      <h2 className="text-xl font-semibold text-gray-800">Appointment Summary</h2>
      <span className="text-sm text-red-500 font-medium">{appointmentData.callStatus}</span>
    </div>

    <div className="space-y-4">
      {/* Pet and Status */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <img 
            src={appointmentData.pet.imageUrl} 
            alt={appointmentData.pet.name} 
            className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
            onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src='https://placehold.co/60x60/81C784/ffffff?text=M' }}
          />
          <div>
            <p className="text-lg font-bold text-gray-900">{appointmentData.pet.name}</p>
            <p className="text-sm text-gray-500">{appointmentData.pet.type} • {appointmentData.pet.breed}</p>
          </div>
        </div>
        <span className="text-sm font-semibold text-purple-600 border border-purple-200 bg-purple-50 px-3 py-1 rounded-full">
          {appointmentData.status}
        </span>
      </div>

      {/* Veterinarian */}
      <div className="pt-2">
        <p className="text-xs uppercase tracking-wider text-gray-500 font-medium">Veterinarian</p>
        <p className="text-base font-semibold text-gray-800">Dr. Michelle Lapera</p>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-4 text-sm pt-2">
        <div>
          <p className="text-xs uppercase tracking-wider text-gray-500 font-medium">Date & Time</p>
          <p className="font-medium text-gray-700 flex items-center gap-1"><Calendar size={14} />{appointmentData.date}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wider text-gray-500 font-medium">Duration</p>
          <p className="font-medium text-gray-700 flex items-center gap-1"><Clock size={14} />{appointmentData.duration}</p>
        </div>
      </div>

      {/* Reason */}
      <div className="pt-2">
        <p className="text-xs uppercase tracking-wider text-gray-500 font-medium">Reason</p>
        <p className="text-base font-medium text-gray-700">{appointmentData.reason}</p>
      </div>

      {/* Description */}
      <div className="pt-2">
        <p className="text-xs uppercase tracking-wider text-gray-500 font-medium">Description</p>
        <p className="text-sm text-gray-600 leading-relaxed">{appointmentData.description}</p>
      </div>
    </div>
  </div>
);

const PriceAndAction = () => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full">
    <h2 className="text-xl font-semibold text-gray-800 mb-6">Price & Action</h2>
    
    <div className="mb-6 flex flex-col items-center p-4 bg-gray-50 rounded-lg border border-gray-200">
      <span className="text-4xl font-extrabold text-gray-900 mb-2">${appointmentData.price}</span>
      <div className="flex items-center text-lg font-medium text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full">
        <CheckCircle size={16} className="mr-1" />
        <span>{appointmentData.paymentStatus}</span>
      </div>
    </div>

    <div className="space-y-3">
      <button 
        onClick={handleDownload}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-emerald-500 text-emerald-600 rounded-lg hover:bg-emerald-50 transition font-medium"
      >
        <Download size={20} />
        Download Summary
      </button>
      <button 
        onClick={handleBookFollowUp}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition shadow-md font-medium"
      >
        <Calendar size={20} />
        Book Follow-Up
      </button>
      <button 
        onClick={handleViewTranscript}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition font-medium"
      >
        <BookOpenCheck size={20} />
        View Transcript
      </button>
    </div>
  </div>
);

const PrescriptionTable = () => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
    <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-4">Prescription</h2>
    
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SL.</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Medication Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dosage</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Instruction</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {appointmentData.prescription.map((item) => (
            <tr key={item.sl} className="hover:bg-gray-50 transition">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.sl}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.medication}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.dosage}</td>
              <td className="px-6 py-4 text-sm text-gray-600 max-w-xs">{item.instruction}</td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button 
                  onClick={() => alert(`Ordering ${item.medication} on Chewy. (Mock Action)`)}
                  className="text-blue-600 hover:text-blue-800 font-semibold transition"
                >
                  Order on Chewy
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);


// --- MAIN COMPONENT ---
export default function AppointmentDetailsPage() {
  return (
    <div className="min-h-screen bg-white font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-2xl font-bold text-gray-800 mb-8 uppercase tracking-wide">
          Appointments Details
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content (2/3 width on large screens) */}
          <div className="lg:col-span-2 space-y-8">
            <AppointmentSummary />
          </div>

          {/* Sidebar (1/3 width on large screens) */}
          <aside className="lg:col-span-1">
            <PriceAndAction />
          </aside>
        </div>
        
        {/* Prescription Section (Full width) */}
        <div className="mt-8">
          <PrescriptionTable />
        </div>

      </div>
    </div>
  );
}