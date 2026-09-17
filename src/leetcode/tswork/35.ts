// 实现一个通用的RequiredByKeys<T, K>，它接收两个类型参数T和K。
// K指定应设为必选的T的属性集。当没有提供K时，它就和普通的Required<T>一样使所有的属性成为必选的。
// 例如:
interface User1 {
  name?: string;
  age?: number;
  address?: string;
}
type UserRequiredName = RequiredByKeys<User1, "name">; // { name: string; age?: number; address?: string }

type RequiredByKeys<T, K extends keyof T> = Omit<T, K> & {
  [P in keyof Pick<T, K>]-?: T[P];
};
