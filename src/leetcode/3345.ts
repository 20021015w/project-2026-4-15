//给你两个整数 n 和 t 。请你返回大于等于 n 的 最小 整数，且该整数的 各数位之积 能被 t 整除。
function smallestNumber(n: number, t: number): number | undefined {
  for (let i = n; i <= 100; i++) {
    const num = Number(
      String(n)
        .split("")
        .reduce((a, b) => Number(a) * Number(b), 1),
    );
    if (num % t === 0) return num;
  }
}
