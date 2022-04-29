export interface ResponseData<T> {
    code: number;
    data?: T;
    msg?: string;
}
export {};
