import { format } from 'date-fns-tz'

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

export function formatDateTime(timeISO: string): string {
  const time = new Date(timeISO)
  const timeZone = "America/New_York"
  const formattedTime = format(time, "MM/dd/yyyy h:mma", { timeZone })
  return formattedTime
}