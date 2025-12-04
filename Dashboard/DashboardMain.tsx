"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import { FaPaw, FaCalendarAlt, FaClipboardCheck } from "react-icons/fa";
import { FiArrowUpRight } from "react-icons/fi";
import Link from "next/link";
import Image from "next/image";

interface User {
  firstName: string;
  stats: {
    totalPets: number;
    upcomingAppointments: number;
    pastConsultations: number;
  };
}

interface Appointment {
  id: string;
  petName: string;
  date: string;
  time: string;
  reason: string;
  status: "scheduled" | "confirmed" | "completed" | "cancelled";
}

interface Pet {
  id: string;
  name: string;
  species: string;
  breed: string;
  age: number;
  condition: string;
  description: string;
  weight?: number;
  photo?: string;
}

export default function DashboardMain() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);

  // Demo data
  const demoAppointments: Appointment[] = [
    { id: "1", petName: "Buddy", date: "2025-12-30", time: "10:00 AM", reason: "Regular checkup", status: "scheduled" },
    { id: "2", petName: "Mittens", date: "2025-12-31", time: "2:00 PM", reason: "Vaccination", status: "confirmed" },
    { id: "3", petName: "Charlie", date: "2026-01-02", time: "11:30 AM", reason: "Dental cleaning", status: "scheduled" },
    { id: "4", petName: "Charlie", date: "2025-01-02", time: "11:30 AM", reason: "Dental cleaning", status: "completed" },
    { id: "5", petName: "Charlie", date: "2026-01-02", time: "11:30 AM", reason: "Dental cleaning", status: "cancelled" },
    { id: "6", petName: "Charlie", date: "2026-01-02", time: "11:30 AM", reason: "Dental cleaning", status: "scheduled" },
  ];

  useEffect(() => {
    const initializeDashboard = () => {
      const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
      if (!accessToken) return router.push("/login");

      const storedUser = typeof window !== "undefined" ? localStorage.getItem("zommeUser") : null;
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        setUser({
          firstName: "John",
          stats: { totalPets: 23, upcomingAppointments: 3, pastConsultations: 5 },
        });
      }

      setAppointments(demoAppointments);
      setPets([
        {
          id: "1",
          name: "Buddy",
          species: "Dog",
          breed: "Golden Retriever",
          age: 3,
          condition: "Medical Condition",
          description: "Vomitting",
          weight: 70,
          photo: "https://i.postimg.cc/SKkMGQy6/Frame-2147226503.png",
        },
        {
          id: "2",
          name: "Mittens",
          species: "Cat",
          breed: "Siamese",
          age: 2,
          condition: "Medical Condition",
          description: "Vomitting",
          weight: 50,
          photo: "https://i.postimg.cc/SKkMGQy6/Frame-2147226503.png",
        },
        {
          id: "3",
          name: "Charlie",
          species: "Cat",
          breed: "Siamese",
          age: 2,
          condition: "Medical Condition",
          description: "Vomitting",
          weight: 760,
          photo: "https://i.postimg.cc/SKkMGQy6/Frame-2147226503.png",
        },
      ]);

      setLoading(false);
    };

    initializeDashboard();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled": return "bg-blue-100 text-blue-800";
      case "confirmed": return "bg-green-100 text-green-800";
      case "completed": return "bg-gray-100 text-gray-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="px-4 md:px-8 lg:px-16 py-6 space-y-10">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Welcome back, {user.firstName}!</h1>
        <p className="text-gray-500 text-sm md:text-base">{dayjs().format("dddd, MMMM D, YYYY")}</p>
      </div>

      {/* MAIN FLEX */}
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 ">

        {/* QUICK ACTIONS */}
        <div className="bg-white border border-gray-100 rounded-xl p-4 flex flex-col gap-4 w-full lg:w-[280px] ">
          <h2 className="text-lg md:text-xl font-semibold mb-2">Quick Actions</h2>
          {[
            { label: "Book Appointment", emoji: "📅", path: "/book" },
            { label: "My Pets", emoji: "🐾", path: "/pets" },
            { label: "My Appointments", emoji: "📋", path: "/myappointment" },
            { label: "My Prescriptions", emoji: "💊", path: "/prescriptions" },
            { label: "Message", emoji: "💬", path: "/subscription" },
            { label: "Account Settings", emoji: "⚙️", path: "/account" },
          ].map((btn, i) => (
            <button
              key={i}
              className="bg-white border p-3 md:p-4 rounded-lg border-gray-200 hover:bg-gray-50 text-left font-medium flex justify-between items-center"
              onClick={() => router.push(btn.path)}
            >
              <span>{btn.emoji} {btn.label}</span>
              <FiArrowUpRight />
            </button>
          ))}
        </div>

        {/* RIGHT PANEL */}
        <div className="flex-1 flex flex-col gap-6 border border-gray-100 rounded-xl px-6 py-4 bg-white">

          {/* OVERVIEW STATS */}
          <h2 className="text-xl font-semibold">Overview Stats</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 bg-white p-4 rounded-lg shadow-md">
              <FaPaw className="text-3xl text-blue-500" />
              <div>
                <p className="text-xl md:text-2xl font-bold">{user.stats.totalPets}</p>
                <p className="text-gray-500 text-sm">Total Pets</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white p-4 rounded-lg shadow-md">
              <FaCalendarAlt className="text-3xl text-green-500" />
              <div>
                <p className="text-xl md:text-2xl font-bold">{user.stats.upcomingAppointments}</p>
                <p className="text-gray-500 text-sm">Upcoming Appointments</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white p-4 rounded-lg shadow-md">
              <FaClipboardCheck className="text-3xl text-red-500" />
              <div>
                <p className="text-xl md:text-2xl font-bold">{user.stats.pastConsultations}</p>
                <p className="text-gray-500 text-sm">Past Consultations</p>
              </div>
            </div>
          </div>

          {/* UPCOMING APPOINTMENTS */}
          <div>
            <h2 className="text-xl font-semibold mb-3">Upcoming Appointments</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {appointments.length === 0 ? (
                <p className="text-gray-500">No upcoming appointments.</p>
              ) : appointments.map((a) => (
                <div
                  key={a.id}
                  className="bg-white p-4 rounded-xl shadow-md flex flex-col justify-between"
                >

                  {/* TOP: Info + Join Video on Right */}
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-lg font-semibold">{a.petName}</p>
                      <p className="text-gray-500 text-sm line-clamp-1">{a.reason}</p>

                      <span
                        className={`inline-block mt-2 px-2 py-1 text-xs font-medium rounded ${getStatusColor(a.status)}`}
                      >
                        {a.status.charAt(0).toUpperCase() + a.status.slice(1)}
                      </span>
                    </div>

                    <button className="text-red-500 font-medium md:text-base cursor-pointer"
                      onClick={() => alert("Joining video call...")}>
                      Join Video
                    </button>
                  </div>

                  <div className="flex justify-between items-center mt-5">
                    <p className="text-gray-500 text-sm font-medium">
                      {dayjs(a.date).format("MMM D, YYYY")} • {a.time}
                    </p>

                    <Link
                      href={`/appointments`}
                      className="text-blue-500 font-medium md:text-base cursor-pointer"
                      onClick={() => router.push(`/appointments`)}
                    >
                      View Details
                    </Link>
                  </div>

                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* PETS SECTION */}
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 gap-3 sm:gap-0">
          <h2 className="text-xl font-semibold">Your Pets</h2>

          <Link
            href="/pets"
            className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors text-sm md:text-base cursor-pointer flex items-center gap-2"
          >
            <span className="text-lg font-bold">+</span>
            Add New Pet
          </Link>

        </div>
        {pets.length === 0 ? (
          <p className="text-gray-500">No pets yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {pets.map((p) => (
              <div
                key={p.id}
                className="bg-white p-4 md:p-5 rounded-xl shadow-md hover:shadow-lg transition-shadow flex flex-col"
              >
                <div className="flex items-center gap-3">
                  <Image
                    src={p.photo || "/placeholder-pet.png"}  // Image source with fallback
                    alt={p.name}
                    width={64}       // w-16 = 64px
                    height={64}      // h-16 = 64px
                    className="rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-lg">{p.name}</p>
                    <p className="text-gray-500 text-sm">{p.species} • {p.breed}</p>
                  </div>
                </div>
                <div className="flex justify-between mt-4 text-sm">
                  <p className="text-green-600 font-medium">Age: {p.age} yrs</p>
                  <p className="text-green-600 font-medium">Weight: {p.weight} lbs</p>
                </div>
                <p className="mt-2 text-sm font-medium">{p.condition}</p>
                <p className="mt-3 text-gray-600 text-sm">
                  {p.description || "No description available."}
                </p>
                <button
                  className="mt-4 w-full text-blue-600 bg-[#F5F9FF] py-2 rounded-lg hover:bg-gray-100 transition-colors text-sm md:text-base cursor-pointer"
                  onClick={() => router.push(`/pets/${p.id}`)}
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
