import { ClientAction } from "state/action";
import { WithContext } from "state/action-types";
import { SafeValidationErrors } from "safe/message-types";
import { absoluteNodeName, RelNodeName } from "util/rel-node-name";

function extractMessage(messageOrError: any): string {
    if (messageOrError instanceof DOMException && messageOrError.name === "AbortError") {
        return "Request timeout";
    }
    if (messageOrError instanceof Error) {
        return messageOrError.constructor.name + ": " + messageOrError.message
    }
    return String(messageOrError);
}

export function formatSchemaErrors(errors: SafeValidationErrors | null | undefined): string {
    return errors != null ? errors.map(({message}) => message).join(", ") : "";
}

export class CausedError extends Error {

    cause: ClientAction | null;

    constructor(message: string, cause: ClientAction | null = null) {
        super(message);
        this.cause = cause;
    }

}

export class VerboseError extends CausedError {

    messageVerbose: string;

    constructor(message: string, messageVerbose: string | null = null, cause: ClientAction | null = null) {
        super(message, cause);
        this.messageVerbose = messageVerbose ?? message;
    }

}

export class NodeError extends VerboseError {

    constructor(method: string, rootApi: string, location: string, title: string | null, messageOrError: Error | string,
                details: string | null = null, cause: ClientAction | null = null) {
        const message = (title ? `${title}: ` : "") + extractMessage(messageOrError);
        const messageVerbose = `${method} ${rootApi}${location}: ${message}` + (details ? `: ${details}` : "");
        super(message, messageVerbose, cause);
    }

}

export class NodeConnectionError extends CausedError {

    constructor(cause: WithContext<ClientAction> | null = null) {
        super("Node connection error", cause);
    }

}

export class NamingError extends VerboseError {

    constructor(method: string, messageOrError: Error | string, details: string | null = null,
                cause: ClientAction | null = null) {
        const message = "Naming service access error: " + extractMessage(messageOrError);
        const messageVerbose = `${method}(): ${message}` + (details ? `: ${details}` : "");
        super(message, messageVerbose, cause);
    }

}

export class NodeApiError extends CausedError {

    errorCode: string;

    constructor(errorCode: string, message: string, cause: ClientAction | null = null) {
        super(message, cause);
        this.errorCode = errorCode;
    }

}

export class HomeNotConnectedError extends VerboseError {

    constructor(cause: ClientAction | null = null) {
        super("Not connected to home", null, cause);
    }

    setQuery(method: string, location: string): void {
        this.messageVerbose = `${method} ${location}: ${this.message}`
    }

}

export class NameResolvingError extends CausedError {

    constructor(nodeName: RelNodeName| string, cause: WithContext<ClientAction> | null = null) {
        super("Name not found: " + extractNodeName(nodeName, cause), cause);
    }

}

function extractNodeName(nodeName: RelNodeName | string, cause: WithContext<ClientAction> | null): string {
    const ownerNameOrUrl = cause?.context.ownerNameOrUrl ?? "unresolvable current node";
    const homeOwnerNameOrUrl = cause?.context.homeOwnerNameOrUrl ?? "unresolvable home node";
    const searchName = cause?.context.searchName ?? "unresolvable search node";
    return absoluteNodeName(nodeName, {ownerNameOrUrl, homeOwnerNameOrUrl, searchName});
}
