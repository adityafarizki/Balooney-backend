import { Server } from "./server";
import * as faker from "faker";

export class GameController {
    server: Server;
    screens: GameScreen[];
    players: Player[];
    gameState: string;

    constructor({
        listenAddress,
        port
    }: GameControllerConstructorParams) {
        this.screens = [];
        this.players = [];
        this.gameState = 'initiating';
        this.server = new Server({
            listenerCallback: this.handleMessage.bind(this),
            listenAddress: listenAddress,
            port: port
        });
    }

    processMessage(ws: Sendable, msg: GameMessage): void {
        switch(msg.action) {
            case 'add_player':
                this.addPlayer(ws, msg);
                break;
            case 'add_screen':
                this.addScreen(ws);
                break;
        }
    }

    handleMessage(ws: Sendable, msg: string): void {
        try {
            let gameMsg: GameMessage = JSON.parse(msg);
            this.processMessage(ws, gameMsg);
        } catch (e) {
            let errorMsg = 'error occured ' + e;
            ws.send(errorMsg);
            return;
        }
    }

    addScreen(ws: Sendable): void {
        if(this.gameState != 'initiating') {
            let errorMsg = 'Game is already underway';
            ws.send(errorMsg);
            return;
        }
        this.screens.push({ socket: ws });
        this.updateScreen();
    }

    addPlayer(ws: Sendable, msg: GameMessage): void {
        if(this.players.length >= 3) {
            let gameFullMessage = 'Game is already full';
            ws.send(gameFullMessage);
            return;
        }

        let playerContent = msg.content;
        let name: string;
        if('name' in playerContent) {
            name = playerContent['name'];
        } else {
            name = faker.name.findName();
        }

        this.players.push({
            socket: ws,
            name: name, 
            score: 0,
            tags: []
        });

        let successMsg = 'Player registration successful';
        ws.send(successMsg);
        this.updateScreen();
    }

    updateScreen(): void {
        let players = this.players.map(player => ({ 
            name: player.name,
            score: player.score,
            tags: player.tags
        }))
        let payload = JSON.stringify({
            players: players,
            gameState: this.gameState
        })
        this.screens.forEach((screen) => {
            screen.socket.send(payload);
        })
    }

    start(): void {
        this.server.start();
    }

    stop(): void {
        this.server.stop();
    }
}