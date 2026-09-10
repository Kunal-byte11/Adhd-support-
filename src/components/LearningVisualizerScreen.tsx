import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  Code2,
  Cpu,
  Layers,
  Sparkles,
  Terminal,
  Check,
  Zap,
  Clock,
  HardDrive,
  Copy,
  BookOpen,
  ArrowDownRight,
  ArrowUpRight,
  Scale,
  Lightbulb,
  AlertTriangle,
  Quote,
  CheckCircle2,
  CheckCircle,
  XCircle,
  Sliders,
  Dices,
  Settings,
  Maximize2,
  Minimize2,
  StepForward,
  Keyboard,
  X,
} from 'lucide-react';

export interface VisualizerStep {
  lineNumber: number;
  explanation: string;
  variables: Record<string, any>;
  phase?: 'init' | 'deposit' | 'withdraw' | 'finish' | 'compare' | 'swap' | 'sorted';
  activeChar?: string;
  activeString?: 's' | 't';
  activeCharIndex?: number;
  highlightIndices?: number[];
  pointers?: Record<string, number>;
  bankBalances?: Record<string, number>;
  // For Bar Chart Visualizers (e.g. Bubble Sort, Array Sorting)
  chartBars?: number[];
  comparingIndices?: number[];
  swappedIndices?: number[];
  sortedIndices?: number[];
}

export interface ProblemDefinition {
  id: string;
  title: string;
  subtitle?: string;
  category: 'Stack & Hashing' | 'Math & Recursion' | 'Arrays & Pointers' | 'Searching & Sorting';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  timeComplexity: string;
  spaceComplexity: string;
  mentalTrigger?: string;
  interviewFlex?: string;
  edgeCases?: string[];
  visualModelDescription?: string;
  defaultInput: Record<string, any>;
  inputSchema: { key: string; label: string; type: 'number' | 'numberArray' | 'string'; placeholder?: string }[];
  codeSnippets: {
    python: string;
    cpp: string;
    javascript: string;
    java: string;
  };
  generateSteps: (inputs: Record<string, any>) => { steps: VisualizerStep[]; result: any };
}

export const PROBLEMS_DATA: ProblemDefinition[] = [
  {
    id: 'valid-anagram',
    title: 'Valid Anagram',
    subtitle: 'LeetCode 242 • NeetCode 150 #2',
    category: 'Stack & Hashing',
    difficulty: 'Easy',
    description: "Determine if string 't' is an exact rearrangement of string 's' (exact same characters in the exact same frequencies).",
    timeComplexity: 'O(N) — Single pass through strings of length N',
    spaceComplexity: 'O(1) — Dictionary never exceeds 26 lowercase English letters',
    mentalTrigger: 'Comparing character frequencies / counting occurrences -> USE A HASH MAP (dict).',
    interviewFlex: '"I used a Hash Map for O(N) linear time. If the interviewer asks for a one-liner or zero extra hash map structures, we could sort both strings and compare (return sorted(s) == sorted(t)), but that trades speed, slowing time to O(N log N)."',
    edgeCases: [
      'len(s) != len(t) -> Impossible! Return False immediately.',
      'Single letter strings: "a" & "a" -> Returns True.',
      'Overdraft: String t tries to withdraw a letter with 0 balance (or not in dict) -> Return False.',
    ],
    visualModelDescription: "The Bank Account Model: String 's' DEPOSITS letters (+1 to count). String 't' WITHDRAWS letters (-1 from count). If all letters balance out to 0 -> True. If any withdrawal overdrafts -> False.",
    defaultInput: { s: 'anagram', t: 'nagaram' },
    inputSchema: [
      { key: 's', label: 'String s (Deposits)', type: 'string', placeholder: 'anagram' },
      { key: 't', label: 'String t (Withdraws)', type: 'string', placeholder: 'nagaram' },
    ],
    codeSnippets: {
      python: `class Solution:
    def isAnagram(self, s: str, t: str) -> bool:
        if len(s) != len(t):
            return False

        count = {}

        # Phase 1: Deposits from s
        for char in s:
            count[char] = count.get(char, 0) + 1

        # Phase 2: Withdrawals from t
        for char in t:
            if char not in count or count[char] == 0:
                return False
            count[char] -= 1

        return True`,
      cpp: `class Solution {
public:
    bool isAnagram(string s, string t) {
        if (s.length() != t.length()) return false;

        unordered_map<char, int> count;

        // Phase 1: Deposits from s
        for (char c : s) {
            count[c]++;
        }

        // Phase 2: Withdrawals from t
        for (char c : t) {
            if (count.find(c) == count.end() || count[c] == 0) {
                return false;
            }
            count[c]--;
        }

        return true;
    }
};`,
      javascript: `var isAnagram = function(s, t) {
    if (s.length !== t.length) return false;

    const count = {};

    // Phase 1: Deposits from s
    for (let char of s) {
        count[char] = (count[char] || 0) + 1;
    }

    // Phase 2: Withdrawals from t
    for (let char of t) {
        if (!count[char]) {
            return false;
        }
        count[char]--;
    }

    return true;
};`,
      java: `class Solution {
    public boolean isAnagram(String s, String t) {
        if (s.length() != t.length()) return false;

        Map<Character, Integer> count = new HashMap<>();

        // Phase 1: Deposits from s
        for (char c : s.toCharArray()) {
            count.put(c, count.getOrDefault(c, 0) + 1);
        }

        // Phase 2: Withdrawals from t
        for (char c : t.toCharArray()) {
            if (!count.containsKey(c) || count.get(c) == 0) {
                return false;
            }
            count.put(c, count.get(c) - 1);
        }

        return true;
    }
}`,
    },
    generateSteps: (inputs) => {
      const s = String(inputs.s ?? 'anagram').trim().toLowerCase();
      const t = String(inputs.t ?? 'nagaram').trim().toLowerCase();
      const steps: VisualizerStep[] = [];

      // Step 1: Function entry
      steps.push({
        lineNumber: 2,
        explanation: `Start isAnagram with s = "${s}" and t = "${t}".`,
        variables: { s: `"${s}"`, t: `"${t}"`, 'len(s)': s.length, 'len(t)': t.length },
        phase: 'init',
        bankBalances: {},
      });

      // Step 2: Length check
      steps.push({
        lineNumber: 3,
        explanation: `Check edge case: len(s) [${s.length}] != len(t) [${t.length}].`,
        variables: { 'len(s)': s.length, 'len(t)': t.length, match: s.length === t.length },
        phase: 'init',
        bankBalances: {},
      });

      if (s.length !== t.length) {
        steps.push({
          lineNumber: 4,
          explanation: `Length mismatch (${s.length} != ${t.length})! Impossible to be an anagram. Return False immediately. ❌`,
          variables: { result: false },
          phase: 'finish',
          bankBalances: {},
        });
        return { steps, result: false };
      }

      // Step 3: Initialize hash map
      const count: Record<string, number> = {};
      steps.push({
        lineNumber: 6,
        explanation: `Initialize empty hash map count = {} (Opening the Bank Account).`,
        variables: { count: '{}' },
        phase: 'init',
        bankBalances: {},
      });

      // Phase 1: Deposits from s
      for (let i = 0; i < s.length; i++) {
        const char = s[i];
        steps.push({
          lineNumber: 9,
          explanation: `[Phase 1 Deposit] Iterating string s at index ${i}: char = '${char}'.`,
          variables: { char: `'${char}'`, index: i, count: JSON.stringify(count) },
          phase: 'deposit',
          activeString: 's',
          activeChar: char,
          activeCharIndex: i,
          bankBalances: { ...count },
        });

        const prevCount = count[char] || 0;
        count[char] = prevCount + 1;

        steps.push({
          lineNumber: 10,
          explanation: `[Deposit +1] Deposited 1 for '${char}'. Balance for '${char}' is now ${count[char]}.`,
          variables: { char: `'${char}'`, count: JSON.stringify(count) },
          phase: 'deposit',
          activeString: 's',
          activeChar: char,
          activeCharIndex: i,
          bankBalances: { ...count },
        });
      }

      // Phase 2: Withdrawals from t
      for (let j = 0; j < t.length; j++) {
        const char = t[j];
        steps.push({
          lineNumber: 13,
          explanation: `[Phase 2 Withdrawal] Iterating string t at index ${j}: char = '${char}'.`,
          variables: { char: `'${char}'`, index: j, count: JSON.stringify(count) },
          phase: 'withdraw',
          activeString: 't',
          activeChar: char,
          activeCharIndex: j,
          bankBalances: { ...count },
        });

        steps.push({
          lineNumber: 14,
          explanation: `Check if '${char}' is in bank account with balance > 0 (Current balance: ${count[char] || 0}).`,
          variables: { char: `'${char}'`, currentBalance: count[char] || 0 },
          phase: 'withdraw',
          activeString: 't',
          activeChar: char,
          activeCharIndex: j,
          bankBalances: { ...count },
        });

        if (!count[char] || count[char] === 0) {
          steps.push({
            lineNumber: 15,
            explanation: `Overdraft error! Character '${char}' has 0 balance or is missing from bank. String t is NOT an anagram. Return False. ❌`,
            variables: { char: `'${char}'`, error: 'Overdraft / Missing char', result: false },
            phase: 'finish',
            activeString: 't',
            activeChar: char,
            activeCharIndex: j,
            bankBalances: { ...count },
          });
          return { steps, result: false };
        }

        count[char] -= 1;
        steps.push({
          lineNumber: 16,
          explanation: `[Withdraw -1] Successfully withdrew 1 for '${char}'. Remaining balance for '${char}': ${count[char]}.`,
          variables: { char: `'${char}'`, remainingBalance: count[char], count: JSON.stringify(count) },
          phase: 'withdraw',
          activeString: 't',
          activeChar: char,
          activeCharIndex: j,
          bankBalances: { ...count },
        });
      }

      // Step Final: Complete
      steps.push({
        lineNumber: 18,
        explanation: `All withdrawals matched perfectly with zero balance remaining! Return True (Valid Anagram 🎉).`,
        variables: { result: true, finalLedger: JSON.stringify(count) },
        phase: 'finish',
        bankBalances: { ...count },
      });

      return { steps, result: true };
    },
  },
  {
    id: 'two-sum',
    title: 'Two Sum',
    subtitle: 'LeetCode 1 • NeetCode 150 #1',
    category: 'Stack & Hashing',
    difficulty: 'Easy',
    description: 'Find two indices in an array such that their numbers add up to a target sum.',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(N)',
    mentalTrigger: 'Find complementary pair in array -> Store elements in Hash Map {val: index}.',
    defaultInput: { nums: '2, 7, 11, 15', target: 9 },
    inputSchema: [
      { key: 'nums', label: 'Array (comma-separated)', type: 'numberArray', placeholder: '2, 7, 11, 15' },
      { key: 'target', label: 'Target Sum', type: 'number', placeholder: '9' },
    ],
    codeSnippets: {
      python: `def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        diff = target - num
        if diff in seen:
            return [seen[diff], i]
        seen[num] = i
    return []`,
      cpp: `vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> seen;
    for (int i = 0; i < nums.size(); i++) {
        int diff = target - nums[i];
        if (seen.count(diff)) {
            return {seen[diff], i};
        }
        seen[nums[i]] = i;
    }
    return {};
}`,
      javascript: `function twoSum(nums, target) {
    const seen = new Map();
    for (let i = 0; i < nums.length; i++) {
        const diff = target - nums[i];
        if (seen.has(diff)) {
            return [seen.get(diff), i];
        }
        seen.set(nums[i], i);
    }
    return [];
}`,
      java: `public int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> seen = new HashMap<>();
    for (int i = 0; i < nums.length; i++) {
        int diff = target - nums[i];
        if (seen.containsKey(diff)) {
            return new int[]{seen.get(diff), i};
        }
        seen.put(nums[i], i);
    }
    return new int[]{};
}`,
    },
    generateSteps: (inputs) => {
      const rawNums = typeof inputs.nums === 'string'
        ? inputs.nums.split(',').map((s: string) => parseInt(s.trim(), 10)).filter((n: number) => !isNaN(n))
        : [2, 7, 11, 15];
      const nums = rawNums.length > 0 ? rawNums : [2, 7, 11, 15];
      const target = parseInt(inputs.target, 10) || 9;
      const steps: VisualizerStep[] = [];

      steps.push({
        lineNumber: 1,
        explanation: `Start two_sum with nums = [${nums.join(', ')}] and target = ${target}.`,
        variables: { nums: `[${nums.join(', ')}]`, target, seen: '{}' },
      });

      const seen: Record<number, number> = {};
      steps.push({
        lineNumber: 2,
        explanation: `Initialize empty hash map 'seen' to store { value: index }.`,
        variables: { nums: `[${nums.join(', ')}]`, target, seen: '{}' },
      });

      for (let i = 0; i < nums.length; i++) {
        const num = nums[i];
        const diff = target - num;

        steps.push({
          lineNumber: 3,
          explanation: `Inspect index i = ${i}, value num = ${num}.`,
          variables: { i, num, target, seen: JSON.stringify(seen) },
          pointers: { i },
          highlightIndices: [i],
        });

        steps.push({
          lineNumber: 4,
          explanation: `Calculate complement diff = target - num (${target} - ${num} = ${diff}).`,
          variables: { i, num, diff, target, seen: JSON.stringify(seen) },
          pointers: { i },
          highlightIndices: [i],
        });

        if (seen[diff] !== undefined) {
          const matchIdx = seen[diff];
          steps.push({
            lineNumber: 5,
            explanation: `Match found! Complement ${diff} is already in 'seen' at index ${matchIdx}.`,
            variables: { i, num, diff, matchIndex: matchIdx, seen: JSON.stringify(seen) },
            pointers: { i, match: matchIdx },
            highlightIndices: [matchIdx, i],
          });
          steps.push({
            lineNumber: 6,
            explanation: `Return pair indices: [${matchIdx}, ${i}] (${nums[matchIdx]} + ${num} = ${target}). 🎉`,
            variables: { result: `[${matchIdx}, ${i}]`, sum: `${nums[matchIdx]} + ${num} = ${target}` },
            pointers: { i, match: matchIdx },
            highlightIndices: [matchIdx, i],
          });
          return { steps, result: [matchIdx, i] };
        } else {
          steps.push({
            lineNumber: 5,
            explanation: `Complement ${diff} not found in map yet.`,
            variables: { i, num, diff, seen: JSON.stringify(seen) },
            pointers: { i },
            highlightIndices: [i],
          });

          seen[num] = i;
          steps.push({
            lineNumber: 7,
            explanation: `Store current number in map: seen[${num}] = ${i}.`,
            variables: { i, num, seen: JSON.stringify(seen) },
            pointers: { i },
            highlightIndices: [i],
          });
        }
      }

      steps.push({
        lineNumber: 8,
        explanation: `No two numbers sum up to ${target}. Return [].`,
        variables: { result: '[]' },
      });
      return { steps, result: [] };
    },
  },
  {
    id: 'factorial',
    title: 'Factorial of a Number',
    subtitle: 'Iterative Running Accumulator',
    category: 'Math & Recursion',
    difficulty: 'Easy',
    description: 'Calculate n! (n factorial) which is the product of all positive integers less than or equal to n.',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)',
    mentalTrigger: 'Iterative running accumulator / recursive call stack.',
    defaultInput: { n: 5 },
    inputSchema: [{ key: 'n', label: 'Number (n)', type: 'number', placeholder: 'e.g. 5' }],
    codeSnippets: {
      python: `def factorial(n):
    if n < 0:
        return None
    fact = 1
    for i in range(1, n + 1):
        fact = fact * i
    return fact`,
      cpp: `long long factorial(int n) {
    if (n < 0) return -1;
    long long fact = 1;
    for (int i = 1; i <= n; i++) {
        fact = fact * i;
    }
    return fact;
}`,
      javascript: `function factorial(n) {
    if (n < 0) return null;
    let fact = 1;
    for (let i = 1; i <= n; i++) {
        fact = fact * i;
    }
    return fact;
}`,
      java: `public static long factorial(int n) {
    if (n < 0) return -1;
    long fact = 1;
    for (int i = 1; i <= n; i++) {
        fact = fact * i;
    }
    return fact;
}`,
    },
    generateSteps: (inputs) => {
      const n = Math.min(Math.max(0, parseInt(inputs.n, 10) || 0), 12);
      const steps: VisualizerStep[] = [];

      steps.push({
        lineNumber: 1,
        explanation: `Start function factorial(n = ${n}).`,
        variables: { n, fact: 'undefined', i: 'undefined' },
      });

      if (n === 0) {
        steps.push({
          lineNumber: 4,
          explanation: `0! is defined as 1. Initialize fact = 1.`,
          variables: { n, fact: 1, i: 'none' },
        });
        steps.push({
          lineNumber: 7,
          explanation: `Return 1. Factorial of 0 is 1.`,
          variables: { n, fact: 1, result: 1 },
        });
        return { steps, result: 1 };
      }

      let fact = 1;
      steps.push({
        lineNumber: 4,
        explanation: `Initialize fact = 1 to hold the running product.`,
        variables: { n, fact, i: 'undefined' },
      });

      for (let i = 1; i <= n; i++) {
        steps.push({
          lineNumber: 5,
          explanation: `Loop iteration: i = ${i} (checking i <= ${n}).`,
          variables: { n, fact, i },
        });

        const prevFact = fact;
        fact = fact * i;
        steps.push({
          lineNumber: 6,
          explanation: `Multiply fact (${prevFact}) by i (${i}): ${prevFact} × ${i} = ${fact}.`,
          variables: { n, fact, i, calculation: `${prevFact} * ${i} = ${fact}` },
        });
      }

      steps.push({
        lineNumber: 7,
        explanation: `Loop completed! Return final factorial: ${fact}.`,
        variables: { n, fact, result: fact },
      });

      return { steps, result: fact };
    },
  },
  {
    id: 'binary-search',
    title: 'Binary Search',
    subtitle: 'Logarithmic Divide & Conquer',
    category: 'Searching & Sorting',
    difficulty: 'Easy',
    description: 'Find the index of a target element in a sorted array by repeatedly halving the search space.',
    timeComplexity: 'O(log N)',
    spaceComplexity: 'O(1)',
    mentalTrigger: 'Sorted array search -> Binary Search (Divide and Conquer with low, mid, high).',
    defaultInput: { nums: '1, 3, 5, 7, 9, 11, 13, 15', target: 7 },
    inputSchema: [
      { key: 'nums', label: 'Sorted Array (comma-separated)', type: 'numberArray', placeholder: '1, 3, 5, 7, 9, 11, 13, 15' },
      { key: 'target', label: 'Target Value', type: 'number', placeholder: '7' },
    ],
    codeSnippets: {
      python: `def binary_search(nums, target):
    low = 0
    high = len(nums) - 1
    while low <= high:
        mid = (low + high) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1`,
      cpp: `int binarySearch(vector<int>& nums, int target) {
    int low = 0, high = nums.size() - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (nums[mid] == target) return mid;
        else if (nums[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return -1;
}`,
      javascript: `function binarySearch(nums, target) {
    let low = 0, high = nums.length - 1;
    while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        if (nums[mid] === target) return mid;
        else if (nums[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return -1;
}`,
      java: `public int binarySearch(int[] nums, int target) {
    int low = 0, high = nums.length - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (nums[mid] == target) return mid;
        else if (nums[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return -1;
}`,
    },
    generateSteps: (inputs) => {
      const raw = typeof inputs.nums === 'string'
        ? inputs.nums.split(',').map((s: string) => parseInt(s.trim(), 10)).filter((n: number) => !isNaN(n))
        : [1, 3, 5, 7, 9, 11, 13, 15];
      const nums = raw.sort((a, b) => a - b);
      const target = parseInt(inputs.target, 10) || 7;
      const steps: VisualizerStep[] = [];

      steps.push({
        lineNumber: 1,
        explanation: `Start binary_search on sorted array [${nums.join(', ')}] for target ${target}.`,
        variables: { nums: `[${nums.join(', ')}]`, target, low: 0, high: nums.length - 1 },
      });

      let low = 0;
      let high = nums.length - 1;

      steps.push({
        lineNumber: 2,
        explanation: `Initialize low pointer = 0 (nums[0] = ${nums[0]}).`,
        variables: { low, high, target },
        pointers: { low, high },
      });

      steps.push({
        lineNumber: 3,
        explanation: `Initialize high pointer = ${high} (nums[${high}] = ${nums[high]}).`,
        variables: { low, high, target },
        pointers: { low, high },
      });

      while (low <= high) {
        const mid = Math.floor((low + high) / 2);

        steps.push({
          lineNumber: 4,
          explanation: `Condition check: low (${low}) <= high (${high}). Search space is valid.`,
          variables: { low, high, mid, target },
          pointers: { low, high },
          highlightIndices: Array.from({ length: high - low + 1 }, (_, i) => low + i),
        });

        steps.push({
          lineNumber: 5,
          explanation: `Calculate mid = (${low} + ${high}) // 2 = ${mid}. Inspect nums[${mid}] = ${nums[mid]}.`,
          variables: { low, high, mid, midVal: nums[mid], target },
          pointers: { low, mid, high },
          highlightIndices: [mid],
        });

        if (nums[mid] === target) {
          steps.push({
            lineNumber: 6,
            explanation: `nums[mid] (${nums[mid]}) matches target (${target})! 🎉`,
            variables: { mid, val: nums[mid], target },
            pointers: { mid },
            highlightIndices: [mid],
          });
          steps.push({
            lineNumber: 7,
            explanation: `Return found index: ${mid}.`,
            variables: { result: mid },
            pointers: { mid },
            highlightIndices: [mid],
          });
          return { steps, result: mid };
        } else if (nums[mid] < target) {
          steps.push({
            lineNumber: 8,
            explanation: `nums[${mid}] (${nums[mid]}) < target (${target}). Target must be in the right half.`,
            variables: { mid, midVal: nums[mid], target, action: 'Move low to mid + 1' },
            pointers: { low, mid, high },
            highlightIndices: [mid],
          });
          low = mid + 1;
          steps.push({
            lineNumber: 9,
            explanation: `Set low = ${mid} + 1 = ${low}.`,
            variables: { low, high, target },
            pointers: { low, high },
          });
        } else {
          steps.push({
            lineNumber: 10,
            explanation: `nums[${mid}] (${nums[mid]}) > target (${target}). Target must be in the left half.`,
            variables: { mid, midVal: nums[mid], target, action: 'Move high to mid - 1' },
            pointers: { low, mid, high },
            highlightIndices: [mid],
          });
          high = mid - 1;
          steps.push({
            lineNumber: 11,
            explanation: `Set high = ${mid} - 1 = ${high}.`,
            variables: { low, high, target },
            pointers: { low, high },
          });
        }
      }

      steps.push({
        lineNumber: 12,
        explanation: `low > high. Target ${target} was not found in array. Return -1.`,
        variables: { result: -1 },
      });
      return { steps, result: -1 };
    },
  },
  {
    id: 'bubble-sort',
    title: 'Bubble Sort',
    subtitle: 'Free Algorithm Visualizer • VisualizedDSA Style',
    category: 'Searching & Sorting',
    difficulty: 'Easy',
    description: 'Repeatedly step through the list, compare adjacent elements and swap them if they are in the wrong order.',
    timeComplexity: 'O(N²) — Worst & Average Case',
    spaceComplexity: 'O(1) — In-Place sorting algorithm',
    mentalTrigger: 'Adjacent element comparisons & bubbling largest element to end -> Bubble Sort.',
    interviewFlex: '"Bubble Sort is an O(N²) quadratic sorting algorithm. While not optimal for large datasets, it is stable, requires O(1) auxiliary space, and can be optimized with an early-exit swapped flag to run in O(N) best case on nearly sorted data."',
    edgeCases: [
      'Already sorted array: Optimized with swapped flag finishes in 1 pass O(N).',
      'Reverse sorted array: Worst case O(N²) comparisons and swaps.',
      'Array with duplicates: Maintains relative stability.',
    ],
    visualModelDescription: 'Bar Chart Visualizer: Grey = Unsorted, Red = Swapping/Comparing, Green = Sorted final positions.',
    defaultInput: { arr: '4, 10, 8, 12, 7, 17, 6, 9, 5, 3, 2, 1, 11, 18, 13, 16, 15, 14, 19, 20' },
    inputSchema: [
      { key: 'arr', label: 'Array elements (comma-separated)', type: 'numberArray', placeholder: '4, 10, 8, 12, 7, 17, 6, 9, 5, 3, 2, 1, 11, 18, 13, 16, 15, 14, 19, 20' },
    ],
    codeSnippets: {
      python: `def bubble_sort(arr: list[int]) -> None:
    n = len(arr)
    for i in range(n - 1):
        for j in range(n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]`,
      cpp: `void bubbleSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                swap(arr[j], arr[j + 1]);
            }
        }
    }
}`,
      javascript: `function bubbleSort(arr) {
    const n = arr.length;
    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            }
        }
    }
}`,
      java: `public void bubbleSort(int[] arr) {
    int n = arr.length;
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
}`,
    },
    generateSteps: (inputs) => {
      const raw = typeof inputs.arr === 'string'
        ? inputs.arr.split(',').map((s: string) => parseInt(s.trim(), 10)).filter((n: number) => !isNaN(n))
        : [4, 10, 8, 12, 7, 17, 6, 9, 5, 3, 2, 1, 11, 18, 13, 16, 15, 14, 19, 20];
      const arr = [...raw];
      const n = arr.length;
      const steps: VisualizerStep[] = [];
      const sortedSet = new Set<number>();

      steps.push({
        lineNumber: 1,
        explanation: `Start bubble_sort on ${n} elements: [${arr.join(', ')}].`,
        variables: { n, i: 'init', j: 'init' },
        phase: 'init',
        chartBars: [...arr],
        sortedIndices: [],
      });

      steps.push({
        lineNumber: 2,
        explanation: `Calculate array length n = ${n}.`,
        variables: { n },
        phase: 'init',
        chartBars: [...arr],
        sortedIndices: [],
      });

      for (let i = 0; i < n - 1; i++) {
        steps.push({
          lineNumber: 3,
          explanation: `Outer loop iteration i = ${i} (Pass ${i + 1} of ${n - 1}).`,
          variables: { i, n, 'n-i-1': n - i - 1 },
          phase: 'compare',
          chartBars: [...arr],
          sortedIndices: Array.from(sortedSet),
        });

        for (let j = 0; j < n - i - 1; j++) {
          steps.push({
            lineNumber: 4,
            explanation: `Inner loop j = ${j}. Comparing arr[${j}] (${arr[j]}) and arr[${j + 1}] (${arr[j + 1]}).`,
            variables: { i, j, 'arr[j]': arr[j], 'arr[j+1]': arr[j + 1] },
            phase: 'compare',
            chartBars: [...arr],
            comparingIndices: [j, j + 1],
            sortedIndices: Array.from(sortedSet),
          });

          steps.push({
            lineNumber: 5,
            explanation: `Condition check: if ${arr[j]} > ${arr[j + 1]} -> ${arr[j] > arr[j + 1] ? 'True (Needs Swap)' : 'False (In order)'}.`,
            variables: { i, j, 'arr[j] > arr[j+1]': arr[j] > arr[j + 1] },
            phase: 'compare',
            chartBars: [...arr],
            comparingIndices: [j, j + 1],
            sortedIndices: Array.from(sortedSet),
          });

          if (arr[j] > arr[j + 1]) {
            const valA = arr[j];
            const valB = arr[j + 1];
            // Swap
            arr[j] = valB;
            arr[j + 1] = valA;

            steps.push({
              lineNumber: 6,
              explanation: `Swapped ${valA} and ${valB}.`,
              variables: { i, j, swapped: `${valA} ↔ ${valB}` },
              phase: 'swap',
              chartBars: [...arr],
              swappedIndices: [j, j + 1],
              sortedIndices: Array.from(sortedSet),
            });
          }
        }

        // Element at n - i - 1 is now locked in sorted position
        sortedSet.add(n - i - 1);
        steps.push({
          lineNumber: 3,
          explanation: `Pass ${i + 1} complete. Element ${arr[n - i - 1]} at index ${n - i - 1} is now locked in sorted position.`,
          variables: { i, lockedIndex: n - i - 1, value: arr[n - i - 1] },
          phase: 'sorted',
          chartBars: [...arr],
          sortedIndices: Array.from(sortedSet),
        });
      }

      // Add index 0 as sorted too
      sortedSet.add(0);
      steps.push({
        lineNumber: 6,
        explanation: `Sorting completed! All ${n} elements are in ascending order. 🎉`,
        variables: { result: 'Sorted', array: `[${arr.join(', ')}]` },
        phase: 'finish',
        chartBars: [...arr],
        sortedIndices: Array.from({ length: n }, (_, idx) => idx),
      });

      return { steps, result: arr };
    },
  },
];

interface LearningVisualizerScreenProps {
  isSidebarCollapsed?: boolean;
}

export const LearningVisualizerScreen: React.FC<LearningVisualizerScreenProps> = ({
  isSidebarCollapsed = false,
}) => {
  const [selectedProblemId, setSelectedProblemId] = useState<string>('bubble-sort');
  const [activeLanguage, setActiveLanguage] = useState<'python' | 'cpp' | 'javascript' | 'java'>('python');
  const [activeTab, setActiveTab] = useState<'visualizer' | 'blueprint'>('visualizer');

  const currentProblem = useMemo(() => {
    return PROBLEMS_DATA.find((p) => p.id === selectedProblemId) || PROBLEMS_DATA[0];
  }, [selectedProblemId]);

  // Input states
  const [problemInputs, setProblemInputs] = useState<Record<string, any>>(currentProblem.defaultInput);

  // Sync inputs on problem change
  useEffect(() => {
    setProblemInputs(currentProblem.defaultInput);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }, [selectedProblemId]);

  // Execution steps generated
  const executionData = useMemo(() => {
    try {
      return currentProblem.generateSteps(problemInputs);
    } catch (e) {
      return { steps: [], result: null };
    }
  }, [currentProblem, problemInputs]);

  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeedMs, setPlaybackSpeedMs] = useState<number>(1200);

  const currentStep: VisualizerStep | undefined = executionData.steps[currentStepIndex];

  // Auto-play timer
  useEffect(() => {
    let timer: any = null;
    if (isPlaying) {
      if (currentStepIndex < executionData.steps.length - 1) {
        timer = setTimeout(() => {
          setCurrentStepIndex((prev) => prev + 1);
        }, playbackSpeedMs);
      } else {
        setIsPlaying(false);
      }
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentStepIndex, executionData.steps.length, playbackSpeedMs]);

  // Split lines of code for active line highlight
  const codeLines = useMemo(() => {
    return currentProblem.codeSnippets[activeLanguage].split('\n');
  }, [currentProblem, activeLanguage]);

  // Keyboard shortcut listener (Space = Play/Pause, R = Reset, ArrowRight = Step)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept when typing in an input or textarea
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        setIsPlaying((prev) => !prev);
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        setIsPlaying(false);
        setCurrentStepIndex(0);
      } else if (e.key === 'ArrowRight' || e.key === '.') {
        e.preventDefault();
        setIsPlaying(false);
        setCurrentStepIndex((prev) => Math.min(executionData.steps.length - 1, prev + 1));
      } else if (e.key === 'ArrowLeft' || e.key === ',') {
        e.preventDefault();
        setIsPlaying(false);
        setCurrentStepIndex((prev) => Math.max(0, prev - 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [executionData.steps.length]);

  // Custom question prompt / ask modal
  const [customQuestionText, setCustomQuestionText] = useState<string>('');
  const [showCustomModal, setShowCustomModal] = useState<boolean>(false);

  return (
    <div className={`flex-1 h-full max-h-screen bg-[#0b0f14] text-slate-100 p-2.5 sm:p-3 flex flex-col gap-2 select-none font-sans overflow-hidden transition-all duration-300 ${
      isSidebarCollapsed ? 'md:pl-20' : 'md:pl-68'
    }`}>
      {/* ================= SLEEK COMPACT TOP HEADER BAR ================= */}
      <div className="shrink-0 h-13 bg-[#0e1319]/90 backdrop-blur-xl border border-slate-800/90 rounded-2xl px-3.5 flex items-center justify-between gap-3 shadow-2xl">
        {/* Left: Problem Title, Tag & Difficulty */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8.5 h-8.5 rounded-xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/25">
            <Cpu className="w-4.5 h-4.5 stroke-[2.5]" />
          </div>
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-sm sm:text-base font-black text-white font-mono tracking-tight truncate">
              {currentProblem.title}
            </span>
            <span className="hidden sm:inline-flex text-[10px] px-2.5 py-0.5 rounded-full font-bold font-mono bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-xs">
              {currentProblem.difficulty}
            </span>
            <span className="hidden md:inline-flex text-[10px] px-2.5 py-0.5 rounded-full font-bold font-mono bg-slate-800/90 text-slate-300 border border-slate-700/80">
              {currentProblem.timeComplexity.split('—')[0].trim()}
            </span>
          </div>
        </div>

        {/* Center: Problem Selector Dropdown & Tab Switcher */}
        <div className="flex items-center gap-2.5">
          {/* Problem Selector Dropdown */}
          <div className="relative">
            <select
              value={selectedProblemId}
              onChange={(e) => {
                setSelectedProblemId(e.target.value);
                setCurrentStepIndex(0);
                setIsPlaying(false);
              }}
              className="bg-[#141b24] hover:bg-[#1a2330] border border-slate-700/90 hover:border-emerald-500/50 text-xs text-white font-bold rounded-xl px-3 py-1.5 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/40 cursor-pointer shadow-md transition-all font-mono"
            >
              {PROBLEMS_DATA.map((p) => (
                <option key={p.id} value={p.id} className="bg-[#121820] text-white">
                  {p.title}
                </option>
              ))}
            </select>
          </div>

          {/* Segmented View Toggle (Visualizer vs Blueprint) */}
          <div className="hidden sm:flex items-center bg-[#090d12] p-1 rounded-xl border border-slate-800/90 shadow-inner">
            <button
              onClick={() => setActiveTab('visualizer')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'visualizer'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-500/20 font-extrabold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Visualizer</span>
            </button>
            <button
              onClick={() => setActiveTab('blueprint')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'blueprint'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-md shadow-amber-500/20 font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Blueprint</span>
            </button>
          </div>
        </div>

        {/* Right: Language Tabs & Ask Custom Question */}
        <div className="flex items-center gap-2.5">
          {/* Language Selector */}
          <div className="flex items-center bg-[#090d12] p-1 rounded-xl border border-slate-800/90">
            {(['python', 'cpp', 'javascript', 'java'] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => setActiveLanguage(lang)}
                className={`px-2.5 py-0.5 rounded-lg text-[11px] font-mono transition-all cursor-pointer ${
                  activeLanguage === lang
                    ? 'bg-emerald-500 text-slate-950 font-black shadow-md shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-white font-semibold'
                }`}
              >
                {lang === 'python' ? 'Python' : lang === 'cpp' ? 'C++' : lang === 'javascript' ? 'JS' : 'Java'}
              </button>
            ))}
          </div>

          {/* Ask Custom Question Button */}
          <button
            onClick={() => setShowCustomModal(true)}
            className="px-3.5 py-1.5 rounded-xl text-xs font-black font-mono bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 flex items-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-500/25 transition-all hover:scale-102"
            title="Ask or input custom algorithm problem"
          >
            <Sparkles className="w-3.5 h-3.5 fill-current" />
            <span className="hidden lg:inline">Custom</span>
          </button>
        </div>
      </div>

      {/* ================= BLUEPRINT & LOGIC VIEW (Scrolls internally if tall) ================= */}
      {activeTab === 'blueprint' && (
        <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-2 gap-3 overflow-y-auto p-0.5 animate-in fade-in duration-200">
          {/* LEFT PAGE: The Blueprint (Logic & Visuals) */}
          <div className="bg-[#121820] border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl space-y-4 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-amber-400" />
                  LEFT PAGE: The Blueprint
                </span>
                <span className="text-[10px] font-mono bg-amber-500/20 text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-500/40 font-bold">
                  Logic &amp; Visual Model
                </span>
              </div>

              <div>
                <h3 className="text-[11px] font-mono uppercase text-slate-400 font-bold mb-0.5">Problem Definition</h3>
                <p className="text-lg font-bold text-white tracking-tight">{currentProblem.title}</p>
              </div>

              <div className="bg-[#161f28] border border-slate-700/80 rounded-xl p-3 space-y-1 shadow-sm">
                <h4 className="text-[11px] font-mono font-bold text-emerald-400 uppercase tracking-wide flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  The Goal
                </h4>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                  {currentProblem.description}
                </p>
              </div>

              {currentProblem.edgeCases && (
                <div className="bg-[#1a1714] border border-amber-500/40 rounded-xl p-3 space-y-1.5 shadow-sm">
                  <h4 className="text-[11px] font-mono font-bold text-amber-400 uppercase tracking-wide flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    Edge Cases to Watch
                  </h4>
                  <ul className="space-y-1 text-xs text-amber-200 font-mono">
                    {currentProblem.edgeCases.map((ec, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-amber-400 font-bold">•</span>
                        <span>{ec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {currentProblem.visualModelDescription && (
                <div className="bg-[#0f1f1a] border border-emerald-500/40 rounded-xl p-3 space-y-1.5 shadow-sm">
                  <h4 className="text-[11px] font-mono font-bold text-emerald-300 uppercase tracking-wide flex items-center gap-1.5">
                    <Scale className="w-3.5 h-3.5 text-emerald-400" />
                    The Visual Model (Whiteboard &amp; Representation)
                  </h4>
                  <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed font-sans font-medium">
                    {currentProblem.visualModelDescription}
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={() => setActiveTab('visualizer')}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition shadow-md"
            >
              <span>Switch to Live Code Execution</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* RIGHT PAGE: The Execution (Code & Complexity) */}
          <div className="bg-[#121820] border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl space-y-4 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                  RIGHT PAGE: The Execution
                </span>
                <span className="text-[10px] font-mono bg-indigo-500/20 text-indigo-300 px-2.5 py-0.5 rounded-full border border-indigo-500/40 font-bold">
                  Code &amp; Complexity
                </span>
              </div>

              {/* Mental Trigger */}
              {currentProblem.mentalTrigger && (
                <div className="bg-[#141728] border border-indigo-500/40 rounded-xl p-3 space-y-1 shadow-sm">
                  <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-indigo-300 uppercase tracking-wide">
                    <Lightbulb className="w-3.5 h-3.5 text-indigo-400" />
                    <span>THE MENTAL TRIGGER</span>
                  </div>
                  <p className="text-xs sm:text-sm text-indigo-100 font-mono font-bold leading-relaxed">
                    {currentProblem.mentalTrigger}
                  </p>
                </div>
              )}

              {/* Big-O Stats */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="bg-[#161f28] p-3 rounded-xl border border-slate-700/80 shadow-sm">
                  <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-mono mb-0.5 font-semibold">
                    <Clock className="w-3 h-3 text-emerald-400" />
                    <span>Time Complexity</span>
                  </div>
                  <span className="text-xs sm:text-sm font-mono font-bold text-white block">
                    {currentProblem.timeComplexity}
                  </span>
                </div>

                <div className="bg-[#161f28] p-3 rounded-xl border border-slate-700/80 shadow-sm">
                  <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-mono mb-0.5 font-semibold">
                    <HardDrive className="w-3 h-3 text-indigo-400" />
                    <span>Space Complexity</span>
                  </div>
                  <span className="text-xs sm:text-sm font-mono font-bold text-white block">
                    {currentProblem.spaceComplexity}
                  </span>
                </div>
              </div>

              {/* The Interview Flex */}
              {currentProblem.interviewFlex && (
                <div className="bg-[#1f1b14] border border-amber-500/40 rounded-xl p-3 space-y-1 shadow-sm">
                  <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-amber-300 uppercase tracking-wide">
                    <Quote className="w-3.5 h-3.5 text-amber-400" />
                    <span>The Interview Flex (Trade-off)</span>
                  </div>
                  <p className="text-xs sm:text-sm text-amber-100/95 leading-relaxed italic font-serif">
                    {currentProblem.interviewFlex}
                  </p>
                </div>
              )}
            </div>

            <div className="bg-[#161f28] p-2.5 rounded-xl border border-slate-700/80 text-[11px] font-mono text-slate-300 flex items-center justify-between font-semibold">
              <span>Optimal Pattern</span>
              <span className="text-emerald-400 font-bold">Python / C++ / Java / JS</span>
            </div>
          </div>
        </div>
      )}

      {/* ================= INTERACTIVE CODE & VISUALIZER (Zero-Scroll 14-Inch Viewport) ================= */}
      {activeTab === 'visualizer' && (
        <div className="flex-1 min-h-0 grid grid-cols-12 gap-2.5 animate-in fade-in duration-150">
          {/* LEFT PANE: Visualizer Graphic Canvas & Current Action Pill (7 Cols) */}
          <div className="col-span-12 lg:col-span-7 h-full flex flex-col gap-2 min-h-0">
            {/* Action Explanation Capsule */}
            <div className="shrink-0 bg-[#0e1319]/90 border border-slate-800 rounded-xl px-3.5 py-1.5 flex items-center justify-between gap-2 shadow-md">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 whitespace-nowrap">
                  Step {currentStepIndex + 1}/{executionData.steps.length}
                </span>
                {currentStep?.phase && (
                  <span className="text-[9px] font-mono font-black uppercase px-2 py-0.5 rounded-md bg-indigo-500/30 text-indigo-200 border border-indigo-500/40 whitespace-nowrap">
                    {currentStep.phase}
                  </span>
                )}
                <span className="text-xs sm:text-[13px] font-bold text-slate-100 truncate font-mono">
                  {currentStep?.explanation || 'Ready to step through algorithm.'}
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-400 shrink-0 font-bold bg-[#161f28] px-2.5 py-0.5 rounded-md border border-slate-700">
                Line {currentStep?.lineNumber || 1}
              </span>
            </div>

            {/* Graphic Visual Canvas */}
            <div className="flex-1 min-h-0 bg-[#121820] border border-slate-800 rounded-2xl p-4 flex flex-col justify-between items-center relative overflow-hidden shadow-xl">
              {/* ================= BUBBLE SORT & BAR CHART VISUAL MODEL ================= */}
              {selectedProblemId === 'bubble-sort' && (
                <div className="w-full h-full flex flex-col justify-between items-center">
                  {/* Stats Bar */}
                  <div className="w-full flex items-center justify-between px-2 text-xs font-mono text-slate-400 shrink-0">
                    <span className="font-bold text-slate-300">
                      Bubble Sort &bull; {currentStep?.chartBars?.length || 20} Elements
                    </span>
                    <span>
                      Max Value: {Math.max(...(currentStep?.chartBars || [20]))}
                    </span>
                  </div>

                  {/* Dynamic Bar Chart Visualizer with Heights */}
                  <div className="w-full flex-1 flex items-end justify-center gap-1.5 sm:gap-2 px-2 py-2 min-h-0">
                    {(() => {
                      const bars = currentStep?.chartBars || [4, 10, 8, 12, 7, 17, 6, 9, 5, 3, 2, 1, 11, 18, 13, 16, 15, 14, 19, 20];
                      const maxVal = Math.max(...bars, 1);
                      const comparing = currentStep?.comparingIndices || [];
                      const swapped = currentStep?.swappedIndices || [];
                      const sorted = currentStep?.sortedIndices || [];

                      return bars.map((val, idx) => {
                        const isComparing = comparing.includes(idx);
                        const isSwapped = swapped.includes(idx);
                        const isSorted = sorted.includes(idx);
                        const heightPercent = Math.max(10, (val / maxVal) * 100);

                        let barColor = 'bg-[#8c9ba5] text-slate-900'; // Default Neutral Grey
                        if (isSorted) {
                          barColor = 'bg-[#22c55e] text-slate-950 shadow-lg shadow-emerald-500/25'; // Green = Sorted
                        } else if (isSwapped || isComparing) {
                          barColor = 'bg-[#f43f5e] text-white shadow-lg shadow-rose-500/40 scale-105'; // Red = Swapping/Comparing
                        }

                        return (
                          <div
                            key={idx}
                            className="flex-1 flex flex-col items-center justify-end h-full max-w-[38px] transition-all duration-150 relative"
                          >
                            {/* Number on top of bar */}
                            <span className={`text-[11px] sm:text-xs font-mono font-black mb-1 transition-colors select-none ${
                              isSwapped || isComparing ? 'text-rose-300 scale-125 font-black' : isSorted ? 'text-emerald-400 font-bold' : 'text-slate-300'
                            }`}>
                              {val}
                            </span>

                            {/* Vertical Bar */}
                            <div
                              style={{ height: `${heightPercent}%` }}
                              className={`w-full rounded-t-lg transition-all duration-150 flex items-center justify-center font-mono text-[10px] font-black ${barColor}`}
                            />

                            {/* Index Label below bar */}
                            <span className="text-[9px] sm:text-[10px] font-mono text-slate-500 mt-1 select-none font-semibold">
                              {idx}
                            </span>
                          </div>
                        );
                      });
                    })()}
                  </div>

                  {/* Visualizer Legend */}
                  <div className="flex items-center gap-5 text-[11px] font-mono text-slate-400 shrink-0 pt-1">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#8c9ba5]" />
                      <span>Unsorted</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#f43f5e]" />
                      <span>Comparing / Swap</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#22c55e]" />
                      <span>Sorted</span>
                    </div>
                  </div>
                </div>
              )}

              {/* ================= VALID ANAGRAM: BIG PROMINENT BANK ACCOUNT VISUAL MODEL ================= */}
              {selectedProblemId === 'valid-anagram' && (
                <div className="w-full h-full flex flex-col justify-around items-center p-2 space-y-3">
                  {/* String s (Deposits) and String t (Withdrawals) Cards with BIG Tiles */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl">
                    {/* String s */}
                    <div className={`p-4 rounded-2xl border-2 transition-all shadow-lg ${
                      currentStep?.activeString === 's'
                        ? 'bg-[#0a1a14] border-emerald-500/90 ring-2 ring-emerald-500/30'
                        : 'bg-[#141c26] border-slate-700/80'
                    }`}>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-mono font-extrabold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                          <ArrowDownRight className="w-4 h-4 text-emerald-400" />
                          String s (Deposits +1)
                        </span>
                        {currentStep?.activeString === 's' && (
                          <span className="text-[10px] bg-emerald-500 text-slate-950 px-2 py-0.5 rounded-full font-mono font-black animate-pulse shadow-sm">
                            DEPOSITING
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        {String(problemInputs.s || 'anagram').split('').map((char, idx) => {
                          const isActive = currentStep?.activeString === 's' && currentStep?.activeCharIndex === idx;
                          return (
                            <div
                              key={idx}
                              className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center font-mono font-black text-lg sm:text-xl transition-all duration-150 shadow-md ${
                                isActive
                                  ? 'bg-gradient-to-br from-emerald-400 to-emerald-500 text-slate-950 scale-115 ring-4 ring-emerald-400/40 shadow-xl shadow-emerald-500/30 border-2 border-emerald-200 animate-pulse'
                                  : 'bg-[#0b0f14] border-2 border-slate-700/90 text-white hover:border-slate-600'
                              }`}
                            >
                              {char}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* String t */}
                    <div className={`p-4 rounded-2xl border-2 transition-all shadow-lg ${
                      currentStep?.activeString === 't'
                        ? 'bg-[#121426] border-indigo-500/90 ring-2 ring-indigo-500/30'
                        : 'bg-[#141c26] border-slate-700/80'
                    }`}>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-mono font-extrabold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                          <ArrowUpRight className="w-4 h-4 text-indigo-400" />
                          String t (Withdraws -1)
                        </span>
                        {currentStep?.activeString === 't' && (
                          <span className="text-[10px] bg-indigo-500 text-white px-2 py-0.5 rounded-full font-mono font-black animate-pulse shadow-sm">
                            WITHDRAWING
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        {String(problemInputs.t || 'nagaram').split('').map((char, idx) => {
                          const isActive = currentStep?.activeString === 't' && currentStep?.activeCharIndex === idx;
                          return (
                            <div
                              key={idx}
                              className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center font-mono font-black text-lg sm:text-xl transition-all duration-150 shadow-md ${
                                isActive
                                  ? 'bg-gradient-to-br from-indigo-400 to-indigo-600 text-white scale-115 ring-4 ring-indigo-400/40 shadow-xl shadow-indigo-500/30 border-2 border-indigo-200 animate-pulse'
                                  : 'bg-[#0b0f14] border-2 border-slate-700/90 text-white hover:border-slate-600'
                              }`}
                            >
                              {char}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Bank Account Hash Map Ledger with BIG Cards */}
                  <div className="w-full max-w-2xl bg-[#141c26] border-2 border-slate-700/90 rounded-2xl p-4 space-y-2.5 shadow-xl">
                    <div className="flex items-center justify-between text-xs font-mono text-slate-300 border-b border-slate-700/80 pb-2">
                      <span className="font-extrabold text-white flex items-center gap-2 text-sm">
                        <Scale className="w-4 h-4 text-amber-400" />
                        The Bank Ledger (Hash Map)
                      </span>
                      <span className="text-slate-400 font-bold text-xs bg-[#0b0f14] px-2.5 py-0.5 rounded-lg border border-slate-800">
                        dict balance count
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5 flex-wrap min-h-[48px]">
                      {(() => {
                        const balances = currentStep?.bankBalances || {};
                        const keys = Object.keys(balances);
                        if (keys.length === 0) {
                          return <span className="text-xs text-slate-500 font-mono my-auto font-bold">(Bank Ledger Empty)</span>;
                        }
                        return keys.map((char) => {
                          const val = balances[char];
                          const isCharActive = currentStep?.activeChar === char;

                          return (
                            <div
                              key={char}
                              className={`px-3.5 py-2 rounded-xl border-2 flex items-center gap-2 font-mono text-sm sm:text-base font-bold transition-all shadow-md ${
                                isCharActive
                                  ? 'bg-amber-500/25 border-amber-400 text-amber-300 ring-4 ring-amber-400/30 scale-108 font-black'
                                  : val === 0
                                  ? 'bg-[#0b0f14] border-slate-800 text-slate-500'
                                  : 'bg-[#0b0f14] border-emerald-500/60 text-emerald-300 font-bold'
                              }`}
                            >
                              <span className="font-black text-white text-base">'{char}':</span>
                              <span className={`text-xs font-black px-2.5 py-0.5 rounded-lg ${
                                val > 0 ? 'bg-emerald-500 text-slate-950 shadow-sm' : 'bg-slate-800 text-slate-400'
                              }`}>
                                {val}
                              </span>
                            </div>
                          );
                        });
                      })()}
                    </div>
                  </div>
                </div>
              )}

              {/* ================= FACTORIAL VISUAL GAUGE ================= */}
              {selectedProblemId === 'factorial' && (
                <div className="flex flex-col items-center justify-center w-full h-full space-y-5">
                  <div className="text-center">
                    <span className="text-xs font-mono text-slate-400 block mb-1 font-bold uppercase tracking-wider">
                      Running Product Result
                    </span>
                    <div className="text-5xl sm:text-6xl font-black font-mono text-emerald-400 tracking-tight animate-in zoom-in-95 duration-150">
                      {currentStep?.variables?.fact ?? 1}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap justify-center max-w-lg">
                    {Array.from({ length: Math.min(Math.max(1, parseInt(problemInputs.n, 10) || 1), 12) }, (_, i) => i + 1).map((num) => {
                      const currentI = typeof currentStep?.variables?.i === 'number' ? currentStep.variables.i : -1;
                      const isPast = num <= currentI;
                      const isCurrent = num === currentI;

                      return (
                        <div key={num} className="flex items-center gap-2">
                          <div
                            className={`w-11 h-11 sm:w-13 sm:h-13 rounded-2xl flex flex-col items-center justify-center font-mono font-black text-sm sm:text-base transition-all duration-150 shadow-md ${
                              isCurrent
                                ? 'bg-amber-500 text-black shadow-lg scale-115 ring-4 ring-amber-300/50 animate-pulse'
                                : isPast
                                ? 'bg-emerald-950/60 border-2 border-emerald-500/60 text-emerald-300'
                                : 'bg-[#161f28] border-2 border-slate-700 text-slate-500'
                            }`}
                          >
                            <span>{num}</span>
                          </div>
                          {num < (parseInt(problemInputs.n, 10) || 1) && (
                            <span className="text-slate-500 font-bold font-mono text-sm">×</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ================= ARRAY & POINTER VISUALIZERS ================= */}
              {(selectedProblemId === 'two-sum' || selectedProblemId === 'binary-search' || selectedProblemId === 'reverse-array') && (
                <div className="flex flex-col items-center justify-center w-full h-full space-y-5">
                  <div className="flex items-center gap-3 flex-wrap justify-center max-w-full overflow-x-auto p-2">
                    {(() => {
                      let rawArr: number[] = [];
                      if (selectedProblemId === 'two-sum') {
                        rawArr = (problemInputs.nums || '2, 7, 11, 15').split(',').map((s: string) => parseInt(s.trim(), 10)).filter((n: number) => !isNaN(n));
                      } else if (selectedProblemId === 'binary-search') {
                        rawArr = (problemInputs.nums || '1, 3, 5, 7, 9, 11, 13, 15').split(',').map((s: string) => parseInt(s.trim(), 10)).filter((n: number) => !isNaN(n)).sort((a: number, b: number) => a - b);
                      } else {
                        const stepArrStr = currentStep?.variables?.arr;
                        if (stepArrStr && typeof stepArrStr === 'string' && stepArrStr.startsWith('[')) {
                          rawArr = stepArrStr.replace(/[\[\]]/g, '').split(',').map((s) => parseInt(s.trim(), 10)).filter((n) => !isNaN(n));
                        } else {
                          rawArr = (problemInputs.arr || '10, 20, 30, 40, 50, 60').split(',').map((s: string) => parseInt(s.trim(), 10)).filter((n) => !isNaN(n));
                        }
                      }

                      return rawArr.map((val, idx) => {
                        const isHighlighted = currentStep?.highlightIndices?.includes(idx);
                        const isMid = currentStep?.pointers?.mid === idx;
                        const isLeft = currentStep?.pointers?.left === idx || currentStep?.pointers?.low === idx;
                        const isRight = currentStep?.pointers?.right === idx || currentStep?.pointers?.high === idx;
                        const isI = currentStep?.pointers?.i === idx;

                        return (
                          <div key={idx} className="flex flex-col items-center gap-1.5">
                            <div className="h-5 flex items-center justify-center gap-1 text-[10px] font-mono font-bold">
                              {isMid && <span className="text-amber-300 bg-amber-950/90 px-1.5 py-0.5 rounded border border-amber-500/50 font-black">mid</span>}
                              {isLeft && <span className="text-sky-300 bg-sky-950/90 px-1.5 py-0.5 rounded border border-sky-500/50 font-black">L</span>}
                              {isRight && <span className="text-rose-300 bg-rose-950/90 px-1.5 py-0.5 rounded border border-rose-500/50 font-black">R</span>}
                              {isI && <span className="text-emerald-300 bg-emerald-950/90 px-1.5 py-0.5 rounded border border-emerald-500/50 font-black">i</span>}
                            </div>

                            <div
                              className={`w-13 h-13 sm:w-15 sm:h-15 rounded-2xl flex items-center justify-center font-mono font-black text-sm sm:text-lg transition-all duration-150 shadow-lg ${
                                isHighlighted
                                  ? 'bg-gradient-to-br from-emerald-400 to-emerald-500 text-slate-950 scale-110 ring-4 ring-emerald-300/50 font-black'
                                  : 'bg-[#141c26] border-2 border-slate-700 text-slate-100'
                              }`}
                            >
                              {val}
                            </div>

                            <span className="text-[10px] font-mono text-slate-500 font-bold">[{idx}]</span>
                          </div>
                        );
                      });
                    })()}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT PANE: Synchronized VS Code-style Synchronized Code Editor (5 Cols) */}
          <div className="col-span-12 lg:col-span-5 h-full flex flex-col min-h-0 bg-[#121820] border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
            {/* Code Header with Active Line badge */}
            <div className="shrink-0 h-9 bg-[#0e1318] px-3 border-b border-slate-800 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-1.5 text-slate-300 font-bold">
                <Code2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Algorithm Code</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-emerald-300 font-bold bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-500/40">
                  Line {currentStep?.lineNumber || 1}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {activeLanguage.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Code Line Listing with Glowing Active Line */}
            <div className="flex-1 min-h-0 p-2 overflow-y-auto font-mono text-[11px] sm:text-xs leading-5 bg-[#0b0e13] select-text">
              {codeLines.map((line, idx) => {
                const lineNum = idx + 1;
                const isActive = currentStep?.lineNumber === lineNum;

                return (
                  <div
                    key={idx}
                    className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md transition-all duration-100 ${
                      isActive
                        ? 'bg-emerald-500/20 text-emerald-200 border-l-2 border-emerald-400 font-bold shadow-xs'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
                    }`}
                  >
                    {/* Active Execution Arrow Indicator */}
                    <div className="w-2.5 flex items-center justify-center shrink-0 select-none">
                      {isActive ? (
                        <span className="text-emerald-400 font-bold text-[9px] animate-pulse">▶</span>
                      ) : null}
                    </div>

                    <span className={`w-5 text-right shrink-0 select-none text-[10px] font-mono ${
                      isActive ? 'text-emerald-400 font-bold' : 'text-slate-600'
                    }`}>
                      {lineNum}
                    </span>
                    <pre className="whitespace-pre font-mono flex-1 overflow-x-hidden text-ellipsis">
                      {line || ' '}
                    </pre>

                    {/* Small inline badge showing what happens on this line */}
                    {isActive && currentStep?.phase && (
                      <span className="hidden sm:inline-flex text-[8px] font-mono font-bold uppercase px-1.5 py-0.2 rounded bg-emerald-500/30 text-emerald-200 border border-emerald-500/40 shrink-0">
                        {currentStep.phase}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Live Variable State Inspector */}
            <div className="shrink-0 bg-[#0e1318] border-t border-slate-800 p-2">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-300 mb-1.5">
                <span className="font-bold text-white flex items-center gap-1">
                  <Terminal className="w-3 h-3 text-emerald-400" />
                  Live Variables Inspector
                </span>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap max-h-16 overflow-y-auto">
                {currentStep?.variables && Object.entries(currentStep.variables).map(([key, val]) => (
                  <div
                    key={key}
                    className="bg-[#161f28] border border-slate-700/80 px-2 py-0.5 rounded-lg text-[10px] font-mono shadow-xs flex items-center gap-1"
                  >
                    <span className="text-slate-400 font-semibold">{key}:</span>
                    <span className="text-emerald-300 font-bold">{String(val)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= VISUALIZED-DSA PLAYBACK TOOLBAR (Height: ~48px) ================= */}
      <div className="shrink-0 h-12 bg-[#121820] border border-slate-800 rounded-2xl px-3 flex items-center justify-between gap-2.5 shadow-xl">
        {/* Left Action Buttons */}
        <div className="flex items-center gap-1.5">
          {/* Play / Pause Toggle */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition cursor-pointer shadow-md ${
              isPlaying
                ? 'bg-amber-500 hover:bg-amber-400 text-black shadow-amber-500/20'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/20'
            }`}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span className="hidden sm:inline">{isPlaying ? 'Pause' : 'Play'}</span>
          </button>

          {/* Step Forward Button */}
          <button
            disabled={currentStepIndex >= executionData.steps.length - 1}
            onClick={() => {
              setIsPlaying(false);
              setCurrentStepIndex((prev) => Math.min(executionData.steps.length - 1, prev + 1));
            }}
            className="px-2.5 py-1.5 bg-[#161f28] hover:bg-slate-800 disabled:opacity-30 text-slate-200 hover:text-white rounded-xl border border-slate-700 transition cursor-pointer text-xs font-mono font-bold flex items-center gap-1 shadow-xs"
            title="Step Forward (→)"
          >
            <StepForward className="w-3 h-3" />
            <span className="hidden sm:inline">Step</span>
          </button>

          {/* Reset Button */}
          <button
            onClick={() => {
              setCurrentStepIndex(0);
              setIsPlaying(false);
            }}
            className="px-2.5 py-1.5 bg-[#161f28] hover:bg-slate-800 text-slate-200 hover:text-white rounded-xl border border-slate-700 transition cursor-pointer text-xs font-mono font-bold flex items-center gap-1 shadow-xs"
            title="Reset (R)"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          {/* Randomize Button (for arrays / sorting) */}
          <button
            onClick={() => {
              const randomArr = Array.from({ length: 20 }, () => Math.floor(Math.random() * 20) + 1);
              setProblemInputs({ ...problemInputs, arr: randomArr.join(', ') });
              setCurrentStepIndex(0);
              setIsPlaying(false);
            }}
            className="px-2.5 py-1.5 bg-[#161f28] hover:bg-slate-800 text-slate-200 hover:text-white rounded-xl border border-slate-700 transition cursor-pointer text-xs font-mono font-bold flex items-center gap-1 shadow-xs"
            title="Randomize Array"
          >
            <Dices className="w-3 h-3 text-emerald-400" />
            <span className="hidden md:inline">Randomize</span>
          </button>
        </div>

        {/* Center: Scrubber Slider */}
        <div className="flex items-center gap-2 flex-1 max-w-xs sm:max-w-sm">
          <input
            type="range"
            min={0}
            max={Math.max(0, executionData.steps.length - 1)}
            value={currentStepIndex}
            onChange={(e) => {
              setIsPlaying(false);
              setCurrentStepIndex(parseInt(e.target.value, 10));
            }}
            className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
          />
          <span className="text-[10px] font-mono text-slate-300 font-bold whitespace-nowrap bg-[#161f28] px-2 py-0.5 rounded-lg border border-slate-700">
            {currentStepIndex + 1}/{executionData.steps.length}
          </span>
        </div>

        {/* Right: Speed & Hotkey Hints */}
        <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
          {/* Speed selector */}
          <div className="flex items-center gap-1">
            <span className="hidden md:inline text-slate-500">Speed:</span>
            {[
              { label: '0.5x', ms: 2000 },
              { label: '1x', ms: 1200 },
              { label: '2x', ms: 500 },
            ].map((s) => (
              <button
                key={s.label}
                onClick={() => setPlaybackSpeedMs(s.ms)}
                className={`px-1.5 py-0.5 rounded text-[10px] transition cursor-pointer ${
                  playbackSpeedMs === s.ms
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'text-slate-400 hover:text-white bg-slate-800/80'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Hotkey Guide */}
          <div className="hidden xl:flex items-center gap-2 text-[9px] text-slate-500 pl-2 border-l border-slate-800">
            <span><kbd className="bg-slate-800 text-slate-300 px-1 py-0.2 rounded border border-slate-700 font-mono">Space</kbd></span>
            <span><kbd className="bg-slate-800 text-slate-300 px-1 py-0.2 rounded border border-slate-700 font-mono">R</kbd></span>
            <span><kbd className="bg-slate-800 text-slate-300 px-1 py-0.2 rounded border border-slate-700 font-mono">→</kbd></span>
          </div>
        </div>
      </div>

      {/* Custom Question Modal */}
      {showCustomModal && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setShowCustomModal(false)}
        >
          <div
            className="bg-[#121820] border border-slate-800 rounded-3xl p-5 sm:p-6 max-w-md w-full shadow-2xl text-white space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">Ask Any DSA / Algorithm Question</h3>
              </div>
              <button
                onClick={() => setShowCustomModal(false)}
                className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              Enter any problem title or question (e.g. <em>"Valid Anagram"</em>, <em>"Bubble Sort"</em>, <em>"Two Sum"</em>, <em>"Binary Search"</em>).
            </p>

            <textarea
              rows={3}
              value={customQuestionText}
              onChange={(e) => setCustomQuestionText(e.target.value)}
              placeholder="e.g. Valid Anagram with Bank Account Model"
              className="w-full bg-[#161f28] border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-hidden focus:border-emerald-500 font-mono shadow-inner"
            />

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                onClick={() => setShowCustomModal(false)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (customQuestionText.trim()) {
                    const lower = customQuestionText.toLowerCase();
                    if (lower.includes('anagram')) {
                      setSelectedProblemId('valid-anagram');
                    } else if (lower.includes('bubble') || lower.includes('sort')) {
                      setSelectedProblemId('bubble-sort');
                    } else if (lower.includes('factor')) {
                      setSelectedProblemId('factorial');
                    } else if (lower.includes('two sum') || lower.includes('pair')) {
                      setSelectedProblemId('two-sum');
                    } else if (lower.includes('binary') || lower.includes('search')) {
                      setSelectedProblemId('binary-search');
                    } else if (lower.includes('revers')) {
                      setSelectedProblemId('reverse-array');
                    }
                    setShowCustomModal(false);
                  }
                }}
                className="px-4 py-1.5 rounded-xl text-xs font-bold font-mono bg-emerald-600 hover:bg-emerald-500 text-white transition cursor-pointer shadow-md"
              >
                Load &amp; Visualize
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
