import {IPagedListMetaData} from '../../../shared/interfaces/paged-list-meta-data';
export class CurrencyDto {
    nameAr: string | undefined;
    nameEn: string | undefined;
    id: number;
    code: string | undefined;
    isActive:boolean| undefined;
    symbol: string | undefined;
}
export class CreateCurrencyCommand {
    nameAr: string | undefined;
    nameEn: string | undefined;
    code: string | undefined;
    isActive:boolean| undefined;
    symbol: string | undefined;
}
export class EditCurrencyCommand {
    nameAr: string | undefined;
    nameEn: string | undefined;
    id: number;
    code: string | undefined;
    isActive:boolean| undefined;
    symbol: string | undefined;
}

export interface ICurrencyDtoPageList {
    metadata: IPagedListMetaData;
    items: CurrencyDto[] | undefined;
}
export class DeleteListCurrencyCommand{
    ids: number[] | undefined;
}

export class CurrencyTransactionDto {
    id: number | undefined;
    currencyMasterId: number;
    currencyDetailId: any | undefined;
    transactionDate: any | undefined;
    transactionFactor: number | undefined;
}
export class CreateCurrencyTransactionCommand {
    inputDto: CurrencyTransactionDto;
}
export class EditCurrencyTransactionCommand {
    inputDto: CurrencyTransactionDto;
    id: number | undefined;
}