type ServerListenerCallback = (ws: Sendable, msg: string) => void
type ServerConstructorParams = {
    listenerCallback: ServerListenerCallback,
    listenAddress?: string,
    port?: number,
    sslKeyFile?: string,
    sslCertFile?: string
}