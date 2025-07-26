declare module '@mysten/sui.js' {
  export class Connection {
    constructor(options: { fullnode: string });
  }

  export class JsonRpcProvider {
    constructor(connection: Connection);
    getObject(params: { id: string, options?: { showContent?: boolean } }): Promise<any>;
    getBalance(params: { owner: string, coinType?: string }): Promise<any>;
  }

  export class TransactionBlock {
    constructor();
    moveCall(params: { target: string, arguments: any[] }): any;
    pure(value: any): any;
    object(objectId: string): any;
    gas: any;
    splitCoins(coin: any, amounts: any[]): any[];
    transferObjects(objects: any[], recipient: any): void;
  }
}