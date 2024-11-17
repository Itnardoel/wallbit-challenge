export function dateParser(date: number): string {
  const cartDate = new Date(date);
  const dayMonthYear = cartDate.toLocaleDateString();
  const hoursMinutsSeconds = cartDate.toLocaleTimeString();

  return `${dayMonthYear} - ${hoursMinutsSeconds.slice(0, -3)}`;
}
