// 从 中，选择一组类型不可分配给的性质。TU
// 例如：
type OmitBoolean = OmitByType<
  {
    name: string;
    count: number;
    isReadonly: boolean;
    isEnable: boolean;
  },
  boolean
>; // { name: string; count: number }
type OmitByType<T extends {}, F> = {
  [P in keyof T as T[P] extends F ? never : P]: T[P];
};
