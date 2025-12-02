"use client";
import { useState, FormEvent } from "react";
import styles from "./login.module.css";
import { useRouter } from "next/navigation";
import { redirect } from 'next/navigation';

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  function handleSubmit(e: FormEvent) {
    e.preventDefault();
  
    // redirect('/dashboard');
    router.push("/dashboard");
    // Placeholder: integrate authentication logic here
  }

  return (
    <div className={styles.loginContainer}>
      <div className={styles.card}>
        <header className={styles.header}> 
          <h1 className={styles.title}>Pioneer Service Kyoto</h1>
          <p className={styles.subtitle}>Blacklist Management System</p>
        </header>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.fieldGroup}>
            <label htmlFor="username" className={styles.label}>Username</label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              placeholder="Enter username"
              className={styles.input}
              value={username}
              onChange={e => setUsername(e.target.value)}
              
            />
          </div>
          <div className={styles.fieldGroup}>
            <label htmlFor="password" className={styles.label}>Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="Enter password"
              className={styles.input}
              value={password}
              onChange={e => setPassword(e.target.value)}
              
            />
          </div>
          <button type="submit" className={styles.button}>Login</button>
        </form>
        <p className={styles.demoNote}>Demo credentials: admin / pioneer2025</p>
      </div>
    </div>
  );
}
