import { zonedTimeToUtc, utcToZonedTime, format } from 'date-fns-tz'

export default function formatSectionTime(
  day: string,
  startTimeStr: string,
  endTimeStr: string
): string {
  const startTime = new Date(startTimeStr)
  const endTime = new Date(endTimeStr)
  const timeZone = "America/New_York"
  const formattedStartTime = format(startTime, "h:mma", { timeZone })
  const formattedEndTime = format(endTime, "h:mma", { timeZone })

  return `${day} ${formattedStartTime} - ${formattedEndTime}`
}
