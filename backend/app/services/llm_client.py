import os
import json
from dotenv import load_dotenv

load_dotenv()

LLM_PROVIDER = os.getenv("LLM_PROVIDER", "gemini")


def _extract_json(text: str) -> dict:
    """Extract JSON from LLM response text."""
    text = text.strip()
    # Try to find JSON block
    if "```json" in text:
        start = text.find("```json") + 7
        end = text.find("```", start)
        text = text[start:end].strip()
    elif "```" in text:
        start = text.find("```") + 3
        end = text.find("```", start)
        text = text[start:end].strip()
    return json.loads(text)


def call_llm(prompt: str, system_prompt: str = "") -> str:
    """Call the configured LLM provider."""
    provider = LLM_PROVIDER.lower()

    if provider == "openai":
        return _call_openai(prompt, system_prompt)
    else:
        return _call_gemini(prompt, system_prompt)


def _call_gemini(prompt: str, system_prompt: str = "") -> str:
    import google.generativeai as genai
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY not set in environment")
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel("gemini-1.5-flash")
    full_prompt = f"{system_prompt}\n\n{prompt}" if system_prompt else prompt
    response = model.generate_content(full_prompt)
    return response.text


def _call_openai(prompt: str, system_prompt: str = "") -> str:
    from openai import OpenAI
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise ValueError("OPENAI_API_KEY not set in environment")
    client = OpenAI(api_key=api_key)
    messages = []
    if system_prompt:
        messages.append({"role": "system", "content": system_prompt})
    messages.append({"role": "user", "content": prompt})
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=messages,
        temperature=0.8,
    )
    return response.choices[0].message.content


def call_llm_json(prompt: str, system_prompt: str = "") -> dict:
    """Call LLM and parse JSON response."""
    response = call_llm(prompt, system_prompt)
    return _extract_json(response)
