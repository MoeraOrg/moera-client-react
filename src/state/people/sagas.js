import { call, put } from "redux-saga/effects";
import { Node } from "api/node";
import { errorThrown } from "state/error/actions";
import {
    peopleGeneralLoaded,
    peopleGeneralLoadFailed,
    subscribersLoaded,
    subscribersLoadFailed,
    subscriptionsLoaded,
    subscriptionsLoadFailed
} from "state/people/actions";

export function* peopleGeneralLoadSaga() {
    try {
        const data = yield call(Node.getPeopleGeneral, "");
        yield put(peopleGeneralLoaded(data));
    } catch (e) {
        yield put(peopleGeneralLoadFailed());
        yield put(errorThrown(e));
    }
}

export function* subscribersLoadSaga() {
    try {
        const data = yield call(Node.getSubscribers, "", "feed");
        yield put(subscribersLoaded(data));
    } catch (e) {
        yield put(subscribersLoadFailed());
        yield put(errorThrown(e));
    }
}

export function* subscriptionsLoadSaga() {
    try {
        const data = yield call(Node.getSubscriptions, "", "feed");
        yield put(subscriptionsLoaded(data));
    } catch (e) {
        yield put(subscriptionsLoadFailed());
        yield put(errorThrown(e));
    }
}
