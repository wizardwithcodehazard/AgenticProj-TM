from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    phone_number = Column(String(20), unique=True, index=True, nullable=False)
    tier = Column(String(20), default="Silver")  # Silver, Gold, Platinum
    loyalty_points = Column(Integer, default=100)
    total_spent = Column(Float, default=0.0)
    streak_months = Column(Integer, default=1)
    created_at = Column(DateTime, default=datetime.utcnow)

    transactions = relationship("Transaction", back_populates="user")


class Plan(Base):
    __tablename__ = "plans"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    operator = Column(String(50), default="Jio / Airtel Style")
    price = Column(Float, nullable=False)
    validity_days = Column(Integer, nullable=False)
    data_allowance = Column(String(100), nullable=False)  # e.g., "2 GB/Day"
    voice = Column(String(50), default="Unlimited")
    sms = Column(String(50), default="100 SMS/Day")
    is_5g_unlimited = Column(Boolean, default=False)
    category = Column(String(50), default="5G Unlimited")  # 5G Unlimited, Entertainment, Annual, Budget, Data Add-on
    ott_benefits = Column(Text, default="[]")  # JSON string of perks
    base_loyalty_points = Column(Integer, default=30)

    transactions = relationship("Transaction", back_populates="plan")


class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    plan_id = Column(Integer, ForeignKey("plans.id"), nullable=False)
    amount_paid = Column(Float, nullable=False)
    payment_method = Column(String(50), default="UPI")
    points_awarded = Column(Integer, nullable=False)
    tier_before = Column(String(20), nullable=False)
    tier_after = Column(String(20), nullable=False)
    agent_reasoning = Column(Text, nullable=True)  # JSON or text logs of agent evaluation
    personalized_message = Column(Text, nullable=True)
    perks_awarded = Column(Text, default="[]")  # JSON array of coupons/vouchers
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="transactions")
    plan = relationship("Plan", back_populates="transactions")
