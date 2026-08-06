// 你正在维护一个项目，该项目有 n 个方法，编号从 0 到 n - 1。
// 给你两个整数 n 和 k，以及一个二维整数数组 invocations，其中 invocations[i] = [ai, bi] 表示方法 ai 调用了方法 bi。
// 已知如果方法 k 存在一个已知的 bug。那么方法 k 以及它直接或间接调用的任何方法都被视为 可疑方法 ，我们需要从项目中移除这些方法。
// 只有当一组方法没有被这组之外的任何方法调用时，这组方法才能被移除。
// 返回一个数组，包含移除所有 可疑方法 后剩下的所有方法。你可以以任意顺序返回答案。如果无法移除 所有 可疑方法，则 不 移除任何方法。
function remainingMethods(n: number, k: number, invocations: number[][]): number[] {
    const graph:number[][] = Array.from({length:n},() => [])
    for(const [a,b] of invocations){
      graph[a].push(b)
    }
    const suspect = new Set()
    const dfs = (start:number) => {
      if(suspect.has(start)) return
      suspect.add(start)
      for(const v of graph[start]) dfs(v)
    }
    dfs(k)
    let canAllRemove = true
    for(const [a,b] of invocations){
      if(!suspect.has(a) && suspect.has(b)) canAllRemove = false
    }
    if(!canAllRemove) return Array.from({length:n},(_,index) => index)
    return Array.from({length:n},(_,index) => index).filter(item => !suspect.has(item))
};