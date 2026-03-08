import React from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axiosInstance from "../utils/axiosInstance";



const Pricing = () => {
  const plans = [
    {
      name: "Starter",
      price: "100",
      credits: "80",
      features: ["8 AI Generations", "Basic Flowcharts", "PDF Downloads"],
      glow: "bg-blue-500/10",
      border: "border-white/10",
    },
    {
      name: "Popular",
      price: "180",
      credits: "180",
      features: ["18 AI Generations", "Advanced Diagrams", "Predictive PYQs"],
      glow: "bg-indigo-500/20",
      border: "border-indigo-500/50",
      popular: true,
    },
    {
      name: "Pro Learner",
      price: "500",
      credits: "430",
      features: [
        "43 AI Generations",
        "God-Mode Prompts",
        "Full Industry Case Studies",
      ],
      glow: "bg-purple-500/20",
      border: "border-white/10",
    },
  ];

  const handlePayment = async (planName) => {
    try {
      const { data } = await axiosInstance.post(
        "/api/credits/purchase",
        { planName },
      );

      if (data.success) {
        window.location.href = data.session.url; // Stripe redirect
      }
    } catch (error) {
      alert(error.response?.data?.message || "Payment Failed to start");
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col">
      <Navbar />
      <main className="flex-grow px-6 py-24 relative overflow-hidden">
        <div className="max-w-6xl mx-auto w-full">
          <div className="text-center mb-20">
            <h2 className="text-6xl font-black mb-6">
              Ready to <span className="text-indigo-500">Upgrade?</span>
            </h2>
            <p className="text-gray-400 font-medium">
              1 Generation = 10 Credits
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -10 }}
                className={`relative p-10 rounded-[3rem] bg-white/[0.03] backdrop-blur-3xl border ${plan.border} flex flex-col justify-between group overflow-hidden`}
              >
                <div>
                  <h3 className="text-xl font-bold text-gray-400">
                    {plan.name}
                  </h3>
                  <div className="text-5xl font-black my-4">₹{plan.price}</div>
                  <p className="text-indigo-400 font-black text-sm mb-8 tracking-wide">
                    {plan.credits} CREDITS
                  </p>
                  <ul className="space-y-4 mb-10">
                    {plan.features.map((f, i) => (
                      <li key={i} className="text-sm text-gray-300 font-medium">
                        ✔ {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <motion.button
                  onClick={() => handlePayment(plan.name)}
                  className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all relative z-10 ${plan.popular ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" : "bg-white text-black hover:bg-gray-200"}`}
                >
                  Buy Credits Now
                </motion.button>
                <div
                  className={`absolute inset-0 ${plan.glow} opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none`}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Pricing;
