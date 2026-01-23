import type { IAgent, IAgentOptions, IAgentPluginSchema, IPluginMethodMap, TAgent } from '@veramo/core-types';
/**
 * Provides a common context for all plugin methods.
 *
 * This is the main entry point into the API of Veramo.
 * When plugins are installed, they extend the API of the agent and the methods
 * they provide can all use the common context so that plugins can build on top
 * of each other and create a richer experience.
 *
 * @public
 */
export declare class Agent implements IAgent {
    /**
     * The map of plugin + override methods
     */
    readonly methods: IPluginMethodMap;
    private schema;
    private schemaValidation;
    readonly context?: Record<string, any>;
    private protectedMethods;
    private readonly eventBus;
    private readonly eventQueue;
    /**
     * Constructs a new instance of the `Agent` class
     *
     * @param options - Configuration options
     * @public
     */
    constructor(options?: IAgentOptions);
    /**
     * Lists available agent method names
     *
     * @returns a list of available methods
     * @public
     */
    availableMethods(): string[];
    /**
     * Returns agent plugin schema
     *
     * @returns agent plugin schema
     * @public
     */
    getSchema(): IAgentPluginSchema;
    /**
     * Executes a plugin method.
     *
     * Normally, the `execute()` method need not be called.
     * The agent will expose the plugin methods directly on the agent instance
     * but this can be used when dynamically deciding which methods to call.
     *
     * @remarks
     * Plugin method will receive a context object as a second argument.
     * Context object always has `agent` property that is the `Agent` instance that is executing said method
     *
     * @param method - method name
     * @param args - arguments object
     * @example
     * ```typescript
     * await agent.execute('foo', { bar: 'baz' })
     *
     * // is equivalent to:
     * await agent.foo({ bar: 'baz' })
     * ```
     * @public
     */
    execute<P = any, R = any>(method: string, args: P): Promise<R>;
    /**
     * Broadcasts an `Event` to potential listeners.
     *
     * Listeners are `IEventListener` instances that declare `eventTypes`
     * and implement an `async onEvent({type, data}, context)` method.
     * Note that `IAgentPlugin` is also an `IEventListener` so plugins can be listeners for events.
     *
     * During creation, the agent automatically registers listener plugins
     * to the `eventTypes` that they declare.
     *
     * Events are processed asynchronously, so the general pattern to be used is fire-and-forget.
     * Ex: `agent.emit('foo', {eventData})`
     *
     * In situations where you need to make sure that all events in the queue have been exhausted,
     * the `Promise` returned by `emit` can be awaited.
     * Ex: `await agent.emit('foo', {eventData})`
     *
     * In case an error is thrown while processing an event, the error is re-emitted as an event
     * of type `CoreEvents.error` with a `EventListenerError` as payload.
     *
     * Note that `await agent.emit()` will NOT throw an error. To process errors, use a listener
     * with `eventTypes: [ CoreEvents.error ]` in the definition.
     *
     * @param eventType - the type of event being emitted
     * @param data - event payload.
     *     Use the same `data` type for events of a particular `eventType`.
     *
     * @public
     */
    emit(eventType: string, data: any): Promise<void>;
}
/**
 * Helper function to create a new instance of the {@link Agent} class with correct type
 *
 * @remarks
 * Use {@link @veramo/core-types#TAgent} to configure agent type (list of available methods) for autocomplete in IDE
 *
 * @example
 * ```typescript
 * import { createAgent, IResolver, IMessageHandler } from '@veramo/core'
 * import { AgentRestClient } from '@veramo/remote-client'
 * import { CredentialIssuer, ICredentialIssuer } from '@veramo/credential-w3c'
 * const agent = createAgent<IResolver & IMessageHandler & ICredentialIssuer>({
 *   plugins: [
 *     new CredentialIssuer(),
 *     new AgentRestClient({
 *       url: 'http://localhost:3002/agent',
 *       enabledMethods: [
 *         'resolveDid',
 *         'handleMessage',
 *       ],
 *     }),
 *   ],
 * })
 * ```
 * @param options - Agent configuration options
 * @returns configured agent
 * @public
 */
export declare function createAgent<T extends IPluginMethodMap, C = Record<string, any>>(options: IAgentOptions & {
    context?: C;
}): TAgent<T> & {
    context?: C;
};
//# sourceMappingURL=agent.d.ts.map