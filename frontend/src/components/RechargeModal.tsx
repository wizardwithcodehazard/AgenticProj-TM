"use client";

import React, { useState } from "react";
import { Plan, User, RechargeResponse } from "@/types";
import { X, Check, ArrowRight, Copy, CheckCircle2, Cpu } from "lucide-react";
import confetti from "canvas-confetti";

interface RechargeModalProps {
  plan: Plan | null;
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updatedUser: User) => void;
}

export const RechargeModal: React.FC<RechargeModalProps> = ({
  plan,
  user,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [phase, setPhase] = useState<"checkout" | "processing" | "reward">("checkout");
  const [paymentMethod, setPaymentMethod] = useState("UPI (Google Pay / PhonePe)");
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [result, setResult] = useState<RechargeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  if (!isOpen || !plan) return null;

  const handleStartRecharge = async () => {
    setPhase("processing");
    setError(null);
    setActiveStepIndex(0);

    const stepInterval = setInterval(() => {
      setActiveStepIndex((prev) => (prev < 2 ? prev + 1 : prev));
    }, 1000);

    try {
      const response = await fetch("http://localhost:8000/api/recharge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user?.id || 1,
          plan_id: plan.id,
          payment_method: paymentMethod,
        }),
      });

      if (!response.ok) {
        throw new Error("Recharge failed. Make sure your FastAPI backend is running on port 8000.");
      }

      const data: RechargeResponse = await response.json();
      clearInterval(stepInterval);
      setActiveStepIndex(3);
      setResult(data);
      setPhase("reward");

      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 },
        });
      } catch (e) {}
    } catch (err: any) {
      clearInterval(stepInterval);
      setError(err.message || "Failed to process transaction.");
      setPhase("checkout");
    }
  };

  const handleFinish = () => {
    if (result) {
      onSuccess(result.updated_user);
    }
    setPhase("checkout");
    onClose();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(text);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-white text-black rounded-[32px] p-8 sm:p-10 shadow-2xl border border-[#e4e7eb] overflow-hidden">
        {/* Close Button */}
        {phase !== "processing" && (
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full text-[#6c737f] hover:text-black hover:bg-[#f2f4f7] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Phase 1: Revolut Checkout Review */}
        {phase === "checkout" && (
          <div>
            <div className="text-xs uppercase font-bold tracking-wider text-[#6c737f] mb-1">
              Checkout &bull; {user?.phone_number}
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-black">{plan.name}</h2>

            <div className="mt-4 pb-6 border-b border-[#e4e7eb]">
              <div className="text-4xl font-extrabold tracking-tight font-mono text-black">
                Rs. {plan.price}
              </div>
              <div className="text-xs text-[#6c737f] mt-1">
                Validity: {plan.validity_days > 0 ? `${plan.validity_days} Days` : "Instant Add-on"}
              </div>
            </div>

            {/* Plan Summary Specs */}
            <div className="py-4 space-y-2.5 text-xs text-[#404652] border-b border-[#e4e7eb]">
              <div className="flex justify-between">
                <span>Data Allowance</span>
                <span className="font-semibold text-black">{plan.data_allowance}</span>
              </div>
              <div className="flex justify-between">
                <span>Voice & Messaging</span>
                <span className="font-semibold text-black">{plan.voice}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Base Loyalty</span>
                <span className="font-semibold text-black font-mono">+{plan.base_loyalty_points} Points</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="mt-5">
              <label className="text-xs font-semibold text-[#6c737f] uppercase tracking-wider block mb-2">
                Select Payment Method
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full p-3.5 rounded-2xl bg-[#f8f9fa] border border-[#e4e7eb] text-sm text-black focus:outline-none focus:border-black font-medium"
              >
                <option value="UPI (Google Pay / PhonePe)">UPI (Google Pay / PhonePe / Paytm)</option>
                <option value="Credit or Debit Card">Credit or Debit Card</option>
                <option value="Net Banking">Net Banking</option>
                <option value="Pulse Pay (Zero Fee)">Pulse Pay (Zero Fee)</option>
              </select>
            </div>

            {error && (
              <div className="mt-4 p-3 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-600">
                {error}
              </div>
            )}

            {/* Revolut Pill CTAs */}
            <div className="mt-8 flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-3.5 rounded-full bg-[#f2f4f7] hover:bg-[#e4e7eb] text-black font-semibold text-xs transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleStartRecharge}
                className="flex-1 py-3.5 rounded-full bg-black hover:bg-[#222] text-white font-semibold text-xs transition-all flex items-center justify-center gap-2"
              >
                <span>Pay Rs. {plan.price}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Phase 2: Live Multi-Agent Reasoning */}
        {phase === "processing" && (
          <div className="py-6 text-center">
            <div className="w-12 h-12 rounded-full bg-[#f2f4f7] flex items-center justify-center mx-auto mb-4 animate-spin">
              <Cpu className="w-6 h-6 text-black" />
            </div>

            <h3 className="text-xl font-bold tracking-tight text-black">
              Evaluating Loyalty Multipliers
            </h3>
            <p className="text-xs text-[#6c737f] mt-1.5 max-w-sm mx-auto">
              CrewAI agents and local Qwen 2.5 are calculating your transaction perks...
            </p>

            <div className="mt-8 space-y-3 text-left max-w-sm mx-auto">
              {/* Step 1 */}
              <div className={`p-3.5 rounded-2xl border flex items-center gap-3 transition-all ${
                activeStepIndex >= 1 ? "bg-white border-[#e4e7eb]" : "bg-[#f8f9fa] border-transparent"
              }`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  activeStepIndex >= 1 ? "bg-black text-white" : "bg-[#e4e7eb] text-[#6c737f]"
                }`}>
                  1
                </div>
                <div>
                  <div className="text-xs font-bold text-black">Plan & Transaction Auditor</div>
                  <div className="text-[11px] text-[#6c737f]">Verified plan eligibility & streak</div>
                </div>
              </div>

              {/* Step 2 */}
              <div className={`p-3.5 rounded-2xl border flex items-center gap-3 transition-all ${
                activeStepIndex >= 2 ? "bg-white border-[#e4e7eb]" : "bg-[#f8f9fa] border-transparent"
              }`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  activeStepIndex >= 2 ? "bg-black text-white" : "bg-[#e4e7eb] text-[#6c737f]"
                }`}>
                  2
                </div>
                <div>
                  <div className="text-xs font-bold text-black">Loyalty Points Strategist</div>
                  <div className="text-[11px] text-[#6c737f]">Calculated tier multiplier & bonuses</div>
                </div>
              </div>

              {/* Step 3 */}
              <div className={`p-3.5 rounded-2xl border flex items-center gap-3 transition-all ${
                activeStepIndex >= 3 ? "bg-white border-[#e4e7eb]" : "bg-[#f8f9fa] border-transparent"
              }`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  activeStepIndex >= 3 ? "bg-black text-white" : "bg-[#e4e7eb] text-[#6c737f]"
                }`}>
                  3
                </div>
                <div>
                  <div className="text-xs font-bold text-black">Personalizer (Qwen 2.5)</div>
                  <div className="text-[11px] text-[#6c737f]">Generated reward message & vouchers</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Phase 3: Revolut Reward Confirmation */}
        {phase === "reward" && result && (
          <div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center mx-auto mb-3">
                <Check className="w-6 h-6 stroke-[3]" />
              </div>
              <div className="text-xs font-semibold uppercase tracking-wider text-[#6c737f]">
                Transaction Complete
              </div>
              <h2 className="text-4xl font-extrabold tracking-tight text-black mt-1 font-mono">
                +{result.points_awarded} Points
              </h2>
            </div>

            {/* AI Agent Quote (Generated by Qwen 2.5) */}
            <div className="mt-6 p-4 rounded-2xl bg-[#f8f9fa] border border-[#e4e7eb] text-xs text-[#404652] leading-relaxed">
              <span className="block text-[11px] font-bold text-black uppercase tracking-wider mb-1">
                Personalized AI Message
              </span>
              "{result.personalized_message}"
            </div>

            {/* Receipt Breakdown */}
            <div className="mt-4 p-4 rounded-2xl bg-[#f8f9fa] border border-[#e4e7eb] space-y-2 text-xs">
              <div className="flex justify-between text-[#6c737f]">
                <span>Base Plan Points</span>
                <span className="font-mono font-medium text-black">+{result.plan.base_loyalty_points}</span>
              </div>
              <div className="flex justify-between text-[#6c737f]">
                <span>Tier Multiplier Bonus</span>
                <span className="font-mono font-medium text-black">
                  +{result.points_awarded - result.plan.base_loyalty_points - (result.updated_user.streak_months * 10)}
                </span>
              </div>
              <div className="flex justify-between text-[#6c737f]">
                <span>On-Time Streak Bonus</span>
                <span className="font-mono font-medium text-black">
                  +{result.updated_user.streak_months * 10}
                </span>
              </div>
              <div className="pt-2 border-t border-[#e4e7eb] flex justify-between font-bold text-black">
                <span>Updated Balance</span>
                <span className="font-mono">{result.updated_user.loyalty_points} Points</span>
              </div>
            </div>

            {/* Perk Vouchers */}
            {result.perks_awarded && result.perks_awarded.length > 0 && (
              <div className="mt-4">
                <div className="text-xs font-bold text-black mb-2">Claimed Perks:</div>
                <div className="space-y-1.5">
                  {result.perks_awarded.map((perk, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-xl bg-[#f8f9fa] border border-[#e4e7eb] flex items-center justify-between text-xs"
                    >
                      <span className="font-medium text-black truncate max-w-[300px]">{perk}</span>
                      <button
                        onClick={() => copyToClipboard(perk)}
                        className="p-1 rounded-md hover:bg-[#e4e7eb] text-black transition-colors"
                        title="Copy code"
                      >
                        {copiedCode === perk ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Finish Button */}
            <button
              onClick={handleFinish}
              className="mt-6 w-full py-4 rounded-full bg-black hover:bg-[#222] text-white font-semibold text-xs transition-all"
            >
              Done & Return to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
