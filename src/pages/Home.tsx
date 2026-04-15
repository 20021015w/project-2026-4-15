import { useAppDispatch, useAppSelector } from '@/app/hook'
import { Button } from 'antd'
import { decrement, increment, selectCount } from '../features/conter/conterSlice'
import styles from './index.less'
const Home = () => {
    const number = useAppSelector(selectCount)
    const disPatch = useAppDispatch()
    return <>
        <span className={styles.spanNum}>{number}</span>
        <Button className={styles.antdBtn} onClick={() => disPatch(increment())}>+</Button>
        <Button className={styles.antdBtn} onClick={() => disPatch(decrement())}>-</Button>
    </>
}
export default Home