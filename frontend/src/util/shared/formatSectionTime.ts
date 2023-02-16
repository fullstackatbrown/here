const daysOfTheWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const timeFormatter = new Intl.DateTimeFormat('en-US', {
  hour: "numeric",
  hour12: true,
  minute: "numeric"
})

export default function formatSectionTime(
  startTime: Date,
  endTime: Date
): string {
  return `${
    daysOfTheWeek[startTime.getDay()]
  } ${timeFormatter.format(startTime)} to ${timeFormatter.format(endTime)}`;
}
