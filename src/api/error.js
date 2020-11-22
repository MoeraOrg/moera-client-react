function extractMessage(messageOrError) {
    return messageOrError instanceof Error ? messageOrError.message : messageOrError;
}

export function formatSchemaErrors(errors) {
    return errors.map(({message}) => message).join(", ");
}

export class NodeError extends Error {

    constructor(method, rootApi, location, title, messageOrError, details = null) {
        super((title ? `${title}: ` : "") + extractMessage(messageOrError));
        this.messageVerbose = `${method} ${rootApi}${location}: ${this.message}` + (details ? `: ${details}` : "");
    }

}

export class NodeApiError extends Error {

    constructor(errorCode, message) {
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

    constructor(nodeName) {
        super("Name not found: " + nodeName);
        this.nodeName = nodeName;
    }

}

export class NamingError extends Error {

    constructor(method, messageOrError, details = null) {
        super("Naming service access error: " + extractMessage(messageOrError));
        this.messageVerbose = `${method}(): ${this.message}` + (details ? `: ${details}` : "");
    }

}
