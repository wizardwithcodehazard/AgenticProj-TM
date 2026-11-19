"use client";

import React, { useEffect, useState } from "react";
import { TransactionHistoryItem } from "@/types";
import { X, ArrowUpRight } from "lucide-react";

interface LedgerHistoryProps {
  userId: number;
  isOpen: boolean;
  onClose: () => void;
}

export const LedgerHistory: React.FC<LedgerHistoryProps> = ({ userId, isOpen, onClose }) => {
  const [history, setHistory] = useState<TransactionHistoryItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      fetch(`http://localhost:8000/api/recharge/history/${userId}`)
        .then((res) => res.json())
        .then((data) => setHistory(data))
        .catch((err) => console.error("Failed to load history", err))
        .finally(() => setLoading(false));
    }
  }, [isOpen, userId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white text-black rounded-[32px] p-8 sm:p-10 shadow-2xl border border-[#e4e7eb] max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between pb-6 border-b border-[#e4e7eb]">
          <div>
            <div className="text-xs uppercase font-bold tracking-wider text-[#6c737f]">
              Transaction Log
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-black mt-0.5">
              Loyalty Points Ledger
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-[#6c737f] hover:text-black hover:bg-[#f2f4f7] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-6 flex-1 overflow-y-auto space-y-3 pr-1">
          {loading ? (
            <div className="py-16 text-center text-[#6c737f] text-sm">Loading ledger entries...</div>
          ) : history.length === 0 ? (
            <div className="py-16 text-center text-[#6c737f] text-sm">
              No transactions recorded yet. Recharge a plan to earn points.
            </div>
          ) : (
            history.map((tx) => (
              <div
                key={tx.id}
                className="p-5 rounded-2xl bg-[#f8f9fa] border border-[#e4e7eb] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-black text-sm">{tx.plan_name}</span>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-white text-[#6c737f] border border-[#e4e7eb]">
                      Rs. {tx.amount_paid}
                    </span>
                  </div>
                  <p className="text-xs text-[#525a66] mt-1.5 max-w-md line-clamp-2">
                    "{tx.personalized_message}"
                  </p>
                  <div className="text-[10px] text-[#8c939e] font-mono mt-2">
                    {new Date(tx.created_at).toLocaleString()} &bull; Tier: {tx.tier_after}
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-3 sm:pt-0 border-[#e4e7eb]">
                  <div className="font-mono font-extrabold text-sm text-black">
                    +{tx.points_awarded} PTS
                  </div>
                  <span className="text-[11px] text-[#6c737f] mt-0.5">{tx.payment_method}</span>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-[#e4e7eb]">
          <button
            onClick={onClose}
            className="w-full py-3.5 rounded-full bg-black text-white font-semibold text-xs hover:bg-[#222] transition-all"
          >
            Close Ledger
          </button>
        </div>
      </div>
    </div>
  );
};
