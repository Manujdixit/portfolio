import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Extend dayjs with relative time plugin
dayjs.extend(relativeTime);

export function formatDate(date: string) {
  try {
    // Try parsing as-is first (handles ISO strings like "2024-01-15T10:30:00.000Z")
    let parsedDate = dayjs(date);

    // If that fails, try parsing common formats
    if (!parsedDate.isValid()) {
      // Handle formats like "Jan 15, 2024" or "January 15, 2024"
      parsedDate = dayjs(date.replace(/(\w+ \d{1,2}), (\d{4})/, "$2-$1"));
    }

    // If still fails, try dev.to specific format handling
    if (!parsedDate.isValid() && date.includes(" ")) {
      // Handle "Aug 2" format by adding current year
      const currentYear = dayjs().year();
      parsedDate = dayjs(`${date}, ${currentYear}`);

      // If the date appears to be in the future (more than a week from now), assume it's from last year
      if (parsedDate.isValid() && parsedDate.isAfter(dayjs().add(1, "week"))) {
        parsedDate = dayjs(`${date}, ${currentYear - 1}`);
      }
    }

    // If all parsing fails, return the original string
    if (!parsedDate.isValid()) {
      return date;
    }

    const now = dayjs();
    const fullDate = parsedDate.format("MMMM D, YYYY");

    // Use dayjs relative time for better accuracy
    const relative = parsedDate.from(now);

    // Handle special cases
    if (parsedDate.isSame(now, "day")) {
      return "Today";
    } else if (parsedDate.isAfter(now)) {
      return fullDate; // Future dates just show the date
    } else {
      return `${fullDate} (${relative})`;
    }
  } catch (error) {
    // If any error occurs, return the original string
    console.warn("Date parsing error:", error);
    return date;
  }
}
