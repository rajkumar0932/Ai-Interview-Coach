"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getProblems, getRecommendations } from "@/lib/api";
import styles from "./page.module.css";

export default function ProblemsPage() {
  const [problems, setProblems] = useState([]);
  const [rec, setRec] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({});

  useEffect(() => {
    Promise.all([getProblems(filter), getRecommendations()])
      .then(([data, recData]) => {
        setProblems(data.problems || []);
        setRec(recData);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [filter.difficulty, filter.topic]);

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <h1 className={styles.logo}>Practice problems</h1>
        <p className={styles.tagline}>
          Solve problems, run code, and get AI follow-ups and hints
        </p>
      </header>

      <main className={styles.main}>
        {rec && (rec.weaknesses?.length || rec.suggestedProblems?.length) && (
          <section className={styles.rec}>
            <h2>Recommended for you</h2>
            {rec.suggestedTopics?.length > 0 && (
              <p>
                <strong>Topics:</strong> {rec.suggestedTopics.join(", ")}
              </p>
            )}
            {rec.suggestedProblems?.length > 0 && (
              <p>
                <strong>Problems:</strong> {rec.suggestedProblems.join(", ")}
              </p>
            )}
          </section>
        )}

        <section className={styles.filters}>
          <span>Filter:</span>
          <select
            value={filter.difficulty || ""}
            onChange={(e) =>
              setFilter((f) => ({ ...f, difficulty: e.target.value || undefined }))
            }
          >
            <option value="">All difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
          <select
            value={filter.topic || ""}
            onChange={(e) =>
              setFilter((f) => ({ ...f, topic: e.target.value || undefined }))
            }
          >
            <option value="">All topics</option>
            <option value="Arrays">Arrays</option>
            <option value="Stack">Stack</option>
            <option value="Sliding Window">Sliding Window</option>
          </select>
        </section>

        <section className={styles.list}>
          <h2>Problems</h2>
          {loading ? (
            <div className={styles.loadingDots}>
              <span />
              <span />
              <span />
            </div>
          ) : problems.length === 0 ? (
            <p className={styles.emptyState}>No problems match your filters. Try changing difficulty or topic.</p>
          ) : (
            <ul className={styles.problemList}>
              {problems.map((p) => (
                <li key={p.id}>
                  <Link href={`/problem/${p.id}`} className={styles.problemCard}>
                    <span className={styles.title}>{p.title}</span>
                    <span className={styles[`diff_${p.difficulty}`]}>
                      {p.difficulty}
                    </span>
                    <span className={styles.topic}>{p.topic}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
