# 🎬 FutureLens — AI Interactive Future Documentary Engine

> "Simulate decisions. Experience consequences. Shape your future."

An AI-powered platform that transforms your life decisions into immersive, interactive documentary experiences with branching timelines, multi-scenario comparison, and what-if analysis.

## ✨ Features

- **🎬 Documentary Mode** — Experience your future as a cinematic documentary with scene-based storytelling
- **🌳 Decision Branching** — See how each choice cascades into multiple future paths
- **📊 Multi-Scenario Comparison** — Compare best-case, worst-case, and most probable outcomes
- **🔁 What-If Engine** — Modify decisions and instantly see how your future changes
- **⚠️ Risk & Regret Analysis** — Understand risks, regret probability, and mitigation strategies
- **⏳ Time Progression** — Navigate year-by-year through your simulated future

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Python, FastAPI |
| AI/LLM | Google Gemini / OpenAI GPT |
| Frontend | React.js (Vite) |
| Styling | Custom CSS with cinematic dark theme |
| Routing | React Router v6 |

## 🚀 Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+
- A Gemini API key (free at [Google AI Studio](https://aistudio.google.com)) or OpenAI API key

### Backend Setup

```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
# Edit .env and add your API key
uvicorn app.main:app --reload --port 8000
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

## 📁 Project Structure

```
Future-Predictor/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI app
│   │   ├── models.py            # Pydantic data models
│   │   ├── routers/
│   │   │   ├── simulation.py    # Simulation & what-if endpoints
│   │   │   └── documentary.py   # Documentary generation endpoint
│   │   └── services/
│   │       ├── llm_client.py    # LLM provider abstraction
│   │       ├── decision_analyzer.py
│   │       ├── scenario_generator.py
│   │       ├── branching_engine.py
│   │       └── story_generator.py
│   ├── requirements.txt
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── components/          # Reusable UI components
    │   ├── pages/               # Route pages
    │   ├── services/api.js      # API client
    │   └── App.jsx
    └── package.json
```

## 🔑 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `GEMINI_API_KEY` | Google Gemini API key | - |
| `OPENAI_API_KEY` | OpenAI API key (alternative) | - |
| `LLM_PROVIDER` | Which LLM to use: `gemini` or `openai` | `gemini` |

## 🎯 Usage

1. Navigate to the app at `http://localhost:5173`
2. Click **"Start Simulation"**
3. Describe your decision (career, education, finance, etc.)
4. Provide context, current situation, and goals
5. Set your time horizon (1–20 years)
6. Click **"Generate My Future"**
7. Explore your future through:
   - 🎬 Documentary timeline view
   - 📊 Scenario comparison
   - 🌳 Decision branching tree
   - 🔁 What-if modifications

## 🏗 Architecture

```
User Input
    ↓
Decision Analyzer (LLM)
    ↓
Scenario Generator (3 futures: best/worst/probable)
    ↓
Branching Engine (decision trees)
    ↓
Story Generator (documentary narratives)
    ↓
React Interactive UI
```
