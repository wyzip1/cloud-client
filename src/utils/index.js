import Toast from "@youzan-cloud/tee-ui/dist/toast/toast";
import Dialog from "@youzan-cloud/tee-ui/dist/dialog/dialog";

export const formatMutipleNum = (num, mutiple = 100, forceNumer = true) => {
  const value = (mutiple === 0 ? num : num / mutiple).toFixed(2);
  return forceNumer ? Number(value) : value;
};

export const sleep = (ms) => new Promise((rev) => setTimeout(rev, ms));

export const withLoading = async (
  ctx,
  callback,
  { errAlertCallback, ...options } = {}
) => {
  const toast = Toast.loading({
    duration: 0,
    message: "加载中",
    forbidClick: true,
    context: ctx,
  });
  try {
    if (typeof callback !== "function") return;
    const res = await callback();
    return res;
  } catch (error) {
    if (!error) return Promise.reject(error);
    ctx.yz.app.yzLog("error", error);
    await sleep(100);
    Dialog.alert({
      title: "错误提示",
      message: Array.isArray(error)
        ? error[0].errMsg
        : (error.data || {}).message || error.message || error.errMsg,
      context: ctx,
      ...options,
    }).then(errAlertCallback);
    return Promise.reject(error);
  } finally {
    toast.clear();
  }
};

export const convertCssSize = (value) => {
  return typeof value === "number" ? `calc(100vw / 750 * ${value})` : value;
};

export function findTreePath(tree, callback, key = "children", path = []) {
  for (const node of tree) {
    const currentPath = [...path];
    currentPath.push(node);
    const isFind = callback(node);

    if (isFind) return currentPath;

    if (node[key] && node[key].length) {
      const findPath = findTreePath(node[key], callback, key, currentPath);
      if (findPath) return findPath;
    }
  }
}

export function parseDateFormatSetting(setting) {
  const result = [];
  const map = {};
  for (const index in setting.split("")) {
    const value = setting[index];
    map[value] = map[value] !== undefined ? map[value] + 1 : 0;
    result.push({ value, index: map[value] });
  }
  return result;
}

export function formatDate(value, formatSetting = "YYYY-MM-DD HH:mm:ss") {
  if (!value) return;
  const date =
    value instanceof Date
      ? value
      : new Date(
          typeof value === "string" && !value.includes(".")
            ? value.replace(/-/g, "/")
            : value
        );
  const year = date.getFullYear().toString();
  const month = formatNum(date.getMonth() + 1);
  const day = formatNum(date.getDate());
  const hour = formatNum(date.getHours());
  const minute = formatNum(date.getMinutes());
  const second = formatNum(date.getSeconds());
  const map = { Y: year, M: month, D: day, H: hour, m: minute, s: second };
  const setting = parseDateFormatSetting(formatSetting);
  let result = "";
  for (const item of setting) {
    const data = map[item.value];
    const value = data ? data[item.index] : item.value;
    result += value;
  }
  return result;
}

export const bindAuthEvent = async (ctx, id, callback) => {
  const authComponent = await ctx.yz.queryComponentById(id);
  if (authComponent) {
    authComponent.onUserAuthAllSuccess(callback);
    return;
  }
  await sleep(300);
  bindAuthEvent(ctx, id, callback);
};

export function formatNum(num, fixed = 2) {
  const value = num.toString();
  if (fixed <= value.length) return value;
  const preload = Array.from({ length: fixed - value.length }, () => "0").join(
    ""
  );
  return preload + value;
}

export const formatVideoTime = (time) => {
  if (typeof time !== "number") return time || "";

  const second = Math.floor(time % 60);
  const minute = Math.floor((time / 60) % 60);
  const hour = Math.floor(time / 60 / 60);
  const value = [hour, minute, second];
  const filterIdx = value.findIndex((item) => item > 0);
  const list = value.slice(filterIdx).map((item) => formatNum(item));

  return (list.length === 1 ? "00:" : "") + list.join(":");
};

const checkReady = (ctx) => {
  const data = ctx.yz ? ctx.yz.data || {} : {};
  const shop = data.shop || {};
  const user = data.user || {};
  if (!shop.kdtId || !user.info || !user.info.yzOpenId) {
    return false;
  }

  return true;
};

export const watchReady = (ctx, count = 0, yz) => {
  if (yz) yz.console.log("watchReady", count);

  return new Promise((rev, rej) => {
    if (checkReady(ctx)) rev(sleep(200));
    else if (count > 10) rej();
    else setTimeout(() => rev(watchReady(ctx, count + 1)), 500);
  });
};

export const getBoundingClientRect = (ctx, selector) => {
  return new Promise((rev) => {
    const query = ctx.createSelectorQuery();
    query
      .select(selector)
      .boundingClientRect()
      .exec((res) => {
        rev((res || [])[0]);
      });
  });
};

export function guid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export const getIsPc = (yz) => {
  return yz.getEnvSync() === "weapp" ||
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )
    ? false
    : true;
};

export function parseJSON(value) {
  try {
    return JSON.parse(value);
  } catch (_) {
    /* empty */
  }
  return value;
}

export function transferStringListToData(list) {
  return list.reduce((prev, current) => {
    const [key, data] = current.split("=");
    prev[key] = parseJSON(data);
    return prev;
  }, {});
}

export function transferQueryToData(search) {
  if (!search) return {};
  return transferStringListToData(search.split("&"));
}
