export const formatINR = (paise: number): string =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(paise / 100);

export const DELIVERY_FEE = 4900;
export const FREE_DELIVERY_ABOVE = 99900;
