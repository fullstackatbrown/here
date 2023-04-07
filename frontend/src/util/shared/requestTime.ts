import { SwapRequest } from "model/swapRequest"

// swap requests from latest to earliest
export const sortRequestsByTime = (swapRequests: SwapRequest[]): SwapRequest[] => {
    return swapRequests.sort((a, b) => {
        return new Date(b.requestTime).getTime() - new Date(a.requestTime).getTime();
    })
}

export const formatRequestTime = (request: SwapRequest): string => {
    return new Date(request.requestTime).toLocaleString("default", {
        month: "short",
        day: "2-digit",
    });
}