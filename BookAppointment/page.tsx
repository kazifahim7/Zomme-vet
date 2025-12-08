"use client";
import React, { useState } from "react";
import BookingSteps from "./BookingSteps";
import Step1, { ApiPet } from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import Step4 from "./Step4";

import { Pet, DateOption, AppointmentTime, Reason } from "./types";

export default function BookingApp() {
  const [step, setStep] = useState(1);
  const [selectedPet, setSelectedPet] = useState<ApiPet | null>(null);
  const [selectedDate, setSelectedDate] = useState<DateOption | null>(null);
  const [selectedTime, setSelectedTime] = useState<AppointmentTime | null>(null);
  const [reason, setReason] = useState<Reason | "">("");
  const [description, setDescription] = useState("");

  return (
    <div className="min-h-screen bg-white px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-xl sm:text-2xl font-bold mb-8">Book Appointment</h1>

        <div className="flex flex-col md:flex-row gap-10">
          <BookingSteps step={step} />

          <div className="flex-1">
            {step === 1 && (
              <Step1 selectedPet={selectedPet} onSelect={setSelectedPet} onNext={() => setStep(2)} />
            )}

            {step === 2 && (
              <Step2
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                onSelectDate={setSelectedDate}
                onSelectTime={setSelectedTime}
                onPrevious={() => setStep(1)}
                onNext={() => setStep(3)}
              />
            )}

            {step === 3 && (
              <Step3
                reason={reason}
                description={description}
                onReason={setReason}
                onDescription={setDescription}
                onPrevious={() => setStep(2)}
                onNext={() => setStep(4)}
              />
            )}

            {step === 4 && (
              <Step4
                selectedPet={selectedPet}
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                reason={reason}
                description={description}
                onPrevious={() => setStep(3)}
                onConfirm={() => alert("Booking Confirmed!")}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
