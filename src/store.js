import { applyMiddleware, combineReducers, createStore } from 'redux';
import error from "error/reducer";
import root from "root/reducer";
import owner from "mainmenu/owner/reducer";
import naming from "naming/reducer";

import createSagaMiddleware from 'redux-saga';
import { takeLatest } from 'redux-saga/effects';
import { errorSaga } from "error/sagas";
import { ownerLoadSaga } from "mainmenu/owner/sagas";
import { ERROR_THROWN } from "error/actions";
import { OWNER_LOAD } from "mainmenu/owner/actions";

function* combinedSaga() {
    yield takeLatest(OWNER_LOAD, ownerLoadSaga);
    yield takeLatest(ERROR_THROWN, errorSaga);
}

const sagaMiddleware = createSagaMiddleware();
export default createStore(
    combineReducers({ error, root, owner, naming }),
    applyMiddleware(sagaMiddleware)
);

sagaMiddleware.run(combinedSaga);
