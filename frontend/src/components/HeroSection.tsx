"use client";

import React from "react";
import { User } from "@/types";
import { ArrowRight, Wifi, Shield, Sparkles, TrendingUp } from "lucide-react";

interface HeroSectionProps {
  user: User | null;
  onExplorePlans: () => void;
  onOpenLedger: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ user, onExplorePlans, onOpenLedger }) => {
  const points = user?.loyalty_points ?? 120;
  const currentTier = user?.tier ?? "Silver";
  const streak = user?.streak_months ?? 2;

  // Tier progression math
  const targetPoints = currentTier === "Platinum" ? 1500 : currentTier === "Gold" ? 800 : 300;
  const nextTier = currentTier === "Platinum" ? "Max Tier" : currentTier === "Gold" ? "Platinum" : "Gold";
  const progressPercent = Math.min(100, Math.round((points / targetPoints) * 100));

  return (
    <section className="relative w-full bg-black text-white pt-14 pb-20 px-6 lg:px-12 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          {/* Left Column: Revolut Editorial Typography & Action Buttons */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Top Pill Status Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#14181f] border border-[#232a35] text-xs font-medium text-[#9ba3af] mb-6 self-start">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>Pulse Telecom &bull; Multi-Agent Loyalty</span>
            </div>

            {/* Stadium Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-medium tracking-revolut-tight leading-[1.0] text-white">
              Change the way you recharge.
            </h1>

            {/* Editorial Subtitle */}
            <p className="mt-6 text-lg sm:text-xl text-[#8c939e] max-w-xl font-normal leading-relaxed">
              Buy Jio and Airtel plans with instant multi-agent reward evaluation. Earn loyalty points, unlock 5G data boosters, and level up your tier.
            </p>

            {/* Revolut Pill Action Buttons */}
            <div className="mt-10 flex flex-wrap items-center gap-3.5">
              <button
                onClick={onExplorePlans}
                className="px-8 py-4 rounded-full bg-white text-black font-semibold text-sm hover:bg-[#e4e7eb] transition-all flex items-center gap-2 group active:scale-[0.98]"
              >
                <span>Recharge a Plan</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={onOpenLedger}
                className="px-8 py-4 rounded-full bg-[#161a22] text-white font-medium text-sm hover:bg-[#202633] border border-[#27303d] transition-all active:scale-[0.98]"
              >
                <span>View Reward Ledger</span>
              </button>
            </div>

            {/* Aligned Micro Metrics Bar */}
            <div className="mt-12 pt-8 border-t border-[#1c222b] grid grid-cols-3 gap-6 max-w-lg">
              <div className="border-r border-[#1c222b] pr-4">
                <div className="text-2xl font-bold tracking-tight text-white font-mono">
                  {streak} Mo
                </div>
                <div className="text-xs text-[#6c737f] mt-1 font-medium">Renewal Streak</div>
              </div>

              <div className="border-r border-[#1c222b] pr-4">
                <div className="text-2xl font-bold tracking-tight text-white font-mono">
                  {currentTier === "Platinum" ? "2.0x" : currentTier === "Gold" ? "1.5x" : "1.0x"}
                </div>
                <div className="text-xs text-[#6c737f] mt-1 font-medium">Points Multiplier</div>
              </div>

              <div>
                <div className="text-2xl font-bold tracking-tight text-white font-mono">
                  Qwen 2.5
                </div>
                <div className="text-xs text-[#6c737f] mt-1 font-medium">Local Multi-Agent</div>
              </div>
            </div>
          </div>

          {/* Right Column: Revolut Metal Card Object & Progress */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="w-full max-w-[420px]">
              {/* Revolut Metal Telecom Card */}
              <div className="w-full aspect-[1.58/1] rounded-[26px] bg-gradient-to-br from-[#1c2128] via-[#12161c] to-[#0a0c0f] p-7 border border-[#2d3542] shadow-[0_24px_60px_rgba(0,0,0,0.85)] flex flex-col justify-between relative overflow-hidden">
                {/* Brushed metal sheen overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.04] to-transparent pointer-events-none" />

                {/* Card Top: Brand & Contactless 5G */}
                <div className="flex items-start justify-between relative z-10">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-md bg-white text-black flex items-center justify-center">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2.5 13H6.5L9.5 5.5L14.5 18.5L17.5 11H21.5" stroke="#000000" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <span className="text-lg font-black tracking-tight text-white">Pulse</span>
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-white/10 text-[#d1d5db] border border-white/10">
                      {currentTier} Metal
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-white/80">
                    <Wifi className="w-4 h-4 rotate-90" />
                    <span className="text-xs font-mono font-bold tracking-wider">5G</span>
                  </div>
                </div>

                {/* EMV Microchip representation */}
                <div className="w-11 h-8 rounded-[6px] bg-gradient-to-br from-[#d4af37] via-[#c59e2b] to-[#997621] border border-[#f3d37a]/30 relative z-10 my-auto shadow-inner flex items-center justify-center">
                  <div className="w-8 h-5 border border-black/20 rounded-[3px] opacity-40"></div>
                </div>

                {/* Card Bottom: Points Balance & Cardholder Name */}
                <div className="relative z-10">
                  <div className="flex justify-between items-end">
                    <div>
                      <div className="text-[10px] uppercase tracking-wider font-mono text-[#8c939e]">
                        Loyalty Wallet
                      </div>
                      <div className="text-3xl font-bold tracking-tight text-white font-mono mt-0.5">
                        {points.toLocaleString()} <span className="text-sm font-normal text-[#8c939e]">PTS</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[9px] uppercase tracking-wider font-mono text-[#6c737f]">
                        Subscriber
                      </div>
                      <div className="text-xs font-bold tracking-widest text-slate-200 uppercase font-mono mt-0.5">
                        {user?.name || "SAHIL SHARMA"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tier Progress Subcard (Clean Revolut Metric Box) */}
              <div className="mt-4 p-5 rounded-2xl bg-[#12161c] border border-[#202733] flex flex-col justify-between">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#8c939e]">
                    Progress to <strong className="text-white font-semibold">{nextTier}</strong>
                  </span>
                  <span className="font-mono text-white text-xs font-semibold">
                    {points} / {targetPoints} pts
                  </span>
                </div>
                <div className="w-full h-2 bg-[#1b212b] rounded-full overflow-hidden mt-3">
                  <div
                    className="h-full bg-white rounded-full transition-all duration-700"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
