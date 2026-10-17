import type { WebSocketLike } from "./ws-adapter.mjs";
import type { RawWebSocketData, ReconnectingEvent, ReconnectingOverrides, UnsentMessage, WebSocketStreamOptions } from "./ws.mjs";
export interface WebSocketReconnectOptions<TParameters> {
    onReconnecting: ((event: ReconnectingEvent<TParameters>) => ReconnectingOverrides<TParameters>) | ((event: ReconnectingEvent<TParameters>) => void);
    maxRetries?: number;
    initialDelay?: number;
    maxDelay?: number;
}
export interface WebSocketConnectionOptions<TParameters> {
    reconnect?: WebSocketReconnectOptions<TParameters> | null | undefined;
    maxQueueSize?: number | undefined;
}
export type WebSocketStreamMessage<TClientEvent, TServerEvent, TError, TParameters> = {
    type: 'connecting' | 'open' | 'closing';
} | {
    type: 'close';
    code: number;
    reason: string;
    unsent: UnsentMessage<TClientEvent>[];
} | {
    type: 'reconnecting';
    reconnect: ReconnectingEvent<TParameters>;
} | {
    type: 'reconnected';
} | {
    type: 'message';
    message: TServerEvent;
} | {
    type: 'raw';
    data: RawWebSocketData;
} | {
    type: 'error';
    error: TError;
};
interface ConnectionOwner<TSocket> {
    socket: TSocket;
    url: URL;
}
/** API types, decoding and request policy stay with the binding and its SDK helpers. */
export interface WebSocketConnectionHooks<TSocket, TClientEvent, TServerEvent, TError, TParameters> {
    buildURL: () => URL;
    createSocket: (url: URL) => TSocket;
    parameters: TParameters | null | undefined;
    isErrorEvent: (event: TServerEvent) => boolean;
    onMessage: (data: string | ArrayBuffer | ArrayBufferView, isBinary: boolean) => void;
    onSocketError?: (socket: TSocket, error: Error) => void;
    onError: (message: string, cause?: unknown) => void;
    createError: (message: string) => TError;
    subscribe: (onEvent: (event: TServerEvent) => void, onRaw: (data: RawWebSocketData) => void, onError: (error: TError) => void) => void;
    unsubscribe: (onEvent: (event: TServerEvent) => void, onRaw: (data: RawWebSocketData) => void, onError: (error: TError) => void) => void;
    emitReconnecting: (event: ReconnectingEvent<TParameters>) => void;
    emitReconnected: () => void;
    emitClose: (code: number, reason: string, unsent: UnsentMessage<TClientEvent>[]) => void;
    /** Existing transports with async credential refresh cancel it when close wins. */
    prepareReconnectSocket?: () => Promise<(url: URL) => TSocket>;
    /** Preserve whether a failed queued write remains in the legacy unsent list. */
    requeueFailed?: boolean;
}
type WebSocketParameters = NonNullable<ReconnectingEvent['parameters']>;
/** Shared connection lifecycle; public fields and event listeners remain on the binding. */
export declare class WebSocketConnection<TSocket extends WebSocketLike, TClientEvent, TServerEvent, TError extends Error, TParameters extends WebSocketParameters = WebSocketParameters> {
    private _reconnectOptions;
    private _sendQueue;
    private _isReconnecting;
    private _intentionallyClosed;
    private _closeCode;
    private _closeReason;
    private _lastCloseCode;
    private _lastCloseReason;
    private _internalEvents;
    private readonly _owner;
    private readonly _hooks;
    constructor(owner: ConnectionOwner<TSocket>, hooks: WebSocketConnectionHooks<TSocket, TClientEvent, TServerEvent, TError, TParameters>, options?: WebSocketConnectionOptions<TParameters>);
    private _cancelRefresh;
    send(event: TClientEvent): void;
    sendRaw(data: RawWebSocketData): void;
    close(props?: {
        code: number;
        reason: string;
    }): void;
    iterate(options?: WebSocketStreamOptions): AsyncIterableIterator<WebSocketStreamMessage<TClientEvent, TServerEvent, TError, TParameters>>;
    connect(createSocket?: (url: URL) => TSocket, url?: URL): TSocket;
    private _canReconnect;
    private _abortReconnect;
    private _notifyReconnecting;
    private _reconnect;
    private _flushSendQueue;
    /**
     * Emits the public `close` event with unsent messages and the internal
     * `close` event used by the async iterator.
     */
    private _emitPermanentClose;
}
export {};
//# sourceMappingURL=ws-connection-controller.d.mts.map