"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import styles from "./landing.module.css";

export default function Home() {
  return (
    <>
      <section className={styles.hero}>
        <div className={styles.heroSplit}>
          <motion.div
            className={styles.problemSide}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className={styles.problemTitle}>The Black Box</h2>
            <p className={styles.problemText}>
              You know you failed, but you don't know why. Traditional platforms give you red "Wrong Answer" screens with cryptic messages.
            </p>
            <div className={styles.problemVisual}>
              <div className={styles.errorScreen}>
                <div className={styles.errorIcon}>❌</div>
                <div className={styles.errorText}>Wrong Answer</div>
                <div className={styles.errorDetails}>Test case #2 failed</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            className={styles.solutionSide}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className={styles.solutionTitle}>The Bridge</h2>
            <p className={styles.solutionText}>
              Real-time dialogue that uncovers your logical gaps. AI interviewer asks follow-up questions on complexity and edge cases.
            </p>
            <div className={styles.solutionVisual}>
              <div className={styles.chatBubble}>
                <div className={styles.aiAvatar}>🤖</div>
                <div className={styles.chatContent}>
                  <div className={styles.chatHeader}>AI Interviewer</div>
                  <div className={styles.chatMessage}>
                    "What's the time complexity of your solution? Can you optimize it further?"
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          className={styles.heroCta}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Link href="/signup" className={styles.ctaPrimary}>
            Start Practicing Now
          </Link>
          <Link href="/problems" className={styles.ctaSecondary}>
            Browse Problems
          </Link>
        </motion.div>
      </section>

      <section className={styles.architecture}>
        <h2 className={styles.sectionTitle}>Secure by Design</h2>
        <p className={styles.sectionSubtitle}>Your code stays on your machine. AI runs locally.</p>
        <div className={styles.archDiagram}>
          <motion.div
            className={styles.archCard}
            whileHover={{ y: -10 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className={styles.cardIcon}>💻</div>
            <h3>Next.js Client</h3>
            <p>Modern React interface with Monaco editor</p>
          </motion.div>

          <motion.div
            className={styles.archCard}
            whileHover={{ y: -10 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className={styles.cardIcon}>🐳</div>
            <h3>Docker Sandbox</h3>
            <p>100% isolated execution environment</p>
          </motion.div>

          <motion.div
            className={styles.archCard}
            whileHover={{ y: -10 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className={styles.cardIcon}>🤖</div>
            <h3>Ollama AI</h3>
            <p>Local AI interviewer, no data leaves your device</p>
          </motion.div>
        </div>
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
