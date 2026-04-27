import type { DebouncedFunc } from 'lodash'
import { debounce } from 'lodash'
import { useEffect, useRef } from 'react'
export default function UseDebounce<T extends (...args: any[]) => any>(fn:T,delay:number) {
  const fnRef = useRef<DebouncedFunc<T>>()
  useEffect(() => {
    fnRef.current = debounce(fn,delay)
    return () => {
      fnRef.current?.cancel()
    }
  },[fn,delay])
  return fnRef
}