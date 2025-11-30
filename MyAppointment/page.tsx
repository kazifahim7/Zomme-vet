"use client";
import React, { useState } from "react";
import Link from "next/link";

/* ---------------- ICON ---------------- */
const CalendarIcon: React.FC = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth="2" />
    <line x1="16" y1="2" x2="16" y2="6" strokeWidth="2" strokeLinecap="round" />
    <line x1="8" y1="2" x2="8" y2="6" strokeWidth="2" strokeLinecap="round" />
    <line x1="3" y1="10" x2="21" y2="10" strokeWidth="2" />
  </svg>
);

/* ---------------- TYPES ---------------- */
export interface Appointment {
  id: number;
  pet: string;
  type: string;
  breed: string;
  reason: string;
  description: string;
  date: string;
  time: string;
  status: "upcoming" | "past";
  image: string;
  videoCall?: boolean;
  confirmed?: boolean;
  cancelled?: boolean;
  completed?: boolean;
}

/* ---------------- DATA ---------------- */
const appointments: Appointment[] = [
  {
    id: 1,
    pet: "Max",
    type: "Dog",
    breed: "British Shorthair",
    reason: "Reason for visit",
    description: "Has mild seasonal allergies during spring...",
    date: "25 December 2025",
    time: "02:00 PM",
    status: "upcoming",
    videoCall: true,
    confirmed: false,
    image: "🐕",
  },
  {
    id: 2,
    pet: "Max",
    type: "Dog",
    breed: "British Shorthair",
    reason: "Reason for visit",
    description: "Has mild seasonal allergies during spring...",
    date: "25 December 2025",
    time: "02:00 PM",
    status: "upcoming",
    videoCall: true,
    confirmed: true,
    image: "🐕",
  },
  {
    id: 3,
    pet: "Max",
    type: "Dog",
    breed: "British Shorthair",
    reason: "Reason for visit",
    description: "Has mild seasonal allergies during spring...",
    date: "25 December 2025",
    time: "02:00 PM",
    status: "upcoming",
    cancelled: true,
    image: "🐕",
  },
  {
    id: 4,
    pet: "Max",
    type: "Dog",
    breed: "British Shorthair",
    reason: "Reason for visit",
    description: "Has mild seasonal allergies during spring...",
    date: "25 December 2025",
    time: "02:00 PM",
    status: "past",
    completed: true,
    image: "🐕",
  },
  {
    id: 5,
    pet: "Max",
    type: "Dog",
    breed: "British Shorthair",
    reason: "Reason for visit",
    description: "Has mild seasonal allergies during spring...",
    date: "25 December 2025",
    time: "02:00 PM",
    status: "past",
    completed: true,
    image: "🐕",
  },
  {
    id: 6,
    pet: "Max",
    type: "Dog",
    breed: "British Shorthair",
    reason: "Reason for visit",
    description: "Has mild seasonal allergies during spring...",
    date: "25 December 2025",
    time: "02:00 PM",
    status: "past",
    cancelled: true,
    image: "🐕",
  },
];

/* ---------------- CARD COMPONENT ---------------- */
interface AppointmentCardProps {
  appointment: Appointment;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({ appointment }) => {
  const isUpcoming = appointment.status === "upcoming";
  const isPast = appointment.status === "past";

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
      {/* Image + title */}
      <div className="flex items-start mb-4">
        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-2xl mr-3">
          {appointment.image}
        </div>

        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 text-base">{appointment.pet}</h3>
          <p className="text-sm text-gray-600">
            {appointment.type} • {appointment.breed}
          </p>
        </div>
      </div>

      {/* Description */}
      <div className="mb-4">
        <p className="text-xs font-semibold text-gray-700">{appointment.reason}</p>
        <p className="text-sm text-gray-600">{appointment.description}</p>
      </div>

      {/* Date + Time */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm font-semibold">{appointment.date}</p>
          <p className="text-sm text-gray-600">{appointment.time}</p>
        </div>

        {isUpcoming && appointment.videoCall && (
          <button className="text-red-500 text-sm font-semibold hover:text-red-600">
            Join Video
          </button>
        )}
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-2 flex-wrap">
        {isUpcoming && !appointment.cancelled && (
          <>
            <button className="px-4 py-1.5 rounded border border-red-500 text-red-500 text-sm hover:bg-red-50">
              Cancel
            </button>

            {appointment.confirmed ? (
              <button className="px-4 py-1.5 rounded border border-teal-500 text-teal-500 text-sm">
                Confirmed
              </button>
            ) : (
              <button className="px-4 py-1.5 rounded border border-blue-500 text-blue-500 text-sm hover:bg-blue-50">
                Scheduled
              </button>
            )}
          </>
        )}

        {isUpcoming && appointment.cancelled && (
          <button className="px-4 py-1.5 rounded border border-red-500 text-red-500 text-sm">
            Canceled
          </button>
        )}

        {isPast && appointment.completed && (
          <button className="px-4 py-1.5 rounded border border-purple-500 text-purple-500 text-sm">
            Completed
          </button>
        )}

        <button className="ml-auto px-4 py-1.5 rounded border border-gray-900 text-gray-900 text-sm hover:bg-gray-50">
          View
        </button>
      </div>
    </div>
  );
};

/* ---------------- MAIN PAGE ---------------- */
const MyApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");

  const upcomingAppointments = appointments.filter((a) => a.status === "upcoming");
  const pastAppointments = appointments.filter((a) => a.status === "past");

  return (
    <div className="min-h-screen  p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">MY APPOINTMENTS</h1>
          <Link
            href="/book"
            className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors text-sm md:text-base cursor-pointer flex items-center gap-2"
          >
            <span className="text-lg font-bold">+</span>
            Book Appointment
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("upcoming")}
            className={`pb-3 text-sm font-semibold relative ${
              activeTab === "upcoming"
                ? "text-teal-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Upcoming
            {activeTab === "upcoming" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600"></span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("past")}
            className={`pb-3 text-sm font-semibold relative ${
              activeTab === "past"
                ? "text-teal-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Past
            {activeTab === "past" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600"></span>
            )}
          </button>
        </div>

        {/* Cards Grid — full responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {(activeTab === "upcoming" ? upcomingAppointments : pastAppointments).map((apt) => (
            <AppointmentCard key={apt.id} appointment={apt} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyApp;
