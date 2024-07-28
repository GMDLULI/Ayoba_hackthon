import styles from "./page.module.css";

export default function Home() {
  return (
    <>
    <main className={styles.main}>
      <div className={styles.description}>
        <p>
          Welcome to the Ayoba Business App. Start by editing&nbsp;
          <code className={styles.code}>src/app/page.tsx</code>
        </p>
      </div>

      <div className={styles.grid}>
        <a
          href="/docs"
          className={styles.card}
        >
          <h2>
            Docs <span>-&gt;</span>
          </h2>
          <p>Find detailed information about the Ayoba Business App features and API.</p>
        </a>
      </div>
    </main>
    </>
  );
}