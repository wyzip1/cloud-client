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
