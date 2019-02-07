import { applyMiddleware, combineReducers, createStore } from 'redux';
import error from "error/reducer";
import naming from "naming/reducer";
import node from "node/reducer";
import home from "home/reducer";
import connectDialog from "logobar/connectionstatus/connectdialog/reducer";
import owner from "mainmenu/owner/reducer";
import profile from "profile/reducer";
import messageBox from "messagebox/reducer";

import createSagaMiddleware from 'redux-saga';
import { takeLatest } from 'redux-saga/effects';
import { ERROR_THROWN } from "error/actions";
import { OWNER_LOAD } from "mainmenu/owner/actions";
import { CONNECT_TO_HOME } from "home/actions";
import { PROFILE_LOAD } from "profile/actions";
import { errorSaga } from "error/sagas";
import { ownerLoadSaga } from "mainmenu/owner/sagas";
import { connectToHomeSaga } from "home/connect";
import { profileLoadSaga } from "profile/sagas";

function* combinedSaga() {
    yield takeLatest(ERROR_THROWN, errorSaga);
    yield takeLatest(OWNER_LOAD, ownerLoadSaga);
    yield takeLatest(CONNECT_TO_HOME, connectToHomeSaga);
    yield takeLatest(PROFILE_LOAD, profileLoadSaga);
}

const sagaMiddleware = createSagaMiddleware();
export default createStore(
    combineReducers({ error, naming, node, home, connectDialog, owner, profile, messageBox }),
    applyMiddleware(sagaMiddleware)
);

sagaMiddleware.run(combinedSaga);
