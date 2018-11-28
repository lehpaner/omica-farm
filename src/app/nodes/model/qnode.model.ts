
export interface IExtendedData {}

export enum Status {
    Created = 0,
    Modified = 1,
    Deleted = 3
}

export interface INodeWhere {
    field: string;
    operator: string;
    val:any;
}

export interface IQNode {
    id: string;
    owner: string;
    parent: string;
    subtype: number;
    name: string;
    status: Status;
    category: number;
    createdOn?: Date;
    modifiedOn?: Date;
    extendedData?: IExtendedData;
}

export interface IDataRep {
    ID: string;
    OWNER: string;
    PARENT: string;
    SUBTYPE: number;
    NAME: string;
    STATUS: number;
    NUMBER: number;
    CREATED: Date;
    MODIFIED: Date;
    ED?: string;
}
