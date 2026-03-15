

# AI Interview Coach

🚀 **AI Interview Coach** is an intelligent coding interview preparation platform that simulates real technical interviews while providing personalized learning guidance.

Unlike traditional coding platforms that only verify whether a solution passes test cases, this system integrates **AI-driven interview interaction, secure code execution, and learning analytics** to help users understand how they solve problems and how they can improve.

---

## ✨ Features

### 🧠 AI Interviewer

After submitting a solution, the AI simulates a real interviewer by asking follow-up questions.

Example interaction:

```text
AI: What is the time complexity of your solution?
User: O(n log n)

AI: Can the space complexity be optimized?
```

The system evaluates:

* explanation clarity
* optimization awareness
* reasoning quality

---

### 💡 Intelligent Hint System

Provides **progressive hints** when users struggle with a problem.

Example hint sequence:

```text
Hint 1: Consider how to track previously seen elements.
Hint 2: A hash-based structure may reduce time complexity.
Hint 3: Try using a hash map to store complements.
```

Hints can trigger when:

* user requests help
* user is inactive for a long time
* multiple incorrect submissions occur

---

### 📊 Learning Pattern Detection

Tracks user performance to detect strengths and weaknesses.

Example:

```text
Strengths
- Arrays
- Sliding Window

Weaknesses
- Graph Algorithms
- Dynamic Programming
```

---

### 🎯 Personalized Problem Recommendations

Based on detected patterns, the platform suggests problems targeting weak areas.

Example:

```text
Recommended Topics
- Graph traversal
- Dynamic programming

Suggested Problems
- Shortest Path in Graph
- Longest Increasing Subsequence
```

---

### 🧪 Interview Simulation Mode

Simulate a complete coding interview with:

* timed coding challenges
* AI interviewer interaction
* performance evaluation report

Example report:

```text
Coding Accuracy: 85%
Optimization Awareness: Moderate
Communication Clarity: Good
Focus Area: Graph Algorithms
```

---

## 🏗 System Architecture

```
Client (Next.js)
      │
      ▼
API Server (Node.js)
      │
      ▼
Job Queue (Redis)
      │
      ▼
Execution Worker
      │
      ▼
Docker Sandbox
      │
      ▼
PostgreSQL Database
```

This architecture ensures:

* secure execution of user code
* asynchronous job processing
* scalable backend infrastructure

---

## 🔒 Security: Code Execution

User-submitted code **must not** run on the host. This project runs code inside **ephemeral Docker containers** with strict limits:

| Control | Setting | Purpose |
|--------|---------|--------|
| Network | `--network none` | No internet (no exfiltrating `.env` or API keys) |
| Memory | `--memory 128m` | Prevents memory exhaustion |
| Swap | `--memory-swap 128m` | No swap beyond limit |
| Processes | `--pids-limit 50` | Caps fork bombs |
| Filesystem | `--read-only` + volume `:ro` | Container cannot write; only the mounted script is readable |
| Privileges | `--security-opt no-new-privileges` + `--cap-drop ALL` | No privilege escalation |

The runner uses **Node.js 20 Alpine** inside the container. The host only mounts the single script file read-only; the container cannot see the host filesystem, `.env`, or the network.

**Production:** Keep `USE_DOCKER_EXECUTION=true` (default) and ensure Docker is installed and the daemon is running.

**Local dev without Docker:** Set `USE_DOCKER_EXECUTION=false` in `Backend/.env`. Code then runs on the host and is **insecure** (user code could read `.env`, delete files, etc.). Use only for development.

---

## 🛠 Tech Stack

### Backend

* Node.js
* Express

### Frontend

* Next.js

### Database

* PostgreSQL

### Queue System

* Redis

### Containerization

* Docker

---

## 📂 Project Structure

```
AI_Interview_Coach
│
├── Backend
│   ├── src
│   │   ├── controllers
│   │   ├── routes
│   │   ├── services
│   │   ├── models
│   │   └── config
│   ├── app.js
│   └── index.js
│
├── frontend
│   ├── app
│   │   ├── page.js          (problem list)
│   │   ├── problem/[id]     (editor, run, hints, AI chat)
│   │   └── layout.js
│   └── lib/api.js
│
└── README.md
```

---

## 🚀 Getting Started

### Clone the repository

```bash
git clone https://github.com/your-username/AI_Interview_Coach.git
cd AI_Interview_Coach
```

### Install dependencies

From the project root:

```bash
npm run install:all
```

Or manually:

```bash
npm install
cd Backend && npm install
cd ../frontend && npm install
```

### Environment (optional)

- Copy `Backend/.env.example` to `Backend/.env` and set `PORT`, `CORS_ORIGIN` if needed.
- Add `OPENAI_API_KEY` for AI-powered interviewer replies (otherwise built-in prompts are used).

### Run the app

**Option 1 – run both backend and frontend together (from root):**

```bash
npm run dev
```

- Backend: http://localhost:5000  
- Frontend: http://localhost:3000 (proxies API to backend)

**Option 2 – run separately:**

```bash
# Terminal 1 – backend
npm run dev:backend

# Terminal 2 – frontend
npm run dev:frontend
```

Then open http://localhost:3000 in your browser.

---

## 📌 Future Enhancements

* AI code review and optimization suggestions
* real-time collaborative coding sessions
* coding battle / duel mode
* analytics dashboard for performance tracking
* multi-language code execution support

---

## 👨‍💻 Author

**Raj Kumar**

* Competitive Programmer
* Backend Developer

