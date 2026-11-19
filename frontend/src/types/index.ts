export interface User {
  id: number;
  name: string;
  phone_number: string;
  tier: "Silver" | "Gold" | "Platinum" | string;
  loyalty_points: number;
  total_spent: number;
  streak_months: number;
  created_at: string;
}

export interface Plan {
  id: number;
  name: string;
  operator: string;
  price: number;
  validity_days: number;
  data_allowance: string;
  voice: string;
  sms: string;
  is_5g_unlimited: boolean;
  category: string;
  ott_benefits: string[];
  base_loyalty_points: number;
}

export interface AgentStep {
  agent: string;
  action: string;
  details: string;
  status: string;
}

export interface RechargeResponse {
  transaction_id: number;
  plan: Plan;
  points_awarded: number;
  tier_before: string;
  tier_after: string;
  personalized_message: string;
  perks_awarded: string[];
  agent_steps: AgentStep[];
  updated_user: User;
  created_at: string;
}

export interface TransactionHistoryItem {
  id: number;
  plan_name: string;
  amount_paid: number;
  payment_method: string;
  points_awarded: number;
  tier_after: string;
  personalized_message: string;
  perks_awarded: string[];
  created_at: string;
}
