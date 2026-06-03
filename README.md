# LifeOps AI 🚀

**AI-Powered Goal Execution System**

LifeOps AI transforms high-level goals into actionable execution plans using Generative AI. Instead of maintaining static to-do lists, users can define a goal in natural language, and the platform automatically generates projects, tasks, progress tracking, productivity analytics, and execution recommendations.

---

## 🌟 Features

### Goal Planning with AI

Users enter a goal such as:

```txt
Become SDE II in 3 months
```

LifeOps AI automatically:

* Creates a Goal
* Generates multiple Projects
* Breaks projects into actionable Tasks
* Assigns task priorities
* Tracks execution progress

---

### AI Project Decomposition

Example:

```txt
Goal:
Become SDE II in 3 months
```

Generated Structure:

```txt
Goal
│
├── Technical Excellence
│   ├── Study System Design
│   ├── Improve Coding Skills
│   └── Practice Architecture Reviews
│
├── Leadership
│   ├── Mentor Engineers
│   ├── Lead Discussions
│   └── Drive Project Planning
│
└── Career Growth
    ├── Build Portfolio
    ├── Increase Visibility
    └── Improve Communication
```

---

### Progress Tracking

LifeOps AI calculates:

* Total Goals
* Total Projects
* Total Tasks
* Completed Tasks
* Completion Percentage

---

### Project Progress Bars

Each project displays:

```txt
Technical Excellence
████████░░ 80%
```

based on task completion.

---

### Task Management

Tasks support:

* Completion Tracking
* Status Updates
* Priority Levels

Priority Types:

```txt
High
Medium
Low
```

---

### Weekly Productivity Review

The platform generates:

```txt
Productivity Score
Tasks Completed
Execution Summary
```

to help users monitor consistency.

---

### AI Recommendation Engine

LifeOps AI identifies:

```txt
Next Highest Impact Task
```

and surfaces it directly on the dashboard.

Example:

```txt
AI Recommendation

Practice Architecture Reviews

This is the next highest-impact action to move your goal forward.
```

---

### Activity Timeline

Tracks:

```txt
Goal Created
Project Created
Task Completed
AI Plan Generated
```

with relative timestamps.

Example:

```txt
Generated AI Plan for Become SDE II
2 mins ago
```

---

# 🏗 System Architecture

```txt
┌──────────────────────────┐
│        User Browser      │
└────────────┬─────────────┘
             │
             ▼
┌──────────────────────────┐
│      Next.js Frontend    │
│      Dashboard UI        │
└────────────┬─────────────┘
             │ REST API
             ▼
┌──────────────────────────┐
│     Next.js API Routes   │
└───────┬─────────┬────────┘
        │         │
        │         │
        ▼         ▼
┌─────────────┐ ┌─────────────┐
│ Gemini AI   │ │ MongoDB     │
│ Goal Planner│ │ Atlas       │
└─────────────┘ └─────────────┘
```

---

# 📁 Project Structure

```txt
app
│
├── api
│   ├── activity
│   ├── goals
│   │   └── ai
│   ├── projects
│   ├── review
│   │   └── weekly
│   ├── tasks
│   └── plan
│
├── dashboard
│   └── page.tsx
│
├── layout.tsx
└── page.tsx

src
│
├── components
│   └── StatCard.tsx
│
├── lib
│   ├── mongodb.ts
│   ├── gemini.ts
│   ├── goalPlanner.ts
│   └── activityLogger.ts
│
└── types
```

---

# 🔄 Application Flow

## 1. User Creates Goal

Request:

```http
POST /api/goals/ai
```

Body:

```json
{
  "title": "Become SDE II in 3 months"
}
```

---

## 2. Goal Stored

MongoDB:

```json
{
  "_id": "...",
  "title": "Become SDE II in 3 months",
  "status": "active"
}
```

---

## 3. Gemini Generates Plan

Prompt:

```txt
Break the user's goal into projects and tasks.
Return valid JSON only.
```

Gemini returns:

```json
{
  "projects": [
    {
      "title": "Technical Excellence",
      "tasks": [
        "Study System Design",
        "Practice Architecture Reviews"
      ]
    }
  ]
}
```

---

## 4. Projects Created

MongoDB:

```json
{
  "goalId": "...",
  "title": "Technical Excellence"
}
```

---

## 5. Tasks Created

MongoDB:

```json
{
  "projectId": "...",
  "title": "Study System Design",
  "priority": "High",
  "completed": false
}
```

---

## 6. Dashboard Refresh

Dashboard automatically displays:

```txt
Goals
Projects
Tasks
Productivity Score
Activity Feed
```

---

# 🗄 Database Collections

## goals

```json
{
  "_id": "...",
  "title": "Become SDE II",
  "status": "active",
  "createdAt": "..."
}
```

---

## projects

```json
{
  "_id": "...",
  "goalId": "...",
  "title": "Technical Excellence"
}
```

---

## tasks

```json
{
  "_id": "...",
  "projectId": "...",
  "title": "Study System Design",
  "priority": "High",
  "completed": false
}
```

---

## activity

```json
{
  "_id": "...",
  "message": "Generated AI Plan",
  "createdAt": "..."
}
```

---

# ⚙️ Technology Stack

### Frontend

* Next.js 16
* React 19
* TypeScript
* Tailwind CSS v4

### Backend

* Next.js API Routes
* Node.js Runtime

### Database

* MongoDB Atlas

### AI

* Google Gemini 2.5 Flash

### Deployment

* Vercel

---

# 🚀 Local Development

## Clone Repository

```bash
git clone https://github.com/PRABHU-OFFICIAL-II/lifeops-ai

cd lifeops-ai
```

---

## Install Dependencies

```bash
npm install
```

---

## Configure Environment Variables

Create:

```txt
.env.local
```

```env
MONGODB_URI=your_mongodb_connection_string

GEMINI_API_KEY=your_gemini_api_key
```

---

## Run Application

```bash
npm run dev
```

Open:

```txt
http://localhost:3000
```

Automatically redirects to:

```txt
http://localhost:3000/dashboard
```

---

# ☁️ Deployment

## Vercel

```bash
git push origin main
```

Import repository into Vercel.

Add Environment Variables:

```txt
MONGODB_URI
GEMINI_API_KEY
```

Deploy.

---

# Future Roadmap

Potential future enhancements:

* Authentication (NextAuth/Auth.js)
* Multi-user support
* Goal deadlines
* Calendar integration
* Notifications
* AI coaching assistant
* Team collaboration
* Mobile application

---

## Author

**Prabhu Prasad Penthoi**
Software Engineer | Salesforce

Built to demonstrate AI-powered planning, execution tracking, and modern full-stack development practices. 🚀