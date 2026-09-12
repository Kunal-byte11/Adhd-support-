# 🧠 ADHD Brain-Vault: Master Execution Memory & Progress Log

> **Purpose:** Permanent, zero-repetition memory store for Kunal. Every task, ADHD learning preference, physical analogy, bug catch, and completed milestone is stored here so context is never lost.

---

## 👤 Student Profile & ADHD Learning Protocol

* **Student:** Kunal
* **Golden Rule:** **Never memorize syntax. Master the physical mental model.**
* **Teaching Protocol (`confusion_compass.md`):**
  1. **Active Provocation:** Always prompt for predictions and physical intuition first. **NEVER** dump full code blocks or lectures upfront.
  2. **Detective Board Building:** Isolate bottlenecks into small, solvable questions.
  3. **Socratic Physical Guidance:** Use intuitive physical models (e.g. Measurement stamps, Whiteboard tallies, Bank deposits/withdrawals).
  4. **No Career Dread / Low Friction:** Keep sessions grounded, calm, and positive. Focus strictly on one puzzle at a time.

---

## 🗺️ Master NeetCode 150 Tracker (Arrays & Hashing)

| # | Problem Name | Status | Visual Mental Model | Core Pattern |
| :-: | :--- | :---: | :--- | :--- |
| **1** | **Contains Duplicate** (LC 217) | ✅ COMPLETED | **The Blank Notepad** | `seen = set()` |
| **2** | **Valid Anagram** (LC 242) | ✅ COMPLETED | **Bank Account Deposit & Withdrawal** | `count = {}` (+1 for $s$, -1 for $t$) |
| **3** | **Two Sum** (LC 1) | ✅ COMPLETED | **The Wanted Partner Lock & Key** | `prevMap = {val: idx}`, `diff = target - n` |
| **4** | **Group Anagrams** (LC 49) | ✅ COMPLETED | **The Labeled Buckets** | `defaultdict(list)` with sorted word key |
| **5** | **Top K Frequent Elements** (LC 347) | ✅ COMPLETED | **The Frequency Shelves (Bucket Sort)** | `freq = [[] for _ in range(n+1)]` + `reversed(freq)` |
| **6** | **String Encode & Decode** (LC 271) | ✅ COMPLETED | **The Cargo Container Measurement Stamp** | `len#word` framing + Two Pointers (`j = i`) |
| **7** | **Product of Array Except Self** (LC 238) | ⏳ **NEXT UP** | **Prefix & Suffix Balance Scales** | Prefix product pass $\times$ Suffix product pass |
| **8** | **Valid Sudoku** (LC 36) | 📋 Queued | **Rows, Columns, and 3x3 Block Grids** | Hash sets per row, col, and 3x3 square |
| **9** | **Longest Consecutive Sequence** (LC 128) | 📋 Queued | **Sequence Start Finder** | `if (num - 1) not in set:` find streak |

---

## 📌 Problem 6 Execution Summary & Solved Bugs

* **Problem:** LeetCode 271 / NeetCode 150 #6 — Encode and Decode Strings
* **Implementation:**
  - **Encode:** Prepend each string with `len(s) + "#" + s`.
  - **Decode:** Two pointers:
    - Finger `i` marks the start of the length number.
    - Finger `j = i` scans until `#`.
    - Length is `int(s[i:j])`.
    - Word payload is sliced via `s[j + 1 : j + 1 + length]`.
    - Finger `i` leaps past payload: `i = j + 1 + length`.

### 🚨 Critical Bug Trap: `j = 1` vs `j = i`
* **Error:** `ValueError: invalid literal for int() with base 10: ''` on line `length = int(s[i:j])`.
* **Why it happened:** Typing `j = 1` instead of `j = i`. On word 1 (`i=0`), `j=1` worked coincidentally. On word 2 (`i=6`), resetting `j=1` meant `j` was behind `i`. Slicing `s[6:1]` produced `""` (empty string), crashing `int("")`!
* **Rule:** **Always initialize `j = i`** at the beginning of each word cycle.

---

## 💻 Active Development & Port Registry

* **Main App (FocusFlow):** `/home/kunal-laptop/Desktop/Adhd-support-/`
  - **Dev Server:** `npm run dev` running live at **`http://localhost:3000`**
  - **Interactive Visualizer:** Accessible via the **Learning Visualizer** screen in FocusFlow.
  - **Contains:** All 6 NeetCode problems with interactive steppers, code in 4 languages, and the Mental Trigger Cheat Sheet.
