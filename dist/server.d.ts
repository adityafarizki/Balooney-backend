/// <reference types="node" />
import * as https from "https";
declare type ws = {
    send: (msg: string) => void;
};
declare type ServerListenerCallback = (ws: ws, msg: string) => void;
declare type ServerConstructorParams = {
    listenerCallback: ServerListenerCallback;
    listenAddress?: string;
    port?: number;
    sslKeyFile?: string;
    sslCertFile?: string;
};
export declare class Server {
    listenAddress: string;
    port: number;
    sslKeyFile: string;
    sslCertFile: string;
    listenerCallback: ServerListenerCallback;
    server: https.Server;
    constructor({ listenerCallback, listenAddress, port, sslKeyFile, sslCertFile }: ServerConstructorParams);
    initServer(): https.Server;
    initWebSocket(): void;
    start(): void;
}
export {};
