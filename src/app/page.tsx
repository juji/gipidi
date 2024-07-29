import { Chat } from "@/components/chat";
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
          <div></div>
          <div>
            <Chat />
          </div>
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
