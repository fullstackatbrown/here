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

export function formatDateTime(timeISO: string, f: string = "MM/dd/yyyy h:mma"): string {
  const time = new Date(timeISO)
  const timeZone = "America/New_York"
  const formattedTime = format(time, f, { timeZone })
  return formattedTime
}

// input: Tuesday,2014-08-18T04:00:00.000Z,2014-08-18T04:00:00.000Z
// output: Tuesday 12:00AM - 12:00AM
export function formatSurveyTime(time: string): string {
  const [day, startTimeStr, endTimeStr] = time.split(",")
  const formattedStartTime = formatDateTime(startTimeStr, "h:mma")
  const formattedEndTime = formatDateTime(endTimeStr, "h:mma")

  return `${day} ${formattedStartTime} - ${formattedEndTime}`

}