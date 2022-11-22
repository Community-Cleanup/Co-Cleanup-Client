// format date takes a JS compatible date string
// then returns a formatted date string which is displayed for users to see
export function formatDate(date) {
  const d = new Date(date);
  return d.toLocaleString("en-AU", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });
}
