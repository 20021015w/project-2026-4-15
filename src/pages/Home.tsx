import { useAppDispatch, useAppSelector } from '@/app/hook'
import { useGurad } from '@/routers/useGuarg'
import { Button } from 'antd'
import { decrement, increment, selectCount } from '../features/conter/conterSlice'
import Chat from './ai/chat'
import styles from './index.less'
const Home = () => {
    useGurad()
    const number = useAppSelector(selectCount)
    const disPatch = useAppDispatch()
    return <>
        <span className={styles.spanNum}>{number}</span>
        <Button className={styles.antdBtn} onClick={() => disPatch(increment())}>+</Button>
        <Button className={styles.antdBtn} onClick={() => disPatch(decrement())}>-</Button>
        <Chat />
    </>
}
export default Home