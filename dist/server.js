"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
const WebSocket = __importStar(require("ws"));
const fs = __importStar(require("fs"));
const https = __importStar(require("https"));
class Server {
    constructor({ listenerCallback, listenAddress = '0.0.0.0', port = 8080, sslKeyFile = 'ssl/localhost.key', sslCertFile = 'ssl/localhost.crt' }) {
        this.listenAddress = listenAddress;
        this.port = port;
        this.sslCertFile = sslCertFile;
        this.sslKeyFile = sslKeyFile;
        this.server = this.initServer();
        this.listenerCallback = listenerCallback;
        this.initServer();
        this.initWebSocket();
    }
    initServer() {
        const options = {
            key: fs.readFileSync(this.sslKeyFile),
            cert: fs.readFileSync(this.sslCertFile)
        };
        return https.createServer(options);
    }
    initWebSocket() {
        let wss = new WebSocket.Server({ server: this.server });
        let server = this;
        wss.on('connection', function connection(ws) {
            ws.on('message', function message(msg) {
                let msgContent = String(msg);
                server.listenerCallback(ws, msgContent);
            });
        });
    }
    start() {
        this.server.listen(this.port);
    }
}
exports.Server = Server;
