"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // <-- import router
import {
  Mic,
  Video,
  MicOff,
  VideoOff,
  MessageSquare,
  Menu,
  Send,
} from "lucide-react";

export default function VideoCall() {
  const router = useRouter(); // initialize router
  const [currentPage, setCurrentPage] = useState<"waiting" | "call">("waiting");
  const [timeLeft, setTimeLeft] = useState({ minutes: 5, seconds: 0 });
  const [callDuration, setCallDuration] = useState({ minutes: 0, seconds: 0 });
  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<
    { text: string; sender: string; time: Date }[]
  >([]);

  // Countdown timer for waiting room
  useEffect(() => {
    if (currentPage !== "waiting") return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { minutes: prev.minutes - 1, seconds: 59 };
        clearInterval(timer);
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [currentPage]);

  // Call duration timer
  useEffect(() => {
    if (currentPage === "waiting") return;
    const timer = setInterval(() => {
      setCallDuration((prev) => {
        if (prev.seconds < 59) return { ...prev, seconds: prev.seconds + 1 };
        return { minutes: prev.minutes + 1, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [currentPage]);

  const handleJoinCall = () => {
    setCurrentPage("call");
    setCallDuration({ minutes: 0, seconds: 0 });
  };

  const handleEndCall = () => {
    // Redirect to review page
    router.push("/videocall/review");
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;
    setMessages([...messages, { text: message, sender: "user", time: new Date() }]);
    setMessage("");
  };

  // ------------------- WAITING ROOM -------------------
  if (currentPage === "waiting") {
    return (
      <div className="min-h-screen bg-white p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-semibold text-gray-900 mb-6">Waiting Room</h1>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Video Preview */}
            <div className="flex-1">
              <div
                className="relative bg-neutral-800 rounded-xl overflow-hidden"
                style={{ aspectRatio: "16/9" }}
              >
                <div className="absolute inset-0"></div>

                {/* Controls */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-6">
                  <button className="flex flex-col items-center text-white">
                    <div className="w-12 h-12 bg-neutral-700 rounded-full flex items-center justify-center">
                      <Mic className="w-5 h-5" />
                    </div>
                    <span className="text-xs mt-1">Mic is on</span>
                  </button>

                  <button className="flex flex-col items-center text-white">
                    <div className="w-12 h-12 bg-neutral-700 rounded-full flex items-center justify-center">
                      <Video className="w-5 h-5" />
                    </div>
                    <span className="text-xs mt-1">Video is on</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Timer + Join Button */}
            <div className="w-full lg:w-96">
              <div className="border border-gray-100 rounded-xl p-8 shadow-sm bg-white">
                <h2 className="text-emerald-600 text-4xl font-semibold text-center mb-3">
                  4:00 PM
                </h2>
                <p className="text-center text-gray-500 mb-6">Your appointment is scheduled for</p>

                <div className="flex justify-center items-center gap-3 mb-2">
                  <div className="text-center">
                    <p className="text-5xl font-bold">
                      {String(timeLeft.minutes).padStart(2, "0")}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">Min</p>
                  </div>

                  <p className="text-5xl font-bold">:</p>

                  <div className="text-center">
                    <p className="text-5xl font-bold">
                      {String(timeLeft.seconds).padStart(2, "0")}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">Sec</p>
                  </div>
                </div>

                <p className="text-center text-gray-400 text-sm mb-6">Call starts in</p>

                <button
                  onClick={handleJoinCall}
                  className="w-full bg-red-600 text-white py-3 rounded-md hover:bg-red-700 transition"
                >
                  Join Call
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ------------------- DURING CALL -------------------
  return (
    <div className="min-h-screen bg-white p-2 md:p-4 flex justify-center items-center">
      <div className="w-full max-w-7xl flex gap-3 md:gap-4 relative">
        {/* MAIN VIDEO */}
        <div
          className="flex-1 relative bg-neutral-800 rounded-xl overflow-hidden"
          style={{ aspectRatio: "16/9" }}
        >
          <div className="absolute inset-0"></div>

          {/* Menu */}
          <button className="absolute top-3 right-3 bg-neutral-700/70 p-2 rounded-lg text-white">
            <Menu className="w-5 h-5" />
          </button>

          {/* Self-video */}
          <div className="absolute bottom-20 right-4 w-36 h-28 bg-neutral-600 rounded-lg md:w-48 md:h-36"></div>

          {/* CONTROL BAR */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-full flex justify-center px-2">
            <div className="flex items-center gap-3 md:gap-6 bg-black/70 px-4 md:px-8 py-2 md:py-3 rounded-full backdrop-blur-md">
              {/* MIC */}
              <button
                onClick={() => setMicOn(!micOn)}
                className="flex flex-col items-center text-white"
              >
                <div
                  className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center ${
                    micOn ? "bg-neutral-700" : "bg-red-600"
                  }`}
                >
                  {micOn ? <Mic /> : <MicOff />}
                </div>
                <span className="text-[10px] md:text-xs mt-1">{micOn ? "Mic on" : "Mic off"}</span>
              </button>

              {/* VIDEO */}
              <button
                onClick={() => setVideoOn(!videoOn)}
                className="flex flex-col items-center text-white"
              >
                <div
                  className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center ${
                    videoOn ? "bg-neutral-700" : "bg-red-600"
                  }`}
                >
                  {videoOn ? <Video /> : <VideoOff />}
                </div>
                <span className="text-[10px] md:text-xs mt-1">{videoOn ? "Video on" : "Video off"}</span>
              </button>

              {/* TIMER */}
              <span className="text-white text-sm md:text-base font-semibold">
                {String(callDuration.minutes).padStart(2, "0")}:
                {String(callDuration.seconds).padStart(2, "0")}
              </span>

              {/* END CALL - redirect to review page */}
              <button
                onClick={handleEndCall}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg md:px-6 md:py-3"
              >
                End
              </button>

              {/* CHAT */}
              <button
                onClick={() => setShowChat(!showChat)}
                className="bg-neutral-700 p-2 rounded-lg text-white hover:bg-neutral-600"
              >
                <MessageSquare className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* CHAT PANEL */}
        {showChat && (
          <div className="w-72 md:w-80 bg-neutral-800 rounded-xl flex flex-col overflow-hidden">
            <div className="bg-neutral-700 px-4 py-3">
              <p className="text-white font-medium">Live Chat</p>
            </div>

            <div className="flex-1 p-4 overflow-y-auto">
              {messages.length === 0 && (
                <p className="text-gray-400 text-center mt-4">No messages yet</p>
              )}

              {messages.map((msg, i) => (
                <div key={i} className="p-3 bg-neutral-700 rounded-lg mb-2">
                  <p className="text-white text-sm">{msg.text}</p>
                </div>
              ))}
            </div>

            <div className="p-3 bg-neutral-800">
              <div className="flex items-center bg-neutral-700 rounded-full px-4 py-2">
                <input
                  type="text"
                  placeholder="Type message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  className="flex-1 bg-transparent text-white text-sm outline-none"
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-teal-500 p-2 rounded-full hover:bg-teal-600"
                >
                  <Send className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
