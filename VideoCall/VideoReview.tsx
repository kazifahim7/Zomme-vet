"use client";
import React, { useState } from "react";
import { Star } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ReviewRatingPage() {
  const router = useRouter(); // initialize router

  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string>("");

  const handleStarClick = (value: number) => setRating(value);
  const handleSubmit = () => rating > 0 && setShowModal(true);
  const handleBookAgain = () => setShowModal(false);
  const handleViewSummary = () => setShowModal(false);

  // Updated to redirect to /dashboard
  const handleDashboard = () => {
    setShowModal(false);
    router.push("/dashboard");
  };

  const getRatingText = () => {
    switch (rating) {
      case 1:
        return "It was poor quality";
      case 2:
        return "It was bad quality";
      case 3:
        return "It was good quality";
      case 4:
        return "It was great quality";
      case 5:
        return "It was great quality";
      default:
        return "How was your visit?";
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-md">
        {/* Time Display */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="text-gray-900 text-xl sm:text-2xl font-semibold mb-1">19:45</div>
          <div className="text-emerald-600 text-xs sm:text-sm font-medium">Thank You</div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 md:p-8 text-center">
          <h2 className="text-gray-900 text-sm sm:text-base md:text-lg font-medium mb-4 sm:mb-6">
            How was your visit?
          </h2>

          {/* Star Rating */}
          <div className="flex justify-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleStarClick(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="transition-transform hover:scale-110 active:scale-95"
              >
                <Star
                  className={`w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 ${
                    star <= (hoveredRating || rating)
                      ? "fill-emerald-500 text-emerald-500"
                      : "fill-none text-gray-300"
                  }`}
                  strokeWidth={2}
                />
              </button>
            ))}
          </div>

          {/* Rating Text */}
          <p className="text-gray-400 text-xs sm:text-sm md:text-base mb-4 sm:mb-6">{getRatingText()}</p>

          {/* Description Input */}
          <textarea
            value={feedback}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFeedback(e.target.value)}
            placeholder="Share your experience... (optional)"
            className="w-full border border-gray-200 rounded-lg p-3 text-xs sm:text-sm md:text-base text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none mb-4 sm:mb-6"
            rows={4}
          />

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={rating === 0}
            className={`w-full mb-3 py-2.5 sm:py-3 md:py-3 px-4 sm:px-6 rounded-lg font-medium text-xs sm:text-sm md:text-base transition-all ${
              rating > 0
                ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            Submit review
          </button>

          {/* Skip Link */}
          <button className="text-emerald-600 text-xs sm:text-sm md:text-base font-medium hover:text-emerald-700 transition">
            Skip for now
          </button>
        </div>
      </div>

      {/* Modal Overlay */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 backdrop-blur-sm z-40">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-6 sm:p-8 w-full max-w-sm sm:max-w-md md:max-w-lg text-center">
            <h3 className="text-gray-900 text-sm sm:text-base md:text-lg font-medium mb-4 sm:mb-6">
              What you want to do now?
            </h3>

            <div className="space-y-2.5 sm:space-y-3">
              <button
                onClick={handleBookAgain}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium text-xs sm:text-sm md:text-base py-2.5 sm:py-3 md:py-3 px-4 sm:px-6 rounded-lg transition"
              >
                Book Again →
              </button>

              <button
                onClick={handleViewSummary}
                className="w-full bg-white hover:bg-gray-50 text-gray-700 font-medium text-xs sm:text-sm md:text-base py-2.5 sm:py-3 md:py-3 px-4 sm:px-6 rounded-lg border border-gray-300 transition"
              >
                View Summary
              </button>

              <button
                onClick={handleDashboard}
                className="text-gray-400 text-xs sm:text-sm md:text-base font-medium hover:text-gray-600 transition pt-1"
              >
                Go to the Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
