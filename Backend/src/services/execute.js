import { spawn } from "child_process";
import fs from "fs/promises";
import path from "path";
import os from "os";

const RUN_TIMEOUT_MS = 5000;
const HELPERS = `
function __runTests(fn, cases) {
  const results = [];
  for (const { name, input, expected } of cases) {
    try {
      const result = fn(...input);
      const pass = JSON.stringify(result) === JSON.stringify(expected);
      results.push({ name, pass, expected, actual: result });
    } catch (err) {
      results.push({ name, pass: false, error: String(err.message) });
    }
  }
  return results;
}
`;

/**
 * Run user code in a separate Node process with timeout.
 * Wraps code in a runner that calls the exported function with test cases.
 */
export async function runCode(code, problemId, testCases) {
  const problemRunners = {
    "1": {
      fnName: "twoSum",
      cases: [
        { name: "Example 1", input: [[2, 7, 11, 15], 9], expected: [0, 1] },
        { name: "Example 2", input: [[3, 2, 4], 6], expected: [1, 2] },
        { name: "Two same", input: [[3, 3], 6], expected: [0, 1] },
      ],
    },
    "2": {
      fnName: "isValid",
      cases: [
        { name: "Simple", input: ["()"], expected: true },
        { name: "Multiple", input: ["()[]{}"], expected: true },
        { name: "Invalid", input: ["(]"], expected: false },
        { name: "Nested", input: ["([)]"], expected: false },
      ],
    },
    "3": {
      fnName: "lengthOfLongestSubstring",
      cases: [
        { name: "Example 1", input: ["abcabcbb"], expected: 3 },
        { name: "Example 2", input: ["bbbbb"], expected: 1 },
        { name: "Example 3", input: ["pwwkew"], expected: 3 },
      ],
    },
  };

  const runner = problemRunners[problemId] || {
    fnName: "solution",
    cases: Array.isArray(testCases) && testCases.length
      ? testCases
      : [{ name: "Sample", input: [], expected: null }],
  };

  const wrapped = `
${HELPERS}
${code}
const results = __runTests(${runner.fnName}, ${JSON.stringify(runner.cases)});
console.log(JSON.stringify({ results }));
`;

  const tmpDir = os.tmpdir();
  const tmpFile = path.join(tmpDir, `run-${Date.now()}-${Math.random().toString(36).slice(2)}.cjs`);
  const start = Date.now();

  try {
    await fs.writeFile(tmpFile, wrapped, "utf8");
    const result = await new Promise((resolve, reject) => {
      const child = spawn("node", [tmpFile], {
        cwd: tmpDir,
        timeout: RUN_TIMEOUT_MS,
        stdio: ["ignore", "pipe", "pipe"],
      });
      let stdout = "";
      let stderr = "";
      child.stdout?.on("data", (d) => (stdout += d.toString()));
      child.stderr?.on("data", (d) => (stderr += d.toString()));
      child.on("error", (err) => reject(err));
      child.on("close", (code, signal) => {
        const runtimeMs = Date.now() - start;
        if (signal === "SIGTERM") {
          resolve({
            status: "timeout",
            stdout,
            stderr: stderr || "Execution timed out.",
            runtimeMs,
            results: null,
          });
        } else if (code !== 0) {
          resolve({
            status: "error",
            stdout,
            stderr: stderr || "Process exited with non-zero code.",
            runtimeMs,
            results: null,
          });
        } else {
          try {
            const parsed = JSON.parse(stdout.trim());
            const results = parsed.results || [];
            const allPass = results.every((r) => r.pass);
            resolve({
              status: allPass ? "accepted" : "wrong_answer",
              stdout,
              stderr,
              runtimeMs,
              results,
            });
          } catch {
            resolve({
              status: "error",
              stdout,
              stderr: stderr || "Invalid output format.",
              runtimeMs,
              results: null,
            });
          }
        }
      });
    });
    return result;
  } finally {
    await fs.unlink(tmpFile).catch(() => {});
  }
}
