export enum Errors {
    UNKNOWN = "Something went wrong. Try again later."
}

export const handleBadRequestError = (err: any) => {
    // Bad request, unauthorized, or forbidden
    if (err.response.status in [400, 401, 403]) {
        return err.response.data
    } else {
        return Errors.UNKNOWN
    }
}