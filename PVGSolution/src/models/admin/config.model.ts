export interface IRS_GetAllConfigurationModel {
    data: IConfigurationModel[]
}

export interface IConfigurationModel{
    key: string;
    value: string;
}

export interface IObjConfigurationModel
{
    EmailFromName: string,
    EmailSend: string,
    EmailSendPassword: string,
    EmailReceive: string,
    EmailSmtpHost: string,
    EmailPort: string,
    SDTSales: string,
    Logo: string,
    ImgHome: string,
    ImgBackground: string,
}

export interface IRQ_SaveConfigurationModel
{
    createUser: string,
    data: IConfigurationModel[],
    dataImage: FormData
}

export interface IImageConfigurationModel
{
    key: string;
    imgFile: File;
}