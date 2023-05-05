import { Swap } from "model/swap"

// swap requests from latest to earliest
export const sortRequestsByTime = (swapRequests: Swap[], pending: boolean = true): Swap[] => {
    return swapRequests.sort((a, b) => {
        return pending ? b.requestTime.getTime() - a.requestTime.getTime() : b.handledTime.getTime() - a.handledTime.getTime()
    })
}

// return time in the format of "Jan 1"
// if detailed is set, return time in the format of "Jan 1, 12:00 AM"
// if recentShowTime is set, return time in the format of "12:00 AM" if the time is today
export const formatRequestTime = (time: Date, detailed = false, recentShowTime = false): string => {
    if (recentShowTime && time.toDateString() === new Date().toDateString()) {
        return time.toLocaleString("default", {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
        });
    }

    const options: Intl.DateTimeFormatOptions = {
        month: "short",
        day: "2-digit",
    };
    if (detailed) {
        options.hour = "numeric"
        options.minute = "numeric"
        options.hour12 = true
    }
    return time.toLocaleString("default", options);
}