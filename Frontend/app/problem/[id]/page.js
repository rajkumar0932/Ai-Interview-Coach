"use client";

import { useParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { useAuth } from "@/context/AuthContext";
import {
  getProblem,
  runCode,
  getHint,
  getInterviewQuestion,
  getInterviewReply,
} from "@/lib/api";
import styles from "./page.module.css";

export default function ProblemPage() {
  const { user } = useAuth();
  const params = useParams();
  const id = params?.id;
  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState("");
  const [runResult, setRunResult] = useState(null);
  const [running, setRunning] = useState(false);
  const [hintIndex, setHintIndex] = useState(-1);
  const [hint, setHint] = useState(null);
  const [chat, setChat] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [sendingChat, setSendingChat] = useState(false);
  const [showInterview, setShowInterview] = useState(false);

  useEffect(() => {
    if (!id) return;
    getProblem(id)
      .then((p) => {
        setProblem(p);
        setCode(p.starterCode || "");
      })
      .catch(() => setProblem(null));
  }, [id]);

  const handleRun = useCallback(async () => {
    if (!id || !code) return;
    setRunning(true);
    setRunResult(null);
    try {
      const userId = user?.email || user?.id || "anonymous";
      const data = await runCode(id, code, userId);
      setRunResult(data);
    } catch (e) {
      setRunResult({
        status: "error",
        stderr: e.message || "Request failed",
      });
    } finally {
      setRunning(false);
    }
  }, [id, code, user]);

  const requestHint = useCallback(async () => {
    if (!id) return;
    const nextIndex = hintIndex + 1;
    setHint(null);
    try {
      const h = await getHint(id, nextIndex);
      setHint(h);
      setHintIndex(nextIndex);
    } catch {
      setHint({ text: "No more hints available.", index: nextIndex, total: 0 });
    }
  }, [id, hintIndex]);

  const startInterview = useCallback(async () => {
    if (!id || chat.length > 0) return;
    setShowInterview(true);
    try {
      const { question } = await getInterviewQuestion(id, []);
      setChat([{ role: "assistant", content: question }]);
    } catch (e) {
      setChat([{ role: "assistant", content: "Could not load question. " + e.message }]);
    }
  }, [id, chat.length]);

  const sendChat = useCallback(async () => {
    const msg = chatInput.trim();
    if (!msg || sendingChat) return;
    setChat((c) => [...c, { role: "user", content: msg }]);
    setChatInput("");
    setSendingChat(true);
    try {
      const history = [...chat, { role: "user", content: msg }].map((m) => ({
        role: m.role,
        content: m.content,
      }));
      const { reply } = await getInterviewReply(msg, history);
      setChat((c) => [...c, { role: "assistant", content: reply }]);
    } catch (e) {
      setChat((c) => [
        ...c,
        { role: "assistant", content: "Sorry, I couldn't get a reply. " + e.message },
      ]);
    } finally {
      setSendingChat(false);
    }
  }, [chat, chatInput, sendingChat]);

  if (!problem) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.loadingWrap}>
          <div className={styles.loadingDots}>
            <span />
            <span />
            <span />
          </div>
          <p className={styles.muted}>Loading problem...</p>
          <Link href="/" className={styles.backLink}>← Back to problems</Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <nav className={styles.nav}>
        <Link href="/">← Back to problems</Link>
        <span className={`${styles.diff} ${styles[problem.difficulty]}`}>
          {problem.difficulty}
        </span>
        <span className={styles.topic}>{problem.topic}</span>
      </nav>

      <div className={styles.grid}>
        <div className={styles.panel}>
          <h1 className={styles.title}>{problem.title}</h1>
          <div className={styles.description}>
            <ReactMarkdown>{problem.description}</ReactMarkdown>
          </div>
        </div>

        <div className={styles.editorPanel}>
          <div className={styles.editorHeader}>Solution (JavaScript)</div>
          <textarea
            className={styles.editor}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
          />
          <div className={styles.actions}>
            <button
              className={styles.runBtn}
              onClick={handleRun}
              disabled={running}
            >
              {running ? "Running..." : "Run & Submit"}
            </button>
            <button
              className={styles.hintBtn}
              onClick={requestHint}
              type="button"
            >
              Get Hint {hintIndex >= 0 ? `(${hintIndex + 1})` : ""}
            </button>
            <button
              className={styles.interviewBtn}
              onClick={startInterview}
              disabled={chat.length > 0}
            >
              Start AI Interview
            </button>
          </div>

          {runResult && (
            <div className={styles.result}>
              <div className={styles.resultStatus}>
                Status:{" "}
                <span
                  className={
                    runResult.status === "accepted"
                      ? styles.statusOk
                      : styles.statusFail
                  }
                >
                  {runResult.status}
                </span>
                {runResult.runtimeMs != null && (
                  <span className={styles.runtime}> ({runResult.runtimeMs}ms)</span>
                )}
              </div>
              {runResult.results?.length > 0 && (
                <ul className={styles.testList}>
                  {runResult.results.map((t, i) => (
                    <li key={i} className={t.pass ? styles.pass : styles.fail}>
                      {t.name}: {t.pass ? "✓" : "✗"}
                      {!t.pass && t.actual !== undefined && (
                        <span> expected {JSON.stringify(t.expected)}, got{" "}
                          {JSON.stringify(t.actual)}</span>
                      )}
                      {!t.pass && t.error && <span> {t.error}</span>}
                    </li>
                  ))}
                </ul>
              )}
              {runResult.stderr && (
                <pre className={styles.stderr}>{runResult.stderr}</pre>
              )}
            </div>
          )}

          {hint && (
            <div className={styles.hintBox}>
              <strong>Hint {hint.index + 1}</strong>
              {hint.total > 0 && ` / ${hint.total}`}: {hint.text}
            </div>
          )}

          {showInterview && (
            <div className={styles.chat}>
              <h3>AI Interviewer</h3>
              <div className={styles.chatMessages}>
                {chat.map((m, i) => (
                  <div
                    key={i}
                    className={
                      m.role === "user" ? styles.chatUser : styles.chatBot
                    }
                  >
                    {m.content}
                  </div>
                ))}
              </div>
              <div className={styles.chatInputRow}>
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendChat()}
                  placeholder="Type your answer..."
                  className={styles.chatInput}
                />
                <button
                  onClick={sendChat}
                  disabled={sendingChat || !chatInput.trim()}
                >
                  Send
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
