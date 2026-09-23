import { useEffect, useRef, useState } from "react";
// 自定义hooks，返回state、setState、ref
// 用于在effect中使用state的最新值
function useStateRef<T>(initialValue: T) {
  const [state, setState] = useState(initialValue);
  const ref = useRef(state);

  useEffect(() => {
    ref.current = state;
  }, [state]);

  return [state, setState, ref] as const;
}
export default useStateRef;
