// 从 中，选择一组类型可分配到 的属性。TU
// 例如：
type OnlyBoolean = PickByType<
  {
    name: string;
    count: number;
    isReadonly: boolean;
    isEnable: boolean;
  },
  boolean
>; // { isReadonly: boolean; isEnable: boolean; }

type PickByType<T, U> = {
  [P in keyof T as T[P] extends U ? P : never]: T[P];
};
