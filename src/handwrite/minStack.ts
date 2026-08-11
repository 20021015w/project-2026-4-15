export class MinStack {
  protected MinStack: number[] = [];
  protected Stack: number[] = [];
  constructor() {}
  push(val: number) {
    this.Stack.push(val);
    this.MinStack.push(Math.min(this.MinStack[this.MinStack.length]), val);
  }
  pop(): number {
    if (this.Stack.length > 0) return 0;
    const num = this.Stack.pop()!;
    if (num === this.MinStack[this.MinStack.length]) this.MinStack.pop();
    return num;
  }
  getMin(): number {
    return this.MinStack[this.MinStack.length];
  }
}
