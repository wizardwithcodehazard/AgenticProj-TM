"use client";

import React from "react";
import { User } from "@/types";
import { ArrowUpRight } from "lucide-react";

interface NavbarProps {
  user: User | null;
  onOpenLedger: () => void;
  onExplorePlans: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ user, onOpenLedger, onExplorePlans }) => {
  return (
    <nav className="sticky top-0 z-50 w-full bg-black/90 backdrop-blur-md border-b border-[#1f242b] px-6 lg:px-12 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2.5 cursor-pointer group">
            {/* Custom Pulse Telecom Geometric Waveform Logo */}
            <div className="w-8 h-8 rounded-xl bg-white text-black flex items-center justify-center shadow-[0_2px_10px_rgba(255,255,255,0.15)] group-hover:scale-105 transition-transform">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.5 13H6.5L9.5 5.5L14.5 18.5L17.5 11H21.5" stroke="#000000" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold tracking-tight text-white">Pulse</span>
              <span className="text-[11px] font-mono text-[#8c939e] uppercase">Telecom</span>
            </div>
          </div>

          {/* Links like Revolut Desktop Nav */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-[#8c939e]">
            <button onClick={onExplorePlans} className="hover:text-white transition-colors">
              Plans & 5G
            </button>
            <button onClick={onOpenLedger} className="hover:text-white transition-colors">
              Points Ledger
            </button>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#1c2128] text-[#a0a6b1] border border-[#2d3440]">
              CrewAI + Qwen 2.5
            </span>
          </div>
        </div>

        {/* Right Action Bar */}
        <div className="flex items-center gap-3">
          {/* User Tier Pill */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#14181e] border border-[#232a35] text-xs">
            <span className={`w-2 h-2 rounded-full ${
              user?.tier === "Platinum" ? "bg-purple-400" : user?.tier === "Gold" ? "bg-amber-400" : "bg-slate-300"
            }`} />
            <span className="font-medium text-white">{user?.tier || "Silver"}</span>
            <span className="text-[#6c737f]">&bull;</span>
            <span className="text-[#8c939e] font-mono text-[11px]">{user?.phone_number || "+91 98765 43210"}</span>
          </div>

          {/* Points Pill (Solid White Revolut Pill Button) */}
          <button
            onClick={onOpenLedger}
            className="flex items-center gap-2 px-5 py-2 rounded-full bg-white text-black font-semibold text-xs hover:bg-[#e4e7eb] transition-all"
          >
            <span className="font-mono text-sm tracking-tight">{user?.loyalty_points ?? 120}</span>
            <span className="font-normal text-[11px] text-[#555]">Points</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-black ml-0.5" />
          </button>
        </div>
      </div>
    </nav>
  );
};
