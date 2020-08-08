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
        describe(
            "given controller is still initiating and a new screen register message come",
            () => {
            let gameController: GameController;
            let samplePlayer: Player;
            beforeEach(() => {
                gameController = new GameController({
                    listenAddress: '0.0.0.0',
                    port: 8080
                });
                gameController.start();
                let mockSendable = { send: jest.fn() };
                samplePlayer = {
                    socket: mockSendable,
                    name: faker.name.findName(),
                    score: faker.random.number(),
                    tags: []
                }
                gameController.players = [samplePlayer]
            });

            afterEach(() => {
                gameController.stop();
            });
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

                    expect(msgData.gameState).toEqual("initiating");
                    expect(msgData.players).toEqual(expectedPlayers);
                    done();
                }
            });
        })
    });
});