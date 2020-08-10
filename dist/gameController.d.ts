import { Server } from "./server";
declare type GameControllerConstructorParams = {
    listenAddress: string;
    port: number;
};
declare type ws = {
    send: (msg: string) => void;
};
export declare class GameController {
    server: Server;
    constructor({ listenAddress, port }: GameControllerConstructorParams);
    processMessage(ws: ws, msg: string): void;
    start(): void;
}
export {};
