export function isObject(target) {
  return target !== null && typeof target === "object";
}

export function def(obj, key, val, enumerable = false) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable,
    configurable: true,
    writable: true,
  });
}

export function parsePath(expression) {
  const attrs = expression.split(".");
  return (obj) => {
    for (const attr of attrs) {
      obj = obj[attr];
    }
    return obj;
  };
}

export function setValue(data, value, path) {
  if (!path) return data;

  const props = path.split(".");
  let current = data;

  for (let i = 0; i < props.length - 1; i++) {
    const prop = props[i];
    if (!current[prop]) current[prop] = {};

    current = current[prop];
  }

  current[props[props.length - 1]] = value;
  return data;
}

export function getFullKey(superInfo, fullKey) {
  if (!superInfo) return fullKey;
  return getFullKey(
    superInfo.ctx.superInfo,
    fullKey ? `${superInfo.key}.${fullKey}` : superInfo.key
  );
}

export function protoAugment(target, src) {
  target.__proto__ = src;
}

export function deepClone(obj, map = new WeakMap()) {
  // 处理非对象类型
  if (obj === null || typeof obj !== "object") return obj;

  // 处理循环引用
  if (map.has(obj)) return map.get(obj);

  // 处理特殊对象类型
  switch (obj.constructor) {
    case Date:
      return new Date(obj);
    case RegExp:
      return new RegExp(obj);
    case Map:
      return new Map(Array.from(obj, ([k, v]) => [k, deepClone(v, map)]));
    case Set:
      return new Set(Array.from(obj, (v) => deepClone(v, map)));
  }

  // 创建新对象/数组
  const clone = Array.isArray(obj)
    ? []
    : Object.create(Object.getPrototypeOf(obj));

  // 记录当前对象，防止循环引用
  map.set(obj, clone);

  // 递归复制属性
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      clone[key] = deepClone(obj[key], map);
    }
  }

  // 处理 Symbol 类型属性
  const symbols = Object.getOwnPropertySymbols(obj);
  for (const sym of symbols) {
    clone[sym] = deepClone(obj[sym], map);
  }

  return clone;
}
