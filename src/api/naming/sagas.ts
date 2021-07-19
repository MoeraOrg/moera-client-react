import { apply, call, select } from 'typed-redux-saga/macro';
import { CallEffect, PutEffect, SelectEffect } from 'redux-saga/effects';
import { ValidateFunction } from 'ajv';

import { formatSchemaErrors, NamingApi, NamingError } from "api";
import { RegisteredNameInfo } from "api/naming/api-types";
import { retryFetch } from "api/fetch-timeout";
import { isSchemaValid } from "api/schema";
import { getSetting } from "state/settings/selectors";

let callId = 1;

type CallException = (e: string | Error, details?: string | null) => NamingError;

export type CallNamingParams<T> = {
    method: string;
    params: any[];
    schema: ValidateFunction<T>;
};

export type CallNamingResult<T> = Generator<CallEffect | PutEffect<any> | SelectEffect, T>;

function* callNaming<T>({method, params, schema}: CallNamingParams<T>): CallNamingResult<T | null> {
    const exception: CallException = (e, details = null) => new NamingError(method, e, details);
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
    method: string;
    params: any[];
};

function* callNamingBoolean({method, params}: CallNamingBooleanParams): CallNamingResult<boolean> {
    const exception: CallException = (e, details = null) => new NamingError(method, e, details);
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

export function* getCurrent(name: string, generation: number): CallNamingResult<RegisteredNameInfo | null> {
    return yield* callNaming({method: "getCurrent", params: [name, generation], schema: NamingApi.RegisteredNameInfo});
}

export function* getSimilar(name: string): CallNamingResult<RegisteredNameInfo | null> {
    return yield* callNaming({method: "getSimilar", params: [name], schema: NamingApi.RegisteredNameInfo});
}

export function* isFree(name: string): CallNamingResult<boolean> {
    return yield* callNamingBoolean({method: "isFree", params: [name]});
}
