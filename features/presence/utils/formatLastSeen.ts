export function formatLastSeen(
  timestamp: number,
  now: number
) {
  const diff = now - timestamp;

  const seconds = Math.floor(diff / 1000);

  if (seconds < 60) {
    return "Last seen just now";
  }

  const minutes = Math.floor(seconds / 60);

  if (minutes < 60) {
    return `Last seen ${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `Last seen ${hours} hour${hours === 1 ? "" : "s"} ago`;
  }

  const days = Math.floor(hours / 24);

  if (days === 1) {
    return "Last seen yesterday";
  }

  return (
    "Last seen " +
    new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "short",
      hour: "numeric",
      minute: "2-digit",
    }).format(timestamp)
  );
}