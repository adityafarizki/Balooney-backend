type ws = import("ws/index")
type ServerListenerCallback = (ws: ws, msg: string) => void
type ServerConstructorParams = {
    listenerCallback: ServerListenerCallback,
    listenAddress?: string,
    port?: number,
    sslKeyFile?: string,
    sslCertFile?: string
}