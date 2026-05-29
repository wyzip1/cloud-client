import { onDestroy } from "../../utils/componentHook";
import createStore, {
  setState,
  useState,
  useWatch,
} from "../../utils/store/index";

export const createFormStore = (ctx) => {
  ctx.yz.page._formInstance = ctx;
  createStore(ctx, {}, "formStore");
};

export const getFormInstance = (ctx) => {
  return ctx.yz.page._formInstance;
};

export const useFormState = (ctx, keyMap) => {
  useState(ctx, keyMap, "formStore");
};

export const regiterFormItem = (formItemCtx, callback) => {
  if (!formItemCtx.yz.page._formItemList)
    formItemCtx.yz.page._formItemList = [];
  formItemCtx.yz.page._formItemList.push(formItemCtx);

  if (typeof callback === "function") callback(getFormInstance(formItemCtx));

  onDestroy(() => {
    formItemCtx.yz.page._formItemList =
      formItemCtx.yz.page._formItemList.filter((v) => v !== formItemCtx);
  }, formItemCtx);
};

export const getFormItemList = (ctx) => {
  return ctx.yz.page._formItemList || [];
};

export const useFormWatch = (key, ctx, cb) => {
  useWatch(key, ctx, cb, "formStore");
};

export const setFormState = (ctx, value) => {
  setState(ctx, value, "formStore");
};
