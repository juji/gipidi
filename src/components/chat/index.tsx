import { UserBubble, BotBubble } from "./bubble"
import { example } from "./example"
import styles from './style.module.css'

export function Chat(){

  return <div className={styles.chat}>
    {example.map((v) => {

      return v.type === 'u' ?
        <UserBubble key={v.id} content={v.content} /> :
        <BotBubble key={v.id} content={v.content} />

    })}
  </div>

}