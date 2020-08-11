import { Server } from "./server"

export class GameController {
    server: Server
    screens: GameScreen[]
    players: Player[]
    gameState: string

    constructor({
        listenAddress,
        port
    }: GameControllerConstructorParams) {
        this.screens = []
        this.players = []
        this.gameState = 'initiating'
        this.server = new Server({
            listenerCallback: this.handleMessage.bind(this),
            listenAddress: listenAddress,
            port: port
        })
    }

    processMessage(ws: ws, msg: GameMessage): void {
        switch(msg.action) {
            case 'add_player':
                this.addPlayer(ws, msg)
                break
            case 'add_screen':
                this.addScreen(ws)
                break
            default:
                throw new Error("Unknown action")
        }
    }

    handleMessage(ws: ws, msg: string): void {
        try {
            let gameMsg: GameMessage = JSON.parse(msg)
            this.processMessage(ws, gameMsg)
        } catch (e) {
            let errorMsg = {
                statusCode: 400,
                error: "error occured: " + e
            }
            ws.send(JSON.stringify(errorMsg))
            return
        }
    }

    addScreen(ws: ws): void {
        if(this.gameState != 'initiating') {
            let errorMessage = {
                statusCode: 403,
                error: 'Game is already running'
            }
            ws.send(JSON.stringify(errorMessage))
            return
        }
        this.screens.push({ socket: ws })
        this.updateScreen()
    }

    addPlayer(ws: ws, msg: GameMessage): void {
        if(this.players.length >= 3 || this.gameState != "initiating") {
            let gameFullMessage = {
                statusCode: 403,
                error: 'Cannot add more player'
            }
            ws.send(JSON.stringify(gameFullMessage))
            return
        }

        let playerContent = msg.content
        let name = <string> playerContent['name']

        this.players.push({
            socket: ws,
            name: name, 
            score: 0,
            tags: []
        })

        let successMsg = {
            statusCode: 200,
            message: "Player registration successful"
        }
        ws.send(JSON.stringify(successMsg))
        this.updateScreen()
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
            screen.socket.send(payload)
        })
    }

    start(): void {
        this.server.start()
    }

    stop(): void {
        this.server.stop()
    }
}