import { spawn } from "child_process";
import fs from "fs/promises";
import path from "path";
import os from "os";
import config from "../config/index.js";

// Helper to wrap user code with test cases and standardized JSON output
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

function parseExecutionResult(stdout, stderr, runtimeMs, timedOut) {
  if (timedOut) {
    return {
      status: "timeout",
      stdout,
      stderr: "Execution timed out.",
      runtimeMs,
      results: null,
    };
  }
  try {
    const parsed = JSON.parse(stdout.trim());
    const results = parsed.results || [];
    const allPass = results.every((r) => r.pass);
    return {
      status: allPass ? "accepted" : "wrong_answer",
      stdout,
      stderr,
      runtimeMs,
      results,
    };
  } catch {
    return {
      status: "error",
      stdout,
      stderr: stderr || "Runtime Error.",
      runtimeMs,
      results: null,
    };
  }
}

/**
 * PRODUCTION SECURE EXECUTION: Runs code inside a locked-down Docker container.
 * Security constraints satisfy Rule #7 by preventing network access, memory 
 * exhaustion, and host filesystem tampering.
 */
async function runCodeInDocker(wrappedCode, startTime) {
  const tmpDir = path.join(os.tmpdir(), `exec-${Date.now()}-${Math.random().toString(36).slice(2)}`);
  const scriptPath = path.join(tmpDir, "run.cjs");
  const containerName = `sandbox-${Date.now()}`;

  await fs.mkdir(tmpDir, { recursive: true });
  await fs.writeFile(scriptPath, wrappedCode, "utf8");

  return new Promise((resolve) => {
    let stdout = "";
    let stderr = "";

    // Hardened Security Arguments:
    // --cpus 0.5: Prevents a single submission from pinning the host CPU.
    // --pids-limit 30: Prevents "fork bombs" (spawning infinite processes).
    const args = [
      "run", "--rm", "--name", containerName,
      "--network", "none",
      "--memory", config.executionMemoryLimit || "128m",
      "--cpus", "0.5",
      "--pids-limit", "30",
      "--read-only",
      "--security-opt", "no-new-privileges",
      "--cap-drop", "ALL",
      "-v", `${path.resolve(tmpDir)}:/app:ro`,
      "node:20-alpine",
      "node", "/app/run.cjs",
    ];

    const child = spawn("docker", args);

    const timeoutId = setTimeout(() => {
      child.kill("SIGKILL");
      // Atomic force-kill to ensure cleanup of stalled containers
      spawn("docker", ["rm", "-f", containerName]); 
      resolve(parseExecutionResult(stdout, stderr, Date.now() - startTime, true));
    }, config.executionTimeoutMs);

    child.stdout.on("data", (d) => (stdout += d.toString()));
    child.stderr.on("data", (d) => (stderr += d.toString()));

    child.on("close", async () => {
      clearTimeout(timeoutId);
      await fs.rm(tmpDir, { recursive: true, force: true }).catch(() => {});
      resolve(parseExecutionResult(stdout, stderr, Date.now() - startTime, false));
    });
  });
}

/**
 * DEVELOPMENT ONLY: Insecure execution for local testing.
 */
async function runCodeInProcess(wrappedCode, startTime) {
  const tmpFile = path.join(os.tmpdir(), `local-${Date.now()}.cjs`);
  await fs.writeFile(tmpFile, wrappedCode, "utf8");

  return new Promise((resolve) => {
    const child = spawn("node", [tmpFile], { timeout: config.executionTimeoutMs });
    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (d) => (stdout += d.toString()));
    child.stderr.on("data", (d) => (stderr += d.toString()));

    child.on("close", async () => {
      await fs.unlink(tmpFile).catch(() => {});
      resolve(parseExecutionResult(stdout, stderr, Date.now() - startTime, false));
    });
  });
}

export async function runCode(code, problemId, testCases) {
  const runner = problemRunners[problemId] || {
    fnName: "solution",
    cases: Array.isArray(testCases) && testCases.length ? testCases : [{ name: "Sample", input: [], expected: null }],
  };

  const wrapped = `
${HELPERS}
${code}
const results = __runTests(${runner.fnName}, ${JSON.stringify(runner.cases)});
console.log(JSON.stringify({ results }));
`;

  const start = Date.now();

  if (config.useDockerExecution) {
    return await runCodeInDocker(wrapped, start);
  }

  if (config.nodeEnv === "production") {
    throw new Error("Docker execution is required in production.");
  }

  return await runCodeInProcess(wrapped, start);
}
