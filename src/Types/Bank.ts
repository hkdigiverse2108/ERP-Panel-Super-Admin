export interface BankBase extends BankFormValues {
    bankName: string;
    bankCode: string;
}   
export interface BankFormValues {
    bankName?: string;
    bankCode?: string;
    isActive?: boolean;
    _submitAction?: string;
}   
export type AddBankPayload = BankFormValues;

export type EditBankPayload = AddBankPayload & {
    bankId: string;
};  
export interface BankApiResponse {
    bank_data:  BankBase[];
}
