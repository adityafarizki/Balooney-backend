import { Server } from "./server";

type GameControllerConstructorParams = {
    listenAddress: string,
    port: number
}

export class GameController {
    server: Server;

    constructor({
        listenAddress,
        port
    }: GameControllerConstructorParams) {
        this.server = new Server({
            listenerCallback: this.processMessage,
            listenAddress: listenAddress,
            port: port
        })
    }

    processMessage(ws: Object, msg: string): void {
        console.log(ws, msg);
    }

    start(): void {
        this.server.start();
    }
}