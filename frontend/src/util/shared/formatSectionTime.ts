const timeFormatter = new Intl.DateTimeFormat('en-US', {
  hour: "numeric",
  hour12: true,
  minute: "numeric"
})

export default function formatSectionTime(
  day: string,
  startTimeStr: string,
  endTimeStr: string
): string {
  const startTime = new Date(startTimeStr);
  const endTime = new Date(endTimeStr);
  return `${day
    } ${timeFormatter.format(startTime)}-${timeFormatter.format(endTime)}`;
}
