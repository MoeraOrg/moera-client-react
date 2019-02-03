import { applyMiddleware, combineReducers, createStore } from 'redux';
import error from "error/reducer";
import naming from "naming/reducer";
import node from "node/reducer";
import owner from "mainmenu/owner/reducer";
import profile from "profile/reducer";

import createSagaMiddleware from 'redux-saga';
import { takeLatest } from 'redux-saga/effects';
import { ERROR_THROWN } from "error/actions";
import { OWNER_LOAD } from "mainmenu/owner/actions";
import { PROFILE_LOAD } from "profile/actions";
import { errorSaga } from "error/sagas";
import { ownerLoadSaga } from "mainmenu/owner/sagas";
import { profileLoadSaga } from "profile/sagas";

function* combinedSaga() {
    yield takeLatest(ERROR_THROWN, errorSaga);
    yield takeLatest(OWNER_LOAD, ownerLoadSaga);
    yield takeLatest(PROFILE_LOAD, profileLoadSaga);
}

const sagaMiddleware = createSagaMiddleware();
export default createStore(
    combineReducers({ error, naming, node, owner, profile }),
    applyMiddleware(sagaMiddleware)
);

sagaMiddleware.run(combinedSaga);
