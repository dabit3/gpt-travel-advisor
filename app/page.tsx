'use client'
import React from "react";

import styles from './page.module.css'
import Link from "next/link";

export default function Home() {
  return (
    <main>
      <div className={styles.homeContainer}>
        <div className={styles.texts}>
          <p className={styles.smallText}>Maya, your XGPT AI Assistant!</p>
          <p className={styles.bigText}>TRANSFORMING YOUR IDEAS INTO ENGAGING HACKATHONS & BOUNTIES EFFORTLESSLY AND PLAYFULLY</p>
          <Link
              className={`button ${styles.button}`}
              href="/try"
            >
              Try it now !
            </Link>
        </div>
        <div>
          <img
            alt="Maya avatar"
            src="/maya.png" 
          />
        </div>
      </div>
    </main>
  )
}