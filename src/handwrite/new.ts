export function myNew(constructor: Function, ...args: any[]) {
  const newObj = Object.create(constructor.prototype);
  const returnValue = constructor.apply(newObj, args);
  const isRefType =
    (typeof returnValue === "object" && returnValue !== null) || typeof returnValue === "function";
  return isRefType ? returnValue : newObj;
}
