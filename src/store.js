import { combineReducers, createStore, applyMiddleware } from 'redux';
import root from "root/reducer";
import owner from "mainmenu/owner/reducer";
import naming from "naming/reducer";

import createSagaMiddleware from 'redux-saga';
import { takeLatest } from 'redux-saga/effects';
import { ownerLoadSaga } from "mainmenu/owner/sagas";
import { OWNER_LOAD } from "mainmenu/owner/actions";

function* combinedSaga() {
    yield takeLatest(OWNER_LOAD, ownerLoadSaga);
}

const sagaMiddleware = createSagaMiddleware();
export default createStore(
    combineReducers({ root, owner, naming }),
    applyMiddleware(sagaMiddleware)
);

sagaMiddleware.run(combinedSaga);
