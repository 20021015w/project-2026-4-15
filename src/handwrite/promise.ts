type resolveType = (value: any) => void;
type rejectType = (reason: any) => void;
export class Wsl {
  private state: "pending" | "resolve" | "reject" = "pending";
  private fulfilCallBacks: Function[] = [];
  private rejectedCallBacks: Function[] = [];
  private value: any;
  private reason: any;
  constructor(excetor: (resolve: resolveType, reject: rejectType) => void) {
    const resolve = (value: any) => {
      if (this.state !== "pending") return;
      if (value === this) throw new TypeError("循环引用");
      this.state = "resolve";
      this.value = value;
      this.fulfilCallBacks.forEach((cb) => cb());
    };
    const reject = (reason: any) => {
      if (this.state !== "pending") return;
      this.state = "reject";
      this.reason = reason;
      this.rejectedCallBacks.forEach((cb) => cb());
    };
    try {
      excetor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }
  then(onFulfiled: Function | any, onRejected: Function | any) {
    onFulfiled = typeof onFulfiled === "function" ? onFulfiled : (value: any) => value;
    onRejected =
      typeof onRejected === "function"
        ? onRejected
        : (reason: any) => {
            throw reason;
          };
    return new Wsl((nextResolve, nextRejected) => {
      const handleFulfiled = () => {
        setTimeout(() => {
          try {
            const result = onFulfiled(this.value);
            this.resolvePromise(result, nextResolve, nextRejected);
          } catch (e) {
            nextRejected(e);
          }
        }, 0);
      };
      const handleRejected = () => {
        setTimeout(() => {
          try {
            const res = onRejected(this.reason);
            this.resolvePromise(res, nextResolve, nextRejected);
          } catch (error) {
            nextRejected(error);
          }
        }, 0);
      };
      if (this.state === "pending") {
        this.fulfilCallBacks.push(handleFulfiled);
        this.rejectedCallBacks.push(handleRejected);
      }
      if (this.state === "reject") {
        handleRejected();
      }
      if (this.state === "resolve") {
        handleFulfiled();
      }
    });
  }
  resolvePromise(value: any, resolve: resolveType, reject: rejectType) {
    if (this.thenable(value)) {
      value.then(resolve, reject);
      return;
    }
    try {
      resolve(value);
    } catch (error) {
      reject(error);
    }
  }
  thenable(value: any) {
    if (typeof value === "object" && value !== null) {
      const then = value.then;
      if (then && typeof then === "function") return true;
    }
    return false;
  }
}
