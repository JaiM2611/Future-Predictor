import uuid
from app.models import UserDecision, DecisionTree, Branch
from app.services.llm_client import call_llm_json

SYSTEM_PROMPT = """You are a strategic decision architect. You map out decision trees showing 
how choices cascade into future possibilities. Always respond with valid JSON only."""


def generate_decision_tree(decision: UserDecision, num_branches: int = 3) -> DecisionTree:
    """Generate a decision tree with branching paths."""
    
    prompt = f"""
Create a decision tree for this scenario as a JSON object:

Core Decision: {decision.decision}
Category: {decision.category.value}
Context: {decision.context or 'General life decision'}
Goals: {decision.goals or 'Success and fulfillment'}

Return ONLY a JSON object with this EXACT structure:
{{
  "root_decision": "{decision.decision}",
  "branches": [
    {{
      "id": "b1",
      "parent_id": null,
      "decision_point": "The initial choice you face",
      "choice": "Option A: [specific choice]",
      "consequence_summary": "1-2 sentence consequence of this choice",
      "children": ["b1_1", "b1_2"]
    }},
    {{
      "id": "b2",
      "parent_id": null,
      "decision_point": "The initial choice you face",
      "choice": "Option B: [specific alternative choice]",
      "consequence_summary": "1-2 sentence consequence of this choice",
      "children": ["b2_1", "b2_2"]
    }},
    {{
      "id": "b1_1",
      "parent_id": "b1",
      "decision_point": "Secondary decision after Option A",
      "choice": "Sub-option A1",
      "consequence_summary": "Consequence of this path",
      "children": []
    }},
    {{
      "id": "b1_2",
      "parent_id": "b1",
      "decision_point": "Secondary decision after Option A",
      "choice": "Sub-option A2",
      "consequence_summary": "Consequence of this path",
      "children": []
    }},
    {{
      "id": "b2_1",
      "parent_id": "b2",
      "decision_point": "Secondary decision after Option B",
      "choice": "Sub-option B1",
      "consequence_summary": "Consequence of this path",
      "children": []
    }},
    {{
      "id": "b2_2",
      "parent_id": "b2",
      "decision_point": "Secondary decision after Option B",
      "choice": "Sub-option B2",
      "consequence_summary": "Consequence of this path",
      "children": []
    }}
  ]
}}

Make the decision points realistic and specific to the category: {decision.category.value}.
Create {num_branches} root branches (level 1) and 2 sub-branches for each root branch.
"""
    raw = call_llm_json(prompt, SYSTEM_PROMPT)
    
    branches = [Branch(**b) for b in raw["branches"]]
    return DecisionTree(
        root_decision=raw["root_decision"],
        branches=branches,
    )
