import { combineReducers, createStore, applyMiddleware } from 'redux';
import root from "global/rootReducer";
import owner from "mainmenu/ownerReducer";

import createSagaMiddleware from 'redux-saga';
import { takeLatest } from 'redux-saga/effects';
import { ownerNameLoadSaga } from "mainmenu/ownerSaga";
import { OWNER_NAME_LOAD } from "mainmenu/ownerActions";

function* combinedSaga() {
    yield takeLatest(OWNER_NAME_LOAD, ownerNameLoadSaga);
}

const sagaMiddleware = createSagaMiddleware()
export default createStore(
    combineReducers({ root, owner }),
    applyMiddleware(sagaMiddleware)
);

sagaMiddleware.run(combinedSaga);
