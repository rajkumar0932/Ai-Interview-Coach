"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { getProfileStats } from "@/lib/api";
import styles from "./page.module.css";

export default function ProfilePage() {
  const { user, ready } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ready) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    getProfileStats(user.email || user.id)
      .then(setStats)
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, [ready, user, router]);

  if (!ready || !user) return null;
  if (loading) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.loading}>
          <div className={styles.loadingDots}>
            <span />
            <span />
            <span />
          </div>
          <p>Loading your profile...</p>
        </div>
      </div>
    );
  }

  const acceptanceRate =
    stats.totalSubmissions > 0
      ? Math.round((stats.acceptedCount / stats.totalSubmissions) * 100)
      : 0;

  // Heatmap: last 84 days (12 weeks). Grid: 7 rows (Sun–Sat) × 12 cols (weeks). Column 0 = oldest week.
  const heatmapDays = [];
  const end = new Date();
  for (let i = 83; i >= 0; i--) {
    const d = new Date(end);
    d.setDate(d.getDate() - i);
    heatmapDays.push(d.toISOString().slice(0, 10));
  }
  const maxActivity = Math.max(1, ...Object.values(stats.activityByDate));
  const getDayIndex = (col, row) => col * 7 + row;

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <div className={styles.avatar}>
          {(user.name || user.email || "U").charAt(0).toUpperCase()}
        </div>
        <div className={styles.headerInfo}>
          <h1 className={styles.name}>{user.name || "Developer"}</h1>
          <p className={styles.email}>{user.email}</p>
        </div>
      </header>

      <section className={styles.statsRow}>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{stats.problemsSolved}</span>
          <span className={styles.statLabel}>Problems solved</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{stats.totalSubmissions}</span>
          <span className={styles.statLabel}>Total submissions</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{acceptanceRate}%</span>
          <span className={styles.statLabel}>Acceptance rate</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{stats.acceptedCount}</span>
          <span className={styles.statLabel}>Accepted runs</span>
        </div>
      </section>

      <div className={styles.twoCol}>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Strengths</h2>
          <p className={styles.sectionSubtitle}>Topics with strong performance</p>
          {stats.strengths.length === 0 ? (
            <p className={styles.empty}>Solve problems to see strengths.</p>
          ) : (
            <div className={styles.barList}>
              {stats.strengths.map((t) => (
                <div key={t.topic} className={styles.barItem}>
                  <div className={styles.barLabel}>
                    <span>{t.topic}</span>
                    <span className={styles.barPct}>{t.acceptanceRate}%</span>
                  </div>
                  <div className={styles.barTrack}>
                    <div
                      className={styles.barFillStrength}
                      style={{ width: `${t.acceptanceRate}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Areas to improve</h2>
          <p className={styles.sectionSubtitle}>Topics to practice more</p>
          {stats.weaknesses.length === 0 ? (
            <p className={styles.empty}>Keep practicing to find focus areas.</p>
          ) : (
            <div className={styles.barList}>
              {stats.weaknesses.map((t) => (
                <div key={t.topic} className={styles.barItem}>
                  <div className={styles.barLabel}>
                    <span>{t.topic}</span>
                    <span className={styles.barPct}>{t.acceptanceRate}%</span>
                  </div>
                  <div className={styles.barTrack}>
                    <div
                      className={styles.barFillWeak}
                      style={{ width: `${Math.min(t.acceptanceRate + 10, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Activity heatmap</h2>
        <p className={styles.sectionSubtitle}>Last 12 weeks · More activity = darker</p>
        <div className={styles.heatmapWrap}>
          <div className={styles.heatmapLegend}>
            <span>Less</span>
            <div className={styles.legendSwatches}>
              <span className={styles.legend0} />
              <span className={styles.legend1} />
              <span className={styles.legend2} />
              <span className={styles.legend3} />
            </div>
            <span>More</span>
          </div>
          <div className={styles.heatmapGrid}>
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className={styles.heatmapRowLabel}>
                {day}
              </div>
            ))}
            <div className={styles.heatmapRows}>
              {[0, 1, 2, 3, 4, 5, 6].map((row) => (
                <div key={row} className={styles.heatmapRow}>
                  {Array.from({ length: 12 }, (_, col) => {
                    const dayIndex = getDayIndex(col, row);
                    const dateStr = heatmapDays[dayIndex];
                    const count = stats.activityByDate[dateStr] || 0;
                    const level =
                      maxActivity <= 0
                        ? 0
                        : count === 0
                          ? 0
                          : count <= maxActivity / 4
                            ? 1
                            : count <= maxActivity / 2
                              ? 2
                              : 3;
                    return (
                      <div
                        key={dateStr}
                        className={`${styles.heatmapCell} ${styles[`level${level}`]}`}
                        title={`${dateStr}: ${count} submission(s)`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
          <div className={styles.heatmapWeekLabels}>
            {Array.from({ length: 12 }, (_, i) => (
              <span key={i} className={styles.weekLabel}>
                W{11 - i}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Recent activity</h2>
        <p className={styles.sectionSubtitle}>Your latest submissions</p>
        {stats.recentActivity.length === 0 ? (
          <p className={styles.empty}>
            No submissions yet.{" "}
            <Link href="/problems">Start with a problem</Link>.
          </p>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Problem</th>
                  <th>Status</th>
                  <th>Time</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentActivity.map((a) => (
                  <tr key={a.id}>
                    <td>
                      <Link href={`/problem/${a.problemId}`} className={styles.problemLink}>
                        {a.problemTitle}
                      </Link>
                    </td>
                    <td>
                      <span
                        className={
                          a.status === "accepted"
                            ? styles.statusOk
                            : styles.statusFail
                        }
                      >
                        {a.status.replace("_", " ")}
                      </span>
                    </td>
                    <td>{a.runtimeMs != null ? `${a.runtimeMs}ms` : "—"}</td>
                    <td className={styles.dateCell}>
                      {new Date(a.createdAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
