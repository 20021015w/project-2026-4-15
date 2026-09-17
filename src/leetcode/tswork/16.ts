// 实现一个接收string,number或bigInt类型参数的Absolute类型,返回一个正数字符串。
// 例如
// type Test = -100;
// type Result = Absolute<Test>; // expected to be "100"

type Absolute<T extends string | number | bigint> = `${T}` extends `-${infer Num}`
  ? Num extends `${infer Real}n`
    ? Real
    : Num
  : `${T}` extends `${infer Real}n`
    ? Real
    : `${T}`;

type Ab = Absolute<-123>;
