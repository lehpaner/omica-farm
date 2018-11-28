export interface RestResponse {
    result: string;
    errorID: number;
    message: string;
    excepted: boolean;
    exceptionStack: string;
    data?: any[];
    dato?: any;
}