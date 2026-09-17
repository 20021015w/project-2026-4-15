// 实现一个类型 ReplaceKeys，它能替换 union 类型的键，如果某个类型没有这个键，就直接跳过替换， 类型需要三个参数。

// 例如：

type NodeA = {
  type: "A";
  name: string;
  flag: number;
};

type NodeB = {
  type: "B";
  id: number;
  flag: number;
};

type NodeC = {
  type: "C";
  name: string;
  flag: number;
};

type Nodes = NodeA | NodeB | NodeC;

type ReplacedNodes = ReplaceKeys<Nodes, "name" | "flag", { name: number; flag: string }>; // {type: 'A', name: number, flag: string} | {type: 'B', id: number, flag: string} | {type: 'C', name: number, flag: string} // would replace name from string to number, replace flag from number to string.

type ReplacedNotExistKeys = ReplaceKeys<Nodes, "name", { aa: number }>; // {type: 'A', name: never, flag: number} | NodeB | {type: 'C', name: never, flag: number} // would replace name to never

type ReplaceKeys<Nodes, Keys, T> =
  Nodes extends Record<string, any>
    ? {
        [P in keyof Nodes]: P extends Keys ? (P extends keyof T ? T[P] : never) : Nodes[P];
      }
    : Nodes;
