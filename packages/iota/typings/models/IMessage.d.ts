import type { IMilestonePayload } from "./payloads/IMilestonePayload";
import type { ITaggedDataPayload } from "./payloads/ITaggedDataPayload";
import type { ITransactionPayload } from "./payloads/ITransactionPayload";
/**
 * The default protocol version.
 */
export declare const DEFAULT_PROTOCOL_VERSION: number;
/**
 * Message layout.
 */
export interface IMessage {
    /**
     * The protocol version under which this message operates.
     */
    protocolVersion?: number;
    /**
     * The parent message ids.
     */
    parentMessageIds?: string[];
    /**
     * The payload contents.
     */
    payload?: ITransactionPayload | IMilestonePayload | ITaggedDataPayload;
    /**
     * The nonce for the message.
     */
    nonce?: string;
}
