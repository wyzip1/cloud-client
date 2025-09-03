import { onDestroy } from "../componentHook";
import arrayMethods from "./array";
import {
  def,
  isObject,
  parsePath,
  setValue,
  getFullKey,
  protoAugment,
  deepClone,
} from "./utils";

/**
 * @returns {Observer}
 */
export function observe(data, superInfo) {
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

  onChange(fn, target) {
    this.listeners.push(fn);

    onDestroy(() => {
      this.listeners = this.listeners.filter((v) => v !== fn);
    }, target);
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
      if (!keyMap.some((v) => v.startsWith(key) || key.startsWith(v))) return;
      const updateKey = keyMap.find((v) => v.startsWith(key)) || key;
      const value = deepClone(parsePath(updateKey)(this.state));
      setValue(target, value === undefined ? null : value, updateKey);
      if (isObject) {
        const topKey = updateKey.split(".")[0];
        target[topKey] = deepClone(target[topKey]);
      }
    };
    (keyMap || []).forEach((key) => syncSate(key));

    this.onChange(syncSate, target);
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

export default function createStore(ctx, state) {
  const ob = observe(state);
  ctx.yz.page.store = observe(state);
  return ob;
}

export const setState = (ctx, value) => {
  if (!value) return;
  if (typeof value === "function") value(ctx.yz.page.store.state);
  else {
    Object.assign(ctx.yz.page.store.state, value);
  }
};

export const useState = (ctx, keyMap) => {
  ctx.yz.page.store.useState(ctx, keyMap);
};
