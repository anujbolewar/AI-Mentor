export const formatINR = (n) => { if (n === undefined || n === null) return ""; return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n); };
