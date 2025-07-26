declare module '@mysten/sui/client' {
  export class SuiClient {
    constructor(options: { url: string });
    getObject(params: { id: string, options?: { showContent?: boolean } }): Promise<any>;
    getBalance(params: { owner: string, coinType?: string }): Promise<any>;
  }
}

declare module '@mysten/sui/transactions' {
  export class Transaction {
    constructor();
    moveCall(params: { target: string, arguments: any[] }): any;
    pure(value: any): any;
    object(objectId: string): any;
    gas: any;
    splitCoins(coin: any, amounts: any[]): any[];
    transferObjects(objects: any[], recipient: any): void;
  }
}