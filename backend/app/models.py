from pydantic import BaseModel, Field
from typing import List, Optional
from enum import Enum


class DecisionCategory(str, Enum):
    CAREER = "career"
    EDUCATION = "education"
    FINANCE = "finance"
    HABITS = "habits"
    RELATIONSHIPS = "relationships"
    ENTREPRENEURSHIP = "entrepreneurship"
    LIFESTYLE = "lifestyle"


class ScenarioType(str, Enum):
    BEST_CASE = "best_case"
    WORST_CASE = "worst_case"
    MOST_PROBABLE = "most_probable"


class UserDecision(BaseModel):
    decision: str = Field(..., description="The core decision the user is making", min_length=5)
    category: DecisionCategory
    context: Optional[str] = Field(None, description="Additional context about the decision")
    current_situation: Optional[str] = Field(None, description="User's current situation")
    goals: Optional[str] = Field(None, description="User's goals and aspirations")
    time_horizon: int = Field(5, description="Years into the future to simulate", ge=1, le=30)


class Scene(BaseModel):
    year: int
    title: str
    narrative: str
    key_events: List[str]
    emotional_tone: str


class Scenario(BaseModel):
    scenario_type: ScenarioType
    title: str
    summary: str
    probability: float = Field(..., ge=0.0, le=1.0)
    scenes: List[Scene]
    key_outcomes: List[str]
    risks: List[str]
    opportunities: List[str]
    regret_probability: float = Field(..., ge=0.0, le=1.0)


class Branch(BaseModel):
    id: str
    parent_id: Optional[str]
    decision_point: str
    choice: str
    consequence_summary: str
    children: List[str] = []


class DecisionTree(BaseModel):
    root_decision: str
    branches: List[Branch]


class SimulationRequest(BaseModel):
    user_decision: UserDecision
    generate_branches: bool = True
    num_branches: int = Field(3, ge=2, le=5)


class SimulationResponse(BaseModel):
    simulation_id: str
    user_decision: UserDecision
    scenarios: List[Scenario]
    decision_tree: Optional[DecisionTree]
    analysis_summary: str
    recommended_path: str


class WhatIfRequest(BaseModel):
    original_simulation_id: str
    original_decision: UserDecision
    modified_decision: str
    modification_context: Optional[str] = None


class WhatIfResponse(BaseModel):
    original_summary: str
    modified_summary: str
    key_differences: List[str]
    recommendation: str
    scenarios: List[Scenario]
