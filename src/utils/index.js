export const formatMutipleNum = (num, mutiple = 100, forceNumer = true) => {
  const value = (mutiple === 0 ? num : num / mutiple).toFixed(2);
  return forceNumer ? Number(value) : value;
};
