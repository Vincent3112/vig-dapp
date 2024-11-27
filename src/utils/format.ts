export function bigNumber(x: string) {
  if (!x) return null;
  const parts = x.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  if (parts[1]) {
    parts[1] = parts[1].substring(0, 2);
  }
  return parts.join(".");
}
