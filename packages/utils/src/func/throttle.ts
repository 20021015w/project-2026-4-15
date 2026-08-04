export function useThrottle (fun:Function,delay:number):Function{
  let lastTime = 0
  return (...args: any[]) => {
    const now = new Date().getTime()
    if(now - delay >= lastTime){
      fun(...args)
    }
    lastTime = now
  }
}
export function useThrottleTimer(fun: Function, delay: number): Function {
  let timer: ReturnType<typeof setTimeout> | null = null;
  
  return (...args: any[]) => {
    if (!timer) {
      timer = setTimeout(() => {
        fun(...args);
        timer = null;
      }, delay);
    }
  };
}

export function useDebounce (fun: Function, delay: number):Function {
  let timer: ReturnType<typeof setTimeout> | null = null;
  return(...args: any[]) => {
    if(timer) clearTimeout(timer)
    if (!timer) {
      timer = setTimeout(() => {
        fun(...args);
        timer = null;
      }, delay);
    }
  };
}
