"use client";

import React from "react";
import { Plan } from "@/types";
import { Check, Zap, Sparkles, Star } from "lucide-react";

interface PlanCardProps {
  plan: Plan;
  onSelect: (plan: Plan) => void;
}

export const PlanCard: React.FC<PlanCardProps> = ({ plan, onSelect }) => {
  // Mindful distinction: use discrete pill badge rather than inverting card colors
  const isBestValue = plan.price === 2999.0 || plan.price === 859.0;

  return (
    <div className="bg-white rounded-[28px] p-7 border border-[#e4e7eb] hover:border-black/30 transition-all duration-200 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.07)] flex flex-col justify-between h-full group">
      <div>
        {/* Row 1: Fixed Height Header (Tags & Badges) */}
        <div className="h-8 flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-[#f2f4f7] text-[#4b5563] border border-[#e5e7eb]">
              {plan.operator}
            </span>
            {isBestValue && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-black text-white">
                <Star className="w-2.5 h-2.5 fill-current text-amber-400" />
                Popular
              </span>
            )}
          </div>

          {plan.is_5g_unlimited && (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#f0f9ff] text-[#0284c7] border border-[#bae6fd]">
              <Zap className="w-3 h-3 fill-current" />
              True 5G
            </span>
          )}
        </div>

        {/* Row 2: Fixed Height Title (Guarantees perfect vertical alignment) */}
        <div className="h-14 flex items-center mb-2">
          <h3 className="text-xl font-bold tracking-tight text-black line-clamp-2 leading-snug">
            {plan.name}
          </h3>
        </div>

        {/* Row 3: Fixed Height Pricing Baseline */}
        <div className="h-12 flex items-baseline gap-2 pb-3 border-b border-[#f2f4f7]">
          <span className="text-3xl font-extrabold tracking-tight font-mono text-black">
            Rs. {plan.price}
          </span>
          <span className="text-xs font-medium text-[#6c737f]">
            {plan.validity_days > 0 ? `/ ${plan.validity_days} Days` : "/ Add-on"}
          </span>
        </div>

        {/* Row 4: Fixed Minimum Height Features List */}
        <div className="min-h-[140px] flex flex-col justify-start space-y-3 py-4 text-xs text-[#374151]">
          {/* Data */}
          <div className="flex items-center gap-2.5">
            <div className="w-4 h-4 rounded-full bg-black text-white flex items-center justify-center shrink-0">
              <Check className="w-2.5 h-2.5 stroke-[3]" />
            </div>
            <span className="font-medium text-black">
              <strong>{plan.data_allowance}</strong> high-speed data
            </span>
          </div>

          {/* Voice & SMS */}
          <div className="flex items-center gap-2.5">
            <div className="w-4 h-4 rounded-full bg-black text-white flex items-center justify-center shrink-0">
              <Check className="w-2.5 h-2.5 stroke-[3]" />
            </div>
            <span className="text-[#4b5563]">
              {plan.voice} &bull; {plan.sms}
            </span>
          </div>

          {/* OTT Bundles */}
          {plan.ott_benefits && plan.ott_benefits.length > 0 ? (
            <div className="flex items-start gap-2.5 pt-1">
              <div className="w-4 h-4 rounded-full bg-black text-white flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-2.5 h-2.5 stroke-[3]" />
              </div>
              <div className="flex flex-wrap gap-1.5">
                {plan.ott_benefits.map((ott, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#f8f9fa] text-[#1f2937] border border-[#e5e7eb]"
                  >
                    {ott}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-[11px] text-[#9ca3af] italic pl-6">
              Standard high-speed data connectivity
            </div>
          )}
        </div>
      </div>

      {/* Row 5: Footer with Pinned Base Points and Recharge Button */}
      <div className="pt-4 border-t border-[#f2f4f7] mt-auto">
        <div className="flex items-center justify-between text-xs mb-3.5 text-[#6c737f]">
          <span className="flex items-center gap-1.5 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Base Reward:</span>
          </span>
          <span className="font-mono font-bold text-black">+{plan.base_loyalty_points} Points</span>
        </div>

        <button
          onClick={() => onSelect(plan)}
          className="w-full py-3.5 rounded-full bg-black hover:bg-[#1a1e24] text-white font-semibold text-xs tracking-tight transition-all duration-150 flex items-center justify-center gap-2 shadow-sm active:scale-[0.99]"
        >
          <span>Recharge Now</span>
        </button>
      </div>
    </div>
  );
};
