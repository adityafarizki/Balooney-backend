"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const gameController_1 = require("./gameController");
let config = {
    listenAddress: '0.0.0.0',
    port: 8080
};
let mainController = new gameController_1.GameController(config);
mainController.start();
