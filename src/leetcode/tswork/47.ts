// 在这个挑战中，你应该实现一个类型，比如GreaterThan<T, U>T > U
// 负数无需考虑。
// 例如：
// GreaterThan<2, 1> //should be true
// GreaterThan<1, 1> //should be false
// GreaterThan<10, 100> //should be false
type G11 = GreaterThan<1, 11>; //should be true
type GreaterThan<num1 extends number, num2 extends number> = num1 extends num2
  ? false
  : BuildTuple<num1> extends [...BuildTuple<num2>, ...infer _]
    ? true
    : false;
