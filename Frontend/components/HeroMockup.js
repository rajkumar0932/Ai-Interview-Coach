"use client";

import styles from "./HeroMockup.module.css";

export default function HeroMockup() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.browserBar}>
        <span className={styles.dot} />
        <span className={styles.dot} />
        <span className={styles.dot} />
        <span className={styles.url}>app.aiinterviewcoach.com/problem/1</span>
      </div>
      <div className={styles.content}>
        <div className={styles.panelLeft}>
          <div className={styles.problemTitle}>Two Sum</div>
          <div className={styles.line} />
          <div className={styles.line} style={{ width: "90%" }} />
          <div className={styles.line} style={{ width: "70%" }} />
          <div className={styles.line} style={{ width: "85%" }} />
          <div className={styles.codeInline}>nums = [2, 7, 11, 15], target = 9</div>
          <div className={styles.line} style={{ width: "60%" }} />
        </div>
        <div className={styles.panelRight}>
          <div className={styles.editor}>
            <div className={styles.editorLine}><span className={styles.keyword}>function</span> twoSum(nums, target) {"{"}</div>
            <div className={styles.editorLine}><span className={styles.indent} />  <span className={styles.keyword}>const</span> map = <span className={styles.keyword}>new</span> Map();</div>
            <div className={styles.editorLine}><span className={styles.indent} />  <span className={styles.keyword}>for</span> (<span className={styles.keyword}>let</span> i = 0; i &lt; nums.length; i++) {"{"}</div>
            <div className={styles.editorLine}><span className={styles.indent} /><span className={styles.indent} />    <span className={styles.keyword}>if</span> (map.<span className={styles.fn}>has</span>(target - nums[i]))</div>
            <div className={styles.editorLine}><span className={styles.indent} /><span className={styles.indent} />      <span className={styles.keyword}>return</span> [map.<span className={styles.fn}>get</span>(...); i];</div>
            <div className={styles.editorLine}><span className={styles.indent} />  {"}"}</div>
            <div className={styles.editorLine}><span className={styles.indent} />  <span className={styles.keyword}>return</span> [];</div>
            <div className={styles.editorLine}>{"}"}</div>
          </div>
          <div className={styles.runRow}>
            <button type="button" className={styles.runBtn}>Run & Submit</button>
          </div>
        </div>
        <div className={styles.sidebar}>
          <div className={styles.timer}>
            <span className={styles.timerLabel}>Timer</span>
            <span className={styles.timerValue}>24:35</span>
          </div>
          <div className={styles.chat}>
            <span className={styles.chatLabel}>AI Interviewer</span>
            <div className={styles.chatBubble}>
              <p>What&apos;s the time complexity of your solution?</p>
            </div>
            <div className={styles.chatBubbleUser}>
              <p>O(n) with one pass.</p>
            </div>
            <div className={styles.chatInput}>
              <span>Type your answer...</span>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.glow} aria-hidden />
    </div>
  );
}
