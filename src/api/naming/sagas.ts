import { formatSchemaErrors, NamingApi, NamingError } from "api";
import { RegisteredNameInfo } from "api/naming/api-types";
import { fetcher } from "api/fetcher";
import { BasicValidateFunction, isSchemaValid } from "api/schema";
import { ClientAction } from "state/action";
import { getSetting } from "state/settings/selectors";
import { select } from "state/store-sagas";

let callId = 1;

type CallException = (e: any, details?: string | null) => NamingError;

type CallNamingParams<T> = {
    caller: ClientAction | null,
    method: string;
    params: any[];
    schema: BasicValidateFunction<T>;
};

async function callNaming<T>({caller, method, params, schema}: CallNamingParams<T>): Promise<T | null> {
    const exception: CallException = (e, details = null) => new NamingError(method, e, details, caller);
    const data = await fetchNaming(method, params, exception);
    if (!isSchemaValid(NamingApi.ObjectResult, data)) {
        throw exception("Response format incorrect", formatSchemaErrors(NamingApi.ObjectResult.errors));
    }
    if (data.result == null) {
        return null;
    }
    if (!isSchemaValid(schema, data.result)) {
        throw exception("Return value format incorrect: ", formatSchemaErrors(schema.errors));
    }
    return data.result;
}

export type CallNamingBooleanParams = {
    caller: ClientAction | null,
    method: string;
    params: any[];
};

async function callNamingBoolean({caller, method, params}: CallNamingBooleanParams): Promise<boolean> {
    const exception: CallException = (e, details = null) => new NamingError(method, e, details, caller);
    const data = await fetchNaming(method, params, exception);
    if (!isSchemaValid(NamingApi.BooleanResult, data)) {
        throw exception("Response format incorrect", formatSchemaErrors(NamingApi.BooleanResult.errors));
    }
    if (data.result == null) {
        throw exception("Return value is null");
    }
    return data.result;
}

const MAX_EMPTY_RESULT_RETRIES = 3;

async function fetchNaming(method: string, params: any[], exception: CallException): Promise<any> {
    const location = select(state => getSetting(state, "naming.location") as string);
    let emptyResultRetries = 0;
    while (true) {
        let response;
        try {
            response = await fetcher(location, {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    jsonrpc: "2.0",
                    id: callId++,
                    method,
                    params
                })
            });
        } catch (e) {
            throw exception(e);
        }
        if (!response.ok) {
            throw exception("Server returned error status", await response.text());
        }
        let data;
        try {
            data = await response.json();
        } catch (e) {
            if (emptyResultRetries >= MAX_EMPTY_RESULT_RETRIES) {
                throw exception("Server returned empty result");
            }
            emptyResultRetries++;
            continue;
        }
        if ("error" in data) {
            if (!isSchemaValid(NamingApi.ErrorResult, data)) {
                throw exception("Error response format incorrect", formatSchemaErrors(NamingApi.ErrorResult.errors));
            }
            throw exception(data.error.message);
        }
        return data;
    }
}

export async function getCurrent(
    caller: ClientAction | null, name: string, generation: number
): Promise<RegisteredNameInfo | null> {
    return await callNaming({
        caller, method: "getCurrent", params: [name, generation], schema: NamingApi.RegisteredNameInfo
    });
}

export async function getSimilar(caller: ClientAction | null, name: string): Promise<RegisteredNameInfo | null> {
    return await callNaming({caller, method: "getSimilar", params: [name], schema: NamingApi.RegisteredNameInfo});
}

export async function isFree(caller: ClientAction | null, name: string): Promise<boolean> {
    return await callNamingBoolean({caller, method: "isFree", params: [name, 0]});
}
