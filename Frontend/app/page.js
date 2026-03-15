"use client";

import Link from "next/link";
import HeroMockup from "@/components/HeroMockup";
import styles from "./landing.module.css";

export default function Home() {
  return (
    <>
      <section className={styles.hero}>
        <div className={styles.heroGrid}>
          <div className={styles.heroContent}>
            <div className={styles.heroBadge}>
              <span className={styles.heroBadgeIcon}>&#9654;</span>
              AI powered practice
            </div>
            <h1 className={styles.heroTitle}>
              Fast. Focused. Interview-ready.
              <span className={styles.heroTitleAccent}> AI, done right for coding interviews.</span>
            </h1>
          <p className={styles.heroSubtitle}>
            From instant problem setup to real-time runs and AI follow-ups—practice like the real thing,
            with hints that teach and feedback that sticks.
          </p>
          <div className={styles.heroCta}>
            <Link href="/signup" className={styles.ctaPrimary}>
              Get started free
            </Link>
            <Link href="/problems" className={styles.ctaSecondary}>
              Browse problems
            </Link>
          </div>
          </div>
          <div className={styles.heroMockupWrap}>
            <HeroMockup />
          </div>
        </div>
        <div className={styles.heroBg} aria-hidden />
      </section>

      <section className={styles.features}>
        <h2 className={styles.sectionTitle}>Why AI Interview Coach</h2>
        <div className={styles.featureGrid}>
          <div className={styles.featureCard}>
            <span className={styles.featureIcon}>🧠</span>
            <h3>AI interviewer</h3>
            <p>Get follow-up questions on complexity and edge cases after each solution—just like a real interview.</p>
          </div>
          <div className={styles.featureCard}>
            <span className={styles.featureIcon}>💡</span>
            <h3>Progressive hints</h3>
            <p>Stuck? Unlock hints step by step instead of seeing the full solution—so you actually learn.</p>
          </div>
          <div className={styles.featureCard}>
            <span className={styles.featureIcon}>📊</span>
            <h3>Track progress</h3>
            <p>See strengths and weak spots. We recommend problems that target what you need to improve.</p>
          </div>
        </div>
      </section>

      <section id="testimonials" className={styles.testimonials}>
        <h2 className={styles.sectionTitle}>What developers say</h2>
        <div className={styles.quoteGrid}>
          <blockquote className={styles.quote}>
            <p>&ldquo;The AI follow-up questions made me think about my solutions in a way no other platform does. Landed my FAANG offer.&rdquo;</p>
            <footer>— Priya M., Software Engineer</footer>
          </blockquote>
          <blockquote className={styles.quote}>
            <p>&ldquo;Hints are perfectly paced—never too much, never too little. Exactly what I needed to break into tech.&rdquo;</p>
            <footer>— Alex K., New Grad</footer>
          </blockquote>
          <blockquote className={styles.quote}>
            <p>&ldquo;Feels like a real interview. Time pressure, follow-ups, and feedback. Best prep tool I&apos;ve used.&rdquo;</p>
            <footer>— Jordan T., Backend Developer</footer>
          </blockquote>
        </div>
      </section>

      <section id="pricing" className={styles.pricing}>
        <h2 className={styles.sectionTitle}>Simple pricing</h2>
        <div className={styles.priceGrid}>
          <div className={styles.priceCard}>
            <h3>Free</h3>
            <p className={styles.priceAmount}><span className={styles.currency}>$</span>0</p>
            <p className={styles.pricePeriod}>forever</p>
            <ul className={styles.priceFeatures}>
              <li>5 problems per day</li>
              <li>AI hints</li>
              <li>Basic interview mode</li>
            </ul>
            <Link href="/signup" className={styles.priceBtn}>Get started</Link>
          </div>
          <div className={`${styles.priceCard} ${styles.priceCardFeatured}`}>
            <span className={styles.badge}>Popular</span>
            <h3>Pro</h3>
            <p className={styles.priceAmount}><span className={styles.currency}>$</span>19</p>
            <p className={styles.pricePeriod}>/ month</p>
            <ul className={styles.priceFeatures}>
              <li>Unlimited problems</li>
              <li>Full AI interviewer</li>
              <li>Progress analytics</li>
              <li>Priority support</li>
            </ul>
            <Link href="/signup" className={styles.priceBtnFeatured}>Start free trial</Link>
          </div>
          <div className={styles.priceCard}>
            <h3>Team</h3>
            <p className={styles.priceAmount}><span className={styles.currency}>$</span>49</p>
            <p className={styles.pricePeriod}>/ seat / month</p>
            <ul className={styles.priceFeatures}>
              <li>Everything in Pro</li>
              <li>Team dashboard</li>
              <li>Custom problem sets</li>
              <li>SSO &amp; admin</li>
            </ul>
            <Link href="/signup" className={styles.priceBtn}>Contact sales</Link>
          </div>
        </div>
      </section>

      <section className={styles.ctaSection}>
        <div className={styles.ctaBox}>
          <h2>Ready to practice?</h2>
          <p>Join developers who use AI Interview Coach to prepare for their next role.</p>
          <Link href="/signup" className={styles.ctaPrimary}>Create free account</Link>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <Link href="/" className={styles.footerLogo}>AI Interview Coach</Link>
          <div className={styles.footerLinks}>
            <Link href="/problems">Problems</Link>
            <a href="/#pricing">Pricing</a>
            <a href="/#testimonials">Testimonials</a>
            <Link href="/login">Log in</Link>
          </div>
          <p className={styles.footerCopy}>&copy; {new Date().getFullYear()} AI Interview Coach. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}
