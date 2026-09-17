// Implement type AllCombinations<S> that return all combinations of strings which use characters from S at most once.
// For example:
// type AllCombinations_ABC = AllCombinations<'ABC'>;
// // should be '' | 'A' | 'B' | 'C' | 'AB' | 'AC' | 'BA' | 'BC' | 'CA' | 'CB' | 'ABC' | 'ACB' | 'BAC' | 'BCA' | 'CAB' | 'CBA'

type StringToUnion<S> = S extends `${infer F}${infer R}` ? F | StringToUnion<R> : S;
type AllCombinations<
  S extends string,
  T extends string = StringToUnion<S>,
  U extends string = T,
> = S extends `${infer F}${infer R}`
  ? U extends U
    ? `${U}${AllCombinations<R, U extends "" ? T : Exclude<T, U>>}`
    : never
  : "";
type Combination = AllCombinations<"ABC">;
