export function formatCurrency(value: number, currency = "USDC") {
  return `${new Intl.NumberFormat("en", {
    maximumFractionDigits: 0,
  }).format(value)} ${currency}`;
}

export function compactAddress(address?: string) {
  if (!address) return "No wallet";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function formatDate(value?: string) {
  if (!value) return "Not scheduled";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function percent(part: number, total: number) {
  if (total <= 0) return 0;
  return Math.min(100, Math.max(0, (part / total) * 100));
}
