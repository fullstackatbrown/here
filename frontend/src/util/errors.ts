export enum Errors {
    UNKNOWN = "Something went wrong. Try again later."
}

export const handleBadRequestError = (err: any) => {
    if (err.response.status === 400) {
        return err.response.data
    } else {
        return Errors.UNKNOWN
    }
}