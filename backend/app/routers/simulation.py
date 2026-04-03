import uuid
from fastapi import APIRouter, HTTPException
from app.models import (
    SimulationRequest, SimulationResponse, WhatIfRequest, WhatIfResponse
)
from app.services.decision_analyzer import analyze_decision
from app.services.scenario_generator import generate_scenarios
from app.services.branching_engine import generate_decision_tree
from app.services.story_generator import (
    generate_risk_analysis, generate_what_if_comparison
)

router = APIRouter(prefix="/api/simulation", tags=["simulation"])

# In-memory store for simulations (use a DB in production)
_simulations: dict = {}


@router.post("/run", response_model=SimulationResponse)
async def run_simulation(request: SimulationRequest):
    """Run a full future simulation for a user decision."""
    try:
        simulation_id = str(uuid.uuid4())
        
        # Analyze decision
        analysis = analyze_decision(request.user_decision)
        
        # Generate scenarios
        scenarios = generate_scenarios(request.user_decision)
        
        # Generate decision tree if requested
        decision_tree = None
        if request.generate_branches:
            decision_tree = generate_decision_tree(
                request.user_decision, request.num_branches
            )
        
        # Generate risk analysis
        risk_analysis = generate_risk_analysis(request.user_decision, scenarios)
        
        response = SimulationResponse(
            simulation_id=simulation_id,
            user_decision=request.user_decision,
            scenarios=scenarios,
            decision_tree=decision_tree,
            analysis_summary=analysis.get("decision_summary", ""),
            recommended_path=risk_analysis.get("recommendation", ""),
        )
        
        # Store simulation
        _simulations[simulation_id] = {
            "response": response,
            "analysis": analysis,
            "risk_analysis": risk_analysis,
        }
        
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{simulation_id}", response_model=SimulationResponse)
async def get_simulation(simulation_id: str):
    """Retrieve a stored simulation."""
    if simulation_id not in _simulations:
        raise HTTPException(status_code=404, detail="Simulation not found")
    return _simulations[simulation_id]["response"]


@router.post("/whatif", response_model=WhatIfResponse)
async def what_if_analysis(request: WhatIfRequest):
    """Run a what-if analysis comparing two decision paths."""
    try:
        # Get original simulation
        original_sim = _simulations.get(request.original_simulation_id)
        if not original_sim:
            raise HTTPException(status_code=404, detail="Original simulation not found")
        
        original_response: SimulationResponse = original_sim["response"]
        
        # Create modified decision
        from app.models import UserDecision
        modified_decision = UserDecision(
            decision=request.modified_decision,
            category=request.original_decision.category,
            context=request.modification_context or request.original_decision.context,
            current_situation=request.original_decision.current_situation,
            goals=request.original_decision.goals,
            time_horizon=request.original_decision.time_horizon,
        )
        
        # Generate new scenarios
        modified_scenarios = generate_scenarios(modified_decision)
        
        # Generate comparison
        comparison = generate_what_if_comparison(
            request.original_decision,
            request.modified_decision,
            original_response.scenarios,
            modified_scenarios,
        )
        
        original_probable = next(
            (s for s in original_response.scenarios if s.scenario_type.value == "most_probable"),
            original_response.scenarios[0]
        )
        modified_probable = next(
            (s for s in modified_scenarios if s.scenario_type.value == "most_probable"),
            modified_scenarios[0]
        )
        
        return WhatIfResponse(
            original_summary=original_probable.summary,
            modified_summary=modified_probable.summary,
            key_differences=comparison.get("key_differences", []),
            recommendation=comparison.get("recommendation", ""),
            scenarios=modified_scenarios,
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
