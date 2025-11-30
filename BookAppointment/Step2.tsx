"use client";
import { useState, useMemo } from "react";
import { DateOption, AppointmentTime } from "./types";
import { dates as allDates, appointmentTimes as allAppointmentTimes } from "./data"; // Renamed for clarity

// Define Time Range structure
interface TimeRange {
  name: string;
  start: string;
  end: string;
  value: string; // Used for selection logic
}

export default function Step2({
  selectedDate,
  selectedTime,
  onSelectDate,
  onSelectTime,
  onNext,
  onPrevious,
}: {
  selectedDate: DateOption | null;
  selectedTime: AppointmentTime | null;
  onSelectDate: (d: DateOption) => void;
  onSelectTime: (t: AppointmentTime) => void;
  onNext: () => void;
  onPrevious: () => void;
}) {
  const dates = allDates; // Use all available dates from data
  
  // State for date view window (to mimic the carousel behavior)
  const [startIndex, setStartIndex] = useState(0); 
  
  // State for Time Range selection
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>("Afternoon"); // Default selection

  // Hardcoded Time Ranges based on the image's text
  const timeRanges: TimeRange[] = [
    { name: "Early Morning", start: "12:01 AM", end: "06:00 AM", value: "Early Morning" },
    { name: "Morning", start: "06:01 AM", end: "12:00 PM", value: "Morning" },
    { name: "Afternoon", start: "12:01 PM", end: "06:00 PM", value: "Afternoon" },
    { name: "Evening", start: "06:01 PM", end: "12:00 AM", value: "Evening" },
  ];

  // The image shows 8 dates at a time (e.g., Dec 05 to Dec 12)
  const visibleDates = dates.slice(startIndex, startIndex + 8);
  const currentMonthYear = "December 2025"; // Hardcoded for this specific example image

  // Filter appointment times based on the selected time range
  const currentRange = timeRanges.find(r => r.value === selectedTimeRange);
  const filteredAppointmentTimes = useMemo(() => {
    if (!currentRange) return [];
    // This is a simple mock filter. In a real app, you'd filter based on actual time values.
    return allAppointmentTimes.filter(t => t.timeRange === selectedTimeRange); 
  }, [selectedTimeRange]);


  const handleNextDate = () => {
    if (startIndex + 8 < dates.length) {
      setStartIndex(prev => prev + 1);
    }
  };

  const handlePreviousDate = () => {
    if (startIndex > 0) {
      setStartIndex(prev => prev - 1);
    }
  };

  const isDateSelected = (date: DateOption) => selectedDate && selectedDate.date === date.date;
  const isTimeSelected = (time: AppointmentTime) => selectedTime && selectedTime.time === time.time;


  return (
    <div className="w-full max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-lg">

      {/* 📅 Select a Date & Month/Year Dropdown */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-medium text-gray-700">Select a Date</h2>
        <select 
          defaultValue={currentMonthYear}
          className="px-3 py-1 border rounded-lg bg-white text-gray-700 focus:ring-emerald-500 focus:border-emerald-500"
        >
          <option value={currentMonthYear}>{currentMonthYear}</option>
        </select>
      </div>
      
      {/* Date Carousel */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={handlePreviousDate}
          disabled={startIndex === 0}
          className="p-1 text-gray-500 hover:text-gray-800 disabled:text-gray-300"
        >
          ←
        </button>

        <div className="flex gap-3 overflow-hidden flex-grow">
          {visibleDates.map((d, i) => (
            <button
              key={d.date}
              disabled={!d.available}
              onClick={() => {
                onSelectDate(d);
                // The image shows the current date (Dec 09) selected on load. 
                // We'll set the range selection as well for a better UX, but this is optional.
                // In a real app, this logic would determine the default time range to show.
                if (d.date === "09") setSelectedTimeRange("Afternoon");
              }}
              className={`shrink-0 w-16 h-16 flex flex-col items-center justify-center rounded-lg text-sm border transition duration-150 ease-in-out ${
                isDateSelected(d)
                  ? "bg-emerald-500 text-white font-semibold shadow-md"
                  : d.available
                  ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              <div className="uppercase">{d.day}</div>
              <div className="text-xl font-bold">{d.date}</div>
            </button>
          ))}
        </div>

        <button
          onClick={handleNextDate}
          disabled={startIndex + 8 >= dates.length}
          className="p-1 text-gray-500 hover:text-gray-800 disabled:text-gray-300"
        >
          →
        </button>
      </div>

      <hr className="mb-8" />

      {/* ⏳ Select a Time Range */}
      <h3 className="text-xl font-medium mb-4 text-gray-700">Select a Time Range</h3>

      <div className="flex flex-wrap gap-4 mb-8">
        {timeRanges.map((range) => (
          <button
            key={range.value}
            onClick={() => setSelectedTimeRange(range.value)}
            className={`p-4 rounded-lg border text-sm transition duration-150 ease-in-out min-w-[150px] text-left ${
              selectedTimeRange === range.value
                ? "bg-emerald-500 text-white border-emerald-500 shadow-md"
                : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
            }`}
          >
            <div className="font-semibold">{range.name}</div>
            <div className="text-xs opacity-80">{`${range.start} - ${range.end}`}</div>
          </button>
        ))}
      </div>

      <hr className="mb-8" />

      {/* ⏱️ Select an Appointment Time */}
      <h3 className="text-xl font-medium mb-4 text-gray-700">Select an Appointment Time</h3>

      <div className="flex flex-wrap gap-3 mb-8">
        {filteredAppointmentTimes.map((t) => (
          <button
            key={t.time}
            disabled={t.booked}
            onClick={() => t.available && onSelectTime(t)}
            className={`px-4 py-2 rounded-lg border text-sm transition duration-150 ease-in-out ${
              t.booked
                ? "bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed" // Booked
                : isTimeSelected(t)
                ? "bg-emerald-500 text-white border-emerald-500 font-medium shadow-md" // Selected
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100" // Available
            }`}
          >
            {t.time}
          </button>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 mb-10">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="w-3 h-3 rounded-full bg-gray-300 border border-gray-400"></span>
          <span>Booked</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="w-3 h-3 rounded-full bg-white border border-gray-400"></span>
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="w-3 h-3 rounded-full bg-emerald-500 border border-emerald-500"></span>
          <span>Selected</span>
        </div>
      </div>


      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6">
        <button 
          onClick={onPrevious} 
          className="px-6 py-3 border border-emerald-500 text-emerald-500 rounded-lg hover:bg-gray-100 transition cursor-pointer"
        >
          Previous
        </button>

        <button
          onClick={onNext}
          disabled={!selectedTime || !selectedDate}
          className={`px-6 py-3 rounded-lg text-white font-medium transition cursor-pointer ${
            selectedTime && selectedDate
              ? "bg-emerald-500 hover:bg-emerald-600"
              : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          Save & Continue
        </button>
      </div>
    </div>
  );
}