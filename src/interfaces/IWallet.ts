
export interface ITransaction{
    type:'credit' | 'debit';
    amount:number;
    description?:string;
    createdAt:Date
}

export interface IWallet{
    userId:string;
    balance:number;
    transaction:ITransaction[],
    createdAt:Date;
    updatedAt:Date;
}