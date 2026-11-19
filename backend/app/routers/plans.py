import json
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models import Plan
from app.schemas import PlanResponse

router = APIRouter(prefix="/api/plans", tags=["Plans"])


@router.get("", response_model=List[PlanResponse])
def get_plans(category: Optional[str] = Query(None), db: Session = Depends(get_db)):
    query = db.query(Plan)
    if category and category != "All":
        query = query.filter(Plan.category == category)
    
    plans = query.all()
    # Parse ott_benefits JSON
    result = []
    for p in plans:
        benefits = json.loads(p.ott_benefits) if p.ott_benefits else []
        plan_dict = {
            "id": p.id,
            "name": p.name,
            "operator": p.operator,
            "price": p.price,
            "validity_days": p.validity_days,
            "data_allowance": p.data_allowance,
            "voice": p.voice,
            "sms": p.sms,
            "is_5g_unlimited": p.is_5g_unlimited,
            "category": p.category,
            "ott_benefits": benefits,
            "base_loyalty_points": p.base_loyalty_points,
        }
        result.append(PlanResponse(**plan_dict))
    return result


@router.get("/{plan_id}", response_model=PlanResponse)
def get_plan(plan_id: int, db: Session = Depends(get_db)):
    plan = db.query(Plan).filter(Plan.id == plan_id).first()
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")
    benefits = json.loads(plan.ott_benefits) if plan.ott_benefits else []
    return PlanResponse(
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
        ott_benefits=benefits,
        base_loyalty_points=plan.base_loyalty_points,
    )
