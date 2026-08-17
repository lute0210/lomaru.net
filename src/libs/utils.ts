export function formatDate(iso: string) {
  const date = new Date(iso);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}.${month}.${day}`;
}

export function compareFn_date_str(a: string, b: string) {
  return new Date(a).getTime() - new Date(b).getTime();
}
