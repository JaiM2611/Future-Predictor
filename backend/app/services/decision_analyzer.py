from app.models import UserDecision
from app.services.llm_client import call_llm_json

SYSTEM_PROMPT = """You are an expert life coach and decision analyst. Your role is to deeply analyze user decisions
and provide structured, insightful analysis. Always respond with valid JSON only. Be empathetic, realistic, and specific."""


def analyze_decision(decision: UserDecision) -> dict:
    """Analyze a user decision and return structured analysis."""
    prompt = f"""
Analyze this life decision and return a JSON object:

Decision: {decision.decision}
Category: {decision.category.value}
Context: {decision.context or 'Not provided'}
Current Situation: {decision.current_situation or 'Not provided'}
Goals: {decision.goals or 'Not provided'}
Time Horizon: {decision.time_horizon} years

Return ONLY a JSON object with these exact fields:
{{
  "core_factors": ["list of 3-5 key factors influencing this decision"],
  "decision_complexity": "low|medium|high",
  "impact_areas": ["list of life areas this decision affects"],
  "key_uncertainties": ["list of 2-4 main uncertainties"],
  "decision_summary": "2-3 sentence analysis of this decision",
  "immediate_implications": ["list of 3 immediate implications"],
  "long_term_implications": ["list of 3 long-term implications"]
}}
"""
    return call_llm_json(prompt, SYSTEM_PROMPT)
