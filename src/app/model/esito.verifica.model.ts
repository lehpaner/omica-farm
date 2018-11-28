export interface IEsitoVerifica {
    indication: string;
    validationTime: Date;
    signingTime: Date;
    signedBy: string;
    uploadedOn: Date;
    id: string;
    signatureFormat: string;
    countriesCodes: string;
}