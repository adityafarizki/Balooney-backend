import * as ws from "ws";
import * as fs from "fs";
import * as https from "https";

export class Server {
    listenAddress: string;
    port: number;
    sslKeyFile: string;
    sslCertFile: string;
    listenerCallback: ServerListenerCallback;
    server: https.Server;

    constructor({
        listenerCallback,
        listenAddress = '0.0.0.0',
        port = 8080,
        sslKeyFile = 'ssl/localhost.key',
        sslCertFile = 'ssl/localhost.crt'
    }: ServerConstructorParams) {
        this.listenAddress = listenAddress;
        this.port = port;
        this.sslCertFile = sslCertFile;
        this.sslKeyFile = sslKeyFile;
        this.server = this.initServer()
        this.listenerCallback = listenerCallback;
        this.initServer();
        this.initws();
    }

    initServer(): https.Server {
        const options: Object = {
            key: fs.readFileSync(this.sslKeyFile),
            cert: fs.readFileSync(this.sslCertFile)
        };
        return https.createServer(options);
    }

    initws(): void {
        let wss = new ws.Server({ server: this.server });
        let server = this;
        wss.on('connection', function connection(ws) {
            ws.on('message', function message(msg) {
                let msgContent = String(msg)
                server.listenerCallback(ws, msgContent);
            });
        });
    }

    start(): void {
        this.server.listen(this.port);
    }

    stop(): void {
        this.server.close();
    }
}

