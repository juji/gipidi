import styles from "./page.module.css";
import { Inputform } from "@/components/input";
import { TopBar } from "@/components/topbar";

export default function Home() {
  return (
    <div className={styles.page}>
      <div className={styles.topbar}>
        <div className={styles.content}>
          <TopBar />
        </div>
      </div>
      <div className={styles.chat}>
        <div className={styles.content}>
          <p>chat</p>
          <p>chat</p>
          <p>chat</p>
          <p>chat</p>
          <p>chat</p>
          <p>chat</p>
          <p>chat</p>
          <p>chat</p>
          <p>chat</p>
          <p>chat</p>
          <p>chat</p>
          <p>chat</p>
          <p>chat</p>
          <p>chat</p>
          <p>chat</p>
          <p>chat</p>
          <p>chat</p>
          <p>chat</p>
          <p>chat</p>
          <p>chat</p>
          <p>chat</p>
          <p>chat</p>
          <p>chat</p>
          <p>chat</p>
          <p>chat</p>
          <p>chat</p>
          <p>chat</p>
          <p>chat</p>
          <p>chat</p>
          <p>chat</p>
        </div>
      </div>
      <div className={styles.input}>
        <div className={styles.content}>
          <Inputform />
        </div>
      </div>
    </div>
  );
}
