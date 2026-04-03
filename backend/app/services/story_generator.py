from app.models import UserDecision, Scenario
from app.services.llm_client import call_llm_json

SYSTEM_PROMPT = """You are an award-winning documentary filmmaker and narrator. You transform 
data-driven scenarios into emotionally compelling documentary scripts. Your narration feels 
human, warm, and deeply engaging - never robotic. Always respond with valid JSON only."""


def generate_documentary_script(decision: UserDecision, scenario: Scenario) -> dict:
    """Generate a full documentary-style script for a scenario."""
    
    scenes_text = "\n".join([
        f"Year {s.year}: {s.narrative}"
        for s in scenario.scenes
    ])
    
    prompt = f"""
Transform this future scenario into a documentary film script:

Person's Decision: {decision.decision}
Scenario: {scenario.title} ({scenario.scenario_type.value})
Summary: {scenario.summary}

Timeline:
{scenes_text}

Create a compelling documentary script as JSON:
{{
  "documentary_title": "dramatic, evocative title for this documentary",
  "opening_narration": "2-3 sentence opening narration that hooks the viewer. Use 'Meet [name]. They made a decision...'",
  "chapter_scripts": [
    {{
      "chapter_number": 1,
      "chapter_title": "title",
      "year_range": "Year 1-2",
      "narration": "3-4 sentence documentary narration for this chapter",
      "interview_snippet": "A fictional quote from the person looking back: 'I remember thinking...'",
      "visual_description": "Brief description of what we see on screen"
    }}
  ],
  "closing_narration": "2-3 sentence powerful closing narration",
  "lesson": "one powerful life lesson from this story",
  "emotional_arc": "brief description of the emotional journey"
}}

Write in documentary style - third person narration, then first person interview snippets.
Make it feel like a Netflix documentary. Be specific, emotional, and human.
"""
    return call_llm_json(prompt, SYSTEM_PROMPT)


def generate_risk_analysis(decision: UserDecision, scenarios: list[Scenario]) -> dict:
    """Generate risk and regret analysis across scenarios."""
    
    risks_by_scenario = {
        s.scenario_type.value: s.risks for s in scenarios
    }
    
    prompt = f"""
Analyze risks and regret for this decision:

Decision: {decision.decision}
Category: {decision.category.value}
Time Horizon: {decision.time_horizon} years

Risks by scenario:
{risks_by_scenario}

Return a JSON risk analysis:
{{
  "overall_risk_level": "low|medium|high|very_high",
  "top_risks": [
    {{
      "risk": "specific risk description",
      "probability": 0.0-1.0,
      "impact": "low|medium|high",
      "mitigation": "how to reduce this risk"
    }}
  ],
  "regret_factors": ["things that could lead to regret"],
  "regret_minimization_tips": ["tips to minimize regret"],
  "decision_confidence_score": 0-100,
  "recommendation": "overall recommendation with reasoning"
}}

Be specific and actionable. Include 3-5 top risks.
"""
    return call_llm_json(prompt, SYSTEM_PROMPT)


def generate_what_if_comparison(
    original_decision: UserDecision,
    modified_decision: str,
    original_scenarios: list[Scenario],
    modified_scenarios: list[Scenario],
) -> dict:
    """Compare original and modified decisions."""
    
    original_probable = next((s for s in original_scenarios if s.scenario_type.value == "most_probable"), original_scenarios[0])
    modified_probable = next((s for s in modified_scenarios if s.scenario_type.value == "most_probable"), modified_scenarios[0])
    
    prompt = f"""
Compare these two decision paths:

ORIGINAL: {original_decision.decision}
Most probable outcome: {original_probable.summary}
Key outcomes: {original_probable.key_outcomes}

MODIFIED: {modified_decision}
Most probable outcome: {modified_probable.summary}
Key outcomes: {modified_probable.key_outcomes}

Return a JSON comparison:
{{
  "key_differences": ["difference 1", "difference 2", "difference 3"],
  "which_is_better": "original|modified|similar",
  "why_better": "explanation of which is better and why",
  "tradeoffs": ["tradeoff 1", "tradeoff 2"],
  "recommendation": "clear recommendation on what to do"
}}
"""
    return call_llm_json(prompt, SYSTEM_PROMPT)
