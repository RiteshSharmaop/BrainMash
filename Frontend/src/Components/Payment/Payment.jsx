import React from "react";
import { Crown, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ParticleBackground from "../Layout/ParticleBackground";

const Payment = ({ setPaymentDone }) => {
  const navigate = useNavigate();

  const handlePayment = () => {
    // ⚡ Replace this with Razorpay / Stripe later
    navigate("/payment/success");
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-900 text-white relative overflow-hidden">
      {/* Background Gradient Glow */}
      <ParticleBackground />
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-blue-600/20 to-cyan-600/20 blur-3xl opacity-30" />

      {/* Payment Card */}
      <div className="relative z-10 bg-gray-800/40 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl p-8 max-w-md w-full">
        {/* Header */}
        <div className="flex flex-col items-center mb-6">
          <Crown className="text-yellow-400 w-12 h-12 mb-2" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Upgrade to Pro
          </h1>
          <p className="text-gray-400 text-center mt-2">
            Unlock <span className="text-purple-400 font-semibold">BrainMesh</span> and premium features for just
          </p>
        </div>

        {/* Price Box */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-center shadow-lg mb-6">
          <p className="text-4xl font-extrabold">₹500</p>
          <p className="text-sm text-gray-200 mt-1">One-time subscription</p>
        </div>

        {/* Features */}
        <ul className="space-y-3 mb-6">
          {[
            "Access Multi-LLM mode",
            "Unlimited conversations",
            "Priority response speed",
            "Early access to new models"
          ].map((feature, i) => (
            <li key={i} className="flex items-center gap-2 text-gray-300">
              <CheckCircle className="text-green-400 w-5 h-5" />
              {feature}
            </li>
          ))}
        </ul>

        {/* Payment Button */}
        <button
          onClick={handlePayment}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 
                     hover:from-purple-700 hover:to-blue-700 
                     text-white font-semibold py-3 rounded-xl 
                     transition-all shadow-md"
        >
          Pay ₹500 & Upgrade
        </button>

        {/* Cancel */}
        <button
          onClick={() => navigate("/chat")}
          className="mt-4 w-full text-gray-400 hover:text-gray-200 text-sm"
        >
          Cancel & Go Back
        </button>
      </div>
    </div>
  );
};

export default Payment;
