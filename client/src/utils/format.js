export function toDate(value) {
  if (!value) return null;
  const normalized = typeof value === "string" && value.length === 10 ? `${value}T12:00:00` : value;
  const date = new Date(normalized);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatDate(value) {
  const date = toDate(value);
  if (!date) return "Date to be announced";
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export function formatDateTime(value) {
  const date = toDate(value);
  if (!date) return "Date to be announced";
  return date.toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatMonth(value) {
  const date = toDate(value);
  if (!date) return "";
  return date.toLocaleDateString("en-GB", { month: "short" }).toUpperCase();
}

export function formatDay(value) {
  const date = toDate(value);
  if (!date) return "";
  return date.toLocaleDateString("en-GB", { day: "2-digit" });
}

export function truncate(text = "", length = 130) {
  if (text.length <= length) return text;
  return `${text.slice(0, length).trimEnd()}…`;
}

export function initials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function toInputDateTime(value) {
  const date = toDate(value);
  if (!date) return "";
  const pad = (number) => String(number).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(
    date.getMinutes(),
  )}`;
}
