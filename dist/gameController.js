"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameController = void 0;
const server_1 = require("./server");
class GameController {
    constructor({ listenAddress, port }) {
        this.server = new server_1.Server({
            listenerCallback: this.processMessage,
            listenAddress: listenAddress,
            port: port
        });
    }
    processMessage(ws, msg) {
        console.log(msg);
        ws.send(msg);
    }
    start() {
        this.server.start();
    }
}
exports.GameController = GameController;
