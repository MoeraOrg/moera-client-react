import { apply, call, select } from 'redux-saga/effects';

import { formatSchemaErrors, NamingApi, NamingError } from "api";
import { getSetting } from "state/settings/selectors";
import { retryFetch } from "api/fetch-timeout";

let callId = 1;

function* callNaming({method, params, schema = null, notNull = false}) {
    const exception = (e, details = null) => new NamingError(method, e, details);
    const location = yield select(state => getSetting(state, "naming.location"));
    let response;
    try {
        response = yield call(retryFetch, location, {
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
        data = yield apply(response, "json");
    } catch (e) {
        throw exception("Server returned empty result");
    }
    if (response.error) {
        if (!NamingApi.ErrorResult(data)) {
            throw exception("Error response format incorrect", formatSchemaErrors(NamingApi.ErrorResult.errors));
        }
        throw exception(data.error.message);
    }
    let resultSchema;
    switch (schema) {
        case "boolean":
            resultSchema = NamingApi.BooleanResult;
            break;
        default:
            resultSchema = NamingApi.ObjectResult;
    }
    if (!resultSchema(data)) {
        throw exception("Response format incorrect", formatSchemaErrors(resultSchema.errors));
    }
    if (data.result == null) {
        if (!notNull) {
            return null;
        } else {
            throw exception("Return value is null");
        }
    }
    if (schema && typeof(schema) === "object" && !schema(data.result)) {
        throw exception("Return value format incorrect: ", formatSchemaErrors(schema.errors));
    }
    return data.result;
}

export function* getCurrent(name, generation) {
    return yield call(callNaming,
        {method: "getCurrent", params: [name, generation], schema: NamingApi.RegisteredNameInfo});
}

export function* getCurrentForLatest(name) {
    return yield call(callNaming,
        {method: "getCurrentForLatest", params: [name], schema: NamingApi.RegisteredNameInfo});
}

export function* isFree(name) {
    return yield call(callNaming,
        {method: "isFree", params: [name], schema: "boolean", notNull: true});
}
