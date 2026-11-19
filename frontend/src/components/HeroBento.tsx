"use client";

import React from "react";
import { User } from "@/types";
import { Sparkles, Trophy, Flame, ArrowUpRight, Gift, Percent } from "lucide-react";

interface HeroBentoProps {
  user: User | null;
  onExplorePlans: () => void;
  onViewHistory: () => void;
}

export const HeroBento: React.FC<HeroBentoProps> = ({ user, onExplorePlans, onViewHistory }) => {
  const points = user?.loyalty_points ?? 120;
  const currentTier = user?.tier ?? "Silver";
  const streak = user?.streak_months ?? 2;

  // Calculate progress to next tier
  let nextTier = "Gold";
  let targetPoints = 300;
  if (currentTier === "Gold") {
    nextTier = "Platinum";
    targetPoints = 800;
  } else if (currentTier === "Platinum") {
    nextTier = "Max Tier";
    targetPoints = 1500;
  }

  const progressPercent = Math.min(100, Math.round((points / targetPoints) * 100));
  const pointsRemaining = Math.max(0, targetPoints - points);

  return (
    <section className="max-w-7xl mx-auto px-4 lg:px-8 pt-8 pb-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Main Loyalty Balance Card (Fintech Revolut Hero) */}
        <div className="lg:col-span-7 glass-panel rounded-3xl p-6 sm:p-8 relative overflow-hidden flex flex-col justify-between border border-slate-800">
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">
                Pulse Rewards Wallet
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <Percent className="w-3 h-3" />
                {currentTier === "Platinum" ? "2.0x" : currentTier === "Gold" ? "1.5x" : "1.0x"} Point Multiplier
              </span>
            </div>

            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-5xl sm:text-6xl font-black tracking-tight text-white font-mono">
                {points.toLocaleString()}
              </span>
              <span className="text-xl font-medium text-slate-400">Loyalty Points</span>
            </div>

            <p className="mt-2 text-sm text-slate-400">
              Redeemable for 5G data booster packs, OTT subscriptions, or discount vouchers.
            </p>
          </div>

          {/* Tier Progression Bar */}
          <div className="mt-8 pt-6 border-t border-slate-800/80">
            <div className="flex justify-between text-xs font-medium mb-2">
              <span className="text-slate-300">
                Current: <strong className="text-blue-400">{currentTier}</strong>
              </span>
              <span className="text-slate-400">
                {pointsRemaining > 0 ? (
                  <>
                    <strong className="text-amber-400">{pointsRemaining} pts</strong> to {nextTier}
                  </>
                ) : (
                  <span className="text-purple-400 font-bold">Top Tier Achieved</span>
                )}
              </span>
            </div>
            <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-amber-500 rounded-full transition-all duration-700"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={onExplorePlans}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all shadow-lg shadow-blue-600/30 flex items-center gap-2"
            >
              <span>Recharge a Plan</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
            <button
              onClick={onViewHistory}
              className="px-5 py-2.5 rounded-xl glass-card text-slate-300 hover:text-white font-semibold text-sm transition-all flex items-center gap-2 border border-slate-700"
            >
              <span>Reward History</span>
            </button>
          </div>
        </div>

        {/* Right side sub-cards (Bento grid style) */}
        <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-5">
          {/* Card 1: Streak Perk */}
          <div className="glass-card rounded-2xl p-5 border border-slate-800 flex items-start gap-4">
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 shrink-0">
              <Flame className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-white">{streak} Months Streak</h4>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">
                  Active
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                You receive <strong>+{streak * 10} extra bonus points</strong> on every on-time monthly plan renewal!
              </p>
            </div>
          </div>

          {/* Card 2: AI Agent Intelligence */}
          <div className="glass-card rounded-2xl p-5 border border-slate-800 flex items-start gap-4">
            <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-white">Dynamic Agentic Perks</h4>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300">
                  CrewAI
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Our CrewAI agents evaluate your data habits and OTT usage on every purchase to tailor instant vouchers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
