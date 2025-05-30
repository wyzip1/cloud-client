export const onDestroy = (cb, ctx) => {
  if (!ctx || !cb) return;
  const originDestory = ctx.$destroy.bind(ctx);
  ctx.$destroy = function () {
    originDestory();
    cb();
  };
};
