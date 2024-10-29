declare module 'web3.storage' {
  export class Web3Storage {
    constructor(config: { token: string });
    put(files: File[]): Promise<string>;
    get(cid: string): Promise<any>;
    status(cid: string): Promise<any>;
    delete(cid: string): Promise<void>;
  }
}
