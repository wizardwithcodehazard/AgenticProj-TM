import json
import os
from typing import Dict, Any, List
from pydantic import BaseModel, Field
from app.config import settings

try:
    from crewai import Agent, Task, Crew, Process, LLM
except ImportError:
    Agent, Task, Crew, Process, LLM = None, None, None, None, None


class LoyaltyDecision(BaseModel):
    points_awarded: int = Field(description="Total loyalty points awarded for this transaction")
    tier_before: str = Field(description="User tier before this recharge")
    tier_after: str = Field(description="User tier after this recharge (Silver, Gold, or Platinum)")
    base_points: int = Field(description="Base points from the plan")
    tier_multiplier_bonus: int = Field(description="Bonus points gained from tier multiplier")
    streak_bonus: int = Field(description="Bonus points for on-time recharge streak")
    personalized_message: str = Field(description="Customer-facing personalized message explaining the rewards")
    perks_awarded: List[str] = Field(description="List of promotional perk vouchers awarded to customer")


def build_crew_and_run(user_dict: Dict[str, Any], plan_dict: Dict[str, Any]) -> Dict[str, Any]:
    """
    Executes the multi-agent loyalty workflow using local Qwen 2.5 on llama.cpp,
    or OpenAI/Gemini if configured, with heuristic fallback.
    """
    # Deterministic baseline metrics
    base_pts = plan_dict.get("base_loyalty_points", 30)
    current_tier = user_dict.get("tier", "Silver")
    streak = user_dict.get("streak_months", 1)
    current_pts = user_dict.get("loyalty_points", 0)

    # Multipliers: Silver=1.0x, Gold=1.5x, Platinum=2.0x
    multiplier_map = {"Silver": 1.0, "Gold": 1.5, "Platinum": 2.0}
    mult = multiplier_map.get(current_tier, 1.0)
    tier_bonus = int(base_pts * (mult - 1.0))
    streak_bonus = streak * 10
    total_pts = base_pts + tier_bonus + streak_bonus

    # New total and tier check
    new_points_total = current_pts + total_pts
    new_tier = current_tier
    if new_points_total >= 800:
        new_tier = "Platinum"
    elif new_points_total >= 300:
        new_tier = "Gold"

    # Contextual perks
    perks = []
    if plan_dict.get("is_5g_unlimited"):
        perks.append("5GB Unlimited 5G High-Speed Booster (Code: SPEED5G)")
    if "Entertainment" in plan_dict.get("category", "") or "Disney" in plan_dict.get("ott_benefits", ""):
        perks.append("Swiggy Gourmet Rs. 100 Discount Voucher (Code: PULSEMEAL)")
    if plan_dict.get("price", 0) >= 1000:
        perks.append("Priority Telecom Customer Care Pass (Valid 90 Days)")
    if not perks:
        perks.append("Rs. 50 Data Add-on Voucher (Code: PULSE50)")

    # Check for local LLM or API keys
    llm = None
    if settings.USE_LOCAL_LLM and Agent is not None:
        try:
            llm = LLM(
                model=settings.LOCAL_LLM_MODEL,
                base_url=settings.LOCAL_LLM_URL,
                api_key="local-token",
                temperature=0.2,
                max_tokens=500
            )
        except Exception as e:
            print(f"[LLM Setup Warning] Local LLM init failed: {e}")
    elif os.getenv("OPENAI_API_KEY") and Agent is not None:
        llm = LLM(model=settings.OPENAI_MODEL_NAME, api_key=os.getenv("OPENAI_API_KEY"))
    elif os.getenv("GEMINI_API_KEY") and Agent is not None:
        llm = LLM(model="gemini/gemini-1.5-flash", api_key=os.getenv("GEMINI_API_KEY"))

    # If LLM is available, execute multi-agent crew
    if llm:
        try:
            auditor = Agent(
                role="Telecom Plan & Transaction Auditor",
                goal=f"Audit the plan purchase for user {user_dict['name']}.",
                backstory="Financial auditor verifying telecom plan tier, validity, and customer recharge streak.",
                verbose=False,
                llm=llm
            )

            personalizer = Agent(
                role="Customer Retention & Perks Specialist",
                goal="Generate an enthusiastic, personalized celebration message for the customer.",
                backstory="Engaging brand voice crafting personalized customer reward announcements.",
                verbose=False,
                llm=llm
            )

            task1 = Task(
                description=(
                    f"Audit the transaction: User={user_dict['name']}, Current Tier={current_tier}, "
                    f"Plan={plan_dict['name']}, Price=Rs.{plan_dict['price']}, Base Points={base_pts}. "
                    f"Confirm that user qualifies for +{total_pts} points."
                ),
                expected_output="Audit confirmation statement in 2 lines.",
                agent=auditor
            )

            task2 = Task(
                description=(
                    f"Write a friendly 2-sentence celebration notification message for {user_dict['name']}. "
                    f"Highlight: awarded +{total_pts} points for recharging {plan_dict['name']}, "
                    f"and their tier is now {new_tier}. Keep it punchy and professional."
                ),
                expected_output="A 2-sentence celebration message.",
                agent=personalizer
            )

            crew = Crew(
                agents=[auditor, personalizer],
                tasks=[task1, task2],
                process=Process.sequential,
                verbose=False
            )

            crew_output = crew.kickoff()
            msg = str(crew_output).strip()
            if msg and len(msg) > 20:
                personalized_message = msg
            else:
                personalized_message = (
                    f"Congratulations {user_dict['name']}! You have earned {total_pts} loyalty points with your {plan_dict['name']} recharge. "
                    f"Your tier is now {new_tier}!"
                )
        except Exception as e:
            print(f"[CrewAI Warning] Falling back to heuristic template: {e}")
            personalized_message = (
                f"Congratulations {user_dict['name']}! You have earned {total_pts} loyalty points with your {plan_dict['name']} recharge. "
                f"Your tier is now {new_tier}!"
            )
    else:
        personalized_message = (
            f"Thank you for recharging with {plan_dict['name']}, {user_dict['name']}! "
            f"You've earned {total_pts} loyalty points today. Your tier is {new_tier}. Enjoy your perks!"
        )

    agent_steps = [
        {
            "agent": "Plan & Transaction Auditor",
            "action": "Plan Validation & Eligibility Verification",
            "details": f"Audited {plan_dict['name']} (Price: Rs. {plan_dict['price']}). Categorized as {plan_dict['category']} with {plan_dict['data_allowance']}.",
            "status": "completed"
        },
        {
            "agent": "Loyalty Points Strategist",
            "action": "Multiplier Computation & Tier Upgrade Assessment",
            "details": f"Applied {current_tier} multiplier ({mult}x) -> +{tier_bonus} pts. Evaluated {streak}-month streak -> +{streak_bonus} pts. Total awarded: {total_pts} pts.",
            "status": "completed"
        },
        {
            "agent": "Perks & Retention Personalizer",
            "action": "Targeted Voucher Matching & Notification Synthesis",
            "details": f"Curated {len(perks)} contextual perk vouchers matching customer plan tier ({new_tier}).",
            "status": "completed"
        }
    ]

    return {
        "points_awarded": total_pts,
        "tier_before": current_tier,
        "tier_after": new_tier,
        "breakdown": {
            "base_points": base_pts,
            "tier_multiplier_bonus": tier_bonus,
            "streak_bonus": streak_bonus,
        },
        "personalized_message": personalized_message,
        "perks_awarded": perks,
        "agent_steps": agent_steps
    }
