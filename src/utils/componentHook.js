export const onDestroy = (cb, ctx) => {
  if (!ctx || !cb) return;
  const originDestory = ctx.$destroy.bind(ctx);
  ctx.$destroy = function () {
    originDestory();
    cb();
  };
};

export const onShow = (cb, ctx) => {
  if (!ctx.yz.page._onShow) ctx.yz.page._onShow = [];
  ctx.yz.page._onShow.push(cb);

  onDestroy(() => {
    ctx.yz.page._onShow = ctx.yz.page._onShow.filter((v) => v !== cb);
  }, ctx);
};

export const triggerShow = (ctx) => {
  if (!Array.isArray(ctx.yz.page._onShow)) return;
  ctx.yz.page._onShow.forEach((fn) => fn());
};
