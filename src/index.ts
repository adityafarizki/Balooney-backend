import { GameController } from "./gameController";

let config = {
    listenAddress: '0.0.0.0',
    port: 8080
}

let mainController: GameController = new GameController(config)
mainController.start()