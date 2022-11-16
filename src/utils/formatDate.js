export function formatDate(date) {
    const d = new Date(date);
    return d.toLocaleString("en-AU", {
      weekday: "short",
      // year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    });
  }