// Implement a generic Fibonacci<T> that takes a number T and returns its corresponding Fibonacci number.

// The sequence starts: 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, ...

// For example

// type Result1 = Fibonacci<3> // 2
// type Result2 = Fibonacci<8> // 21
type Fibonacci<
  T extends number,
  currnet extends number = 2,
  result extends number[] = [],
> = T extends 1
  ? [1]
  : T extends 2
    ? [1, 1]
    : currnet extends T
      ? result
      : Fibonacci<T, PluseOne<currnet>, [1, 1]>;
