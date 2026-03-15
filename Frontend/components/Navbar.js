"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const { user, logout, ready } = useAuth();

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <Link href="/" className={styles.logo}>
          AI Interview Coach
        </Link>
        <div className={styles.links}>
          <Link href="/" className={styles.link}>Home</Link>
          <Link href="/problems" className={styles.link}>Problems</Link>
          <a href="/#pricing" className={styles.link}>Pricing</a>
          <a href="/#testimonials" className={styles.link}>Testimonials</a>
          {ready && (
            user ? (
              <div className={styles.userWrap}>
                <Link href="/profile" className={styles.profileLink}>
                  {user.name}
                </Link>
                <button type="button" onClick={logout} className={styles.logoutBtn}>
                  Log out
                </button>
              </div>
            ) : (
              <>
                <Link href="/login" className={styles.linkSecondary}>Log in</Link>
                <Link href="/signup" className={styles.ctaBtn}>Get started</Link>
              </>
            )
          )}
        </div>
      </nav>
    </header>
  );
}
