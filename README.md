# 🎓 FocusFlow & Sem 7 Study Hub 🚀
> An ADHD-friendly, high-focus exam revision and curriculum tracking application built with **React 19**, **TypeScript**, **Tailwind CSS**, and **Firebase**.

---

## 📌 Overview

**FocusFlow** is designed specifically to reduce cognitive overload and friction for engineering exam preparation and skill roadmaps. It simplifies exam review by breaking complex syllabi into prioritized, high-yield questions, providing built-in micro-sprint timers, and offering a partner accountability mode.

---

## ✨ Key Features

### 1. 📚 Sem 7 Exam Revision Hub
A structured, prioritized revision system covering Semester 7 core subjects:

- **🧠 Deep Learning (DL)**:
  - *Unit 1 — Fundamentals*: Multi-Layer Perceptrons (MLP), XOR Problem, Representation Power, Sigmoid Neurons, Gradient Descent, DL Taxonomy & History.
  - *Unit 2 — Training & Optimization*: Deep Feedforward Networks, Activation Functions comparison (Logistic, Tanh, Linear, ReLU, Leaky ReLU, Softmax), Loss Functions (Squared Error vs Cross-Entropy), Backpropagation derivation.
- **📊 Big Data Analytics (BDA)**:
  - Ranked Top 15 must-do exam questions.
  - Hadoop Ecosystem, MapReduce execution workflow, Two-pass Matrix-Vector Multiplication, NoSQL architectures, HDFS architecture (NameNode/DataNode/Replication), and MapReduce relational algebra.
- **⛓️ Blockchain Technology (BCT)**:
  - Prioritized blockchain modules.
  - Hyperledger Fabric & Ethereum architectures, RAFT & Nakamoto consensus algorithms (PoW, PoS, PoB, PoET), Merkle Trees, UTXO model, and Solidity smart contract development.
- **🏢 Management Information Systems (MIS)**:
  - Comprehensive question bank organized across all 5 syllabus modules with marks weightage indicators (`[5M]`, `[10M]`).
- **⏱️ Integrated Focus Sprint Modal**:
  - 10-minute and 25-minute Pomodoro timers directly inside the revision hub.
  - Dynamic subject topic checklist to maintain momentum without context switching.

---

### 2. 🗺️ Curriculum & Task Tracker
- Comprehensive roadmap tracking for Data Structures & Algorithms (DSA) and AI/Data Science topics.
- Visual completion checklists with live percentage progress indicators.

---

### 3. 💖 Partner HQ (Accountability Portal)
- Dedicated mode for a study partner or loved one to send real-time encouragement.
- Voice/Audio cheer notes and customizable gift rewards to keep motivation high.
- Instant real-time nudges powered by Firestore.

---

## 🛠️ Tech Stack

- **Frontend**: [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Vite](https://vitejs.dev/)
- **Styling & Animation**: [Tailwind CSS v4](https://tailwindcss.com/), [Motion (Framer Motion)](https://motion.dev/), [Lucide React Icons](https://lucide.dev/)
- **Backend / Real-time Sync**: [Node.js](https://nodejs.org/), [Express](https://expressjs.com/), [Firebase Firestore & Auth](https://firebase.google.com/)
- **Bundler & Tooling**: `esbuild`, `tsx`

---

## 📂 Project Structure

```text
├── src/
│   ├── components/
│   │   ├── Sem7Screen.tsx         # Sem 7 Exam Portal & Focus Sprint Modal
│   │   ├── RoadmapScreen.tsx      # Curriculum & DSA Progress Tracker
│   │   ├── PartnerHQScreen.tsx    # Partner Cheer, Notes & Reward System
│   │   ├── Sidebar.tsx            # Desktop Navigation Sidebar
│   │   ├── MobileNav.tsx          # Mobile Responsive Bottom Navigation
│   │   └── ...
│   ├── data/
│   │   └── curriculumData.ts      # Structured syllabus questions & roadmaps
│   ├── lib/
│   │   ├── firebase.ts            # Firebase initialization & authentication
│   │   └── firestoreService.ts    # Real-time Firestore sync & data listeners
│   ├── types.ts                   # Core TypeScript interfaces & types
│   ├── App.tsx                    # Root App component and tab router
│   ├── main.tsx                   # React DOM entry point
│   └── index.css                  # Tailwind styles and custom glassmorphism UI
├── server.ts                      # Express API & static server
├── vite.config.ts                 # Vite bundler configuration
└── package.json                   # Dependencies and scripts
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation
1. Clone the repository or navigate to the directory:
   ```bash
   cd /path/to/Adhd-support-
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running Locally
To launch the development server with live reload:
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:3000` (or the port specified in terminal).

### Production Build & Start
```bash
npm run build
npm run start
```

### Type Checking & Linting
```bash
npm run lint
```

---

## 📝 License
Private repository designed for personal study, focus optimization, and academic preparation.
