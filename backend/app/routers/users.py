from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User
from app.schemas import UserResponse

router = APIRouter(prefix="/api/users", tags=["Users"])


@router.get("/demo", response_model=UserResponse)
def get_demo_user(db: Session = Depends(get_db)):
    user = db.query(User).first()
    if not user:
        user = User(
            name="Sahil Sharma",
            phone_number="+91 98765 43210",
            tier="Silver",
            loyalty_points=120,
            total_spent=1450.0,
            streak_months=2,
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    return user


@router.get("/{user_id}", response_model=UserResponse)
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
