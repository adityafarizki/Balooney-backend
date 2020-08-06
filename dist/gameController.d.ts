import { Server } from "./server";
declare type GameControllerConstructorParams = {
    listenAddress: string;
    port: number;
};
export declare class GameController {
    server: Server;
    constructor({ listenAddress, port }: GameControllerConstructorParams);
    processMessage(ws: Object, msg: string): void;
    start(): void;
}
export {};
