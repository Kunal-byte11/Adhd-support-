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
  Trophy,
} from 'lucide-react';
import { MasteryCelebrationModal } from './MasteryCelebrationModal';

export interface VisualizerStep {
  lineNumber: number;
  explanation: string;
  variables: Record<string, any>;
  phase?: 'init' | 'deposit' | 'withdraw' | 'finish' | 'compare' | 'swap' | 'sorted' | 'inspect' | 'match' | 'insert' | 'bucket';
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
  // For Contains Duplicate
  seenSet?: (number | string)[];
  foundDuplicate?: boolean;
  duplicateVal?: number | string;
  // For Two Sum
  currentIndex?: number;
  currentNum?: number;
  diff?: number;
  prevMap?: Record<string | number, number>;
  matchedIndices?: [number, number];
  // For Group Anagrams (Buckets)
  currentWord?: string;
  currentWordIndex?: number;
  currentCharCounts?: number[];
  charFingerprint?: string;
  buckets?: Record<string, string[]>;
  activeBucketKey?: string;
  // For Top K Elements (Frequency Shelves)
  countMap?: Record<string | number, number>;
  freqShelves?: (number | string)[][];
  activeShelfIndex?: number;
  collectedResults?: (number | string)[];
  kTarget?: number;
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
    id: 'contains-duplicate',
    title: 'Contains Duplicate',
    subtitle: 'LeetCode 217 • NeetCode 150 #1',
    category: 'Stack & Hashing',
    difficulty: 'Easy',
    description: 'Given an integer array nums, return True if any value appears at least twice, and False if all elements are distinct.',
    timeComplexity: 'O(n) — Single linear pass with O(1) set lookups and additions',
    spaceComplexity: 'O(n) — Hash set stores up to n seen numbers in worst-case',
    mentalTrigger: 'Checking for existence / finding duplicates -> USE A HASH SET (set()).',
    interviewFlex: '"I used a Hash Set to prioritize O(n) linear speed. If strictly constrained to O(1) space, we can sort the array in-place first (O(n log n) time) and check adjacent neighbors nums[i] == nums[i - 1], trading speed to eliminate auxiliary memory."',
    edgeCases: [
      'Empty array [] -> Returns False',
      'Single element [1] -> Returns False',
      'Negative numbers [-1, 2, -1] -> Handled automatically by set().',
    ],
    visualModelDescription: 'The Blank Notepad Model: 1. Hold a blank notepad in your hand (seen = set()). 2. Flip over cards one by one (for num in nums:). 3. Look at the notepad: If the number is already written -> BINGO! Return True. If not written -> Write the number down on the notepad (seen.add(num)). 4. If all cards are flipped with no matches -> Return False.',
    defaultInput: { nums: '1, 2, 3, 1' },
    inputSchema: [
      { key: 'nums', label: 'Array nums (comma-separated)', type: 'string', placeholder: '1, 2, 3, 1' },
    ],
    codeSnippets: {
      python: `class Solution:
    def hasDuplicate(self, nums: list[int]) -> bool:
        seen = set()  # 1. Blank notepad to record seen numbers

        for num in nums:  # 2. Flip cards one by one
            if num in seen:  # 3. Check if card was seen on notepad
                return True  # 4. Duplicate found! Return True
            seen.add(num)  # 5. Not seen yet -> write down on notepad

        return False  # 6. All cards unique -> return False`,
      cpp: `class Solution {
public:
    bool hasDuplicate(vector<int>& nums) {
        unordered_set<int> seen;  // 1. Blank notepad for seen numbers

        for (int num : nums) {  // 2. Inspect each number
            if (seen.find(num) != seen.end()) {  // 3. Check if already recorded
                return true;  // 4. Duplicate found! Return true
            }
            seen.insert(num);  // 5. Record on notepad
        }

        return false;  // 6. All numbers distinct
    }
};`,
      javascript: `var hasDuplicate = function(nums) {
    const seen = new Set();  // 1. Blank notepad for seen numbers

    for (const num of nums) {  // 2. Inspect each number
        if (seen.has(num)) {  // 3. Check if already recorded
            return true;  // 4. Duplicate found! Return true
        }
        seen.add(num);  // 5. Record on notepad
    }

    return false;  // 6. All numbers distinct
};`,
      java: `class Solution {
    public boolean hasDuplicate(int[] nums) {
        Set<Integer> seen = new HashSet<>();  // 1. Blank notepad

        for (int num : nums) {  // 2. Inspect each number
            if (seen.contains(num)) {  // 3. Check if already recorded
                return true;  // 4. Duplicate found! Return true
            }
            seen.add(num);  // 5. Record on notepad
        }

        return false;  // 6. All numbers distinct
    }
}`,
    },
    generateSteps: (inputs) => {
      const rawNums = String(inputs.nums ?? '1, 2, 3, 1')
        .split(',')
        .map((x) => parseInt(x.trim(), 10))
        .filter((n) => !isNaN(n));
      const nums = rawNums.length > 0 ? rawNums : [1, 2, 3, 1];
      const steps: VisualizerStep[] = [];
      const seenArr: number[] = [];

      // Step 1: Function entry / initialization
      steps.push({
        lineNumber: 3,
        explanation: `Start hasDuplicate with nums = [${nums.join(', ')}]. Initialize blank notepad seen = set().`,
        variables: { nums: `[${nums.join(', ')}]`, seen: 'set()' },
        phase: 'init',
        seenSet: [],
      });

      for (let i = 0; i < nums.length; i++) {
        const num = nums[i];

        // Step 2: Looking at card
        steps.push({
          lineNumber: 5,
          explanation: `[Card ${i}] Flipped over card nums[${i}] = ${num}.`,
          variables: { i, num, seen: `{${seenArr.join(', ')}}` },
          phase: 'inspect',
          currentIndex: i,
          currentNum: num,
          seenSet: [...seenArr],
        });

        // Step 3: Check Notepad
        const alreadySeen = seenArr.includes(num);
        steps.push({
          lineNumber: 6,
          explanation: `Check Notepad: Is ${num} already written on seen notepad?`,
          variables: { num, 'num in seen': alreadySeen, seen: `{${seenArr.join(', ')}}` },
          phase: 'inspect',
          currentIndex: i,
          currentNum: num,
          seenSet: [...seenArr],
        });

        if (alreadySeen) {
          // Step 4: Duplicate Found!
          steps.push({
            lineNumber: 7,
            explanation: `🎯 BINGO! Duplicate found! ${num} is already recorded on the notepad! Return True.`,
            variables: { num, result: true },
            phase: 'match',
            currentIndex: i,
            currentNum: num,
            foundDuplicate: true,
            duplicateVal: num,
            seenSet: [...seenArr],
          });
          return { steps, result: true };
        }

        // Step 5: Add to seen
        seenArr.push(num);
        steps.push({
          lineNumber: 8,
          explanation: `${num} is not on the notepad yet. Write ${num} down on notepad (seen.add(${num})). Move to next card.`,
          variables: { num, seen: `{${seenArr.join(', ')}}` },
          phase: 'insert',
          currentIndex: i,
          currentNum: num,
          seenSet: [...seenArr],
        });
      }

      // Step Final: Complete without duplicates
      steps.push({
        lineNumber: 10,
        explanation: `All ${nums.length} cards checked. No duplicates found on notepad! Return False.`,
        variables: { result: false },
        phase: 'finish',
        seenSet: [...seenArr],
      });

      return { steps, result: false };
    },
  },
  {
    id: 'valid-anagram',
    title: 'Valid Anagram',
    subtitle: 'LeetCode 242 • NeetCode 150 #2',
    category: 'Stack & Hashing',
    difficulty: 'Easy',
    description: 'Given two strings s and t, return True if t is an exact rearrangement of s (same characters with identical frequencies), and False otherwise.',
    timeComplexity: 'O(n) — Two separate linear passes through strings of length n',
    spaceComplexity: 'O(1) — Dictionary bounded by 26 lowercase English letters',
    mentalTrigger: 'Comparing character frequencies / counting occurrences -> USE A HASH MAP (dict).',
    interviewFlex: '"I used a single Hash Map for O(n) time and O(1) alphabet-bounded space. If we want a clean one-liner, we could compare sorted strings (return sorted(s) == sorted(t)), which runs in O(n log n) time."',
    edgeCases: [
      'len(s) != len(t) -> Impossible! Return False immediately.',
      'Single-character identical strings: "a" & "a" -> Returns True.',
      'Overdraft: String t tries to withdraw a letter with 0 balance (or not in dict) -> Return False.',
    ],
    visualModelDescription: "The Bank Account / Whiteboard Model: 1. Instant Filter: If len(s) != len(t), return False immediately. 2. String s DEPOSITS letters (+1 to count). 3. String t WITHDRAWS letters (-1 from count). 4. If t tries to withdraw a letter with 0 balance -> Return False. 5. If all characters balance out to 0 -> Return True.",
    defaultInput: { s: 'anagram', t: 'nagaram' },
    inputSchema: [
      { key: 's', label: 'String s (Deposits)', type: 'string', placeholder: 'anagram' },
      { key: 't', label: 'String t (Withdraws)', type: 'string', placeholder: 'nagaram' },
    ],
    codeSnippets: {
      python: `class Solution:
    def isAnagram(self, s: str, t: str) -> bool:
        if len(s) != len(t):  # 1. Filter: check equal lengths
            return False  # 2. Length mismatch -> impossible

        count = {}  # 3. Whiteboard to track letter balances

        for char in s:  # 4. Deposit Phase: +1 for each letter in s
            count[char] = count.get(char, 0) + 1

        for char in t:  # 5. Withdraw Phase: -1 for each letter in t
            if char not in count or count[char] == 0:
                return False  # 6. Overdrawn / letter not in s
            count[char] -= 1  # 7. Decrement balance

        return True  # 8. All balances hit zero -> valid anagram!`,
      cpp: `class Solution {
public:
    bool isAnagram(string s, string t) {
        if (s.length() != t.length()) return false;  # 1. Length check

        unordered_map<char, int> count;  # 2. Whiteboard balances

        for (char c : s) {  # 3. Deposit Phase (+1)
            count[c]++;
        }

        for (char c : t) {  # 4. Withdraw Phase (-1)
            if (count.find(c) == count.end() || count[c] == 0) {
                return false;  # 5. Overdraft check
            }
            count[c]--;
        }

        return true;  # 6. All balances balanced!
    }
};`,
      javascript: `var isAnagram = function(s, t) {
    if (s.length !== t.length) return false;  # 1. Length check

    const count = {};  # 2. Whiteboard balances

    for (let char of s) {  # 3. Deposit Phase (+1)
        count[char] = (count[char] || 0) + 1;
    }

    for (let char of t) {  # 4. Withdraw Phase (-1)
        if (!count[char]) {
            return false;  # 5. Overdraft check
        }
        count[char]--;
    }

    return true;  # 6. Valid anagram!
};`,
      java: `class Solution {
    public boolean isAnagram(String s, String t) {
        if (s.length() != t.length()) return false;  # 1. Length check

        Map<Character, Integer> count = new HashMap<>();  # 2. Whiteboard

        for (char c : s.toCharArray()) {  # 3. Deposit Phase (+1)
            count.put(c, count.getOrDefault(c, 0) + 1);
        }

        for (char c : t.toCharArray()) {  # 4. Withdraw Phase (-1)
            if (!count.containsKey(c) || count.get(c) == 0) {
                return false;  # 5. Overdraft check
            }
            count.put(c, count.get(c) - 1);
        }

        return true;  # 6. Valid anagram!
    }
}`,
    },
    generateSteps: (inputs) => {
      const s = String(inputs.s ?? 'anagram').trim() || 'anagram';
      const t = String(inputs.t ?? 'nagaram').trim() || 'nagaram';
      const steps: VisualizerStep[] = [];
      const bankBalances: Record<string, number> = {};

      // Step 1: Init & length check
      steps.push({
        lineNumber: 3,
        explanation: `Start isAnagram: Comparing "${s}" (len ${s.length}) vs "${t}" (len ${t.length}).`,
        variables: { s, t, lenS: s.length, lenT: t.length },
        phase: 'init',
        bankBalances: {},
      });

      if (s.length !== t.length) {
        steps.push({
          lineNumber: 4,
          explanation: `Lengths do not match (${s.length} != ${t.length})! Impossible to be an anagram. Return False immediately.`,
          variables: { s, t, result: false },
          phase: 'finish',
          bankBalances: {},
        });
        return { steps, result: false };
      }

      // Step 2: Initialize count map
      steps.push({
        lineNumber: 6,
        explanation: `Initialize blank whiteboard count = {} for letter bank balances.`,
        variables: { count: '{}' },
        phase: 'init',
        bankBalances: {},
      });

      // Phase 1: Deposits
      for (let i = 0; i < s.length; i++) {
        const char = s[i];
        bankBalances[char] = (bankBalances[char] || 0) + 1;

        steps.push({
          lineNumber: 9,
          explanation: `[Deposit ${i + 1}/${s.length}] Pull tile '${char}' from string s ("${s}"). Add +1 to bank balance for '${char}'. Balance is now ${bankBalances[char]}.`,
          variables: { activeChar: char, string: 's', count: JSON.stringify(bankBalances) },
          phase: 'deposit',
          activeChar: char,
          activeString: 's',
          activeCharIndex: i,
          bankBalances: { ...bankBalances },
        });
      }

      // Phase 2: Withdrawals
      for (let i = 0; i < t.length; i++) {
        const char = t[i];
        const currentBalance = bankBalances[char] || 0;

        steps.push({
          lineNumber: 12,
          explanation: `[Withdraw ${i + 1}/${t.length}] Inspect tile '${char}' from string t ("${t}"). Check balance on whiteboard.`,
          variables: { activeChar: char, string: 't', currentBalance, count: JSON.stringify(bankBalances) },
          phase: 'inspect',
          activeChar: char,
          activeString: 't',
          activeCharIndex: i,
          bankBalances: { ...bankBalances },
        });

        if (!bankBalances[char] || bankBalances[char] <= 0) {
          steps.push({
            lineNumber: 13,
            explanation: `❌ OVERDRAFT! Tile '${char}' from string t has a balance of ${currentBalance}. String t contains characters not supplied by s! Return False.`,
            variables: { activeChar: char, currentBalance, result: false },
            phase: 'withdraw',
            activeChar: char,
            activeString: 't',
            activeCharIndex: i,
            bankBalances: { ...bankBalances },
          });
          return { steps, result: false };
        }

        bankBalances[char] -= 1;
        steps.push({
          lineNumber: 14,
          explanation: `Tile '${char}' found in bank! Deduct -1 from balance for '${char}'. Balance is now ${bankBalances[char]}.`,
          variables: { activeChar: char, string: 't', newBalance: bankBalances[char], count: JSON.stringify(bankBalances) },
          phase: 'withdraw',
          activeChar: char,
          activeString: 't',
          activeCharIndex: i,
          bankBalances: { ...bankBalances },
        });
      }

      // Step 3: All balances zero
      steps.push({
        lineNumber: 16,
        explanation: `🎉 All tiles from string t matched and withdrew from string s perfectly! Every balance reached zero. Return True!`,
        variables: { result: true },
        phase: 'finish',
        bankBalances: { ...bankBalances },
      });

      return { steps, result: true };
    },
  },
  {
    id: 'two-sum',
    title: 'Two Sum',
    subtitle: 'LeetCode 1 • NeetCode 150 #3',
    category: 'Arrays & Pointers',
    difficulty: 'Easy',
    description: "Given an array 'nums' and an integer 'target', return the INDICES of the two numbers such that they add up to 'target'.",
    timeComplexity: 'O(n) — Single pass through array with O(1) instant hash map lookup',
    spaceComplexity: 'O(n) — prevMap hash map stores up to n seen numbers',
    mentalTrigger: 'Finding a pair that sums to a target + needing indices -> ONE-PASS HASH MAP ({value: index}).',
    interviewFlex: '"I used a One-Pass Hash Map to achieve optimal O(n) time. The brute force method checks all pairs in O(n^2) time. Notice we cannot sort the array first here because sorting scrambles the original index positions required by the problem."',
    edgeCases: [
      'Duplicate numbers adding to target (nums=[3, 3], target=6): Index 0 stores {3: 0}, index 1 searches 6 - 3 = 3, finds index 0, returns [0, 1].',
      'Negative numbers in array -> Subtraction diff = target - n works seamlessly.',
      'Target is zero or negative -> Fully handled by algebraic diff.',
    ],
    visualModelDescription: "The Lock & Key / Wanted Poster Model: 1. Hold a card n at index i. 2. Compute wanted partner: diff = target - n. 3. Look at your notepad (prevMap = {value: index}): 'Did I already see diff earlier?' If YES -> Return [prevMap[diff], i] (BINGO!). If NO -> Write prevMap[n] = i on notepad and move to next card.",
    defaultInput: { nums: '2, 7, 11, 15', target: 9 },
    inputSchema: [
      { key: 'nums', label: 'Array nums (comma-separated)', type: 'string', placeholder: '2, 7, 11, 15' },
      { key: 'target', label: 'Target Sum', type: 'number', placeholder: '9' },
    ],
    codeSnippets: {
      python: `class Solution:
    def twoSum(self, nums: list[int], target: int) -> list[int]:
        prevMap = {}  # 1. Notepad mapping: value -> index

        for i, n in enumerate(nums):  # 2. Inspect card 'n' at index 'i'
            diff = target - n  # 3. Calculate wanted partner complement

            if diff in prevMap:  # 4. Check if wanted partner is on notepad
                return [prevMap[diff], i]  # 5. BINGO! Return pair of indices

            prevMap[n] = i  # 6. Not found -> record (n : i) on notepad

        return []  # 7. No pair found`,
      cpp: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> prevMap;  // 1. Notepad: value -> index

        for (int i = 0; i < nums.size(); i++) {  // 2. Inspect each card
            int diff = target - nums[i];  // 3. Compute complement
            if (prevMap.find(diff) != prevMap.end()) {  // 4. Partner found?
                return {prevMap[diff], i};  // 5. Match found!
            }
            prevMap[nums[i]] = i;  // 6. Record (val : index)
        }

        return {};  // 7. No pair found
    }
};`,
      javascript: `var twoSum = function(nums, target) {
    const prevMap = {};  // 1. Notepad: value -> index

    for (let i = 0; i < nums.length; i++) {  // 2. Inspect each card
        const n = nums[i];
        const diff = target - n;  // 3. Compute complement

        if (diff in prevMap) {  // 4. Partner found?
            return [prevMap[diff], i];  // 5. Match found!
        }

        prevMap[n] = i;  // 6. Record (val : index)
    }

    return [];  // 7. No pair found
};`,
      java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> prevMap = new HashMap<>();  // 1. Notepad

        for (int i = 0; i < nums.length; i++) {  // 2. Inspect each card
            int diff = target - nums[i];  // 3. Compute complement

            if (prevMap.containsKey(diff)) {  // 4. Partner found?
                return new int[] { prevMap.get(diff), i };  // 5. Match found!
            }

            prevMap.put(nums[i], i);  // 6. Record (val : index)
        }

        return new int[] {};  // 7. No pair found
    }
}`,
    },
    generateSteps: (inputs) => {
      const rawNums = String(inputs.nums ?? '2, 7, 11, 15')
        .split(',')
        .map((x) => parseInt(x.trim(), 10))
        .filter((n) => !isNaN(n));
      const nums = rawNums.length > 0 ? rawNums : [2, 7, 11, 15];
      const target = parseInt(String(inputs.target ?? 9), 10);
      const steps: VisualizerStep[] = [];
      const prevMap: Record<string, number> = {};

      // Step 1: Function entry
      steps.push({
        lineNumber: 3,
        explanation: `Start twoSum with nums = [${nums.join(', ')}] and target = ${target}. Initialize empty notepad prevMap = {}.`,
        variables: { nums: `[${nums.join(', ')}]`, target, prevMap: '{}' },
        phase: 'init',
        prevMap: { ...prevMap },
      });

      for (let i = 0; i < nums.length; i++) {
        const n = nums[i];
        const diff = target - n;

        // Step 2: Loop iteration & diff calculation
        steps.push({
          lineNumber: 5,
          explanation: `[Card ${i}] Looking at nums[${i}] = ${n}. Wanted partner: diff = target (${target}) - n (${n}) = ${diff}.`,
          variables: { i, n, diff, prevMap: JSON.stringify(prevMap) },
          phase: 'inspect',
          currentIndex: i,
          currentNum: n,
          diff,
          prevMap: { ...prevMap },
        });

        // Step 3: Hash Map Lookup
        steps.push({
          lineNumber: 8,
          explanation: `Check Notepad: Did we already see partner ${diff} in prevMap?`,
          variables: { diff, inPrevMap: diff in prevMap, prevMap: JSON.stringify(prevMap) },
          phase: 'inspect',
          currentIndex: i,
          currentNum: n,
          diff,
          prevMap: { ...prevMap },
        });

        if (diff in prevMap) {
          const partnerIdx = prevMap[diff];
          // Step 4: Found Match!
          steps.push({
            lineNumber: 9,
            explanation: `🎯 BINGO! Partner ${diff} was found in prevMap at index ${partnerIdx}! (${diff} + ${n} = ${target}). Return [${partnerIdx}, ${i}]!`,
            variables: { result: `[${partnerIdx}, ${i}]`, sum: `${diff} + ${n} = ${target}` },
            phase: 'match',
            currentIndex: i,
            currentNum: n,
            diff,
            matchedIndices: [partnerIdx, i],
            prevMap: { ...prevMap },
          });
          return { steps, result: [partnerIdx, i] };
        }

        // Step 5: Insert into prevMap
        prevMap[n] = i;
        steps.push({
          lineNumber: 11,
          explanation: `Partner ${diff} not in prevMap yet. Write down (${n} : index ${i}) on notepad. Move to next card.`,
          variables: { prevMap: JSON.stringify(prevMap) },
          phase: 'insert',
          currentIndex: i,
          currentNum: n,
          diff,
          prevMap: { ...prevMap },
        });
      }

      steps.push({
        lineNumber: 13,
        explanation: `No pair found that sums to ${target}. Return [].`,
        variables: { result: '[]' },
        phase: 'finish',
        prevMap: { ...prevMap },
      });

      return { steps, result: [] };
    },
  },
  {
    id: 'group-anagrams',
    title: 'Group Anagrams',
    subtitle: 'LeetCode 49 • NeetCode 150 #4',
    category: 'Stack & Hashing',
    difficulty: 'Medium',
    description: 'Given an array of strings strs, group all the anagrams together into separate sub-lists.',
    timeComplexity: 'O(M * K log K) — For M strings of max length K, sorting each string takes O(K log K)',
    spaceComplexity: 'O(M * K) — Hash map stores all strings and bucket labels',
    mentalTrigger: 'Grouping items by a common property / pattern -> HASH MAP OF LISTS (defaultdict(list)).',
    interviewFlex: '"Instead of sorting each string in O(K log K), we could count character frequencies using a 26-element array count = [0] * 26 as the hash map key (converted to a tuple). This optimizes the time complexity down to O(M * K)."',
    edgeCases: [
      'Array with single empty string [""] -> Returns [[""]]',
      'Single string ["a"] -> Returns [["a"]]',
      'All words distinct ["a", "b", "c"] -> Returns [["a"], ["b"], ["c"]]',
    ],
    visualModelDescription: 'The Labeled Buckets Model: 1. We need a unique "Fingerprint / Label" for every bucket so that words with the same letters fall into the same bucket. 2. For any word (e.g. "act" and "cat"), sorting its characters gives the exact same label -> "act". 3. Toss each original word into the bucket matching its sorted label. 4. Collect all bucket contents at the end: return list(res.values()).',
    defaultInput: { strs: 'act, pots, tops, cat, stop, hat' },
    inputSchema: [
      { key: 'strs', label: 'Strings (comma-separated)', type: 'string', placeholder: 'act, pots, tops, cat, stop, hat' },
    ],
    codeSnippets: {
      python: `from collections import defaultdict

class Solution:
    def groupAnagrams(self, strs: list[str]) -> list[list[str]]:
        res = defaultdict(list)  # 1. Labeled buckets: sorted_label -> [words]

        for s in strs:  # 2. Inspect each word one by one
            sorted_word = "".join(sorted(s))  # 3. Sort chars to get bucket label
            res[sorted_word].append(s)  # 4. Toss word into matching bucket

        return list(res.values())  # 5. Return all collected word buckets`,
      cpp: `class Solution {
public:
    vector<vector<string>> groupAnagrams(vector<string>& strs) {
        unordered_map<string, vector<string>> res;  # 1. Labeled buckets

        for (string s : strs) {  # 2. Inspect each word
            string sorted_word = s;
            sort(sorted_word.begin(), sorted_word.end());  # 3. Sort to get label
            res[sorted_word].push_back(s);  # 4. Toss into bucket
        }

        vector<vector<string>> ans;
        for (auto pair : res) {
            ans.push_back(pair.second);  # 5. Collect buckets
        }
        return ans;
    }
};`,
      javascript: `var groupAnagrams = function(strs) {
    const res = {};  # 1. Labeled buckets: sorted_label -> [words]

    for (const s of strs) {  # 2. Inspect each word
        const sorted_word = s.split('').sort().join('');  # 3. Sort chars for label
        if (!res[sorted_word]) {
            res[sorted_word] = [];  # 4. Create bucket if first time
        }
        res[sorted_word].push(s);  # 5. Toss word into bucket
    }

    return Object.values(res);  # 6. Return all collected buckets
};`,
      java: `class Solution {
    public List<List<String>> groupAnagrams(String[] strs) {
        Map<String, List<String>> res = new HashMap<>();  # 1. Labeled buckets

        for (String s : strs) {  # 2. Inspect each word
            char[] chars = s.toCharArray();
            Arrays.sort(chars);  # 3. Sort chars for bucket label
            String sorted_word = new String(chars);

            res.putIfAbsent(sorted_word, new ArrayList<>());  # 4. Init bucket
            res.get(sorted_word).add(s);  # 5. Toss word into bucket
        }

        return new ArrayList<>(res.values());  # 6. Return buckets
    }
}`,
    },
    generateSteps: (inputs) => {
      const rawStrs = String(inputs.strs ?? 'act, pots, tops, cat, stop, hat')
        .split(',')
        .map((x) => x.trim())
        .filter((x) => x.length > 0);
      const strs = rawStrs.length > 0 ? rawStrs : ['act', 'pots', 'tops', 'cat', 'stop', 'hat'];
      const steps: VisualizerStep[] = [];
      const buckets: Record<string, string[]> = {};

      // Step 1: Init
      steps.push({
        lineNumber: 5,
        explanation: `Initialize empty hash map res = defaultdict(list) with ${strs.length} words to group.`,
        variables: { strs: JSON.stringify(strs), res: '{}' },
        phase: 'init',
        buckets: {},
      });

      for (let i = 0; i < strs.length; i++) {
        const word = strs[i];
        const sortedWord = word.split('').sort().join('');

        // Step 2: Inspect & Sort
        steps.push({
          lineNumber: 8,
          explanation: `[Word ${i + 1}/${strs.length}] Pick word "${word}". Sort characters: "${word}" → Fingerprint Label "${sortedWord}".`,
          variables: { currentWord: word, sorted_word: sortedWord, wordIndex: i },
          phase: 'inspect',
          currentWord: word,
          currentWordIndex: i,
          charFingerprint: sortedWord,
          activeBucketKey: sortedWord,
          buckets: JSON.parse(JSON.stringify(buckets)),
        });

        // Step 3: Add to bucket
        if (!buckets[sortedWord]) {
          buckets[sortedWord] = [];
        }
        buckets[sortedWord].push(word);

        steps.push({
          lineNumber: 9,
          explanation: `Toss "${word}" into Bucket 🏷️ "${sortedWord}". Current bucket contents: [${buckets[sortedWord].map((w) => `"${w}"`).join(', ')}].`,
          variables: { bucket: sortedWord, contents: JSON.stringify(buckets[sortedWord]) },
          phase: 'bucket',
          currentWord: word,
          currentWordIndex: i,
          charFingerprint: sortedWord,
          activeBucketKey: sortedWord,
          buckets: JSON.parse(JSON.stringify(buckets)),
        });
      }

      // Step 4: Finish
      const finalResult = Object.values(buckets);
      steps.push({
        lineNumber: 11,
        explanation: `All ${strs.length} words grouped into ${finalResult.length} unique buckets! Return list(res.values()).`,
        variables: { result: JSON.stringify(finalResult) },
        phase: 'finish',
        buckets: JSON.parse(JSON.stringify(buckets)),
      });

      return { steps, result: finalResult };
    },
  },
  {
    id: 'top-k-frequent-elements',
    title: 'Top K Frequent Elements',
    subtitle: 'LeetCode 347 • NeetCode 150 #5',
    category: 'Stack & Hashing',
    difficulty: 'Medium',
    description: 'Given an integer array nums and an integer k, return the k most frequent elements in any order.',
    timeComplexity: 'O(n) — Linear time using Frequency Bucket Sort',
    spaceComplexity: 'O(n) — Hash map for counts and frequency shelves',
    mentalTrigger: 'Top K elements by frequency in O(n) time -> BUCKET SORT BY FREQUENCY (freq = [[] ...] + reversed()).',
    interviewFlex: '"A standard approach is to use a Min-Heap of size k, which takes O(n log k) time. However, by using Bucket Sort where the bucket index represents element frequency, we optimize the time complexity to strictly O(n) linear time."',
    edgeCases: [
      'All elements identical nums = [7, 7, 7], k = 1 -> Returns [7]',
      'k equals number of unique elements -> Returns all unique elements',
      'Negative numbers -> Handled seamlessly by dictionary keys',
    ],
    visualModelDescription: 'The Frequency Shelves Model: 1. Count frequencies on the whiteboard (count = {}). 2. Create empty shelves where shelf index = frequency count (0 to len(nums)). 3. Place numbers onto their matching shelf. 4. Walk shelves in reverse from highest shelf down to collect k numbers.',
    defaultInput: { nums: '1, 2, 2, 3, 3, 3', k: 2 },
    inputSchema: [
      { key: 'nums', label: 'Array nums (comma-separated)', type: 'string', placeholder: '1, 2, 2, 3, 3, 3' },
      { key: 'k', label: 'k (top count)', type: 'number', placeholder: '2' },
    ],
    codeSnippets: {
      python: `class Solution:
    def topKFrequent(self, nums: list[int], k: int) -> list[int]:
        count = {}  # 1. Whiteboard: count frequencies of each number
        for n in nums:
            count[n] = count.get(n, 0) + 1

        freq = [[] for _ in range(len(nums) + 1)]  # 2. Empty frequency shelves
        for n, c in count.items():
            freq[c].append(n)  # 3. Place number 'n' on shelf 'c'

        res = []  # 4. Result list to collect winners
        for shelf in reversed(freq):  # 5. Walk shelves in reverse order
            for n in shelf:
                res.append(n)  # 6. Grab number from shelf
                if len(res) == k:
                    return res  # 7. Collected k numbers -> return result`,
      cpp: `class Solution {
public:
    vector<int> topKFrequent(vector<int>& nums, int k) {
        unordered_map<int, int> count;  // 1. Whiteboard frequency count
        for (int n : nums) {
            count[n]++;
        }

        vector<vector<int>> freq(nums.size() + 1);  // 2. Frequency shelves
        for (auto& pair : count) {
            freq[pair.second].push_back(pair.first);  // 3. Place on shelf
        }

        vector<int> res;  // 4. Result list
        for (int i = freq.size() - 1; i > 0; i--) {  // 5. Walk backwards
            for (int n : freq[i]) {
                res.push_back(n);  // 6. Grab from shelf
                if (res.size() == k) return res;  // 7. Found k elements!
            }
        }
        return res;
    }
};`,
      javascript: `var topKFrequent = function(nums, k) {
    const count = {};  // 1. Whiteboard frequency count
    for (const n of nums) {
        count[n] = (count[n] || 0) + 1;
    }

    const freq = Array.from({ length: nums.length + 1 }, () => []);  // 2. Shelves
    for (const [n, c] of Object.entries(count)) {
        freq[c].push(Number(n));  // 3. Place on shelf
    }

    const res = [];  // 4. Result list
    for (let i = freq.length - 1; i > 0; i--) {  // 5. Walk backwards
        for (const n of freq[i]) {
            res.push(n);  // 6. Grab from shelf
            if (res.length === k) return res;  // 7. Found k elements!
        }
    }
    return res;
};`,
      java: `class Solution {
    public int[] topKFrequent(int[] nums, int k) {
        Map<Integer, Integer> count = new HashMap<>();  // 1. Whiteboard
        for (int n : nums) {
            count.put(n, count.getOrDefault(n, 0) + 1);
        }

        List<Integer>[] freq = new List[nums.length + 1];  // 2. Shelves
        for (int i = 0; i < freq.length; i++) freq[i] = new ArrayList<>();
        for (Map.Entry<Integer, Integer> entry : count.entrySet()) {
            freq[entry.getValue()].add(entry.getKey());  // 3. Place on shelf
        }

        int[] res = new int[k];  // 4. Result array
        int idx = 0;
        for (int i = freq.length - 1; i > 0; i--) {  // 5. Walk backwards
            for (int n : freq[i]) {
                res[idx++] = n;  // 6. Grab from shelf
                if (idx == k) return res;  // 7. Found k elements!
            }
        }
        return res;
    }
}`,
    },
    generateSteps: (inputs) => {
      const rawNums = String(inputs.nums ?? '1, 2, 2, 3, 3, 3')
        .split(',')
        .map((x) => parseInt(x.trim(), 10))
        .filter((n) => !isNaN(n));
      const nums = rawNums.length > 0 ? rawNums : [1, 2, 2, 3, 3, 3];
      const k = parseInt(String(inputs.k ?? 2), 10);
      const steps: VisualizerStep[] = [];

      // Step 1: Init & Whiteboard
      const count: Record<number, number> = {};
      steps.push({
        lineNumber: 3,
        explanation: `Start topKFrequent with nums = [${nums.join(', ')}] and k = ${k}. Initialize empty whiteboard count = {}.`,
        variables: { nums: `[${nums.join(', ')}]`, k, count: '{}' },
        phase: 'init',
        countMap: {},
        freqShelves: Array.from({ length: nums.length + 1 }, () => []),
        collectedResults: [],
        kTarget: k,
      });

      // Phase 1: Count
      for (let i = 0; i < nums.length; i++) {
        const n = nums[i];
        count[n] = (count[n] || 0) + 1;
        steps.push({
          lineNumber: 5,
          explanation: `[Tally ${i + 1}/${nums.length}] Saw number ${n}. Tally count for ${n} is now ${count[n]}.`,
          variables: { n, count: JSON.stringify(count) },
          phase: 'deposit',
          countMap: { ...count },
          freqShelves: Array.from({ length: nums.length + 1 }, () => []),
          collectedResults: [],
          kTarget: k,
        });
      }

      // Phase 2: Create shelves and populate
      const freq: number[][] = Array.from({ length: nums.length + 1 }, () => []);
      steps.push({
        lineNumber: 7,
        explanation: `Initialize ${nums.length + 1} empty Frequency Shelves (indexed 0 to ${nums.length}).`,
        variables: { totalShelves: nums.length + 1 },
        phase: 'init',
        countMap: { ...count },
        freqShelves: freq.map((arr) => [...arr]),
        collectedResults: [],
        kTarget: k,
      });

      for (const [nStr, c] of Object.entries(count)) {
        const n = parseInt(nStr, 10);
        freq[c].push(n);
        steps.push({
          lineNumber: 9,
          explanation: `Number ${n} appeared ${c} time${c > 1 ? 's' : ''}. Place ${n} onto Shelf ${c}!`,
          variables: { number: n, frequency: c, shelf: `Shelf ${c}` },
          phase: 'insert',
          countMap: { ...count },
          freqShelves: freq.map((arr) => [...arr]),
          activeShelfIndex: c,
          collectedResults: [],
          kTarget: k,
        });
      }

      // Phase 3: Walk shelves in reverse
      const res: number[] = [];
      steps.push({
        lineNumber: 11,
        explanation: `Ready to collect top k = ${k} winners. Start walking shelves in reverse order from Shelf ${nums.length} down to 1.`,
        variables: { res: '[]', k },
        phase: 'inspect',
        countMap: { ...count },
        freqShelves: freq.map((arr) => [...arr]),
        collectedResults: [],
        kTarget: k,
      });

      for (let i = freq.length - 1; i > 0; i--) {
        const shelf = freq[i];
        steps.push({
          lineNumber: 12,
          explanation: `Inspecting Shelf ${i} (Numbers with frequency ${i}): ${shelf.length > 0 ? `[${shelf.join(', ')}]` : '(Empty)'}.`,
          variables: { shelfIndex: i, shelfContents: JSON.stringify(shelf), res: JSON.stringify(res) },
          phase: 'inspect',
          countMap: { ...count },
          freqShelves: freq.map((arr) => [...arr]),
          activeShelfIndex: i,
          collectedResults: [...res],
          kTarget: k,
        });

        for (const n of shelf) {
          res.push(n);
          steps.push({
            lineNumber: 14,
            explanation: `🎯 Grabbed ${n} from Shelf ${i}! Total collected: [${res.join(', ')}] (${res.length}/${k}).`,
            variables: { grabbedNumber: n, res: JSON.stringify(res), countCollected: res.length, k },
            phase: 'match',
            countMap: { ...count },
            freqShelves: freq.map((arr) => [...arr]),
            activeShelfIndex: i,
            collectedResults: [...res],
            kTarget: k,
          });

          if (res.length === k) {
            steps.push({
              lineNumber: 16,
              explanation: `🎉 Collected exactly k = ${k} most frequent numbers: [${res.join(', ')}]! Return result!`,
              variables: { result: JSON.stringify(res) },
              phase: 'finish',
              countMap: { ...count },
              freqShelves: freq.map((arr) => [...arr]),
              activeShelfIndex: i,
              collectedResults: [...res],
              kTarget: k,
            });
            return { steps, result: res };
          }
        }
      }

      return { steps, result: res };
    },
  },
];

interface LearningVisualizerScreenProps {
  isSidebarCollapsed?: boolean;
}

export const LearningVisualizerScreen: React.FC<LearningVisualizerScreenProps> = ({
  isSidebarCollapsed = false,
}) => {
  const [selectedProblemId, setSelectedProblemId] = useState<string>('contains-duplicate');
  const [activeLanguage, setActiveLanguage] = useState<'python' | 'cpp' | 'javascript' | 'java'>('python');
  const [activeTab, setActiveTab] = useState<'visualizer' | 'blueprint' | 'cheatsheet'>('visualizer');

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

  // Problem Mastery celebration modal
  const [celebratedProblem, setCelebratedProblem] = useState<{ topic: string; category?: string } | null>(null);

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

          {/* Segmented View Toggle (Visualizer vs Blueprint vs Cheat Sheet) */}
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
            <button
              onClick={() => setActiveTab('cheatsheet')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'cheatsheet'
                  ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-md shadow-purple-500/20 font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Cheat Sheet</span>
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
            className="px-3.5 py-1.5 rounded-xl text-xs font-black font-mono bg-[#161f28] hover:bg-slate-800 text-slate-300 hover:text-white flex items-center gap-1.5 cursor-pointer border border-slate-700 transition-all"
            title="Ask or input custom algorithm problem"
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
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

      {/* ================= MASTER DSA REVISION NOTEBOOK CHEAT SHEET VIEW ================= */}
      {activeTab === 'cheatsheet' && (
        <div className="flex-1 min-h-0 overflow-y-auto p-2 space-y-3.5 animate-in fade-in duration-200">
          {/* Framework Banner */}
          <div className="bg-gradient-to-r from-purple-950/60 via-indigo-950/40 to-slate-900 border-2 border-purple-500/40 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl">🧠</span>
                <h2 className="text-base sm:text-lg font-black text-white font-mono tracking-tight">
                  Master DSA Revision Notebook (NeetCode 150)
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-purple-200/90 font-medium leading-relaxed">
                <strong className="text-purple-300">Framework Rule:</strong> Never memorize syntax; memorize the physical pattern. Always draw the physical logic on paper before typing a single line of code.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[10px] font-mono bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full border border-purple-500/40 font-bold">
                NeetCode 150 Core
              </span>
            </div>
          </div>

          {/* Mental Trigger Cheat Sheet Table */}
          <div className="bg-[#121820] border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-400" />
                📑 Mental Trigger Cheat Sheet (Master Reference)
              </span>
              <span className="text-[10px] font-mono bg-amber-500/20 text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-500/40 font-bold">
                5 Core Patterns
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="py-2.5 px-3 font-extrabold uppercase">Goal / Requirement</th>
                    <th className="py-2.5 px-3 font-extrabold uppercase">Data Structure / Technique</th>
                    <th className="py-2.5 px-3 font-extrabold uppercase">Physical Analogy</th>
                    <th className="py-2.5 px-3 font-extrabold uppercase text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  <tr className="hover:bg-slate-800/30 transition">
                    <td className="py-3 px-3 font-bold text-white">
                      Check if an element was seen before (existence / duplicates)
                    </td>
                    <td className="py-3 px-3 text-emerald-400 font-bold">
                      <code className="bg-[#0b0f14] px-2 py-0.5 rounded border border-emerald-500/30">set()</code> (Hash Set)
                    </td>
                    <td className="py-3 px-3 text-amber-300 font-semibold">
                      📝 The Blank Notepad
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => {
                          setSelectedProblemId('contains-duplicate');
                          setActiveTab('visualizer');
                        }}
                        className="px-2.5 py-1 rounded-lg bg-emerald-600/80 hover:bg-emerald-500 text-white font-mono text-[10px] font-bold transition cursor-pointer shadow-xs"
                      >
                        Launch
                      </button>
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-800/30 transition">
                    <td className="py-3 px-3 font-bold text-white">
                      Track character frequencies / counts
                    </td>
                    <td className="py-3 px-3 text-emerald-400 font-bold">
                      <code className="bg-[#0b0f14] px-2 py-0.5 rounded border border-emerald-500/30">dict()</code> (Hash Map)
                    </td>
                    <td className="py-3 px-3 text-amber-300 font-semibold">
                      📊 The Whiteboard Tally / Bank Account
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => {
                          setSelectedProblemId('valid-anagram');
                          setActiveTab('visualizer');
                        }}
                        className="px-2.5 py-1 rounded-lg bg-emerald-600/80 hover:bg-emerald-500 text-white font-mono text-[10px] font-bold transition cursor-pointer shadow-xs"
                      >
                        Launch
                      </button>
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-800/30 transition">
                    <td className="py-3 px-3 font-bold text-white">
                      Find pair matching target sum + need indices
                    </td>
                    <td className="py-3 px-3 text-emerald-400 font-bold">
                      <code className="bg-[#0b0f14] px-2 py-0.5 rounded border border-emerald-500/30">dict()</code> (Hash Map: val → idx)
                    </td>
                    <td className="py-3 px-3 text-amber-300 font-semibold">
                      🔑 The "Wanted Partner" Lock &amp; Key
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => {
                          setSelectedProblemId('two-sum');
                          setActiveTab('visualizer');
                        }}
                        className="px-2.5 py-1 rounded-lg bg-emerald-600/80 hover:bg-emerald-500 text-white font-mono text-[10px] font-bold transition cursor-pointer shadow-xs"
                      >
                        Launch
                      </button>
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-800/30 transition">
                    <td className="py-3 px-3 font-bold text-white">
                      Reverse list / In-place element swapping
                    </td>
                    <td className="py-3 px-3 text-indigo-400 font-bold">
                      Two Pointers (<code className="bg-[#0b0f14] px-1.5 py-0.5 rounded border border-indigo-500/30">start</code>, <code className="bg-[#0b0f14] px-1.5 py-0.5 rounded border border-indigo-500/30">end</code>)
                    </td>
                    <td className="py-3 px-3 text-slate-300 font-semibold">
                      👉👈 Pointers moving inward
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span className="text-[10px] text-slate-500 font-bold">Coming next</span>
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-800/30 transition">
                    <td className="py-3 px-3 font-bold text-white">
                      Save space to O(1) without extra data structures
                    </td>
                    <td className="py-3 px-3 text-indigo-400 font-bold">
                      Sorting (<code className="bg-[#0b0f14] px-1.5 py-0.5 rounded border border-indigo-500/30">nums.sort()</code>)
                    </td>
                    <td className="py-3 px-3 text-slate-300 font-semibold">
                      🃏 Arranging deck in numerical order
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span className="text-[10px] text-slate-500 font-bold">Coming next</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 3 Interactive Revision Spread Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {PROBLEMS_DATA.map((prob, idx) => (
              <div
                key={prob.id}
                className="bg-[#121820] border border-slate-800 hover:border-slate-700 rounded-2xl p-4 flex flex-col justify-between space-y-3 shadow-lg transition-all hover:shadow-emerald-500/5"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-md border border-emerald-500/30">
                      Problem {idx + 1}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 font-bold">
                      {prob.subtitle}
                    </span>
                  </div>

                  <h3 className="text-sm font-black text-white font-mono">{prob.title}</h3>
                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {prob.description}
                  </p>

                  <div className="bg-[#0e1319] p-2.5 rounded-xl border border-slate-800 text-[11px] font-mono text-indigo-300 font-bold">
                    🎯 {prob.mentalTrigger}
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1 border-t border-slate-800/80">
                  <button
                    onClick={() => {
                      setSelectedProblemId(prob.id);
                      setActiveTab('visualizer');
                    }}
                    className="flex-1 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs flex items-center justify-center gap-1 cursor-pointer transition shadow-md"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Visualize</span>
                  </button>
                  <button
                    onClick={() => {
                      setSelectedProblemId(prob.id);
                      setActiveTab('blueprint');
                    }}
                    className="flex-1 py-1.5 rounded-xl bg-[#161f28] hover:bg-slate-800 text-slate-200 hover:text-white font-mono font-bold text-xs flex items-center justify-center gap-1 border border-slate-700 cursor-pointer transition"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                    <span>Blueprint</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= INTERACTIVE CODE & VISUALIZER (Zero-Scroll 14-Inch Viewport) ================= */}
      {activeTab === 'visualizer' && (
        <div className="flex-1 min-h-0 grid grid-cols-12 gap-2.5 animate-in fade-in duration-150">
          {/* LEFT PANE: Visualizer Graphic Canvas & Current Action Pill (7 Cols) */}
          <div className="col-span-12 lg:col-span-7 h-full flex flex-col gap-2 min-h-0">
            {/* ================= TEST YOUR OWN EXAMPLE LIVE INPUT BAR ================= */}
            <div className="shrink-0 bg-[#0e1319]/95 border border-slate-800/90 rounded-xl px-3 py-1.5 flex flex-wrap items-center justify-between gap-2.5 shadow-md">
              <div className="flex items-center gap-1.5 text-xs font-mono font-extrabold text-amber-400 shrink-0">
                <Sliders className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Try Your Own Example:</span>
                <span className="sm:hidden">Inputs:</span>
              </div>

              {/* Dynamic Input Fields for the Current Problem */}
              <div className="flex items-center gap-2.5 flex-wrap flex-1 min-w-0">
                {currentProblem.inputSchema.map((field) => (
                  <div key={field.key} className="flex items-center gap-1.5 text-xs font-mono min-w-0 flex-1 sm:flex-initial">
                    <label className="text-slate-400 font-bold text-[11px] whitespace-nowrap">{field.label}:</label>
                    <input
                      type={field.type === 'number' ? 'number' : 'text'}
                      value={problemInputs[field.key] ?? ''}
                      onChange={(e) => {
                        const val = field.type === 'number' ? (parseFloat(e.target.value) || 0) : e.target.value;
                        setProblemInputs((prev) => ({ ...prev, [field.key]: val }));
                        setCurrentStepIndex(0);
                        setIsPlaying(false);
                      }}
                      placeholder={field.placeholder}
                      className="bg-[#141c26] border border-slate-700/80 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/40 rounded-lg px-2.5 py-0.5 text-xs text-white font-mono font-bold focus:outline-hidden shadow-inner w-full sm:w-auto sm:min-w-[120px]"
                    />
                  </div>
                ))}
              </div>

              {/* Reset to Default Button */}
              <button
                type="button"
                onClick={() => {
                  setProblemInputs(currentProblem.defaultInput);
                  setCurrentStepIndex(0);
                  setIsPlaying(false);
                }}
                className="px-2.5 py-0.5 rounded-lg text-[10px] font-mono font-bold text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60 transition cursor-pointer shrink-0"
                title="Reset to default example"
              >
                Reset Default
              </button>
            </div>

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
              {/* ================= CONTAINS DUPLICATE: THE BLANK NOTEPAD (HASH SET) VISUAL MODEL ================= */}
              {selectedProblemId === 'contains-duplicate' && (
                <div className="w-full h-full flex flex-col justify-around items-center p-2 space-y-3">
                  {/* Header Status Bar / Bingo Indicator */}
                  <div className="w-full max-w-2xl bg-[#141c26] border-2 border-slate-700/80 rounded-2xl p-3.5 flex flex-wrap items-center justify-between gap-3 shadow-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-slate-400 uppercase">Current Card:</span>
                      {currentStep?.currentNum !== undefined ? (
                        <span className="px-3 py-1 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono font-black text-sm sm:text-base">
                          Card [{currentStep.currentIndex}]: {currentStep.currentNum}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-500 font-mono font-bold">(None)</span>
                      )}
                    </div>

                    {currentStep?.foundDuplicate && (
                      <div className="px-3 py-1 rounded-xl bg-emerald-500 text-slate-950 font-mono font-black text-xs flex items-center gap-1.5 shadow-md animate-bounce">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>BINGO! DUPLICATE FOUND: {currentStep.duplicateVal}</span>
                      </div>
                    )}

                    {currentStep?.phase === 'finish' && !currentStep.foundDuplicate && (
                      <div className="px-3 py-1 rounded-xl bg-slate-800 text-slate-300 font-mono font-bold text-xs flex items-center gap-1.5 border border-slate-700">
                        <span>All Distinct (No Duplicates)</span>
                      </div>
                    )}
                  </div>

                  {/* Array nums Cards with Pointer */}
                  <div className="w-full max-w-2xl bg-[#0e141c] border-2 border-slate-700/80 rounded-2xl p-4 space-y-2 shadow-xl">
                    <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-b border-slate-800 pb-2">
                      <span className="font-extrabold text-white flex items-center gap-2">
                        <Layers className="w-4 h-4 text-emerald-400" />
                        Array nums Cards (Flip one by one)
                      </span>
                      <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded-md text-slate-400 font-mono">
                        for num in nums:
                      </span>
                    </div>

                    <div className="flex items-center gap-3 flex-wrap justify-center py-2">
                      {(() => {
                        const raw = String(problemInputs.nums || '1, 2, 3, 1').split(',').map((s) => parseInt(s.trim(), 10)).filter((n) => !isNaN(n));
                        const nums = raw.length > 0 ? raw : [1, 2, 3, 1];
                        const activeIdx = currentStep?.currentIndex;
                        const isMatch = currentStep?.foundDuplicate;

                        return nums.map((val, idx) => {
                          const isCurrent = activeIdx === idx;
                          const isDuplicateMatch = isCurrent && isMatch;

                          return (
                            <div key={idx} className="flex flex-col items-center gap-1.5">
                              {/* Pointer indicator */}
                              <div className="h-5 flex items-center justify-center">
                                {isCurrent && (
                                  <span className="text-amber-300 bg-amber-950/90 text-[10px] font-mono font-black px-1.5 py-0.5 rounded border border-amber-500/50 animate-bounce">
                                    ↓ current
                                  </span>
                                )}
                              </div>

                              {/* Card Tile */}
                              <div
                                className={`w-13 h-13 sm:w-16 sm:h-16 rounded-2xl flex flex-col items-center justify-center font-mono font-black text-base sm:text-xl transition-all duration-200 shadow-md ${
                                  isDuplicateMatch
                                    ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 text-slate-950 scale-110 ring-4 ring-emerald-400/40 shadow-xl shadow-emerald-500/40 border-2 border-emerald-200 animate-pulse'
                                    : isCurrent
                                    ? 'bg-gradient-to-br from-amber-400 to-amber-500 text-slate-950 scale-110 ring-4 ring-amber-400/40 shadow-xl shadow-amber-500/40 border-2 border-amber-200'
                                    : 'bg-[#141c26] border-2 border-slate-700 text-white'
                                }`}
                              >
                                <span>{val}</span>
                              </div>

                              <span className="text-[10px] font-mono text-slate-400 font-bold">[{idx}]</span>
                            </div>
                          );
                        });
                      })()}
                    </div>
                  </div>

                  {/* The Blank Notepad / Hash Set (seen = set()) */}
                  <div className="w-full max-w-2xl bg-[#141c26] border-2 border-slate-700/80 rounded-2xl p-4 space-y-2.5 shadow-xl">
                    <div className="flex items-center justify-between text-xs font-mono text-slate-300 border-b border-slate-700/80 pb-2">
                      <span className="font-extrabold text-white flex items-center gap-2 text-sm">
                        <BookOpen className="w-4 h-4 text-emerald-400" />
                        The Blank Notepad (seen = set())
                      </span>
                      <span className="text-slate-400 font-bold text-xs bg-[#0b0f14] px-2.5 py-0.5 rounded-lg border border-slate-800">
                        O(1) Set Lookup &amp; Insertion
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5 flex-wrap min-h-[48px]">
                      {(() => {
                        const seenArr = (currentStep?.seenSet || []) as (number | string)[];
                        if (seenArr.length === 0) {
                          return <span className="text-xs text-slate-500 font-mono my-auto font-bold">(Notepad Blank — no numbers recorded yet)</span>;
                        }
                        return seenArr.map((item, sIdx) => {
                          const isMatch = currentStep?.foundDuplicate && String(currentStep.duplicateVal) === String(item);
                          return (
                            <div
                              key={sIdx}
                              className={`px-4 py-2 rounded-xl border-2 flex items-center gap-2 font-mono text-sm sm:text-base font-bold transition-all shadow-md ${
                                isMatch
                                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 ring-4 ring-emerald-400/40 scale-108 font-black shadow-lg shadow-emerald-500/30'
                                  : 'bg-[#0b0f14] border-slate-700 text-slate-200'
                              }`}
                            >
                              <span className="font-black text-white text-base">{item}</span>
                            </div>
                          );
                        });
                      })()}
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

              {/* ================= TWO SUM: THE WANTED POSTER / LOCK & KEY VISUAL MODEL ================= */}
              {selectedProblemId === 'two-sum' && (
                <div className="w-full h-full flex flex-col justify-around items-center p-2 space-y-3">
                  {/* Target & Active Math Equation Card */}
                  <div className="w-full max-w-2xl bg-[#141c26] border-2 border-slate-700/80 rounded-2xl p-3.5 flex flex-wrap items-center justify-between gap-3 shadow-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-slate-400 uppercase">Target Sum:</span>
                      <span className="px-3 py-1 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono font-black text-sm sm:text-base">
                        {problemInputs.target ?? 9}
                      </span>
                    </div>

                    {currentStep?.currentNum !== undefined && (
                      <div className="flex items-center gap-2 font-mono text-xs sm:text-sm font-bold bg-[#0b0f14] px-3 py-1 rounded-xl border border-slate-700">
                        <span className="text-slate-400">Card [{currentStep.currentIndex}]:</span>
                        <span className="text-white font-black">{currentStep.currentNum}</span>
                        <span className="text-emerald-400 font-bold">→ Wanted diff:</span>
                        <span className="text-emerald-300 font-black bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/40">
                          {currentStep.diff}
                        </span>
                      </div>
                    )}

                    {currentStep?.matchedIndices && (
                      <div className="px-3 py-1 rounded-xl bg-emerald-500 text-slate-950 font-mono font-black text-xs flex items-center gap-1.5 shadow-md animate-bounce">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>MATCH FOUND!</span>
                      </div>
                    )}
                  </div>

                  {/* Array nums Cards with Pointer */}
                  <div className="w-full max-w-2xl bg-[#0e141c] border-2 border-slate-700/80 rounded-2xl p-4 space-y-2 shadow-xl">
                    <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-b border-slate-800 pb-2">
                      <span className="font-extrabold text-white flex items-center gap-2">
                        <Layers className="w-4 h-4 text-emerald-400" />
                        Array nums Cards
                      </span>
                      <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded-md text-slate-400 font-mono">
                        Pick one by one
                      </span>
                    </div>

                    <div className="flex items-center gap-3 flex-wrap justify-center py-2">
                      {(() => {
                        const raw = String(problemInputs.nums || '2, 7, 11, 15').split(',').map((s) => parseInt(s.trim(), 10)).filter((n) => !isNaN(n));
                        const nums = raw.length > 0 ? raw : [2, 7, 11, 15];
                        const activeIdx = currentStep?.currentIndex;
                        const matched = currentStep?.matchedIndices;

                        return nums.map((val, idx) => {
                          const isCurrent = activeIdx === idx;
                          const isMatched = matched?.includes(idx);

                          return (
                            <div key={idx} className="flex flex-col items-center gap-1.5">
                              {/* Pointer indicator */}
                              <div className="h-5 flex items-center justify-center">
                                {isCurrent && (
                                  <span className="text-amber-300 bg-amber-950/90 text-[10px] font-mono font-black px-1.5 py-0.5 rounded border border-amber-500/50 animate-bounce">
                                    ↓ current
                                  </span>
                                )}
                                {isMatched && !isCurrent && (
                                  <span className="text-emerald-300 bg-emerald-950/90 text-[10px] font-mono font-black px-1.5 py-0.5 rounded border border-emerald-500/50">
                                    ✓ partner
                                  </span>
                                )}
                              </div>

                              {/* Card Tile */}
                              <div
                                className={`w-13 h-13 sm:w-16 sm:h-16 rounded-2xl flex flex-col items-center justify-center font-mono font-black text-base sm:text-xl transition-all duration-200 shadow-md ${
                                  isMatched
                                    ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 text-slate-950 scale-110 ring-4 ring-emerald-400/40 shadow-xl shadow-emerald-500/40 border-2 border-emerald-200 animate-pulse'
                                    : isCurrent
                                    ? 'bg-gradient-to-br from-amber-400 to-amber-500 text-slate-950 scale-110 ring-4 ring-amber-400/40 shadow-xl shadow-amber-500/40 border-2 border-amber-200'
                                    : 'bg-[#141c26] border-2 border-slate-700 text-white'
                                }`}
                              >
                                <span>{val}</span>
                              </div>

                              <span className="text-[10px] font-mono text-slate-400 font-bold">[{idx}]</span>
                            </div>
                          );
                        });
                      })()}
                    </div>
                  </div>

                  {/* The Notepad / Hash Map (prevMap) */}
                  <div className="w-full max-w-2xl bg-[#141c26] border-2 border-slate-700/80 rounded-2xl p-4 space-y-2.5 shadow-xl">
                    <div className="flex items-center justify-between text-xs font-mono text-slate-300 border-b border-slate-700/80 pb-2">
                      <span className="font-extrabold text-white flex items-center gap-2 text-sm">
                        <BookOpen className="w-4 h-4 text-amber-400" />
                        The Notepad (prevMap: val → index)
                      </span>
                      <span className="text-slate-400 font-bold text-xs bg-[#0b0f14] px-2.5 py-0.5 rounded-lg border border-slate-800">
                        O(1) Instant Lookup
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5 flex-wrap min-h-[48px]">
                      {(() => {
                        const prevMap = currentStep?.prevMap || {};
                        const keys = Object.keys(prevMap);
                        if (keys.length === 0) {
                          return <span className="text-xs text-slate-500 font-mono my-auto font-bold">(Notepad Empty — no numbers recorded yet)</span>;
                        }
                        return keys.map((numStr) => {
                          const idxVal = prevMap[numStr];
                          const isTargetDiff = currentStep?.diff !== undefined && String(currentStep.diff) === numStr;
                          const isMatchedKey = currentStep?.matchedIndices && String(currentStep.diff) === numStr;

                          return (
                            <div
                              key={numStr}
                              className={`px-3.5 py-2 rounded-xl border-2 flex items-center gap-2 font-mono text-sm sm:text-base font-bold transition-all shadow-md ${
                                isMatchedKey
                                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 ring-4 ring-emerald-400/40 scale-108 font-black shadow-lg shadow-emerald-500/30'
                                  : isTargetDiff
                                  ? 'bg-amber-500/25 border-amber-400 text-amber-300 ring-4 ring-amber-400/30 scale-108 font-black'
                                  : 'bg-[#0b0f14] border-slate-700 text-slate-200'
                              }`}
                            >
                              <span className="font-black text-white text-base">{numStr}</span>
                              <span className="text-slate-400 text-xs">→</span>
                              <span className="text-xs font-black px-2 py-0.5 rounded-md bg-slate-800 text-emerald-300 border border-slate-700">
                                idx {idxVal}
                              </span>
                            </div>
                          );
                        });
                      })()}
                    </div>
                  </div>
                </div>
              )}

              {/* ================= GROUP ANAGRAMS: THE LABELED BUCKETS VISUAL MODEL ================= */}
              {selectedProblemId === 'group-anagrams' && (
                <div className="w-full h-full flex flex-col justify-around items-center p-2 space-y-3">
                  {/* Word Inspection & Fingerprint Card */}
                  <div className="w-full max-w-2xl bg-[#141c26] border-2 border-slate-700/80 rounded-2xl p-3.5 flex flex-wrap items-center justify-between gap-3 shadow-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-slate-400 uppercase">Current Word:</span>
                      <span className="px-3 py-1 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/40 font-mono font-black text-sm sm:text-base">
                        {currentStep?.currentWord ? `"${currentStep.currentWord}"` : '—'}
                      </span>
                    </div>

                    {currentStep?.charFingerprint && (
                      <div className="flex items-center gap-2 font-mono text-xs sm:text-sm font-bold bg-[#0b0f14] px-3 py-1 rounded-xl border border-slate-700">
                        <span className="text-slate-400">Sorted Label:</span>
                        <span className="text-amber-300 font-black bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/40">
                          🏷️ "{currentStep.charFingerprint}"
                        </span>
                      </div>
                    )}

                    {currentStep?.phase === 'finish' && (
                      <div className="px-3 py-1 rounded-xl bg-emerald-500 text-slate-950 font-mono font-black text-xs flex items-center gap-1.5 shadow-md animate-bounce">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>ALL GROUPED!</span>
                      </div>
                    )}
                  </div>

                  {/* Input Words List */}
                  <div className="w-full max-w-2xl bg-[#0e141c] border-2 border-slate-700/80 rounded-2xl p-4 space-y-2 shadow-xl">
                    <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-b border-slate-800 pb-2">
                      <span className="font-extrabold text-white flex items-center gap-2">
                        <Layers className="w-4 h-4 text-purple-400" />
                        Original Input Words (strs)
                      </span>
                      <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded-md text-slate-400 font-mono">
                        Inspect &amp; Sort
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5 flex-wrap justify-center py-2">
                      {(() => {
                        const raw = String(problemInputs.strs || 'act, pots, tops, cat, stop, hat').split(',').map((s) => s.trim()).filter((s) => s.length > 0);
                        const words = raw.length > 0 ? raw : ['act', 'pots', 'tops', 'cat', 'stop', 'hat'];
                        const activeIdx = currentStep?.currentWordIndex;

                        return words.map((w, idx) => {
                          const isCurrent = activeIdx === idx;
                          const isProcessed = activeIdx !== undefined && idx < activeIdx;

                          return (
                            <div key={idx} className="flex flex-col items-center gap-1">
                              <div className="h-4 flex items-center justify-center">
                                {isCurrent && (
                                  <span className="text-purple-300 text-[10px] font-mono font-black animate-bounce">
                                    ↓ sorting
                                  </span>
                                )}
                              </div>
                              <div
                                className={`px-3 py-1.5 rounded-xl font-mono text-xs sm:text-sm font-black transition-all shadow-md ${
                                  isCurrent
                                    ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white scale-110 ring-4 ring-purple-400/40 shadow-purple-500/40 border-2 border-purple-200'
                                    : isProcessed
                                    ? 'bg-[#141c26] text-slate-400 border border-slate-700/50 opacity-60'
                                    : 'bg-[#141c26] border-2 border-slate-700 text-white'
                                }`}
                              >
                                "{w}"
                              </div>
                            </div>
                          );
                        });
                      })()}
                    </div>
                  </div>

                  {/* The Buckets Grid */}
                  <div className="w-full max-w-2xl bg-[#141c26] border-2 border-slate-700/80 rounded-2xl p-4 space-y-2.5 shadow-xl">
                    <div className="flex items-center justify-between text-xs font-mono text-slate-300 border-b border-slate-700/80 pb-2">
                      <span className="font-extrabold text-white flex items-center gap-2 text-sm">
                        <BookOpen className="w-4 h-4 text-emerald-400" />
                        The Labeled Buckets (res: sorted_str → [words])
                      </span>
                      <span className="text-slate-400 font-bold text-xs bg-[#0b0f14] px-2.5 py-0.5 rounded-lg border border-slate-800">
                        defaultdict(list)
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 min-h-[64px]">
                      {(() => {
                        const buckets = currentStep?.buckets || {};
                        const keys = Object.keys(buckets);
                        if (keys.length === 0) {
                          return <span className="col-span-full text-xs text-slate-500 font-mono my-auto font-bold text-center py-3">(Buckets Empty — no words sorted into buckets yet)</span>;
                        }
                        return keys.map((bucketKey) => {
                          const items = buckets[bucketKey] || [];
                          const isActiveBucket = currentStep?.activeBucketKey === bucketKey;

                          return (
                            <div
                              key={bucketKey}
                              className={`p-3 rounded-xl border-2 flex flex-col gap-2 font-mono transition-all shadow-md ${
                                isActiveBucket
                                  ? 'bg-gradient-to-b from-purple-950/60 to-[#101720] border-purple-400 ring-2 ring-purple-400/30 scale-102'
                                  : 'bg-[#0b0f14] border-slate-700 text-slate-200'
                              }`}
                            >
                              <div className="flex items-center justify-between border-b border-slate-700/60 pb-1">
                                <span className="text-xs font-black text-amber-300 flex items-center gap-1">
                                  🏷️ "{bucketKey}"
                                </span>
                                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-800 text-purple-300">
                                  {items.length} {items.length === 1 ? 'word' : 'words'}
                                </span>
                              </div>
                              <div className="flex flex-wrap gap-1.5">
                                {items.map((it, iIdx) => (
                                  <span
                                    key={iIdx}
                                    className="px-2 py-0.5 rounded-lg bg-purple-500/20 text-purple-200 border border-purple-500/30 text-xs font-bold font-mono"
                                  >
                                    "{it}"
                                  </span>
                                ))}
                              </div>
                            </div>
                          );
                        });
                      })()}
                    </div>
                  </div>
                </div>
              )}

              {/* ================= TOP K FREQUENT: THE FREQUENCY SHELVES VISUAL MODEL ================= */}
              {selectedProblemId === 'top-k-frequent-elements' && (
                <div className="w-full h-full flex flex-col justify-around items-center p-2 space-y-3">
                  {/* Top Header Card: Target K & Collected Winners */}
                  <div className="w-full max-w-2xl bg-[#141c26] border-2 border-slate-700/80 rounded-2xl p-3.5 flex flex-wrap items-center justify-between gap-3 shadow-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-slate-400 uppercase">Target K:</span>
                      <span className="px-3 py-1 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono font-black text-sm sm:text-base">
                        Top {problemInputs.k ?? 2} Elements
                      </span>
                    </div>

                    <div className="flex items-center gap-2 font-mono text-xs sm:text-sm font-bold bg-[#0b0f14] px-3 py-1 rounded-xl border border-slate-700">
                      <span className="text-slate-400">Winners Collected:</span>
                      <span className="text-emerald-300 font-black bg-emerald-950/60 px-2.5 py-0.5 rounded border border-emerald-500/40">
                        {currentStep?.collectedResults && currentStep.collectedResults.length > 0
                          ? `[${currentStep.collectedResults.join(', ')}]`
                          : '[]'}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        ({currentStep?.collectedResults?.length || 0}/{problemInputs.k ?? 2})
                      </span>
                    </div>

                    {currentStep?.phase === 'finish' && (
                      <div className="px-3 py-1 rounded-xl bg-emerald-500 text-slate-950 font-mono font-black text-xs flex items-center gap-1.5 shadow-md animate-bounce">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>TOP {problemInputs.k ?? 2} FOUND!</span>
                      </div>
                    )}
                  </div>

                  {/* Whiteboard Tally (Number -> Frequency Count) */}
                  <div className="w-full max-w-2xl bg-[#0e141c] border-2 border-slate-700/80 rounded-2xl p-4 space-y-2 shadow-xl">
                    <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-b border-slate-800 pb-2">
                      <span className="font-extrabold text-white flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-cyan-400" />
                        The Whiteboard Tally (count: number → frequency)
                      </span>
                      <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded-md text-slate-400 font-mono">
                        Phase 1: O(n) Count
                      </span>
                    </div>

                    <div className="flex items-center gap-3 flex-wrap justify-center py-2">
                      {(() => {
                        const countMap = currentStep?.countMap || {};
                        const keys = Object.keys(countMap);
                        if (keys.length === 0) {
                          return <span className="text-xs text-slate-500 font-mono py-2 font-bold">(Whiteboard Empty)</span>;
                        }
                        return keys.map((numStr) => {
                          const freqVal = countMap[numStr];
                          return (
                            <div
                              key={numStr}
                              className="px-3.5 py-2 rounded-xl bg-[#141c26] border-2 border-slate-700 flex items-center gap-2.5 font-mono text-sm shadow-md"
                            >
                              <span className="text-white font-black text-base">Num {numStr}</span>
                              <span className="text-slate-500">→</span>
                              <span className="px-2 py-0.5 rounded-md bg-cyan-950/70 text-cyan-300 font-bold border border-cyan-500/40 text-xs">
                                {freqVal}×
                              </span>
                            </div>
                          );
                        });
                      })()}
                    </div>
                  </div>

                  {/* The Frequency Shelves (Buckets) */}
                  <div className="w-full max-w-2xl bg-[#141c26] border-2 border-slate-700/80 rounded-2xl p-4 space-y-2.5 shadow-xl">
                    <div className="flex items-center justify-between text-xs font-mono text-slate-300 border-b border-slate-700/80 pb-2">
                      <span className="font-extrabold text-white flex items-center gap-2 text-sm">
                        <Layers className="w-4 h-4 text-amber-400" />
                        The Frequency Shelves (freq: index = count → [numbers])
                      </span>
                      <span className="text-amber-300 font-bold text-xs bg-amber-950/60 px-2.5 py-0.5 rounded-lg border border-amber-500/40">
                        reversed(freq)
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 max-h-48 overflow-y-auto p-1">
                      {(() => {
                        const shelves = currentStep?.freqShelves || [];
                        const activeIdx = currentStep?.activeShelfIndex;
                        const winners = currentStep?.collectedResults || [];

                        return shelves.map((items, idx) => {
                          if (idx === 0) return null; // Shelf 0 is always empty
                          const isActive = activeIdx === idx;
                          const hasItems = items && items.length > 0;

                          return (
                            <div
                              key={idx}
                              className={`p-2.5 rounded-xl border-2 flex flex-col gap-1.5 font-mono transition-all duration-200 shadow-md ${
                                isActive
                                  ? 'bg-gradient-to-b from-amber-950/80 to-[#101720] border-amber-400 ring-4 ring-amber-400/30 scale-105 shadow-amber-500/20'
                                  : hasItems
                                  ? 'bg-[#0e141c] border-slate-600/90 text-white'
                                  : 'bg-[#090d12] border-slate-800 text-slate-600 opacity-60'
                              }`}
                            >
                              <div className="flex items-center justify-between border-b border-slate-700/60 pb-1">
                                <span className={`text-[11px] font-black ${isActive ? 'text-amber-300' : 'text-slate-400'}`}>
                                  Shelf {idx} ({idx}×)
                                </span>
                                {isActive && (
                                  <span className="text-[9px] bg-amber-400 text-slate-950 px-1.5 py-0.2 rounded font-black animate-pulse">
                                    SCAN
                                  </span>
                                )}
                              </div>
                              <div className="flex flex-wrap gap-1 min-h-[22px] items-center">
                                {hasItems ? (
                                  items.map((nVal, nIdx) => {
                                    const isWinner = winners.includes(nVal);
                                    return (
                                      <span
                                        key={nIdx}
                                        className={`px-2 py-0.5 rounded-lg text-xs font-black font-mono shadow-xs ${
                                          isWinner
                                            ? 'bg-emerald-500 text-slate-950 ring-2 ring-emerald-300 border border-emerald-200 animate-pulse'
                                            : 'bg-cyan-950/80 text-cyan-200 border border-cyan-500/40'
                                        }`}
                                      >
                                        {nVal}
                                      </span>
                                    );
                                  })
                                ) : (
                                  <span className="text-[10px] text-slate-600 italic font-mono">(empty)</span>
                                )}
                              </div>
                            </div>
                          );
                        });
                      })()}
                    </div>
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
                    if (lower.includes('group') || lower.includes('bucket')) {
                      setSelectedProblemId('group-anagrams');
                    } else if (lower.includes('two sum') || lower.includes('pair') || lower.includes('target')) {
                      setSelectedProblemId('two-sum');
                    } else if (lower.includes('anagram') || lower.includes('bank')) {
                      setSelectedProblemId('valid-anagram');
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

      {/* Problem Mastery Celebration Modal */}
      {celebratedProblem && (
        <MasteryCelebrationModal
          isOpen={Boolean(celebratedProblem)}
          topic={celebratedProblem.topic}
          category={celebratedProblem.category || 'Algorithm Mastery'}
          xpPoints={600}
          onClose={() => setCelebratedProblem(null)}
        />
      )}
    </div>
  );
};
