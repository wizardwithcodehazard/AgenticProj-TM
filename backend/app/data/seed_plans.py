import json
from sqlalchemy.orm import Session
from app.models import Plan, User


SEED_PLANS = [
    {
        "name": "Jio True 5G Starter",
        "operator": "Jio Style",
        "price": 349.0,
        "validity_days": 28,
        "data_allowance": "2.0 GB/Day",
        "voice": "Unlimited Calls",
        "sms": "100 SMS/Day",
        "is_5g_unlimited": True,
        "category": "5G Unlimited",
        "ott_benefits": json.dumps(["JioCinema", "JioTV"]),
        "base_loyalty_points": 40,
    },
    {
        "name": "Airtel Xstream OTT Hero",
        "operator": "Airtel Style",
        "price": 859.0,
        "validity_days": 84,
        "data_allowance": "2.0 GB/Day",
        "voice": "Unlimited Calls",
        "sms": "100 SMS/Day",
        "is_5g_unlimited": True,
        "category": "Entertainment",
        "ott_benefits": json.dumps(["Disney+ Hotstar", "Airtel Xstream Play"]),
        "base_loyalty_points": 110,
    },
    {
        "name": "Pulse Annual Mega Saver",
        "operator": "Pulse Prime",
        "price": 2999.0,
        "validity_days": 365,
        "data_allowance": "2.5 GB/Day",
        "voice": "Unlimited Calls",
        "sms": "100 SMS/Day",
        "is_5g_unlimited": True,
        "category": "Annual",
        "ott_benefits": json.dumps(["Disney+ Hotstar 1 Year", "Prime Video Mobile", "SonyLIV"]),
        "base_loyalty_points": 450,
    },
    {
        "name": "Budget Essential Pack",
        "operator": "Jio Style",
        "price": 199.0,
        "validity_days": 28,
        "data_allowance": "1.5 GB/Day",
        "voice": "Unlimited Calls",
        "sms": "100 SMS/Day",
        "is_5g_unlimited": False,
        "category": "Budget",
        "ott_benefits": json.dumps([]),
        "base_loyalty_points": 20,
    },
    {
        "name": "Ultimate Cinema & Sports 5G",
        "operator": "Airtel Style",
        "price": 1199.0,
        "validity_days": 84,
        "data_allowance": "3.0 GB/Day",
        "voice": "Unlimited Calls",
        "sms": "100 SMS/Day",
        "is_5g_unlimited": True,
        "category": "Entertainment",
        "ott_benefits": json.dumps(["Netflix Basic", "Disney+ Hotstar", "FanCode"]),
        "base_loyalty_points": 160,
    },
    {
        "name": "High-Speed 5G Booster Pack",
        "operator": "Pulse Prime",
        "price": 61.0,
        "validity_days": 0,  # existing pack validity
        "data_allowance": "6.0 GB Total",
        "voice": "NA",
        "sms": "NA",
        "is_5g_unlimited": False,
        "category": "Data Add-on",
        "ott_benefits": json.dumps([]),
        "base_loyalty_points": 10,
    },
]


def seed_initial_data(db: Session):
    # Check if plans already exist
    existing_plans = db.query(Plan).count()
    if existing_plans == 0:
        for plan_data in SEED_PLANS:
            plan = Plan(**plan_data)
            db.add(plan)
        db.commit()
        print("[Database] Seeded 6 realistic telecom plans.")

    # Check if demo user exists
    existing_user = db.query(User).filter(User.phone_number == "+91 98765 43210").first()
    if not existing_user:
        demo_user = User(
            name="Sahil Sharma",
            phone_number="+91 98765 43210",
            tier="Silver",
            loyalty_points=120,
            total_spent=1450.0,
            streak_months=2,
        )
        db.add(demo_user)
        db.commit()
        print("[Database] Seeded demo user 'Sahil Sharma' (+91 98765 43210).")
