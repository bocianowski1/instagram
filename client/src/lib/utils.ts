export function formatDate(input: string): string {
  const inputDate = new Date(input);

  if (isNaN(inputDate.getTime())) {
    return "Now";
  }

  const now = new Date();
  const diff = now.getTime() - inputDate.getTime();

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  // Formatting based on the time difference
  if (minutes < 60) {
    if (minutes < 1) {
      return "Now";
    } else if (minutes === 1) {
      return "1 minute ago";
    } else return `${minutes} minutes ago`;
  } else if (hours < 24) {
    return `${hours} hours ago`;
  } else if (days < 7) {
    return `${days} days ago`;
  } else {
    return inputDate.toLocaleDateString();
  }
}
