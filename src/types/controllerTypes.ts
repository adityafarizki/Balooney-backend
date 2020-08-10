type GameControllerConstructorParams = {
    listenAddress: string,
    port: number
};
type GameMessage = {
    action: string,
    content: Object
};
type GameScreen = {
    socket: ws | Sendable
};
type Sendable = {
    send: (msg: string) => void
}
type Player = {
    socket: ws | Sendable,
    name: string,
    score: number,
    tags: string[]
}