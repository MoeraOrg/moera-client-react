import { call, put } from "redux-saga/effects";
import { Node } from "api/node";
import { errorThrown } from "state/error/actions";
import { peopleGeneralLoaded, peopleGeneralLoadFailed } from "state/people/actions";

export function* peopleGeneralLoadSaga(action) {
    try {
        const data = yield call(Node.getPeopleGeneral, "");
        yield put(peopleGeneralLoaded(data));
    } catch (e) {
        yield put(peopleGeneralLoadFailed());
        yield put(errorThrown(e));
    }
}
