/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import { FaPaw, FaCalendarAlt, FaClipboardCheck } from "react-icons/fa";
import { FiArrowUpRight } from "react-icons/fi";
import Link from "next/link";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

interface User {
  createdAt: string;
  name: ReactNode;
  firstName: string;
  email: string;
  userId: string;
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
  petId: string;
  name: string;
  species: string;
  breed: string;
  age: number;
  color: string;
  weight?: number;
  profileImageUrl?: string;
  isActive: boolean;
}

interface DashboardData {
  appointments: {
    items: Appointment[];
    recent: number;
    upcoming: number;
  };
  pets: {
    count: number;
    items: Pet[];
  };
  summary: {
    hasActiveSubscription: boolean | null;
    recentAppointments: number;
    subscriptionStatus: string | null;
    totalPets: number;
    upcomingAppointments: number;
  };
  user: User;
}

export default function DashboardMain() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);
  const [summary, setSummary] = useState<{
    totalPets: number;
    upcomingAppointments: number;
    recentAppointments: number;
    totalSpent: number;
    totalAppointments: number;
    cancelledAppointments: number;
    completedAppointments: number;
    hasActiveSubscription: boolean | null;
    subscriptionStatus: string | null;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        setLoading(true);
        setError(null);

        // Check for tokens
        const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
        const token = localStorage.getItem("idToken");

        if (!accessToken || !token) {
          router.push("https://us-east-2vpnzrjwhp.auth.us-east-2.amazoncognito.com/login?client_id=mprqfsjl2oapu6iscbb41gk9u&response_type=token&scope=openid+email+profile&redirect_uri=https://zoomievetcare.com/callback");
          return;
        }

        // Get dashboard data
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me/dashboard`, {
          method: "GET",
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem('idToken');
            localStorage.removeItem('accessToken');
            window.location.href = 'https://us-east-2vpnzrjwhp.auth.us-east-2.amazoncognito.com/login?client_id=mprqfsjl2oapu6iscbb41gk9u&response_type=token&scope=openid+email+profile&redirect_uri=https://zoomievetcare.com/callback';
            return;
          }
          throw new Error(`API request failed with status: ${response.status}`);
        }

        const dashboardData: DashboardData = await response.json();
        console.log("Dashboard data:", dashboardData);

        // Set user data
        if (dashboardData.user) {
          setUser(dashboardData.user);
        }

        // Set appointments - fix: check if appointments exists and has items
        if (dashboardData.appointments && dashboardData.appointments.items) {
          setAppointments(dashboardData.appointments.items);
        } else {
          setAppointments([]);
        }

        // Set summary data
        if (dashboardData.summary) {
          setSummary({
            totalPets: dashboardData.summary.totalPets || 0,
            upcomingAppointments: dashboardData.summary.upcomingAppointments || 0,
            recentAppointments: dashboardData.summary.recentAppointments || 0,
            totalSpent: 0, // Not in your API response
            totalAppointments: 0, // Not in your API response
            cancelledAppointments: 0, // Not in your API response
            completedAppointments: 0, // Not in your API response
            hasActiveSubscription: dashboardData.summary.hasActiveSubscription,
            subscriptionStatus: dashboardData.summary.subscriptionStatus
          });
        }

        // Set pets data - fix: check if pets exists and has items
        if (dashboardData.pets && dashboardData.pets.items) {
          setPets(dashboardData.pets.items);
        } else {
          setPets([]);
        }

      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    initializeDashboard();
  }, [router]);

  // Loading state
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

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="text-red-500 text-xl">⚠️</div>
          <p className="mt-4 text-gray-700">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // If no user data, show empty state
  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-gray-700">No user data found. Please login again.</p>
          <button
            onClick={() => router.push("/login")}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled": return "bg-blue-100 text-blue-800";
      case "confirmed": return "bg-green-100 text-green-800";
      case "completed": return "bg-gray-100 text-gray-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  // Format age display
  const formatAge = (age: number): string => {
    if (age < 0) return "Age unknown";
    if (age === 0) return "Less than 1 year";
    return `${age} ${age === 1 ? 'yr' : 'yrs'}`;
  };

  // Format weight display
  const formatWeight = (weight?: number): string => {
    if (!weight || weight <= 0) return "Weight unknown";
    return `${weight} lbs`;
  };

  return (
    <div className="px-4 md:px-8 lg:px-16 py-6 space-y-10">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">
          Welcome back, {user?.name || user?.email}!
        </h1>
        <p className="text-gray-500 text-sm md:text-base">
          {dayjs(user.createdAt).utc().format("dddd, MMMM D, YYYY")}
        </p>
      </div>

      {/* MAIN FLEX */}
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">

        {/* QUICK ACTIONS */}
        <div className="bg-white border border-gray-100 rounded-xl p-4 flex flex-col gap-4 w-full lg:w-[280px]">
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
                <p className="text-xl md:text-2xl font-bold">{summary?.totalPets || 0}</p>
                <p className="text-gray-500 text-sm">Total Pets</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white p-4 rounded-lg shadow-md">
              <FaCalendarAlt className="text-3xl text-green-500" />
              <div>
                <p className="text-xl md:text-2xl font-bold">{summary?.recentAppointments || 0}</p>
                <p className="text-gray-500 text-sm">Recent Appointments</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white p-4 rounded-lg shadow-md">
              <FaClipboardCheck className="text-3xl text-red-500" />
              <div>
                <p className="text-xl md:text-2xl font-bold">{summary?.upcomingAppointments || 0}</p>
                <p className="text-gray-500 text-sm">Upcoming Appointments</p>
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
                    <button
                      className="text-red-500 font-medium md:text-base cursor-pointer hover:text-red-700"
                      onClick={() => alert("Joining video call...")}
                    >
                      Join Video
                    </button>
                  </div>

                  <div className="flex justify-between items-center mt-5">
                    <p className="text-gray-500 text-sm font-medium">
                      {dayjs(a.date).format("MMM D, YYYY")} • {a.time}
                    </p>
                    <button
                      onClick={() => router.push(`/appointments`)}
                      className="text-blue-500 font-medium md:text-base cursor-pointer hover:text-blue-700"
                    >
                      View Details
                    </button>
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
            {pets.filter(pet => pet.isActive !== false).map((p) => (
              <div
                key={p.petId}
                className="bg-white p-4 md:p-5 rounded-xl shadow-md hover:shadow-lg transition-shadow flex flex-col"
              >
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                    {p.profileImageUrl ? (
                      <img
                        src={p.profileImageUrl}
                        alt={p.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-500 text-2xl">🐾</span>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-lg">{p.name}</p>
                    <p className="text-gray-500 text-sm">{p.species} • {p.breed}</p>
                  </div>
                </div>
                <div className="flex justify-between mt-4 text-sm">
                  <p className="text-green-600 font-medium">{formatAge(p.age)}</p>
                  <p className="text-green-600 font-medium">{formatWeight(p.weight)}</p>
                </div>
                <p className="mt-2 text-sm font-medium text-gray-600">
                  Color: {p.color || "Unknown"}
                </p>
                {/* <button
                  className="mt-4 w-full text-blue-600 bg-[#F5F9FF] py-2 rounded-lg hover:bg-gray-100 transition-colors text-sm md:text-base cursor-pointer"
                  onClick={() => router.push(`/pets/${p.petId}`)}
                >
                  View Details
                </button> */}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}