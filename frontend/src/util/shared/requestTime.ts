import { Swap } from "model/swap"

// swap requests from latest to earliest
export const sortRequestsByTime = (swapRequests: Swap[]): Swap[] => {
    return swapRequests.sort((a, b) => {
        return b.requestTime.getTime() - a.requestTime.getTime();
    })
}

export const formatRequestTime = (request: Swap, detailed = false): string => {
    const options: Intl.DateTimeFormatOptions = {
        month: "short",
        day: "2-digit",
    };
    if (detailed) {
        options.hour = "numeric"
        options.minute = "numeric"
        options.hour12 = true
    }
    return request.requestTime.toLocaleString("default", options);
}