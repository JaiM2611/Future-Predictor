import json
from app.models import UserDecision, Scenario, Scene, ScenarioType
from app.services.llm_client import call_llm_json

SYSTEM_PROMPT = """You are a master storyteller and futurist. You create vivid, emotionally engaging, 
realistic future scenarios based on user decisions. Your scenarios feel like documentary films - 
they have narrative arc, emotional depth, and authentic human experiences. Always respond with valid JSON only."""


def generate_scenarios(decision: UserDecision) -> list[Scenario]:
    """Generate best, worst, and most probable scenarios for a decision."""
    
    years = list(range(1, decision.time_horizon + 1, max(1, decision.time_horizon // 4)))
    if decision.time_horizon not in years:
        years.append(decision.time_horizon)

    prompt = f"""
Generate 3 future scenarios for this decision as a JSON array:

Decision: {decision.decision}
Category: {decision.category.value}
Context: {decision.context or 'A person at a crossroads'}
Current Situation: {decision.current_situation or 'Starting fresh'}
Goals: {decision.goals or 'Success and fulfillment'}
Time Horizon: {decision.time_horizon} years
Timeline checkpoints: years {years}

Create exactly 3 scenarios: best_case, worst_case, most_probable.

Return ONLY a JSON array with 3 objects, each having these EXACT fields:
[
  {{
    "scenario_type": "best_case",
    "title": "compelling title for this scenario",
    "summary": "2-3 sentence emotional summary of this future",
    "probability": 0.25,
    "scenes": [
      {{
        "year": 1,
        "title": "scene title",
        "narrative": "2-3 sentence vivid narrative of what life looks like at this point. Write in second person (you). Be specific and emotional.",
        "key_events": ["event 1", "event 2", "event 3"],
        "emotional_tone": "hopeful|anxious|triumphant|reflective|determined|struggling"
      }}
    ],
    "key_outcomes": ["outcome 1", "outcome 2", "outcome 3"],
    "risks": ["risk 1", "risk 2"],
    "opportunities": ["opportunity 1", "opportunity 2"],
    "regret_probability": 0.1
  }},
  {{
    "scenario_type": "worst_case",
    ...same structure, probability ~0.15-0.25, regret_probability ~0.7-0.9
  }},
  {{
    "scenario_type": "most_probable",
    ...same structure, probability ~0.5-0.65, regret_probability ~0.25-0.45
  }}
]

Make exactly {len(years)} scenes per scenario, one for each year checkpoint: {years}.
Write scenes in second person ("You wake up...", "You realize...", "You find yourself...").
Make narratives emotionally vivid and documentary-like.
"""
    raw = call_llm_json(prompt, SYSTEM_PROMPT)
    
    scenarios = []
    for item in raw:
        scenes = [Scene(**s) for s in item["scenes"]]
        scenario = Scenario(
            scenario_type=ScenarioType(item["scenario_type"]),
            title=item["title"],
            summary=item["summary"],
            probability=item["probability"],
            scenes=scenes,
            key_outcomes=item["key_outcomes"],
            risks=item["risks"],
            opportunities=item["opportunities"],
            regret_probability=item["regret_probability"],
        )
        scenarios.append(scenario)
    return scenarios
