import { call, put } from 'typed-redux-saga/macro';

import { Node } from "api/node";
import { errorThrown } from "state/error/actions";
import {
    PEOPLE_GENERAL_LOAD,
    peopleGeneralLoaded,
    peopleGeneralLoadFailed,
    SUBSCRIBERS_LOAD,
    subscribersLoaded,
    subscribersLoadFailed,
    SUBSCRIPTIONS_LOAD,
    subscriptionsLoaded,
    subscriptionsLoadFailed
} from "state/people/actions";
import { executor } from "state/executor";

export default [
    executor(PEOPLE_GENERAL_LOAD, "", peopleGeneralLoadSaga),
    executor(SUBSCRIBERS_LOAD, "", subscribersLoadSaga),
    executor(SUBSCRIPTIONS_LOAD, "", subscriptionsLoadSaga)
];

function* peopleGeneralLoadSaga() {
    try {
        const data = yield* call(Node.getPeopleGeneral, "");
        yield* put(peopleGeneralLoaded(data));
    } catch (e) {
        yield* put(peopleGeneralLoadFailed());
        yield* put(errorThrown(e));
    }
}

function* subscribersLoadSaga() {
    try {
        const data = yield* call(Node.getSubscribers, "", "feed");
        yield* put(subscribersLoaded(data));
    } catch (e) {
        yield* put(subscribersLoadFailed());
        yield* put(errorThrown(e));
    }
}

function* subscriptionsLoadSaga() {
    try {
        const data = yield* call(Node.getSubscriptions, "", "feed");
        yield* put(subscriptionsLoaded(data));
    } catch (e) {
        yield* put(subscriptionsLoadFailed());
        yield* put(errorThrown(e));
    }
}
