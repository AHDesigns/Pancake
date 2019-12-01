export const SocketIOEvents = {
    /*
     * Fired upon a connection including a successful reconnection.
     */
    connect: 'connect',
    /*
     * Fired when an error occurs.
     */
    error: 'error',
    /*
     * Fired upon a disconnection
     */
    disconnect: 'disconnect',
    /*
     * fired upon a connection error.
     */
    connectError: 'connect_error',
    /*
     * Fired upon a connection timeout.
     */
    connectTimeout: 'connect_timeout',
    /*
     * Fired upon a successful reconnection.
     */
    reconnect: 'reconnect',
    /*
     * Fired upon an attempt to reconnect.
     */
    reconnectAttempt: 'reconnect_attempt',
    /*
     * Fired upon an attempt to reconnect.
     */
    reconnecting: 'reconnecting',
    /*
     * Fired upon a reconnection attempt error.
     */
    reconnectError: 'reconnect_error',
    /*
     * Fired when couldn't reconnect within reconnectionAttempts.
     */
    reconnectFailed: 'reconnect_failed',
    /*
     * Fired when a ping packet is written out to the server.
     */
    ping: 'ping',
    /*
     * Fired when a pong is received from the server.
     */
    pong: 'pong',
};

export const PancakeEvents = {
    availableRepos: 'available-repos',
    clientId: 'client-id',
    reviews: 'reviews',
    rateLimit: 'rate-limit',
};
