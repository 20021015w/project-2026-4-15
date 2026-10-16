const cyx = {
  role: "pretty",
  salary: 2000,
  access: 0,
};

const cxyProx = new Proxy(cyx, {
  get(target, prop, receiver) {
    // 可以在这里做拦截，比如隐藏某些字段
    if (prop === "salary") {
      return "保密";
    }
    return Reflect.get(target, prop, receiver);
  },

  set(target, prop, value, receiver) {
    if (prop === "access") {
      if (typeof value === "number" && value > 0) {
        return Reflect.set(target, prop, value, receiver);
      }
      // 不满足条件，拒绝赋值
      return false; // 严格模式下会抛 TypeError
    }
    // 其他属性正常赋值
    return Reflect.set(target, prop, value, receiver);
  },
});

console.log(cxyProx.role); // "pretty"
console.log(cxyProx.salary); // "保密"
console.log(cxyProx.access); // 0

cxyProx.access = 5;
console.log(cxyProx.access); // 5

cxyProx.access = -1;
console.log(cxyProx.access); // 5（没变，赋值被拒绝）
