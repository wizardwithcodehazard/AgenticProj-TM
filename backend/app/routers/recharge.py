import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import User, Plan, Transaction
from app.schemas import RechargeRequest, RechargeResponse, PlanResponse, UserResponse, AgentStep
from app.agents.crew import build_crew_and_run

router = APIRouter(prefix="/api/recharge", tags=["Recharge & Loyalty Engine"])


@router.post("", response_model=RechargeResponse)
def execute_recharge(payload: RechargeRequest, db: Session = Depends(get_db)):
    # 1. Fetch user & plan
    user = db.query(User).filter(User.id == payload.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    plan = db.query(Plan).filter(Plan.id == payload.plan_id).first()
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")

    # 2. Prepare dictionaries for the CrewAI Multi-Agent workflow
    user_dict = {
        "id": user.id,
        "name": user.name,
        "phone_number": user.phone_number,
        "tier": user.tier,
        "loyalty_points": user.loyalty_points,
        "total_spent": user.total_spent,
        "streak_months": user.streak_months,
    }

    plan_benefits = json.loads(plan.ott_benefits) if plan.ott_benefits else []
    plan_dict = {
        "id": plan.id,
        "name": plan.name,
        "operator": plan.operator,
        "price": plan.price,
        "validity_days": plan.validity_days,
        "data_allowance": plan.data_allowance,
        "voice": plan.voice,
        "sms": plan.sms,
        "is_5g_unlimited": plan.is_5g_unlimited,
        "category": plan.category,
        "ott_benefits": plan.ott_benefits,
        "base_loyalty_points": plan.base_loyalty_points,
    }

    # 3. Run Agentic Flow
    decision = build_crew_and_run(user_dict, plan_dict)

    # 4. Update User state
    tier_before = user.tier
    user.loyalty_points += decision["points_awarded"]
    user.tier = decision["tier_after"]
    user.total_spent += plan.price
    user.streak_months += 1

    # 5. Record Transaction
    transaction = Transaction(
        user_id=user.id,
        plan_id=plan.id,
        amount_paid=plan.price,
        payment_method=payload.payment_method,
        points_awarded=decision["points_awarded"],
        tier_before=tier_before,
        tier_after=decision["tier_after"],
        agent_reasoning=json.dumps(decision.get("agent_steps", [])),
        personalized_message=decision.get("personalized_message", ""),
        perks_awarded=json.dumps(decision.get("perks_awarded", [])),
    )
    db.add(transaction)
    db.commit()
    db.refresh(user)
    db.refresh(transaction)

    # 6. Format Response
    plan_resp = PlanResponse(
        id=plan.id,
        name=plan.name,
        operator=plan.operator,
        price=plan.price,
        validity_days=plan.validity_days,
        data_allowance=plan.data_allowance,
        voice=plan.voice,
        sms=plan.sms,
        is_5g_unlimited=plan.is_5g_unlimited,
        category=plan.category,
        ott_benefits=plan_benefits,
        base_loyalty_points=plan.base_loyalty_points,
    )

    steps = [AgentStep(**s) for s in decision.get("agent_steps", [])]

    return RechargeResponse(
        transaction_id=transaction.id,
        plan=plan_resp,
        points_awarded=decision["points_awarded"],
        tier_before=tier_before,
        tier_after=decision["tier_after"],
        personalized_message=decision["personalized_message"],
        perks_awarded=decision["perks_awarded"],
        agent_steps=steps,
        updated_user=UserResponse.model_validate(user),
        created_at=transaction.created_at,
    )


@router.get("/history/{user_id}")
def get_user_transaction_history(user_id: int, db: Session = Depends(get_db)):
    txs = db.query(Transaction).filter(Transaction.user_id == user_id).order_by(Transaction.created_at.desc()).all()
    history = []
    for t in txs:
        plan_name = t.plan.name if t.plan else "Telecom Plan"
        history.append({
            "id": t.id,
            "plan_name": plan_name,
            "amount_paid": t.amount_paid,
            "payment_method": t.payment_method,
            "points_awarded": t.points_awarded,
            "tier_after": t.tier_after,
            "personalized_message": t.personalized_message,
            "perks_awarded": json.loads(t.perks_awarded) if t.perks_awarded else [],
            "created_at": t.created_at
        })
    return history
