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
    for (const item of list) {
      observe(item);
    }
  }

  onChange(fn, target) {
    this.listeners.push(fn);

    onDestroy(() => {
      this.listeners = this.listeners.filter((v) => v !== fn);
    }, target);
  }

  watch(key, target, cb) {
    this.onChange((k, ...args) => {
      if (k !== key) return;
      cb(...args);
    }, target);
    cb(this.state[key]);
  }

  getTopCtx() {
    if (!this.superInfo) return this;
    return this.superInfo.ctx.getTopCtx();
  }

  update(key, newValue, oldValue) {
    const ctx = this.getTopCtx();
    ctx.listeners.forEach((fn) => fn(key, newValue, oldValue));
  }

  $set(key, value) {
    const oldValue = this.state[key];
    this.state[key] = value;
    if (Array.isArray(value)) {
      protoAugment(value, arrayMethods);
      this.observeArray(value);
    }
    defineReactive(this.state, key, this, { key, ctx: this });
    this.update(key, this.state[key], oldValue);
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

export default function createStore(ctx, state = {}, name = "store") {
  const ob = observe(state);
  ctx.yz.page[name] = observe(state);
  return ob;
}

export const setState = (ctx, value, name = "store") => {
  if (!value || !ctx.yz.page[name]) return;
  let result = value;
  if (typeof value === "function") {
    result = value(ctx.yz.page[name].state) || ctx.yz.page[name].state;
  }
  for (const key of Object.keys(result)) {
    if (Object.prototype.hasOwnProperty.call(ctx.yz.page[name].state, key))
      continue;
    ctx.yz.page[name].$set(key, result[key]);
  }
  Object.assign(ctx.yz.page[name].state, value);
};

export const useState = (ctx, keyMap, name = "store") => {
  if (!ctx.yz.page[name]) return;
  ctx.yz.page[name].useState(ctx, keyMap);

  for (const key of keyMap) {
    if (Object.prototype.hasOwnProperty.call(ctx.yz.page[name].state, key))
      continue;
    ctx.yz.page[name].$set(key, null);
  }
};

export const useWatch = (key, ctx, cb, name = "store") => {
  if (!ctx.yz.page[name]) return;
  ctx.yz.page[name].watch(key, ctx, cb);
};

export const getState = (ctx, name = "store") => {
  if (!ctx.yz.page[name]) return;
  return ctx.yz.page[name].state;
};
