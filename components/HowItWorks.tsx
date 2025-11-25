import React from "react";

const steps = [
  {
    img: "https://i.postimg.cc/W1DTPWBf/solar-calendar-bold-(2).png",
    title: "Schedule",
    description: "Choose a convenient time for your appointment",
  },
  {
    img: "https://i.postimg.cc/VvvKKBFc/solar-calendar-bold.png",
    title: "Connect",
    description: "Join secure video call with Dr. Lapera",
  },
  {
    img: "https://i.postimg.cc/mgC8pr7D/solar-calendar-bold-(1).png",
    title: "Follow-up",
    description: "Get prescriptions and care plan delivered",
  },
];

const HowItWorks = () => {
  return (
    <section id="services" className="py-16 bg-gray-50 w-full">

      {/* Title */}
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-black">
        How It Works
      </h2>

      {/* Wrapper Without Container */}
      <div className="w-full flex flex-col md:flex-row justify-center items-center gap-12">

        {/* Step 1 Box */}
        <div
          className="bg-gray-50 rounded-xl flex flex-col items-center text-center"
          style={{
            width: "348.4445495605469px",
            height: "249px",
            paddingTop: "36px",
            paddingBottom: "36px",
          }}
        >
          <div
            className="bg-gray-50 rounded-full flex items-center justify-center mb-4"
            style={{ width: "96px", height: "96px" }}
          >
            <img
              src={steps[0].img}
              alt={steps[0].title}
              style={{ width: "96px", height: "96px" }}
            />
          </div>

          <h3 className="text-xl font-semibold text-black mb-2">
            {steps[0].title}
          </h3>

          <p className="text-gray-600 text-sm px-6">
            {steps[0].description}
          </p>
        </div>

        {/* BETWEEN IMAGE (1 → 2) */}
        <img
          src="https://i.postimg.cc/PqKb0vJG/Group-9.png"
          alt="arrow"
          style={{
            width: "80px",
            height: "50px",
            transform: "",
            opacity: 1,
          }}
        />

        {/* Step 2 Box */}
        <div
          className="bg-gray-50 rounded-xl flex flex-col items-center text-center"
          style={{
            width: "348.4445495605469px",
            height: "249px",
            paddingTop: "36px",
            paddingBottom: "36px",
          }}
        >
          <div
            className="bg-gray-50 rounded-full flex items-center justify-center mb-4"
            style={{ width: "96px", height: "96px" }}
          >
            <img
              src={steps[1].img}
              alt={steps[1].title}
              style={{ width: "96px", height: "96px" }}
            />
          </div>

          <h3 className="text-xl font-semibold text-black mb-2">
            {steps[1].title}
          </h3>

          <p className="text-gray-600 text-sm px-6">
            {steps[1].description}
          </p>
        </div>

        {/* BETWEEN IMAGE (2 → 3) */}
        <img
          src="https://i.postimg.cc/PqKb0vJG/Group-9.png"
          alt="arrow"
          style={{
            width: "80",
            height: "50px",
            transform: "",
            opacity: 1,
          }}
        />

        {/* Step 3 Box */}
        <div
          className="bg-gray-50 rounded-xl flex flex-col items-center text-center"
          style={{
            width: "348.4445495605469px",
            height: "249px",
            paddingTop: "36px",
            paddingBottom: "36px",
          }}
        >
          <div
            className="bg-gray-50 rounded-full flex items-center justify-center mb-4"
            style={{ width: "96px", height: "96px" }}
          >
            <img
              src={steps[2].img}
              alt={steps[2].title}
              style={{ width: "96px", height: "96px" }}
            />
          </div>

          <h3 className="text-xl font-semibold text-black mb-2">
            {steps[2].title}
          </h3>

          <p className="text-gray-600 text-sm px-6">
            {steps[2].description}
          </p>
        </div>

      </div>
    </section>
  );
};

export default HowItWorks;
