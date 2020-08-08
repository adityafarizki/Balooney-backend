type GameControllerConstructorParams = {
    listenAddress: string,
    port: number
};
type Sendable = {
    send: (msg: string) => void
};
type GameMessage = {
    action: string,
    content: Object
};
type GameScreen = {
    socket: Sendable
};
type Player = {
    socket: Sendable,
    name: string,
    score: number,
    tags: string[]
}