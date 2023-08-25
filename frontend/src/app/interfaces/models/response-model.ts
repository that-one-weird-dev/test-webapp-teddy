
export type ResponseModel<T> = { data: T } | { error: string };

export function responseIsError<T>(response: ResponseModel<T>): response is { error: string } {
    return (response as any).error;
}

export function responseIsOk<T>(response: ResponseModel<T>): response is { data: T } {
    return (response as any).data;
}