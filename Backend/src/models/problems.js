// In-memory store for problems (no DB required to run).
// Set DATABASE_URL to use PostgreSQL instead (see services/db.js if added).

const problems = [
  {
    id: "1",
    title: "Two Sum",
    difficulty: "easy",
    topic: "Arrays",
    description: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

**Example 1:**
\`\`\`
Input: nums = [2, 7, 11, 15], target = 9
Output: [0, 1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].
\`\`\`

**Example 2:**
\`\`\`
Input: nums = [3, 2, 4], target = 6
Output: [1, 2]
\`\`\`

**Constraints:** 2 <= nums.length <= 10^4, -10^9 <= nums[i] <= 10^9`,
    starterCode: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function twoSum(nums, target) {
  // Your code here
  return [];
}`,
    hints: [
      "Consider how to track previously seen elements.",
      "A hash-based structure may reduce time complexity.",
      "Try using a hash map to store complements (target - nums[i]).",
    ],
    solutionSnippet: "Use a Map: for each num, check if (target - num) exists in the map; else store num -> index.",
    fnName: "twoSum",
    testCases: [
      { name: "Example 1", input: [[2, 7, 11, 15], 9], expected: [0, 1] },
      { name: "Example 2", input: [[3, 2, 4], 6], expected: [1, 2] },
      { name: "Two same", input: [[3, 3], 6], expected: [0, 1] },
    ],
  },
  {
    id: "2",
    title: "Valid Parentheses",
    difficulty: "easy",
    topic: "Stack",
    description: `Given a string \`s\` containing just the characters \`'('\`, \`')'\`, \`'{'\`, \`'}'\`, \`'['\` and \`']'\`, determine if the input string is valid.

An input string is valid if:
- Open brackets are closed by the same type of brackets.
- Open brackets are closed in the correct order.

**Example 1:** Input: s = "()" → Output: true  
**Example 2:** Input: s = "()[]{}" → Output: true  
**Example 3:** Input: s = "(]" → Output: false`,
    starterCode: `/**
 * @param {string} s
 * @return {boolean}
 */
function isValid(s) {
  // Your code here
  return false;
}`,
    hints: [
      "Think about the order in which brackets must close.",
      "A stack is ideal for matching closing brackets to the most recent open one.",
      "Handle edge case: empty string and odd length.",
    ],
    solutionSnippet: "Use a stack: push opening brackets, pop and match on closing; check stack empty at end.",
    fnName: "isValid",
    testCases: [
      { name: "Simple", input: ["()"], expected: true },
      { name: "Multiple", input: ["()[]{}"], expected: true },
      { name: "Invalid", input: ["(]"], expected: false },
      { name: "Nested", input: ["([)]"], expected: false },
    ],
  },
  {
    id: "3",
    title: "Longest Substring Without Repeating Characters",
    difficulty: "medium",
    topic: "Sliding Window",
    description: `Given a string \`s\`, find the length of the longest substring without repeating characters.

**Example 1:** Input: s = "abcabcbb" → Output: 3 (e.g. "abc")  
**Example 2:** Input: s = "bbbbb" → Output: 1  
**Example 3:** Input: s = "pwwkew" → Output: 3 (e.g. "wke")`,
    starterCode: `/**
 * @param {string} s
 * @return {number}
 */
function lengthOfLongestSubstring(s) {
  // Your code here
  return 0;
}`,
    hints: [
      "You need to track which characters are in the current window.",
      "When you see a duplicate, shrink the window from the left.",
      "A hash set plus two pointers (sliding window) works well.",
    ],
    solutionSnippet: "Sliding window with a Set; when char repeats, move left until duplicate is removed.",
    fnName: "lengthOfLongestSubstring",
    testCases: [
      { name: "Example 1", input: ["abcabcbb"], expected: 3 },
      { name: "Example 2", input: ["bbbbb"], expected: 1 },
      { name: "Example 3", input: ["pwwkew"], expected: 3 },
    ],
  },
];

const problemMap = new Map(problems.map((p) => [p.id, p]));

export function getAllProblems(filters = {}) {
  let list = [...problems];
  if (filters.difficulty) {
    list = list.filter((p) => p.difficulty === filters.difficulty);
  }
  if (filters.topic) {
    list = list.filter((p) => p.topic === filters.topic);
  }
  return list;
}

export function getProblemById(id) {
  return problemMap.get(id) || null;
}
