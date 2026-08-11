function permutations(arr: string[]): string[][] {
  const result: string[][] = [];
  const path: string[] = [];
  const used: boolean[] = new Array(arr.length).fill(false);
  const backtrack = () => {
    if (path.length === arr.length) {
      result.push([...path]);
      return;
    }
    for (let i = 0; i < arr.length; i++) {
      if (used[i]) continue; // 跳过已使用的

      path.push(arr[i]);
      used[i] = true;
      backtrack();
      path.pop();
      used[i] = false;
    }
  };

  backtrack();
  return result;
}
