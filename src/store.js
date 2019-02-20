import { applyMiddleware, combineReducers, createStore } from 'redux';
import error from "error/reducer";
import naming from "naming/reducer";
import node from "node/reducer";
import home from "home/reducer";
import tokens from "tokens/reducer";
import connectDialog from "logobar/connectionstatus/connectdialog/reducer";
import owner from "mainmenu/owner/reducer";
import profile from "profile/reducer";
import messageBox from "messagebox/reducer";

import createSagaMiddleware from 'redux-saga';
import { takeLatest } from 'redux-saga/effects';
import { ERROR_THROWN } from "error/actions";
import { OWNER_LOAD } from "mainmenu/owner/actions";
import { CONNECT_TO_HOME, RESTORE_CONNECTION_TO_HOME } from "home/actions";
import { PROFILE_LOAD, PROFILE_UPDATE } from "profile/actions";
import { errorSaga } from "error/sagas";
import { ownerLoadSaga } from "mainmenu/owner/sagas";
import { connectToHomeSaga, verifyHomeOwnerSaga } from "home/connect";
import { profileLoadSaga, profileUpdateSaga } from "profile/sagas";

function* combinedSaga() {
    yield takeLatest(ERROR_THROWN, errorSaga);
    yield takeLatest(OWNER_LOAD, ownerLoadSaga);
    yield takeLatest(CONNECT_TO_HOME, connectToHomeSaga);
    yield takeLatest(RESTORE_CONNECTION_TO_HOME, verifyHomeOwnerSaga);
    yield takeLatest(PROFILE_LOAD, profileLoadSaga);
    yield takeLatest(PROFILE_UPDATE, profileUpdateSaga);
}

const sagaMiddleware = createSagaMiddleware();
export default createStore(
    combineReducers({ error, naming, node, home, tokens, connectDialog, owner, profile, messageBox }),
    applyMiddleware(sagaMiddleware)
);

sagaMiddleware.run(combinedSaga);
