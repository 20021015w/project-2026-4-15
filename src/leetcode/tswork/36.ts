// 实现 的类型版本Object.entries
// 例如：
interface Model {
  name: string;
  age: number;
  locations: string[] | null;
}
type modelEntries = ObjectEntries<Model>; // ['name', string] | ['age', number] | ['locations', string[] | null];
type ObjectEntries<T> = {
  [P in keyof T]: [P, T[P]];
}[keyof T];
