import { spawn } from "child_process";
import fs from "fs/promises";
import path from "path";
import os from "os";
import config from "../config/index.js";

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
      stderr: stderr || "Execution timed out.",
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
      stderr: stderr || "Invalid output format.",
      runtimeMs,
      results: null,
    };
  }
}

/**
 * Run user code inside an ephemeral Docker container.
 * Security: no network, limited memory, read-only filesystem, no new privileges.
 * Prevents access to host filesystem, .env, or network.
 */
async function runCodeInDocker(wrappedCode, startTime) {
  const tmpDir = path.join(
    os.tmpdir(),
    `exec-${Date.now()}-${Math.random().toString(36).slice(2)}`
  );
  const scriptPath = path.join(tmpDir, "run.cjs");
  const timeoutMs = config.executionTimeoutMs;
  const memoryLimit = config.executionMemoryLimit;
  const containerName = `exec-${Date.now()}-${Math.random().toString(36).slice(2)}`;

  await fs.mkdir(tmpDir, { recursive: true });
  await fs.writeFile(scriptPath, wrappedCode, "utf8");

  try {
    const result = await new Promise((resolve, reject) => {
      const volumeMount = path.resolve(tmpDir);
      const args = [
        "run",
        "--rm",
        "--name",
        containerName,
        "--network",
        "none",
        "--memory",
        memoryLimit,
        "--memory-swap",
        memoryLimit,
        "--pids-limit",
        "50",
        "--read-only",
        "--security-opt",
        "no-new-privileges",
        "--cap-drop",
        "ALL",
        "-v",
        `${volumeMount}:/app:ro`,
        "node:20-alpine",
        "node",
        "/app/run.cjs",
      ];

      const child = spawn("docker", args, {
        stdio: ["ignore", "pipe", "pipe"],
      });

      let stdout = "";
      let stderr = "";
      child.stdout?.on("data", (d) => (stdout += d.toString()));
      child.stderr?.on("data", (d) => (stderr += d.toString()));

      const timeoutId = setTimeout(() => {
        child.kill("SIGKILL");
        spawn("docker", ["kill", containerName], { stdio: "ignore" }).on(
          "error",
          () => {}
        );
        const runtimeMs = Date.now() - startTime;
        resolve(
          parseExecutionResult(stdout, stderr, runtimeMs, true)
        );
      }, timeoutMs);

      child.on("error", (err) => {
        clearTimeout(timeoutId);
        reject(err);
      });

      child.on("close", (code, signal) => {
        clearTimeout(timeoutId);
        const runtimeMs = Date.now() - startTime;
        if (signal === "SIGKILL") {
          resolve(parseExecutionResult(stdout, stderr, runtimeMs, true));
          return;
        }
        if (code !== 0) {
          resolve({
            status: "error",
            stdout,
            stderr: stderr || "Process exited with non-zero code.",
            runtimeMs,
            results: null,
          });
          return;
        }
        resolve(parseExecutionResult(stdout, stderr, runtimeMs, false));
      });
    });
    return result;
  } finally {
    await fs.rm(tmpDir, { recursive: true, force: true }).catch(() => {});
  }
}

/**
 * INSECURE: Runs user code directly on the host. Use only for local dev when Docker is unavailable.
 * User code can read .env, delete files, or access the network. Never use in production.
 */
async function runCodeInProcess(wrappedCode, startTime) {
  const tmpDir = os.tmpdir();
  const tmpFile = path.join(
    tmpDir,
    `run-${Date.now()}-${Math.random().toString(36).slice(2)}.cjs`
  );

  try {
    await fs.writeFile(tmpFile, wrappedCode, "utf8");
    const result = await new Promise((resolve, reject) => {
      const child = spawn("node", [tmpFile], {
        cwd: tmpDir,
        timeout: config.executionTimeoutMs,
        stdio: ["ignore", "pipe", "pipe"],
      });
      let stdout = "";
      let stderr = "";
      child.stdout?.on("data", (d) => (stdout += d.toString()));
      child.stderr?.on("data", (d) => (stderr += d.toString()));
      child.on("error", (err) => reject(err));
      child.on("close", (code, signal) => {
        const runtimeMs = Date.now() - startTime;
        if (signal === "SIGTERM") {
          resolve(
            parseExecutionResult(stdout, stderr, runtimeMs, true)
          );
        } else if (code !== 0) {
          resolve({
            status: "error",
            stdout,
            stderr: stderr || "Process exited with non-zero code.",
            runtimeMs,
            results: null,
          });
        } else {
          resolve(parseExecutionResult(stdout, stderr, runtimeMs, false));
        }
      });
    });
    return result;
  } finally {
    await fs.unlink(tmpFile).catch(() => {});
  }
}

/**
 * Run user code in an isolated environment (Docker by default).
 * Wraps code in a runner that calls the solution function with test cases.
 */
export async function runCode(code, problemId, testCases) {
  const runner = problemRunners[problemId] || {
    fnName: "solution",
    cases:
      Array.isArray(testCases) && testCases.length
        ? testCases
        : [{ name: "Sample", input: [], expected: null }],
  };

  const wrapped = `
${HELPERS}
${code}
const results = __runTests(${runner.fnName}, ${JSON.stringify(runner.cases)});
console.log(JSON.stringify({ results }));
`;

  const start = Date.now();

  if (config.useDockerExecution) {
    try {
      return await runCodeInDocker(wrapped, start);
    } catch (err) {
      console.error("Docker execution failed:", err.message);
      throw new Error(
        "Code execution is unavailable (Docker required). If running locally, set USE_DOCKER_EXECUTION=false only for development."
      );
    }
  }

  if (config.nodeEnv === "production") {
    throw new Error(
      "Docker execution is required in production. Set USE_DOCKER_EXECUTION=true and ensure Docker is available."
    );
  }
  console.warn(
    "[SECURITY] Running user code on host (USE_DOCKER_EXECUTION=false). Do not use in production."
  );
  return runCodeInProcess(wrapped, start);
}
