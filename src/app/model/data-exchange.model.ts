
export interface IResultRestModel {
    result: string;  //'SUCESS'|'ERROR'|'PROGRESS'
    errorNumber: number;
    message: string;
    data: any;
}