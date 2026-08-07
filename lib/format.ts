export function formatCurrency(value?: number | null): string {
  if (value == null || Number.isNaN(value)) return "—";
  return new Intl.NumberFormat("fr-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function parseCurrency(input: string): number | null {
  const digits = input.replace(/[^\d]/g, "");
  if (!digits) return null;
  return parseInt(digits, 10);
}
