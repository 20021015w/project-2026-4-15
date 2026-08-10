class MyPromise {
  private value: any;
  private reason: any;
  private state: 'fulfilled' | 'pending' | 'rejected' = 'pending';
  private fulfilCallBacks: Function[] = [];
  private rejectCallBacks: Function[] = [];

  constructor(excetor: (resolve: Function, reject: Function) => void) {
    const resolve = (value: any) => {
      if (this.state === 'pending') {
        this.state = 'fulfilled';
        this.value = value;
        this.fulfilCallBacks.forEach((cb) => cb(this.value));
      }
    };
    const reject = (reason: any) => {
      if (this.state === 'pending') {
        this.state = 'rejected';
        this.reason = reason;
        this.rejectCallBacks.forEach((cb) => cb(this.reason));
      }
    };
    try {
      excetor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  then(onFulfiled?: Function, onRejected?: Function) {
    // 值的穿透
    onFulfiled = typeof onFulfiled === 'function' ? onFulfiled : (value: any) => value;
    onRejected = typeof onRejected === 'function' ? onRejected : (reason: any) => { throw reason };

    return new MyPromise((resolve, reject) => {
      const handleFulfiled = () => {
        setTimeout(() => {
          try {
            const result = onFulfiled!(this.value);
            // 如果返回的是 Promise，递归处理
            if (result instanceof MyPromise) {
              result.then(resolve, reject);
            } else {
              resolve(result);
            }
          } catch (error) {
            reject(error);
          }
        }, 0);
      };

      const handleRejected = () => {
        setTimeout(() => {
          try {
            const result = onRejected!(this.reason);
            // 如果返回的是 Promise，递归处理
            if (result instanceof MyPromise) {
              result.then(resolve, reject);
            } else {
              resolve(result);  // 注意：rejected 回调中返回非错误值会转为 resolve
            }
          } catch (error) {
            reject(error);
          }
        }, 0);
      };

      if (this.state === 'pending') {
        this.fulfilCallBacks.push(() => handleFulfiled());
        this.rejectCallBacks.push(() => handleRejected());
      }
      if (this.state === 'fulfilled') {
        handleFulfiled();
      }
      if (this.state === 'rejected') {
        handleRejected();
      }
    });
  }

  // 添加 catch 方法
  catch(onRejected: Function) {
    return this.then(undefined, onRejected);
  }

  // 添加静态 resolve
  static resolve(value: any) {
    return new MyPromise((resolve) => resolve(value));
  }

  // 添加静态 reject
  static reject(reason: any) {
    return new MyPromise((_, reject) => reject(reason));
  }
}