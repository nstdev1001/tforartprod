export const formatPrice = (price: number | undefined): string => {
  if (!price || price === 0) return "—";
  return new Intl.NumberFormat("vi-VN").format(price) + " ₫";
};

export const formatShortPrice = (price: number | undefined): string => {
  if (!price || price === 0) return "—";
  const million = price / 1_000_000;
  if (Number.isInteger(million)) {
    return `${million}tr`;
  }
  return `${million.toFixed(2)}tr`;
};
