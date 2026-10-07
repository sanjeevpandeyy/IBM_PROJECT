# 🎯 IBM_PROJECT 

## Agentic Career Counseling Companion

IBM_PROJECT is an **Agentic Career Counseling Companion** designed to help students make informed career decisions based on their **academic performance, skills, interests, projects, experience, and career goals**.

Instead of providing generic career suggestions, IBM_PROJECT analyzes a student's profile, identifies suitable career pathways, detects skill gaps, recommends learning resources and projects, and provides actionable guidance through a conversational interface.

The project explores the use of **Agentic AI and IBM Granite** to transform career counseling from a one-time recommendation into a continuous and personalized career journey.

---

## 📌 Project Information

| Category | Details |
|----------|---------|
| Project Title | IBM_PROJECT |
| Domain | Education |
| Project Type | Agentic Career Counseling Companion |
| Primary Focus | Personalized Career Guidance |
| Backend | Python + Flask |
| Frontend | HTML + CSS + JavaScript |
| AI Technology | IBM Granite |
| Development Assistant | IBM Bob |
| Data Format | JSON |
| Application Type | Web Application |

---

# 🚨 Problem Statement

Students often struggle to make informed career decisions because:

- Career information is scattered across different sources.
- Students may not clearly understand their strengths and weaknesses.
- Required skills differ across career paths.
- Industry and job requirements continue to evolve.
- Generic career quizzes often provide limited guidance.
- Students may know which career interests them but not know how to become job-ready.

IBM_PROJECT addresses this problem by providing a personalized career guidance companion that analyzes the student's profile and generates actionable career pathways.

---

# 💡 Proposed Solution

IBM_PROJECT acts as an intelligent career companion that analyzes:

- Academic performance
- Technical skills
- Soft skills
- Interests
- Projects
- Experience
- Career goals
- Required career skills
- Learning resources
- Job-market guidance

The system understands the student's request, determines the required task, selects the appropriate specialized tool, performs the analysis, and generates personalized guidance.

### Core Workflow

Student Profile
        ↓
Understand User Intent
        ↓
IBM_PROJECT Agent
        ↓
Plan the Required Task
        ↓
Select Specialized Tool
        ↓
Analyze Career Knowledge
        ↓
Generate Personalized Guidance
        ↓
Maintain Conversation Context

---

# ✨ Key Features

## 🎯 1. Personalized Career Recommendations

IBM_PROJECT analyzes the student's profile and identifies career pathways that best match their current skills, interests and goals.

---

## 📊 2. Skill-Gap Analysis

The system compares the student's existing skills with the skills required for a selected career.

It identifies:

- Existing skills
- Missing skills
- Important skills to develop
- Areas requiring improvement

---

## 🗺️ 3. Career Roadmaps

IBM_PROJECT provides structured guidance on what the student should focus on to progress toward their desired career.

---

## 📚 4. Learning Recommendations

The system recommends learning areas and resources based on the student's selected career path and skill gaps.

---

## 💻 5. Project Recommendations

IBM_PROJECT recommends practical projects that can help students build portfolio-ready skills for their target career.

---

## 📈 6. Career Readiness Assessment

The system provides an indicative career-readiness score based on the student's current profile and career requirements.

---

## ⚖️ 7. Career Comparison

Students can compare two career paths and understand how their current skill set aligns with each option.

Example:

    Compare Data Analyst with Operations Analyst

---

## 💬 8. Conversational Career Companion

Students can interact with IBM_PROJECT using natural-language questions.

Examples:

    Which career should I choose?

    What skills am I missing?

    What should I learn first?

    Give me some projects for this career.

    How job ready am I?

    Compare Data Analyst with Operations Analyst.

---

## 🧠 9. Conversation Memory

IBM_PROJECT maintains session-level conversation context so that students can ask follow-up questions without repeatedly providing the same information.

Example:

    User:
    Which career is suitable for me?

    IBM_PROJECT:
    Data Analyst is a strong match.

    User:
    What skills am I missing?

    IBM_PROJECT:
    Based on your previous profile, you should focus on...

---

## 📚 10. Knowledge-Driven Guidance

IBM_PROJECT uses structured knowledge sources containing:

- Career roles
- Required skills
- Learning resources
- Job-market guidance

This allows the system to provide structured and consistent recommendations.

---

# 🤖 Role of Agentic AI

IBM_PROJECT follows an agentic workflow rather than functioning as a simple question-and-answer application.

The agent follows the cycle:

    Understand → Reason → Plan → Act → Evaluate → Personalize

### Agent Workflow

```text
┌─────────────────────────┐
│     STUDENT PROFILE     │
│ Skills • Marks          │
│ Interests • Goals       │
└────────────┬────────────┘
             ↓
┌─────────────────────────┐
│     UNDERSTAND INTENT   │
└────────────┬────────────┘
             ↓
┌─────────────────────────┐
│       IBM GRANITE       │
│    Analyze + Reason     │
└────────────┬────────────┘
             ↓
┌──────────────────────────────┐
│       AGENTIC PLANNER        │
│ Understand → Plan → Select   │
│             Tool             │
└────────────┬─────────────────┘
             ↓
┌────────────────────────────────────┐
│          SPECIALIZED TOOLS         │
│                                    │
│ Career | Skill | Roadmap           │
│ Learning | Project | Market        │
└────────────┬───────────────────────┘
             ↓
┌────────────────────────────────────┐
│       PERSONALIZED GUIDANCE        │
│                                    │
│ Recommendations • Roadmap          │
│ Skill Gap • Projects • Readiness   │
└────────────┬───────────────────────┘
             ↕
┌─────────────────────────┐
│     MEMORY / CONTEXT    │
└─────────────────────────┘
```

---

## 🚀 Quick Start (Running the Project)

### 1. One-Click Start (Recommended)
From the root directory, simply run:
```bash
bash start.sh
```
This will automatically create a Python virtual environment, install dependencies, and launch the Flask server on `http://127.0.0.1:5000`.

### 2. Manual Start
```bash
cd Backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python app.py
```

### 3. Open the Frontend
Simply open `Frontend/index.html` in any web browser (or serve it with Live Server / any local HTTP server).

