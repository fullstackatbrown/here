export enum Errors {
    UNKNOWN = "Something went wrong. Try again later."
}

export const handleBadRequestError = (err: any) => {
    // Bad request, unauthorized, or forbidden
    if ([400, 401, 403].includes(err.response?.status)) {
        return err.response.data
    } else {
        return Errors.UNKNOWN
    }
}