// 有时，您可能希望根据某个属性在联合类型中查找类型。
// 在此挑战中，我们想通过在联合类型Cat | Dog中通过指定公共属性type的值来获取相应的类型。换句话说，在以下示例中，LookUp<Dog | Cat, 'dog'>的结果应该是Dog，LookUp<Dog | Cat, 'cat'>的结果应该是Cat。
interface Cat {
  type: "cat";
  breeds: "Abyssinian" | "Shorthair" | "Curl" | "Bengal";
}
interface Dog {
  type: "dog";
  breeds: "Hound" | "Brittany" | "Bulldog" | "Boxer";
  color: "brown" | "white" | "black";
}
type MyDog = LookUp<Cat | Dog, "cat", "type">; // expected to be `Dog`

type LookUp<T, V, K extends keyof T> = T extends { [P in K]: V } ? T : never;
