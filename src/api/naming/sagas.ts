import { apply, call, select } from 'typed-redux-saga';
import { CallEffect, PutEffect, SelectEffect } from 'redux-saga/effects';
import { ValidateFunction } from 'ajv';

import { formatSchemaErrors, NamingApi, NamingError } from "api";
import { RegisteredNameInfo } from "api/naming/api-types";
import { retryFetch } from "api/fetch-timeout";
import { isSchemaValid } from "api/schema";
import { ClientAction } from "state/action";
import { getSetting } from "state/settings/selectors";

let callId = 1;

type CallException = (e: any, details?: string | null) => NamingError;

export type CallNamingParams<T> = {
    caller: ClientAction | null,
    method: string;
    params: any[];
    schema: ValidateFunction<T>;
};

export type CallNamingResult<T> = Generator<CallEffect | PutEffect<any> | SelectEffect, T>;

function* callNaming<T>({caller, method, params, schema}: CallNamingParams<T>): CallNamingResult<T | null> {
    const exception: CallException = (e, details = null) => new NamingError(method, e, details, caller);
    const data = yield* fetchNaming(method, params, exception);
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

function* callNamingBoolean({caller, method, params}: CallNamingBooleanParams): CallNamingResult<boolean> {
    const exception: CallException = (e, details = null) => new NamingError(method, e, details, caller);
    const data = yield* fetchNaming(method, params, exception);
    if (!isSchemaValid(NamingApi.BooleanResult, data)) {
        throw exception("Response format incorrect", formatSchemaErrors(NamingApi.ObjectResult.errors));
    }
    if (data.result == null) {
        throw exception("Return value is null");
    }
    return data.result;
}

function* fetchNaming(method: string, params: any[], exception: CallException): any {
    const location = (yield* select(state => getSetting(state, "naming.location"))) as string;
    let response;
    try {
        response = yield* call(retryFetch, location, {
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
        throw exception("Server returned error status");
    }
    let data;
    try {
        data = yield* apply(response, "json", []);
    } catch (e) {
        throw exception("Server returned empty result");
    }
    if ("error" in data) {
        if (!isSchemaValid(NamingApi.ErrorResult, data)) {
            throw exception("Error response format incorrect", formatSchemaErrors(NamingApi.ErrorResult.errors));
        }
        throw exception(data.error.message);
    }
    return data;
}

export function* getCurrent(
    caller: ClientAction | null, name: string, generation: number
): CallNamingResult<RegisteredNameInfo | null> {
    return yield* callNaming({
        caller, method: "getCurrent", params: [name, generation], schema: NamingApi.RegisteredNameInfo
    });
}

export function* getSimilar(caller: ClientAction | null, name: string): CallNamingResult<RegisteredNameInfo | null> {
    return yield* callNaming({caller, method: "getSimilar", params: [name], schema: NamingApi.RegisteredNameInfo});
}

export function* isFree(caller: ClientAction | null, name: string): CallNamingResult<boolean> {
    return yield* callNamingBoolean({caller, method: "isFree", params: [name]});
}
