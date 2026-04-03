from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.models import UserDecision, ScenarioType
from app.services.scenario_generator import generate_scenarios
from app.services.story_generator import generate_documentary_script, generate_risk_analysis

router = APIRouter(prefix="/api/documentary", tags=["documentary"])


class DocumentaryRequest(BaseModel):
    user_decision: UserDecision
    scenario_type: ScenarioType = ScenarioType.MOST_PROBABLE


@router.post("/generate")
async def generate_documentary(request: DocumentaryRequest):
    """Generate a documentary script for a decision."""
    try:
        scenarios = generate_scenarios(request.user_decision)
        target_scenario = next(
            (s for s in scenarios if s.scenario_type == request.scenario_type),
            scenarios[0]
        )
        script = generate_documentary_script(request.user_decision, target_scenario)
        risk_analysis = generate_risk_analysis(request.user_decision, scenarios)
        
        return {
            "scenario": target_scenario,
            "script": script,
            "risk_analysis": risk_analysis,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
