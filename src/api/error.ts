function extractMessage(messageOrError: Error | string): string {
    return messageOrError instanceof Error ? messageOrError.message : messageOrError;
}

export function formatSchemaErrors(errors: Error[]): string {
    return errors.map(({message}) => message).join(", ");
}

export class NodeError extends Error {

    messageVerbose: string;

    constructor(method: string, rootApi: string, location: string, title: string | null, messageOrError: Error | string,
                details: string | null = null) {
        super((title ? `${title}: ` : "") + extractMessage(messageOrError));
        this.messageVerbose = `${method} ${rootApi}${location}: ${this.message}` + (details ? `: ${details}` : "");
    }

}

export class NodeApiError extends Error {

    errorCode: string;

    constructor(errorCode: string, message: string) {
        super(message);
        this.errorCode = errorCode;
    }

}

export class HomeNotConnectedError extends Error {

    constructor() {
        super("Not connected to home");
    }

}

export class NameResolvingError extends Error {

    nodeName: string;

    constructor(nodeName: string) {
        super("Name not found: " + nodeName);
        this.nodeName = nodeName;
    }

}

export class NamingError extends Error {

    messageVerbose: string;

    constructor(method: string, messageOrError: Error | string, details: string | null = null) {
        super("Naming service access error: " + extractMessage(messageOrError));
        this.messageVerbose = `${method}(): ${this.message}` + (details ? `: ${details}` : "");
    }

}
