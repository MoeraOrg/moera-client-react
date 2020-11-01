import { call, put } from 'redux-saga/effects';

import { Node, NodeApiError } from "api";
import { signedUp, signUpFailed } from "state/signupdialog/actions";
import { errorThrown } from "state/error/actions";
import { initFromLocation } from "state/navigation/actions";

const PROVIDER_URL = "https://moera.blog";
const PROVIDER_SUFFIX = ".moera.blog";
// const PROVIDER_URL = "http://localhost.localdomain:8082";
// const PROVIDER_SUFFIX = ".localhost.localdomain";

export function* signUpSaga(action) {
    try {
        const nodeDomainName = action.payload.domain + PROVIDER_SUFFIX;
        yield call(Node.createDomain, PROVIDER_URL, nodeDomainName);
        yield put(signedUp());
        yield put(initFromLocation("https://" + nodeDomainName));
    } catch(e) {
        yield put(signUpFailed());
        if (e instanceof NodeApiError) {
            action.payload.onError("domain", e.message);
        } else {
            yield put(errorThrown(e));
        }
    }
}
