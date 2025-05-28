import { arrayMethods } from "./array.js";
import {
  def,
  isObject,
  parsePath,
  setValue,
  getFullKey,
  protoAugment,
} from "./utils.js";

export default function observe(data, superInfo) {
  if (!isObject(data)) return;
  let ob;
  if (typeof data.__ob__ === "undefined") {
    ob = new Observer(data, superInfo);
  } else ob = data.__ob__;
  return ob;
}

export class Observer {
  constructor(data, superInfo) {
    def(data, "__ob__", this);
    this.state = data;
    this.superInfo = superInfo;
    this.listeners = [];

    if (Array.isArray(data)) {
      protoAugment(data, arrayMethods);
      this.observeArray(data);
      return;
    }
    this.walk(data);
  }

  walk(obj) {
    const keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i++) {
      defineReactive(obj, keys[i], this, { key: keys[i], ctx: this });
    }
  }

  observeArray(list) {
    for (let i = 0; i < list.length; i++) {
      observe(list[i]);
    }
  }

  onChange(fn) {
    this.listeners.push(fn);
  }

  getTopCtx() {
    if (!this.superInfo) return this;
    return this.superInfo.ctx.getTopCtx();
  }

  update(key, newValue, oldValue) {
    const ctx = this.getTopCtx();
    ctx.listeners.forEach((fn) => fn(key, newValue, oldValue));
  }

  useState(target, keyMap) {
    const syncSate = (key) => {
      if (!keyMap.some((v) => key.startsWith(v))) return;
      setValue(target, parsePath(key)(this.state), key);
      const topKey = key.split(".")[0];
      if (isObject(target[topKey])) {
        target[topKey] = { ...target[topKey] };
      }
    };
    (keyMap || []).forEach((key) => syncSate(key));
    this.onChange(syncSate);
  }
}

export function defineReactive(target, key, ctx, superInfo) {
  let value = target[key];
  observe(value, superInfo);

  Object.defineProperty(target, key, {
    enumerable: true,
    configurable: true,
    get() {
      return value;
    },
    set(newVal) {
      if (newVal === value) return;
      observe(newVal, superInfo);
      const oldValue = value;
      value = newVal;
      ctx.update(getFullKey(ctx.superInfo, key), newVal, oldValue);
    },
  });
}
