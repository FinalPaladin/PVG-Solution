export interface IResponseUpdateImage {
    publicUrl: string
    keyUrl: string
    file: File
}

export interface IRS_CloudflareUploadListImageModel{
    data: ICloudflareUploadModel[];
}

export interface ICloudflareUploadModel{
    publicUrl: string;
    key: string;
}