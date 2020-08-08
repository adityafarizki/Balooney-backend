import { Server } from "./server";
declare type GameControllerConstructorParams = {
    listenAddress: string;
    port: number;
};
declare type Sendable = {
    send: (msg: string) => void;
};
export declare class GameController {
    server: Server;
    constructor({ listenAddress, port }: GameControllerConstructorParams);
    processMessage(ws: Sendable, msg: string): void;
    start(): void;
}
export {};
