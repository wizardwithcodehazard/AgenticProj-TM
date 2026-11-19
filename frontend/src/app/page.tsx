"use client";

import React, { useEffect, useState, useRef } from "react";
import { User, Plan } from "@/types";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { PlanCard } from "@/components/PlanCard";
import { RechargeModal } from "@/components/RechargeModal";
import { LedgerHistory } from "@/components/LedgerHistory";
import { ArrowRight, Sparkles, Check, Gift } from "lucide-react";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activePlanForRecharge, setActivePlanForRecharge] = useState<Plan | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const plansSectionRef = useRef<HTMLDivElement>(null);

  const categories = [
    "All",
    "5G Unlimited",
    "Entertainment",
    "Annual",
    "Budget",
    "Data Add-on",
  ];

  const fetchData = async () => {
    try {
      setLoading(true);
      const userRes = await fetch("http://localhost:8000/api/users/demo");
      if (userRes.ok) {
        const userData = await userRes.json();
        setUser(userData);
      }

      const plansRes = await fetch("http://localhost:8000/api/plans");
      if (plansRes.ok) {
        const plansData = await plansRes.json();
        setPlans(plansData);
      }
    } catch (err) {
      console.error("Backend error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredPlans =
    selectedCategory === "All"
      ? plans
      : plans.filter((p) => p.category.toLowerCase() === selectedCategory.toLowerCase());

  const handleScrollToPlans = () => {
    plansSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleRechargeSuccess = (updatedUser: User) => {
    setUser(updatedUser);
  };

  return (
    <main className="min-h-screen bg-black">
      {/* 1. DARK CANVAS SECTION: Revolut Hero & Header */}
      <div className="bg-black text-white">
        <Navbar
          user={user}
          onOpenLedger={() => setIsHistoryOpen(true)}
          onExplorePlans={handleScrollToPlans}
        />

        <HeroSection
          user={user}
          onExplorePlans={handleScrollToPlans}
          onOpenLedger={() => setIsHistoryOpen(true)}
        />
      </div>

      {/* 2. PURE WHITE CANVAS SECTION: Clean, Aligned Plan Grid */}
      <div ref={plansSectionRef} className="bg-white text-black py-20 px-6 lg:px-12 border-t border-[#1f242b]">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="max-w-2xl">
            <div className="text-xs uppercase font-bold tracking-wider text-[#6b7280] mb-2">
              Prepaid & 5G Catalog
            </div>
            <h2 className="text-4xl sm:text-5xl font-medium tracking-revolut-tight text-black">
              Plans tailored to your life.
            </h2>
            <p className="text-base text-[#6b7280] mt-3">
              Recharge any plan to earn loyalty points, evaluate tier progression, and unlock perks via our CrewAI agent.
            </p>
          </div>

          {/* Clean Standalone Filter Pills (Revolut Dedicated Row) */}
          <div className="mt-8 pb-8 border-b border-[#e5e7eb]">
            <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
              {categories.map((cat) => {
                const count =
                  cat === "All"
                    ? plans.length
                    : plans.filter((p) => p.category.toLowerCase() === cat.toLowerCase()).length;

                const isSelected = selectedCategory === cat;

                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-150 active:scale-[0.98] ${isSelected
                        ? "bg-black text-white shadow-sm"
                        : "bg-[#f2f4f7] text-[#4b5563] hover:text-black hover:bg-[#e5e7eb]"
                      }`}
                  >
                    <span>{cat}</span>
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${isSelected
                          ? "bg-white/20 text-white"
                          : "bg-white text-[#6b7280] border border-[#e5e7eb]"
                        }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Plan Cards Grid with Uniform Alignment */}
          <div className="mt-12">
            {loading ? (
              <div className="py-24 text-center text-[#6b7280] text-sm">
                Connecting to Pulse Telecom Backend...
              </div>
            ) : filteredPlans.length === 0 ? (
              <div className="py-20 text-center text-[#6b7280] text-sm bg-[#f9fafb] rounded-[28px] border border-[#e5e7eb]">
                No plans available in this category.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
                {filteredPlans.map((plan) => (
                  <PlanCard
                    key={plan.id}
                    plan={plan}
                    onSelect={(p) => setActivePlanForRecharge(p)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* 3. REWARDS REDEMPTION MATRIX: Uniform Bento Grid */}
          <div className="mt-28 pt-16 border-t border-[#e5e7eb]">
            <div className="max-w-2xl mb-12">
              <div className="text-xs uppercase font-bold tracking-wider text-[#6b7280] mb-2">
                Spend Points
              </div>
              <h3 className="text-3xl sm:text-4xl font-medium tracking-revolut-tight text-black">
                Instant value from every point.
              </h3>
              <p className="text-sm text-[#6b7280] mt-2">
                Points never expire as long as your connection is active. Redeem them instantly for 5G data boosts or vouchers.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
              <div className="p-7 rounded-[24px] bg-[#f9fafb] border border-[#e5e7eb] flex flex-col justify-between h-[210px] hover:border-black/30 transition-colors">
                <div>
                  <div className="text-2xl font-bold tracking-tight text-black font-mono">150 PTS</div>
                  <h4 className="text-base font-bold text-black mt-2">10GB 5G Data Pack</h4>
                  <p className="text-xs text-[#6b7280] mt-1">High-speed instant booster with zero extra fee.</p>
                </div>
                <div className="text-xs font-semibold text-black flex items-center gap-1 mt-auto pt-4">
                  <span>Included in Gold</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>

              <div className="p-7 rounded-[24px] bg-[#f9fafb] border border-[#e5e7eb] flex flex-col justify-between h-[210px] hover:border-black/30 transition-colors">
                <div>
                  <div className="text-2xl font-bold tracking-tight text-black font-mono">300 PTS</div>
                  <h4 className="text-base font-bold text-black mt-2">Swiggy Gourmet Rs. 100</h4>
                  <p className="text-xs text-[#6b7280] mt-1">Exclusive food voucher with no minimum order.</p>
                </div>
                <div className="text-xs font-semibold text-black flex items-center gap-1 mt-auto pt-4">
                  <span>Instant Code</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>

              <div className="p-7 rounded-[24px] bg-[#f9fafb] border border-[#e5e7eb] flex flex-col justify-between h-[210px] hover:border-black/30 transition-colors">
                <div>
                  <div className="text-2xl font-bold tracking-tight text-black font-mono">600 PTS</div>
                  <h4 className="text-base font-bold text-black mt-2">Disney+ Hotstar 3-Mo</h4>
                  <p className="text-xs text-[#6b7280] mt-1">Mobile VIP pass for live cricket and movies.</p>
                </div>
                <div className="text-xs font-semibold text-black flex items-center gap-1 mt-auto pt-4">
                  <span>Entertainment Pass</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>

              <div className="p-7 rounded-[24px] bg-[#f9fafb] border border-[#e5e7eb] flex flex-col justify-between h-[210px] hover:border-black/30 transition-colors">
                <div>
                  <div className="text-2xl font-bold tracking-tight text-black font-mono">1200 PTS</div>
                  <h4 className="text-base font-bold text-black mt-2">Netflix Basic 1-Mo</h4>
                  <p className="text-xs text-[#6b7280] mt-1">All your favorite cinema titles in crisp HD.</p>
                </div>
                <div className="text-xs font-semibold text-black flex items-center gap-1 mt-auto pt-4">
                  <span>Platinum Tier</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. MINIMALIST FOOTER */}
      <footer className="w-full bg-[#f9fafb] border-t border-[#e5e7eb] py-8 px-6 lg:px-12 text-xs text-[#6b7280]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-black">Pulse Telecom</span>
            <span>&bull;</span>
            <span>Agentic Loyalty System</span>
          </div>
          <div>FastAPI &bull; CrewAI &bull; Qwen 2.5 3B (Local) &bull; Next.js</div>
        </div>
      </footer>

      {/* Modals */}
      <RechargeModal
        isOpen={!!activePlanForRecharge}
        plan={activePlanForRecharge}
        user={user}
        onClose={() => setActivePlanForRecharge(null)}
        onSuccess={handleRechargeSuccess}
      />

      <LedgerHistory
        isOpen={isHistoryOpen}
        userId={user?.id || 1}
        onClose={() => setIsHistoryOpen(false)}
      />
    </main>
  );
}
