"use client"
import { motion } from "framer-motion";
import Image from "next/image";
import styles from "./page.module.css";
import Link from "next/link";

export default function Home() {
  return (
    <main className={styles.main}>
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        Welcome to the Todo App
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        Please choose your Profile
      </motion.p>
      <motion.div
        className={styles.linkContainer}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1 }}
      >
        <div className="link-container">
            <Link href="/todo1" className="back-button">
                <motion.p
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    Go to Todo 1
                </motion.p>
            </Link>
            <Link href="/todo2" className="back-button">
                <motion.p
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    Go to Todo 2
                </motion.p>
            </Link>
        </div>
      </motion.div>
    </main>
  )
}