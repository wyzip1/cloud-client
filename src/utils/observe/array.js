import { def, getFullKey } from "./utils.js";

const methodsMap = [
  "push",
  "splice",
  "pop",
  "unshift",
  "shift",
  "sort",
  "reverse",
];

const arrayProto = Array.prototype;
export const arrayMethods = Object.create(arrayProto);

methodsMap.forEach((method) => {
  def(arrayMethods, method, function (...arg) {
    // 调用数组原来的方法
    const oldList = [...this];
    const result = arrayProto[method].apply(this, arg);

    const ob = this.__ob__;
    // 如果是添加操作则对添加数据进行响应处理
    if (["push", "unshift"].includes(method)) {
      ob.observeArray(arg);
    } else if (method === "splice") {
      ob.observeArray(arg.slice(2));
    }

    ob.update(getFullKey(ob.superInfo), [...this], oldList);

    return result;
  });
});
