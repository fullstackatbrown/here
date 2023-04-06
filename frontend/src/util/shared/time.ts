export function getNextWeekDate() {
    const nextWeek = new Date()
    nextWeek.setDate(new Date().getDate() + 7)
    nextWeek.setHours(23, 59)
    return nextWeek
}