import { GameController } from "gameController";
import * as faker from "faker";

describe("GameController", () => {
    describe(".start", () => {
        it("starts game server based on params", done => {
            let listenAddress = "0.0.0.0";
            let listenPort = 8080;
            let controller = new GameController({
                listenAddress: listenAddress,
                port: listenPort
            })

            controller.start();
            let gameUrl = "wss://localhost:" + listenPort;
            let webSocket = new WebSocket(gameUrl);
            webSocket.onopen = () => { 
                controller.stop();
                done(); 
            }
        });
    });

    describe(".addScreen", () => {
        let gameController: GameController;
        let samplePlayer: Player;
        beforeEach(() => {
            gameController = new GameController({
                listenAddress: '0.0.0.0',
                port: 8080
            });
            gameController.start();
            let mockws = { send: jest.fn() };
            samplePlayer = {
                socket: mockws,
                name: faker.name.findName(),
                score: faker.random.number(),
                tags: []
            }
            gameController.players = [samplePlayer]
        });

        afterEach(() => {
            gameController.stop();
        });

        describe("given controller is still initiating", () => {
            it("registers the screen and return game and players status message",
                 done => {
                let msg = { action: "add_screen", content: {} }
                let webSocket = new WebSocket("wss://localhost:8080");
                webSocket.onopen = () => {
                    webSocket.send(JSON.stringify(msg));
                }
                webSocket.onmessage = (event) => {
                    let msgJson = event.data;
                    let msgData = JSON.parse(msgJson);
                    delete samplePlayer["socket"];
                    let expectedPlayers = [samplePlayer]

                    try {
                        expect(msgData.gameState).toEqual("initiating");
                        expect(msgData.players).toEqual(expectedPlayers);
                        done();
                    } catch (error) {
                        done(error);
                    }
                }
            });
        })

        describe("given the gameController has started game", () => {
            beforeEach(() => {
                gameController.gameState = 'running';
            });

            it("rejects new screen and return error message", done => {
                let msg = { action: "add_screen", content: {} }
                let webSocket = new WebSocket("wss://localhost:8080");
                webSocket.onopen = () => {
                    webSocket.send(JSON.stringify(msg));
                }
                webSocket.onmessage = (event) => {
                    let msgJson = event.data;
                    let msgData = JSON.parse(msgJson);

                    try {
                        expect(msgData.statusCode).toEqual(403);
                        done();
                    } catch(error) {
                        done(error);
                    }
                }
            });
        });
    });

    describe(".addPlayer", () => {
        let gameController: GameController;
        beforeEach(() => {
            gameController = new GameController({
                listenAddress: '0.0.0.0',
                port: 8080
            });
            gameController.start();
        });

        afterEach(() => {
            gameController.stop();
        });

        describe("given the game is still initiating", () => {
            it(
                "registers new player and returns success mesage",
                done => {
                let playerSocket = new WebSocket("wss://localhost:8080");
                let playerData = {
                    action: "add_player",
                    content: {
                        name: "test"
                    }
                }

                playerSocket.onopen = () => {
                    playerSocket.send(JSON.stringify(playerData));
                }

                playerSocket.onmessage = (event) => {
                    let msgJson = event.data;
                    let msgData = JSON.parse(msgJson);

                    try {
                        expect(msgData.statusCode).toEqual(200);
                        done();
                    } catch(error) {
                        done(error);
                    }
                }
            });

            it("registers new player and update screen state", done => {
                let playerName = faker.name.findName();
                let playerData = {
                    action: "add_player",
                    content: {
                        name: playerName
                    }
                }
                let screenSendable: Sendable = { send: (msg: string) => {
                    let msgData = JSON.parse(msg);
                    let expectedPlayers = [{
                        name: playerName,
                        score: 0,
                        tags: []
                    }]

                    try {
                        expect(msgData.players[0]).toEqual(expectedPlayers[0]);
                        expect(msgData.gameState).toEqual("initiating");
                        done();
                    } catch(error) {
                        done(error);
                    }
                }}
                gameController.screens = [{ socket: screenSendable }];
                let playerSocket = new WebSocket("wss://localhost:8080");
                playerSocket.onopen = () => {
                    playerSocket.send(JSON.stringify(playerData));
                }
            });
        })
    });
});