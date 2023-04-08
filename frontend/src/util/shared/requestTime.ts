import { Swap } from "model/swap"

// swap requests from latest to earliest
export const sortRequestsByTime = (swapRequests: Swap[]): Swap[] => {
    return swapRequests.sort((a, b) => {
        return new Date(b.requestTime).getTime() - new Date(a.requestTime).getTime();
    })
}

export const formatRequestTime = (request: Swap): string => {
    return new Date(request.requestTime).toLocaleString("default", {
        month: "short",
        day: "2-digit",
    });
}