// 实现通用类型 JSONSchema2TS，它会返回对应给定 JSON 模式的 TypeScript 类型。
// 其他需要应对的挑战：
// 附加属性
// 其中之一，任一，全部
// 最小长度和最大长度
const schemaBasic = {
  type: "object",
  properties: {
    name: { type: "string" },
    age: { type: "number" },
  },
  required: ["name"],
} as const;

type JSONSchema2TS<T> = {
  -readonly [P in keyof T["properties"]]: T["properties"][P]["type"];
} & {
  [P in T["name"]]?: T["properties"][P]["type"];
};
type T1 = JSONSchema2TS<typeof schemaBasic>;
