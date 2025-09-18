export const onDestroy = (cb, ctx) => {
  if (!ctx || !cb) return;
  const originDestory = ctx.$destroy.bind(ctx);
  ctx.$destroy = function () {
    originDestory();
    cb();
  };
};

/**
 *
 * @param {'show' | 'hide' | 'pullDownRefresh' | 'reachBottom' | 'pageScroll'} name
 * @param {Function} cb
 * @param {Object} ctx
 */
export const onPageEvent = (name, ctx, cb) => {
  if (!ctx.yz.page._pageEvents) ctx.yz.page._pageEvents = {};
  if (!ctx.yz.page._pageEvents[name]) ctx.yz.page._pageEvents[name] = [];
  ctx.yz.page._pageEvents[name].push(cb);

  const clearEvent = () => {
    ctx.yz.page._onShow = ctx.yz.page._pageEvents[name].filter((v) => v !== cb);
  };

  onDestroy(clearEvent, ctx);
  return clearEvent;
};

export const triggerPageEvent = (name, ctx) => {
  if (!Array.isArray((ctx.yz.page._pageEvents || {})[name])) return;
  ctx.yz.page._pageEvents[name].forEach((fn) => fn());
};
