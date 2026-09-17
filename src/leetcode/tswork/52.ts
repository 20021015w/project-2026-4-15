// 给定两个集合（并集），返回其笛卡尔积，组成一组元组，例如：

// // [1, 'a'] | [2, 'a'] | [1, 'b'] | [2, 'b']
type CartesianProduct<T, K> = T extends any ? (K extends any ? [T, K] : never) : never;
type DC = CartesianProduct<1 | 2, "a" | "b">;
