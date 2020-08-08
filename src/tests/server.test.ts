import { Server } from "server";

type Sendable = {
    send: (msg: string) => void
}

describe("Server", () => {
    let server: Server;
    let listenerCallback =  (ws: Sendable, msg: string) => {
        ws.send(msg);
    }

    beforeAll(()=> {
        server = new Server({listenerCallback});
        server.start();
    });

    afterAll(() => {
        server.stop();
    })

    it('starts websocket server and pass any incoming message to callback', done => {
        let testMsg =  'test';
        let client = new WebSocket('wss://localhost:8080');
        client.onopen = () => { client.send(testMsg) }
        client.onmessage = (event) => { 
            expect(event.data).toEqual(testMsg);
            done();
        }
    });
})