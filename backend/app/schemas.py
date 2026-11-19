from pydantic import BaseModel, Field
from typing import List, Optional, Any
from datetime import datetime


# Plan Schemas
class PlanBase(BaseModel):
    name: str
    operator: str
    price: float
    validity_days: int
    data_allowance: str
    voice: str
    sms: str
    is_5g_unlimited: bool
    category: str
    ott_benefits: List[str] = []
    base_loyalty_points: int


class PlanResponse(PlanBase):
    id: int

    class Config:
        from_attributes = True


# User Schemas
class UserBase(BaseModel):
    name: str
    phone_number: str
    tier: str
    loyalty_points: int
    total_spent: float
    streak_months: int


class UserResponse(UserBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


# Transaction & Agent Reasoning Schemas
class AgentStep(BaseModel):
    agent: str
    action: str
    details: str
    status: str = "completed"


class RechargeRequest(BaseModel):
    user_id: int
    plan_id: int
    payment_method: str = "UPI"


class LoyaltyEvaluationOutput(BaseModel):
    points_awarded: int
    tier_before: str
    tier_after: str
    breakdown: dict = Field(default_factory=dict)
    personalized_message: str
    perks_awarded: List[str] = Field(default_factory=list)
    agent_steps: List[AgentStep] = Field(default_factory=list)


class RechargeResponse(BaseModel):
    transaction_id: int
    plan: PlanResponse
    points_awarded: int
    tier_before: str
    tier_after: str
    personalized_message: str
    perks_awarded: List[str]
    agent_steps: List[AgentStep]
    updated_user: UserResponse
    created_at: datetime
