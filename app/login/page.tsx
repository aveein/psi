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
            <img src="/logo/2.jpg" alt="Pioneer Logo" style={{width: '30%', display: 'block', margin: '0 auto'}} className={styles.logo} />
          {/* <div style={{display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'space-between', gap: '8px'}}> */}
            <img src="/logo/1.jpg" alt="Pioneer Logo" style={{width: '100%', marginTop: '10px'}} className={styles.logo} />
          {/* </div> */}
          {/* <h1 className={styles.title}>Pioneer Service Kyoto</h1>
          <p className={styles.subtitle}>ブラックリスト管理システム</p> */}
        </header>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.fieldGroup}>
            <label htmlFor="username" className={styles.label}>Username | ユーザー名</label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              placeholder="Enter username | ユーザー名を入力"
              className={styles.input}
              value={username}
              onChange={e => setUsername(e.target.value)}
              
            />
          </div>
          <div className={styles.fieldGroup}>
            <label htmlFor="password" className={styles.label}>Password | パスワード</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="Enter password | パスワードを入力"
              className={styles.input}
              value={password}
              onChange={e => setPassword(e.target.value)}
              
            />
          </div>
          <button type="submit" className={styles.button}>Login | ログイン</button>
        </form>
        <p className={styles.demoNote}>Demo credentials | デモ資格情報 : admin / pioneer2025</p>
      </div>
    </div>
  );
}
